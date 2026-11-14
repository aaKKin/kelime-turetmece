// --- FIREBASE VERİTABANI ADRESİN ---
const FIREBASE_DB_URL = "https://kelime-turetmece-c151c-default-rtdb.europe-west1.firebasedatabase.app";
const TURN_DURATION_MS = 7000;
const HOST_GRACE_MS = 800; // Ağ gecikmesi toleransı (0.8 sn)

// --- SUNUCU SAATİ FARKI (GECİKME SENKRONİZASYONU) ---
let serverTimeOffset = 0;
function getSyncedNow() {
    return Date.now() + serverTimeOffset;
}

// --- RASTGELE ANONİM TAKMA AD ÜRETİCİ ---
const nickAdjectives = [
    "Hızlı", "Gizemli", "Atik", "Zeki", "Süper", "Keskin", "Sessiz", "Çevik",
    "Usta", "Gölge", "Kozmik", "Buzul", "Fırtına", "Kıvrak", "Şimşek", "Asil"
];
const nickNouns = [
    "Tilki", "Baykuş", "Kurt", "Kartal", "Panda", "Ejder", "Vaşak", "Şahin",
    "Gezgin", "Kaşif", "Avcı", "Bilge", "Korsan", "Ninja", "Yıldız", "Kuzgun"
];

function generateAnonNick() {
    const adj = nickAdjectives[Math.floor(Math.random() * nickAdjectives.length)];
    const noun = nickNouns[Math.floor(Math.random() * nickNouns.length)];
    const num = Math.floor(10 + Math.random() * 89);
    return `${adj}${noun}${num}`;
}

let suggestedAnonNick = generateAnonNick();

function initAnonPlaceholder() {
    const nameInput = document.getElementById("player-name");
    nameInput.placeholder = `Örn: ${suggestedAnonNick}`;
}

// --- AVATAR SEÇENEKLERİ ---
const avatarOptions = ["🦊", "🐱", "🐺", "🦁", "🐼", "🐸", "🦉", "🐲", "👾", "🚀", "🎸", "⚡"];
let selectedAvatar = avatarOptions[0];

function initAvatarSelector() {
    const grid = document.getElementById("avatar-grid");
    grid.innerHTML = "";
    avatarOptions.forEach((emoji) => {
        const btn = document.createElement("div");
        btn.className = "avatar-option" + (emoji === selectedAvatar ? " selected" : "");
        btn.textContent = emoji;
        btn.onclick = () => {
            selectedAvatar = emoji;
            document.querySelectorAll(".avatar-option").forEach(el => el.classList.remove("selected"));
            btn.classList.add("selected");
        };
        grid.appendChild(btn);
    });
}

// --- ODA GİZLİLİK SEÇİMİ ---
let isRoomPublic = true;

function setRoomPrivacy(publicFlag) {
    isRoomPublic = publicFlag;
    const pubBtn = document.getElementById("btn-privacy-public");
    const privBtn = document.getElementById("btn-privacy-private");
    if (publicFlag) {
        pubBtn.className = "privacy-btn active-public";
        privBtn.className = "privacy-btn";
    } else {
        pubBtn.className = "privacy-btn";
        privBtn.className = "privacy-btn active-private";
    }
}

// --- SEKME DEĞİŞTİRME ---
function switchRightTab(tabName) {
    const chainTab = document.getElementById("tab-chain");
    const lbTab = document.getElementById("tab-leaderboard");
    const btnChain = document.getElementById("tab-btn-chain");
    const btnLb = document.getElementById("tab-btn-leaderboard");

    if (tabName === "chain") {
        chainTab.classList.remove("hidden");
        lbTab.classList.add("hidden");
        btnChain.classList.add("active");
        btnLb.classList.remove("active");
    } else {
        chainTab.classList.add("hidden");
        lbTab.classList.remove("hidden");
        btnChain.classList.remove("active");
        btnLb.classList.add("active");
        fetchGlobalLeaderboard();
    }
}

// --- AKTİF ODALAR / LOBİLER LİSTESİ ---
let activeRoomsPollInterval = null;
let isLeavingRoom = false;

async function getFirebaseServerNow() {
    const t0 = Date.now();
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/serverClock.json?t=${t0}`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ".sv": "timestamp" })
        });
        const t1 = Date.now();
        if (res.ok) {
            const ts = await res.json();
            if (typeof ts === "number") {
                const rtt = t1 - t0;
                serverTimeOffset = ts - (t0 + Math.round(rtt / 2));
                return ts;
            }
        }
    } catch (e) {}
    return Date.now();
}

async function sendRoomHeartbeat() {
    if (!currentRoomCode || !isHost || isLocalSolo || isLeavingRoom) return;

    try {
        await fetch(`${FIREBASE_DB_URL}/activeRooms/${currentRoomCode}.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: currentRoomCode,
                hostName: myName,
                hostAvatar: selectedAvatar,
                isPublic: isRoomPublic,
                status: gameState.status,
                playerCount: gameState.players.length,
                lastSeen: { ".sv": "timestamp" }
            })
        });
    } catch (e) {}
}

async function removeRoomByCode(code, wasHost) {
    if (!code) return;
    try {
        if (wasHost) {
            await Promise.all([
                fetch(`${FIREBASE_DB_URL}/activeRooms/${code}.json`, { method: "DELETE", keepalive: true }),
                fetch(`${FIREBASE_DB_URL}/rooms/${code}.json`, { method: "DELETE", keepalive: true })
            ]);
        } else {
            await fetch(`${FIREBASE_DB_URL}/rooms/${code}/joins/${myId}.json`, { method: "DELETE", keepalive: true });
        }
    } catch (e) {}
}

async function removeMyActiveRoom() {
    if (!currentRoomCode || isLocalSolo) return;
    isLeavingRoom = true;
    await removeRoomByCode(currentRoomCode, isHost);
}

async function fetchActiveRooms(manual = false) {
    try {
        const serverNow = await getFirebaseServerNow();
        const res = await fetch(`${FIREBASE_DB_URL}/activeRooms.json?t=${Date.now()}`, {
            cache: "no-store"
        });
        if (!res.ok) return;
        const data = await res.json();
        const validRooms = [];

        if (data) {
            for (const [rCode, info] of Object.entries(data)) {
                if (!info) continue;
                const roomLastSeen = typeof info.lastSeen === "number" ? info.lastSeen : serverNow;

                if (serverNow - roomLastSeen <= 90000) {
                    validRooms.push(info);
                } else if (rCode !== currentRoomCode) {
                    fetch(`${FIREBASE_DB_URL}/activeRooms/${rCode}.json`, { method: "DELETE" });
                }
            }
        }

        renderActiveRooms(validRooms);
    } catch (e) {}
}

function renderActiveRooms(rooms) {
    const container = document.getElementById("online-rooms-list");
    const countBadge = document.getElementById("online-count-badge");
    container.innerHTML = "";
    countBadge.textContent = rooms.length;

    if (rooms.length === 0) {
        container.innerHTML = `<div class="online-empty-msg">Şu an aktif oda yok. Oda kurduğunda burada görünür!</div>`;
        return;
    }

    rooms.forEach(room => {
        const card = document.createElement("div");
        card.className = "online-room-card" + (room.isPublic ? " is-public" : "");

        const isPlaying = room.status === "playing";
        const isFull = (room.playerCount || 1) >= 6;
        const isMyRoom = room.code === currentRoomCode;

        let rightActionHtml = "";
        let subInfoHtml = "";

        if (room.isPublic) {
            subInfoHtml = `<span class="room-player-pill">${room.playerCount || 1}/6 Oyuncu</span>`;

            if (isMyRoom) {
                rightActionHtml = `<span style="font-size: 0.72rem; color: var(--cyan); font-weight: 700;">Odandasın</span>`;
            } else if (!isPlaying && !isFull) {
                rightActionHtml = `<button class="quick-join-mini" onclick="joinRoom('${room.code}')">Katıl</button>`;
            } else {
                rightActionHtml = `<span class="in-game-badge">${isPlaying ? "Maçta" : (isFull ? "Dolu" : "Açık")}</span>`;
            }
        } else {
            subInfoHtml = `<span class="private-status-tag">🔒 Gizli Odada Aktif${isPlaying ? " • Maçta" : ""}</span>`;
        }

        card.innerHTML = `
            <div class="online-room-info">
                <div class="online-user-left">
                    <span class="online-user-avatar">${room.hostAvatar || "🎮"}</span>
                    <span class="online-user-name">${room.hostName}</span>
                </div>
                <div class="room-meta-line">${subInfoHtml}</div>
            </div>
            ${rightActionHtml}
        `;
        container.appendChild(card);
    });
}

function startActiveRoomsMonitor() {
    fetchActiveRooms();
    clearInterval(activeRoomsPollInterval);
    activeRoomsPollInterval = setInterval(async () => {
        if (isHost && currentRoomCode && !isLocalSolo && !isLeavingRoom) {
            await sendRoomHeartbeat();
        }
        await fetchActiveRooms();
    }, 4000);

    document.addEventListener("visibilitychange", async () => {
        if (!document.hidden) {
            if (isHost && currentRoomCode && !isLocalSolo && !isLeavingRoom) {
                await sendRoomHeartbeat();
            }
            await fetchActiveRooms();
        }
    });

    window.addEventListener("pagehide", () => {
        removeMyActiveRoom();
    });
    window.addEventListener("beforeunload", () => {
        removeMyActiveRoom();
    });
}

// --- GLOBAL BULUT LİDERLİK TABLOSU (YALNIZCA İLK 5) ---
let leaderboardData = {};

function sanitizeFirebaseKey(name) {
    return name.replace(/[.#$\[\]\/]/g, "_").trim();
}

async function fetchGlobalLeaderboard() {
    const infoEl = document.getElementById("lb-sync-info");
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/leaderboard.json?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        leaderboardData = data || {};
        infoEl.textContent = "🟢 En İyi 5 Oyuncu (Canlı)";
        renderLeaderboard();
    } catch (e) {
        infoEl.textContent = "⚠️ Bulut bağlantısı kurulamadı";
        renderLeaderboard();
    }
}

async function recordMatchStats(winnerPlayer, historyList) {
    const matchSummary = {};
    const safeHistory = Array.isArray(historyList) ? historyList : [];

    safeHistory.forEach(item => {
        if (item.senderId === "sys" || item.isBot) return;
        const key = sanitizeFirebaseKey(item.senderName);
        if (!matchSummary[key]) {
            matchSummary[key] = {
                name: item.senderName,
                avatar: item.senderAvatar || "🎮",
                winsToAdd: 0,
                wordsToAdd: 0
            };
        }
        matchSummary[key].wordsToAdd += 1;
        matchSummary[key].avatar = item.senderAvatar || matchSummary[key].avatar;
    });

    if (winnerPlayer && !winnerPlayer.isBot) {
        const wKey = sanitizeFirebaseKey(winnerPlayer.name);
        if (!matchSummary[wKey]) {
            matchSummary[wKey] = {
                name: winnerPlayer.name,
                avatar: winnerPlayer.avatar,
                winsToAdd: 0,
                wordsToAdd: 0
            };
        }
        matchSummary[wKey].winsToAdd += 1;
        matchSummary[wKey].avatar = winnerPlayer.avatar;
    }

    Object.entries(matchSummary).forEach(([key, delta]) => {
        const existing = leaderboardData[key] || { name: delta.name, avatar: delta.avatar, wins: 0, words: 0 };
        leaderboardData[key] = {
            name: delta.name,
            avatar: delta.avatar,
            wins: (existing.wins || 0) + delta.winsToAdd,
            words: (existing.words || 0) + delta.wordsToAdd
        };
    });
    renderLeaderboard();

    for (const [key, delta] of Object.entries(matchSummary)) {
        try {
            const currentRes = await fetch(`${FIREBASE_DB_URL}/leaderboard/${encodeURIComponent(key)}.json?t=${Date.now()}`, { cache: "no-store" });
            const currentData = (await currentRes.json()) || { name: delta.name, avatar: delta.avatar, wins: 0, words: 0 };

            const updatedRecord = {
                name: delta.name,
                avatar: delta.avatar,
                wins: (currentData.wins || 0) + delta.winsToAdd,
                words: (currentData.words || 0) + delta.wordsToAdd
            };

            await fetch(`${FIREBASE_DB_URL}/leaderboard/${encodeURIComponent(key)}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRecord)
            });
        } catch (e) {}
    }

    await fetchGlobalLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.getElementById("leaderboard-tbody");
    const emptyEl = document.getElementById("lb-empty-state");
    tbody.innerHTML = "";

    const topFive = Object.values(leaderboardData)
        .filter(entry => entry && !entry.isBot)
        .sort((a, b) => {
            if ((b.wins || 0) !== (a.wins || 0)) return (b.wins || 0) - (a.wins || 0);
            return (b.words || 0) - (a.words || 0);
        })
        .slice(0, 5);

    if (topFive.length === 0) {
        emptyEl.style.display = "block";
        return;
    }

    emptyEl.style.display = "none";

    topFive.forEach((entry, idx) => {
        const tr = document.createElement("tr");
        let rankDisplay = idx + 1;
        if (idx === 0) rankDisplay = "🥇";
        else if (idx === 1) rankDisplay = "🥈";
        else if (idx === 2) rankDisplay = "🥉";

        const badgeClass = entry.name === myName ? "badge-me" : "";
        tr.innerHTML = `
            <td class="col-num">${rankDisplay}</td>
            <td><span class="badge ${badgeClass}">${entry.avatar || "🎮"} ${entry.name}</span></td>
            <td style="text-align: center; font-weight: 800; color: var(--emerald);">${entry.wins || 0}</td>
            <td style="text-align: right; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">${entry.words || 0}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- KELİME HAVUZU ---
const commonBotWords = [
    "ABLA", "ABİ", "ACİL", "AÇIK", "ADA", "ADALET", "ADAM", "ADIM", "ADRES", "AĞAÇ", "AĞIZ", "AİLE",
    "AKIL", "AKREP", "AKŞAM", "ALAN", "ALARM", "ALET", "ALEV", "ALKIŞ", "ALTIN", "AMAÇ", "AMCA", "ANAHTAR",
    "ANLAM", "ANNE", "ARABA", "ARAZİ", "ARKA", "ARKADAŞ", "ARMUT", "ARPA", "ASANSÖR", "ASKER", "ASLAN",
    "AŞK", "ATEŞ", "ATKI", "AVLU", "AVUÇ", "AYAK", "AYAKKABI", "AYNA", "AYRAN", "AYVA", "AZİM",
    "BABA", "BACA", "BADEM", "BAĞ", "BAHANE", "BAHÇE", "BAHAR", "BAKAN", "BAKIR", "BAKIŞ", "BAL", "BALIK",
    "BALKON", "BALON", "BANKA", "BANYO", "BARDAK", "BARIŞ", "BASINÇ", "BASKI", "BAŞARI", "BAŞKAN", "BAVUL",
    "BAYRAK", "BAYRAM", "BEBEK", "BEDEN", "BEKÇİ", "BELGE", "BERBER", "BESİN", "BEYAZ", "BEYİN", "BIÇAK",
    "BİBER", "BİLGİ", "BİLGİSAYAR", "BİLİM", "BİNA", "BİTKİ", "BOĞAZ", "BOMBA", "BORÇ", "BORU", "BOYA",
    "BOYNUZ", "BÖCEK", "BÖLGE", "BÖREK", "BUĞDAY", "BULUT", "BURUN", "BUZ", "BÜTÇE",
    "CADDE", "CAM", "CAMİ", "CAN", "CANLI", "CEKET", "CEP", "CESARET", "CEVAP", "CEVİZ", "CEZA", "CİHAZ",
    "CİLT", "CÜMLE", "CÜZDAN",
    "ÇADIR", "ÇAĞRI", "ÇAKIL", "ÇAKMAK", "ÇALIŞMA", "ÇAMUR", "ÇANTA", "ÇARE", "ÇARŞAF", "ÇARŞI", "ÇATAL",
    "ÇATI", "ÇAY", "ÇAYIR", "ÇEKİÇ", "ÇELİK", "ÇEMBER", "ÇENE", "ÇEŞİT", "ÇEŞME", "ÇEVRE", "ÇİÇEK",
    "ÇİFT", "ÇİLEK", "ÇİMEN", "ÇİNİ", "ÇİZGİ", "ÇİZME", "ÇOBAN", "ÇOCUK", "ÇORAP", "ÇORBA", "ÇÖZÜM", "ÇUKUR",
    "DAĞ", "DAİRE", "DAKİKA", "DAL", "DALGA", "DAMAR", "DAMLA", "DANS", "DAVET", "DAVUL", "DEDE", "DEFTER",
    "DEĞER", "DEĞİRMEN", "DEKOR", "DELİK", "DEMİR", "DENEY", "DENGE", "DENİZ", "DEPO", "DEPREM", "DERE",
    "DERGİ", "DERİ", "DERS", "DESTEK", "DEV", "DEVLET", "DIŞARI", "DİKEN", "DİKKAT", "DİL", "DİLEK",
    "DİN", "DİREK", "DİŞ", "DİZ", "DOĞA", "DOĞU", "DOKTOR", "DOKU", "DOLAP", "DOLMA", "DOMATES", "DON",
    "DOST", "DOSYA", "DÖNEM", "DUDAK", "DUMAN", "DURAK", "DURUM", "DUŞ", "DUVAR", "DUYGU", "DÜĞME",
    "DÜĞÜN", "DÜKKAN", "DÜNYA", "DÜŞ", "DÜŞÜNCE", "DÜZEN",
    "ECZANE", "EDEBİYAT", "EĞİTİM", "EĞLENCE", "EKİM", "EKİP", "EKMEK", "EKRAN", "ELBİSE", "ELDİVEN",
    "ELEKTRİK", "ELMA", "ELMAS", "EMEK", "EMİR", "ENERJİ", "ENGEL", "ERİK", "ERKEK", "ESER", "ESKİ",
    "EŞEK", "EŞİT", "EŞYA", "ETEK", "ETİKET", "ETKİ", "EV", "EVLAT", "EVREN", "EYLEM", "EYLÜL", "EZGİ",
    "FABRİKA", "FARE", "FARK", "FASULYE", "FATURA", "FAYDA", "FENER", "FIRÇA", "FIRIN", "FIRTINA",
    "FISTIK", "FİKİR", "FİL", "FİLM", "FİNCAN", "FİYAT", "FORMA", "FOTOĞRAF", "FUTBOL",
    "GALERİ", "GAR", "GARSON", "GAZ", "GAZETE", "GECE", "GEÇİT", "GELECEK", "GELİN", "GEMİ", "GENÇ",
    "GERÇEK", "GEYİK", "GEZEGEN", "GIDA", "GİTAR", "GİYİM", "GİZEM", "GÖK", "GÖKYÜZÜ", "GÖL", "GÖLGE",
    "GÖMLEK", "GÖNÜL", "GÖREV", "GÖRÜNTÜ", "GÖZ", "GÖZLÜK", "GRUP", "GURUR", "GÜÇ", "GÜL", "GÜMÜŞ",
    "GÜN", "GÜNEŞ", "GÜNEY", "GÜNLÜK", "GÜRÜLTÜ", "GÜVEN", "GÜZ", "GÜZEL",
    "HABER", "HAFTA", "HAK", "HALA", "HALAT", "HALI", "HALK", "HAMUR", "HAN", "HANE", "HARF", "HARİTA",
    "HASTA", "HASTANE", "HATA", "HATIRA", "HAVA", "HAVLU", "HAVUÇ", "HAVUZ", "HAYAL", "HAYAT", "HAYVAN",
    "HAZİNE", "HEDEF", "HEDİYE", "HELVA", "HESAP", "HEYECAN", "HEYKEL", "HIZ", "HİKAYE", "HİSSE", "HİZMET",
    "HOROZ", "HUKUK", "HUZUR", "HÜCRE",
    "IHLAMUR", "IRMAK", "ISPANAK", "IŞIK", "IZGARA",
    "İÇECEK", "İFADE", "İĞNE", "İHTİYAÇ", "İKİZ", "İLAÇ", "İLERİ", "İLGİ", "İLİM", "İLKE", "İMAJ",
    "İMZA", "İNANÇ", "İNCİ", "İNCİR", "İNEK", "İNSAN", "İNŞAAT", "İP", "İPEK", "İPLİK", "İSİM", "İSKELE",
    "İSTASYON", "İSTEK", "İŞARET", "İŞÇİ", "İŞLEM", "İZ", "İZİN",
    "JANT", "JELATİN", "JEST", "JİLET", "JOKER", "JÜRİ",
    "KABAK", "KABLO", "KABUK", "KADIN", "KAFES", "KAĞIT", "KAHVE", "KALE", "KALEM", "KALP", "KAMERA",
    "KAMP", "KAMYON", "KAN", "KANAL", "KANAT", "KANEPE", "KAPI", "KAPLAN", "KAPTAN", "KAR", "KARAR",
    "KARDEŞ", "KARE", "KARGA", "KARGO", "KARINCA", "KARPUZ", "KART", "KARTAL", "KAS", "KASA", "KASAP",
    "KASK", "KAŞ", "KAŞIK", "KAT", "KAVGA", "KAVUN", "KAYA", "KAYIK", "KAYISI", "KAZ", "KAZA", "KAZAK",
    "KAZAN", "KEÇİ", "KEDİ", "KEK", "KEKİK", "KELEBEK", "KEMER", "KEMİK", "KENAR", "KENT", "KEPÇE",
    "KİBRİT", "KİLİM", "KİLİT", "KİLO", "KİMYA", "KİRA", "KİRAZ", "KİRPİ", "KİTAP", "KLAVYE", "KOL",
    "KOLTUK", "KOLYE", "KOMŞU", "KONU", "KONUK", "KONSER", "KORKU", "KORNA", "KOVA", "KOYUN", "KÖMÜR",
    "KÖPEK", "KÖPRÜ", "KÖPÜK", "KÖŞE", "KÖY", "KRAL", "KREDİ", "KREM", "KRİSTAL", "KULAK", "KULE",
    "KUM", "KUMAŞ", "KUMBARA", "KUNDUZ", "KURBAĞA", "KURŞUN", "KURT", "KURU", "KUTU", "KUŞ", "KUYRUĞU",
    "KUYU", "KUZEY", "KUZU", "KÜÇÜK", "KÜL", "KÜMES", "KÜPE", "KÜRE", "KÜREK", "KÜTÜPHANE",
    "LAHANA", "LAMBA", "LASTİK", "LEKE", "LEVENT", "LEYLEK", "LEZZET", "LİDER", "LİMAN", "LİMON",
    "LİSTE", "LOKANTA", "LOKMA",
    "MACERA", "MADALYA", "MADEN", "MAĞARA", "MAĞAZA", "MAHALLE", "MAKAS", "MAKİNE", "MAL", "MANDAL",
    "MANGAL", "MANTAR", "MANTI", "MANZARA", "MARANGOZ", "MARKET", "MARTI", "MARUL", "MASA", "MASAL",
    "MASKE", "MATEMATİK", "MAVİ", "MAYA", "MAYIN", "MAYMUN", "MECLİS", "MEDYA", "MEKTUP", "MELEK",
    "MEMUR", "MENDİL", "MERAK", "MERCAN", "MERDİVEN", "MERKEZ", "MERMER", "MESAJ", "MESLEK", "MEŞALE",
    "METAL", "METRE", "METRO", "MEVSİM", "MEYDAN", "MEYVE", "MEZAR", "MISIR", "MİDE", "MİDYELER",
    "MİKROFON", "MİLLET", "MİMAR", "MİSAFİR", "MİZAH", "MOBİLYA", "MODA", "MODEL", "MOTOR", "MUM",
    "MUTFAK", "MUTLULUK", "MUZ", "MÜDÜR", "MÜHENDİS", "MÜREKKEP", "MÜZE", "MÜZİK",
    "NABIZ", "NAKIŞ", "NAL", "NANE", "NAR", "NAZAR", "NEFES", "NEHİR", "NEŞE", "NİMET", "NİNE",
    "NİSAN", "NİŞAN", "NİYET", "NOHUT", "NOKTA", "NOT", "NOTA", "NÖBET", "NUMARA", "NÜFUS",
    "OCAK", "ODA", "ODUN", "OĞUL", "OK", "OKUL", "OKYANUS", "OLAY", "OLTA", "OMUZ", "ONUR", "OPERA",
    "ORDU", "ORGAN", "ORMAN", "ORTA", "ORTAM", "OT", "OTEL", "OTOBÜS", "OYUN", "OYUNCAK", "OZAN",
    "ÖDÜL", "ÖFKE", "ÖĞLE", "ÖĞRENCİ", "ÖĞRETMEN", "ÖKÜZ", "ÖLÇÜ", "ÖMÜR", "ÖNEM", "ÖRDEK", "ÖRNEK",
    "ÖRTÜ", "ÖRÜMCEK", "ÖYKÜ", "ÖZET", "ÖZGÜRLÜK", "ÖZLEM",
    "PAKET", "PALTO", "PAMUK", "PANCAR", "PANEL", "PANİK", "PANTOLON", "PAPATYA", "PARA", "PARÇA",
    "PARK", "PARMAK", "PASTA", "PATATES", "PATEN", "PATLICAN", "PAZAR", "PENCERE", "PENGUEN", "PERDE",
    "PERGEL", "PERİ", "PETROL", "PEYNİR", "PINAR", "PIRASA", "PİL", "PİLAV", "PİLOT", "PİPO", "PİYANO",
    "PLAJ", "PLAN", "PLASTİK", "POLİS", "PORTAKAL", "POSTA", "POŞET", "PROJE", "PUAN", "PUSULA",
    "RADAR", "RADYO", "RAF", "RAHAT", "RAKAM", "RAKET", "RAMAZAN", "RANDEVU", "RAPOR", "REÇEL",
    "REHBER", "REKLAM", "REKOR", "RENK", "RESİM", "RESSAM", "RİCA", "RİTİM", "ROBOT", "ROKET",
    "ROMAN", "ROTA", "RUH", "RÜYA", "RÜZGAR",
    "SAAT", "SABAH", "SABIR", "SABUN", "SAÇ", "SAHİL", "SAHNE", "SAKAL", "SAKIZ", "SAKSI", "SALATA",
    "SALÇA", "SALGIN", "SALINCAK", "SALON", "SAMAN", "SANAT", "SANDAL", "SANDALYE", "SANDIK", "SANİYE",
    "SARAY", "SARI", "SARIMSAK", "SATIR", "SATRANÇ", "SAVAŞ", "SAYFA", "SAYGI", "SAYI", "SAZ", "SEBEP",
    "SEBZE", "SEÇİM", "SEDEF", "SEFER", "SEHPA", "SEL", "SELAM", "SEMER", "SEPET", "SERA", "SERÇE",
    "SERGİ", "SERİN", "SES", "SEVGİ", "SEYAHAT", "SICAK", "SIFIR", "SIĞIR", "SINAV", "SINIF", "SINIR",
    "SIRA", "SIRT", "SİGORTA", "SİLAH", "SİLGİ", "SİMİT", "SİNEMA", "SİNYAL", "SİRK", "SİS", "SİSTEM",
    "SİTE", "SOBA", "SOFRA", "SOĞAN", "SOĞUK", "SOHBET", "SOKAK", "SOLUK", "SON", "SONBAHAR", "SONUÇ",
    "SORU", "SORUN", "SOYADI", "SÖZ", "SÖZLÜK", "SPOR", "STADYUM", "SU", "SUCUK", "SULTAN", "SURAT",
    "SÜNGER", "SÜPÜRGE", "SÜRAHİ", "SÜRE", "SÜRÜ", "SÜT", "SÜTUN",
    "ŞAİR", "ŞAKA", "ŞAL", "ŞAMPİYON", "ŞANS", "ŞAPKA", "ŞARKI", "ŞART", "ŞATO", "ŞEFTALİ", "ŞEHİR",
    "ŞEKER", "ŞEKİL", "ŞELALE", "ŞEMSİYE", "ŞERİT", "ŞİFRE", "ŞİİR", "ŞİKAYET", "ŞİMŞEK", "ŞİŞE",
    "ŞOFÖR", "ŞÖLEN", "ŞÖMİNE", "ŞUBE", "ŞUBAT", "ŞÜPHE",
    "TABAK", "TABELA", "TABLO", "TAÇ", "TAHTA", "TAKIM", "TAKİP", "TAKSİ", "TAKVİM", "TALEBE", "TALİH",
    "TAMİR", "TANE", "TANIK", "TARAF", "TARAK", "TARIM", "TARİF", "TARİH", "TARLA", "TASARIM", "TAŞ",
    "TAŞIT", "TAT", "TATİL", "TATLI", "TAVA", "TAVAN", "TAVŞAN", "TAVUK", "TAY", "TAZE", "TEBEŞİR",
    "TECRÜBE", "TEDAVİ", "TEHLİKE", "TEKNE", "TEKNİK", "TEKNOLOJİ", "TEKRAR", "TEL", "TELEFON",
    "TELEVİZYON", "TEMEL", "TEMİZ", "TEMMUZ", "TENCERE", "TENEKE", "TENİS", "TEPE", "TEPSİ", "TER",
    "TERAZİ", "TERCİH", "TEREYAĞI", "TERLİK", "TERS", "TERZİ", "TESİS", "TEST", "TESTERE", "TEYZE",
    "TIĞ", "TIRNAK", "TİLKİ", "TİMSAH", "TİYATRO", "TOHUM", "TOKA", "TOP", "TOPLANTI", "TOPLUM",
    "TOPRAK", "TORBA", "TORUN", "TOZ", "TÖREN", "TRAFİK", "TREN", "TURİST", "TURŞU", "TURUNCU", "TUVALET",
    "TUZ", "TÜNEL", "TÜRKÜ", "TÜY",
    "UÇAK", "UÇURUM", "UÇURTMA", "UFUK", "UĞUR", "ULUS", "UMUT", "UN", "UNSUR", "USTA", "UYARI",
    "UYDU", "UYGU", "UYKU", "UYUM", "UZAY", "UZMAN",
    "ÜCRET", "ÜÇGEN", "ÜLKE", "ÜMİT", "ÜNİVERSİTE", "ÜNLÜ", "ÜRETİM", "ÜRÜN", "ÜST", "ÜTÜ", "ÜYE", "ÜZÜM",
    "VADİ", "VAGON", "VAKİT", "VALİ", "VALİZ", "VAPUR", "VARLIK", "VATAN", "VAZO", "VEDA", "VERGİ",
    "VERİ", "VİDA", "VİDEO", "VİLLA", "VİNÇ", "VİŞNE", "VİTAMİN", "VÜCUT",
    "YABANCI", "YAĞ", "YAĞMUR", "YAKA", "YAKIT", "YALAN", "YAMAÇ", "YANAK", "YANGIN", "YANIT", "YANKI",
    "YAPRAK", "YARA", "YARAR", "YARDIM", "YARIŞ", "YARIN", "YASTIK", "YAŞ", "YAŞAM", "YATAK", "YATIRIM",
    "YAVRU", "YAY", "YAYA", "YAYIN", "YAYLA", "YAZ", "YAZAR", "YAZI", "YEDEK", "YELEK", "YELKEN",
    "YEMEK", "YEMİN", "YENİ", "YER", "YEŞİL", "YETENEK", "YETİŞKİN", "YIL", "YILAN", "YILDIZ", "YİĞİT",
    "YOĞURT", "YOL", "YOLCU", "YONCA", "YORUM", "YÖN", "YÖNTEM", "YUFKA", "YUMURTA", "YUNUS", "YURT",
    "YUVA", "YÜK", "YÜN", "YÜREK", "YÜZ", "YÜZÜK",
    "ZAFER", "ZAMAN", "ZAR", "ZARAR", "ZARF", "ZEKA", "ZEMİN", "ZENGİN", "ZEYTİN", "ZİHİN", "ZİL",
    "ZİNCİR", "ZİRVE", "ZİYARET", "ZOR", "ZÜRAFA"
];

const turkishCities = new Set([
    "ADANA", "ADIYAMAN", "AFYONKARAHİSAR", "AĞRI", "AMASYA", "ANKARA", "ANTALYA", "ARTVİN", "AYDIN",
    "BALIKESİR", "BİLECİK", "BİNGÖL", "BİTLİS", "BOLU", "BURDUR", "BURSA", "ÇANAKKALE", "ÇANKIRI",
    "ÇORUM", "DENİZLİ", "DİYARBAKIR", "EDİRNE", "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHİR",
    "GAZİANTEP", "GİRESUN", "GÜMÜŞHANE", "HAKKARİ", "HATAY", "ISPARTA", "MERSİN", "İSTANBUL", "İZMİR",
    "KARS", "KASTAMONU", "KAYSERİ", "KIRKLARELİ", "KIRŞEHİR", "KOCAELİ", "KONYA", "KÜTAHYA", "MALATYA",
    "MANİSA", "KAHRAMANMARAŞ", "MARDİN", "MUĞLA", "MUŞ", "NEVŞEHİR", "NİĞDE", "ORDU", "RİZE", "SAKARYA",
    "SAMSUN", "SİİRT", "SİNOP", "SİVAS", "TEKİRDAĞ", "TOKAT", "TRABZON", "TUNCELİ", "ŞANLIURFA", "UŞAK",
    "VAN", "YOZGAT", "ZONGULDAK", "AKSARAY", "BAYBURT", "KARAMAN", "KIRIKKALE", "BATMAN", "ŞIRNAK",
    "BARTIN", "ARDAHAN", "IĞDIR", "YALOVA", "KARABÜK", "KİLİS", "OSMANİYE", "DÜZCE"
]);

const botProfiles = [
    { name: "Bot Alp", avatar: "🤖", skill: 0.90 },
    { name: "Bot Derin", avatar: "🦾", skill: 0.85 },
    { name: "Bot Mert", avatar: "🛸", skill: 0.82 },
    { name: "Bot Ece", avatar: "🧠", skill: 0.88 },
    { name: "Bot Kaan", avatar: "⚙️", skill: 0.80 }
];

let dictionarySet = new Set(commonBotWords);
const cleanBotWords = commonBotWords.filter(w => !w.endsWith("Ğ") && !turkishCities.has(w));

function toTurkishUpper(str) {
    return str.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase().trim();
}

async function loadDictionary() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
        const res = await fetch("https://cdn.jsdelivr.net/gh/mertemin/turkish-word-list@master/words.txt", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error();
        const text = await res.text();
        text.split(/\r?\n/).forEach(line => {
            const w = line.trim();
            if (w.length >= 3 && !w.includes(" ") && /^[a-zA-ZçğıöşüÇĞİÖŞÜ]+$/.test(w)) {
                const upper = toTurkishUpper(w);
                if (!turkishCities.has(upper)) dictionarySet.add(upper);
            }
        });
        document.getElementById("dict-status").textContent = `${dictionarySet.size.toLocaleString('tr-TR')} kelime doğrulamaya hazır`;
    } catch (e) {
        document.getElementById("dict-status").textContent = `Çekirdek sözlük hazır (${dictionarySet.size} kelime)`;
    }
}

// --- %100 FIREBASE ÇOK OYUNCULU ODA MOTORU ---
let isHost = false;
let isLocalSolo = false;
let myId = "p_" + Math.random().toString(36).substring(2, 10);
let myName = "Oyuncu";
let currentRoomCode = "";
let syncInterval = null;
let lastRenderedTurnNumber = -1;
let lastRenderedTurnStart = 0;
let isSwitchingRoom = false;

let gameState = {
    status: "lobby",
    isPublic: true,
    players: [],
    turnIndex: 0,
    turnNumber: 0,
    currentWord: "",
    usedWords: [],
    history: [],
    winnerText: "",
    turnStartedAt: 0
};

function normalizeGameState(raw) {
    const s = raw || {};
    return {
        status: s.status || "lobby",
        isPublic: s.isPublic !== false,
        players: Array.isArray(s.players) ? s.players : [],
        turnIndex: typeof s.turnIndex === "number" ? s.turnIndex : 0,
        turnNumber: typeof s.turnNumber === "number" ? s.turnNumber : 0,
        currentWord: s.currentWord || "",
        usedWords: Array.isArray(s.usedWords) ? s.usedWords : [],
        history: Array.isArray(s.history) ? s.history : [],
        winnerText: s.winnerText || "",
        turnStartedAt: typeof s.turnStartedAt === "number" ? s.turnStartedAt : getSyncedNow()
    };
}

let timerInterval = null;
let botThinkTimeout = null;
let isProcessingTurn = false;

const msgEl = document.getElementById("message");
const inputEl = document.getElementById("word-input");
const eliminatedBannerEl = document.getElementById("eliminated-banner");

function getPlayerName() {
    const val = document.getElementById("player-name").value.trim();
    return val || suggestedAnonNick;
}

function showGameScreen() {
    document.getElementById("lobby-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("room-banner").classList.remove("hidden");
    if (window.innerWidth <= 960) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function updateRoomBannerPrivacy(publicFlag, code) {
    const codeWrapper = document.getElementById("private-code-wrapper");
    const badge = document.getElementById("room-privacy-badge");

    if (publicFlag) {
        codeWrapper.classList.add("hidden");
        badge.textContent = "🌍 Herkese Açık Oda";
        badge.className = "room-privacy-pill";
    } else {
        codeWrapper.classList.remove("hidden");
        document.getElementById("room-code-text").textContent = code;
        badge.textContent = "🔒 Gizli Oda";
        badge.className = "room-privacy-pill private-pill";
    }
}

async function pushRoomStateToFirebase() {
    if (!currentRoomCode || isLocalSolo || isSwitchingRoom) return;
    try {
        await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/state.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameState)
        });
        await sendRoomHeartbeat();
    } catch (e) {}
}

function startRoomSyncLoop() {
    clearInterval(syncInterval);
    const loopRoomCode = currentRoomCode;

    syncInterval = setInterval(async () => {
        if (!currentRoomCode || currentRoomCode !== loopRoomCode || isLocalSolo || isSwitchingRoom) return;
        try {
            if (isHost) {
                const [joinRes, subRes] = await Promise.all([
                    fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/joins.json?t=${Date.now()}`, { cache: "no-store" }),
                    fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/submissions.json?t=${Date.now()}`, { cache: "no-store" })
                ]);

                if (currentRoomCode !== loopRoomCode || isSwitchingRoom) return;

                const joins = await joinRes.json();
                let stateChanged = false;

                if (joins && gameState.status === "lobby") {
                    for (const [pid, pdata] of Object.entries(joins)) {
                        if (pdata && !gameState.players.some(p => p.id === pid)) {
                            gameState.players.push({
                                id: pid,
                                name: pdata.name,
                                avatar: pdata.avatar || "🎮",
                                isBot: false,
                                eliminated: false
                            });
                            stateChanged = true;
                        }
                    }
                }

                const subs = await subRes.json();
                if (subs && gameState.status === "playing") {
                    const sortedSubs = Object.entries(subs).sort((a, b) => (a[1]?.ts || 0) - (b[1]?.ts || 0));
                    for (const [subKey, subData] of sortedSubs) {
                        if (subData && subData.word && subData.senderId) {
                            await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/submissions/${subKey}.json`, { method: "DELETE" });
                            await validateAndProcessWord(subData.word, subData.senderId, subData.turnNumber);
                        }
                    }
                }

                if (stateChanged) {
                    renderGameState();
                    await pushRoomStateToFirebase();
                }
            } else {
                const [stateRes, errRes] = await Promise.all([
                    fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/state.json?t=${Date.now()}`, { cache: "no-store" }),
                    fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/errors/${myId}.json?t=${Date.now()}`, { cache: "no-store" })
                ]);

                if (currentRoomCode !== loopRoomCode || isSwitchingRoom) return;

                const remoteState = await stateRes.json();
                const remoteErr = await errRes.json();

                if (remoteErr && remoteErr.text) {
                    msgEl.style.color = "var(--danger)";
                    msgEl.textContent = remoteErr.text;
                    fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/errors/${myId}.json`, { method: "DELETE" });
                }

                if (!remoteState) {
                    clearInterval(syncInterval);
                    clearInterval(timerInterval);
                    currentRoomCode = "";
                    document.getElementById("game-screen").classList.add("hidden");
                    document.getElementById("lobby-screen").classList.remove("hidden");
                    msgEl.style.color = "var(--warning)";
                    msgEl.textContent = "Oda kurucusu odadan ayrıldığı için oda kapatıldı.";
                    fetchActiveRooms();
                    return;
                }

                const prevStatus = gameState.status;
                gameState = normalizeGameState(remoteState);

                renderGameState();

                if (gameState.status === "playing") {
                    if (gameState.turnNumber !== lastRenderedTurnNumber || gameState.turnStartedAt !== lastRenderedTurnStart) {
                        lastRenderedTurnNumber = gameState.turnNumber;
                        lastRenderedTurnStart = gameState.turnStartedAt;
                        startTurnTimer();
                    }
                } else {
                    clearInterval(timerInterval);
                    if (prevStatus === "playing" && gameState.status === "gameover") {
                        fetchGlobalLeaderboard();
                    }
                }
            }
        } catch (e) {}
    }, 500);
}

async function leaveRoom() {
    clearInterval(syncInterval);
    clearInterval(timerInterval);
    clearTimeout(botThinkTimeout);
    await removeMyActiveRoom();
    location.reload();
}

// --- HIZLI BOT ARENASI ---
function startQuickBotArena() {
    isHost = true;
    isLocalSolo = true;
    myName = getPlayerName();
    showGameScreen();
    document.getElementById("room-banner").classList.add("hidden");

    gameState.players = [{ id: myId, name: myName, avatar: selectedAvatar, isBot: false, eliminated: false }];
    addBotToRoom(true);
    addBotToRoom(true);
    addBotToRoom(true);
    hostStartMultiplayer();
}

// --- ODA KUR (HOST) ---
async function createRoom() {
    isHost = true;
    isLocalSolo = false;
    isLeavingRoom = false;
    myName = getPlayerName();
    currentRoomCode = String(Math.floor(1000 + Math.random() * 9000));

    msgEl.style.color = "var(--cyan)";
    msgEl.textContent = "Oda oluşturuluyor...";

    const now = await getFirebaseServerNow();

    gameState = normalizeGameState({
        status: "lobby",
        isPublic: isRoomPublic,
        players: [{ id: myId, name: myName, avatar: selectedAvatar, isBot: false, eliminated: false }],
        turnNumber: 0,
        turnStartedAt: now
    });

    try {
        const res = await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: gameState })
        });
        if (!res.ok) throw new Error();

        msgEl.textContent = "";
        await sendRoomHeartbeat();
        await fetchActiveRooms();

        showGameScreen();
        updateRoomBannerPrivacy(isRoomPublic, currentRoomCode);
        document.getElementById("host-controls").classList.remove("hidden");
        renderGameState();
        startRoomSyncLoop();
    } catch (e) {
        currentRoomCode = "";
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = "Oda kurulamadı, internet bağlantını kontrol et.";
    }
}

// --- ODAYA KATIL ---
async function joinRoom(directCode = null) {
    const rawCode = directCode
        ? String(directCode).trim()
        : document.getElementById("join-code-input").value.trim().replace(/\D/g, "");

    if (rawCode.length !== 4) {
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = "Lütfen 4 haneli gizli oda kodunu gir!";
        return;
    }

    if (rawCode === currentRoomCode) return;

    myName = getPlayerName();
    msgEl.style.color = "var(--cyan)";
    msgEl.textContent = "Odaya bağlanılıyor...";

    try {
        await getFirebaseServerNow();
        const checkRes = await fetch(`${FIREBASE_DB_URL}/rooms/${rawCode}/state.json?t=${Date.now()}`, { cache: "no-store" });
        if (!checkRes.ok) throw new Error();
        const rawRoomState = await checkRes.json();

        if (!rawRoomState || !rawRoomState.players) {
            msgEl.style.color = "var(--danger)";
            msgEl.textContent = "Bu oda artık aktif değil!";
            fetchActiveRooms();
            return;
        }
        if (rawRoomState.status === "playing") {
            msgEl.style.color = "var(--warning)";
            msgEl.textContent = "Bu odada oyun şu an devam ediyor, bitmesini bekle!";
            return;
        }

        if (currentRoomCode && !isLocalSolo) {
            isSwitchingRoom = true;
            clearInterval(syncInterval);
            clearInterval(timerInterval);
            clearTimeout(botThinkTimeout);
            await removeRoomByCode(currentRoomCode, isHost);
            currentRoomCode = "";
            isSwitchingRoom = false;
        } else if (isLocalSolo) {
            clearInterval(timerInterval);
            clearTimeout(botThinkTimeout);
            isLocalSolo = false;
        }

        isHost = false;
        isLeavingRoom = false;
        currentRoomCode = rawCode;
        lastRenderedTurnNumber = -1;
        lastRenderedTurnStart = 0;

        const joinPut = await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/joins/${myId}.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: myName, avatar: selectedAvatar })
        });
        if (!joinPut.ok) throw new Error();

        msgEl.textContent = "";
        gameState = normalizeGameState(rawRoomState);
        if (!gameState.players.some(p => p.id === myId)) {
            gameState.players.push({ id: myId, name: myName, avatar: selectedAvatar, isBot: false, eliminated: false });
        }

        showGameScreen();
        updateRoomBannerPrivacy(gameState.isPublic, currentRoomCode);
        document.getElementById("host-controls").classList.add("hidden");
        renderGameState();
        fetchActiveRooms();
        startRoomSyncLoop();
    } catch (e) {
        isSwitchingRoom = false;
        currentRoomCode = "";
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = "Odaya bağlanırken ağ hatası oluştu.";
    }
}

// --- BOT EKLE / ÇIKAR ---
async function addBotToRoom(silent = false) {
    if (!isHost || gameState.status === "playing") return;
    if (gameState.players.length >= 6) {
        if (!silent) {
            msgEl.style.color = "var(--warning)";
            msgEl.textContent = "Odada en fazla 6 oyuncu/bot olabilir!";
        }
        return;
    }

    const usedNames = gameState.players.map(p => p.name);
    const availableBot = botProfiles.find(b => !usedNames.includes(b.name)) || {
        name: "Bot-" + Math.floor(10 + Math.random() * 89),
        avatar: "🤖",
        skill: 0.85
    };

    gameState.players.push({
        id: "bot-" + Date.now() + Math.random(),
        name: availableBot.name,
        avatar: availableBot.avatar,
        isBot: true,
        skill: availableBot.skill,
        eliminated: false
    });

    if (!silent) {
        msgEl.textContent = "";
        renderGameState();
        await pushRoomStateToFirebase();
    }
}

async function removeBot(botId) {
    if (!isHost || gameState.status === "playing") return;
    gameState.players = gameState.players.filter(p => p.id !== botId);
    renderGameState();
    await pushRoomStateToFirebase();
}

function copyRoomCode() {
    const code = document.getElementById("room-code-text").textContent;
    navigator.clipboard.writeText(code);
    msgEl.style.color = "var(--emerald)";
    msgEl.textContent = `Gizli oda kodu (${code}) panoya kopyalandı!`;
    setTimeout(() => { msgEl.textContent = ""; }, 2000);
}

async function hostStartMultiplayer() {
    if (!isHost) return;
    if (gameState.players.length < 2) {
        msgEl.style.color = "var(--warning)";
        msgEl.textContent = "Başlamak için en az 2 oyuncu olmalı (İstersen + Bot Ekle'ye bas)!";
        return;
    }
    msgEl.textContent = "";
    switchRightTab("chain");
    gameState.players.forEach(p => p.eliminated = false);
    gameState.turnIndex = 0;
    gameState.turnNumber = 1;
    gameState.status = "playing";
    gameState.usedWords = [];
    gameState.history = [];
    gameState.winnerText = "";
    gameState.turnStartedAt = getSyncedNow();

    const starter = cleanBotWords[Math.floor(Math.random() * cleanBotWords.length)];
    gameState.currentWord = starter;
    gameState.usedWords.push(starter);
    gameState.history.push({ word: starter, senderName: "Sistem", senderAvatar: "🎯", senderId: "sys", isBot: false });

    renderGameState();
    await pushRoomStateToFirebase();
    startTurnTimer();
    checkIfBotTurn();
}

// --- YAPAY ZEKA BOT HAMLESİ ---
function checkIfBotTurn() {
    clearTimeout(botThinkTimeout);
    if (!isHost || gameState.status !== "playing") return;

    const activePlayer = gameState.players[gameState.turnIndex];
    if (!activePlayer || !activePlayer.isBot || activePlayer.eliminated) return;

    const expectedTurn = gameState.turnNumber;
    const thinkTimeMs = 1500 + Math.random() * 2500;

    botThinkTimeout = setTimeout(() => {
        if (gameState.status !== "playing" || gameState.turnNumber !== expectedTurn) return;
        const currentActive = gameState.players[gameState.turnIndex];
        if (!currentActive || currentActive.id !== activePlayer.id) return;

        const requiredLetter = gameState.currentWord.slice(-1);
        const possibleWords = cleanBotWords.filter(w =>
            w.startsWith(requiredLetter) &&
            !gameState.usedWords.includes(w)
        );

        const roll = Math.random();
        const isHardLetter = ["J", "V", "F", "P", "Z", "Ö", "Ü"].includes(requiredLetter);
        const failThreshold = isHardLetter ? (activePlayer.skill - 0.15) : activePlayer.skill;

        if (possibleWords.length === 0 || roll > failThreshold) {
            return;
        }

        const chosenWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
        validateAndProcessWord(chosenWord, activePlayer.id, expectedTurn);
    }, thinkTimeMs);
}

// --- KELİME GÖNDERME ---
inputEl.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && gameState.status === "playing") {
        const me = gameState.players.find(p => p.id === myId);
        if (me && me.eliminated) {
            msgEl.style.color = "var(--danger)";
            msgEl.textContent = "Elendiğin için artık kelime yazamazsın!";
            return;
        }

        const word = toTurkishUpper(inputEl.value);
        if (!word) return;

        const submittedTurn = gameState.turnNumber;

        if (isHost) {
            validateAndProcessWord(word, myId, submittedTurn);
        } else if (currentRoomCode) {
            inputEl.value = "";
            msgEl.textContent = "";
            const subId = "s_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
            await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/submissions/${subId}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    word: word,
                    senderId: myId,
                    turnNumber: submittedTurn,
                    ts: getSyncedNow()
                })
            });
        }
    }
});

async function sendErrorToPlayer(playerId, text) {
    if (playerId === myId) {
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = text;
    } else if (currentRoomCode && !isLocalSolo) {
        await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/errors/${playerId}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, ts: getSyncedNow() })
        });
    }
}

async function validateAndProcessWord(userWord, senderId, submittedTurn = null) {
    if (isProcessingTurn || gameState.status !== "playing") return;

    if (submittedTurn !== null && submittedTurn !== gameState.turnNumber) {
        return;
    }

    const senderPlayer = gameState.players.find(p => p.id === senderId);
    if (!senderPlayer || senderPlayer.eliminated) {
        sendErrorToPlayer(senderId, "Elendiğin için artık kelime yazamazsın!");
        return;
    }

    const activePlayer = gameState.players[gameState.turnIndex];
    if (!activePlayer || activePlayer.id !== senderId) return;

    const requiredLetter = gameState.currentWord.slice(-1);

    if (userWord.includes(" ")) {
        sendErrorToPlayer(senderId, "Boşluk kullanamazsın, sadece tek kelime!");
        return;
    }
    if (userWord.length < 3) {
        sendErrorToPlayer(senderId, "En az 3 harfli bir kelime yazmalısın!");
        return;
    }
    if (!userWord.startsWith(requiredLetter)) {
        sendErrorToPlayer(senderId, `Kelime '${requiredLetter}' harfi ile başlamalı!`);
        return;
    }
    if (turkishCities.has(userWord)) {
        sendErrorToPlayer(senderId, "Şehir isimleri yasak! Cins isim yazmalısın.");
        return;
    }
    if (gameState.usedWords.includes(userWord)) {
        sendErrorToPlayer(senderId, "Bu kelime daha önce kullanıldı!");
        return;
    }
    if (userWord.endsWith("Ğ")) {
        sendErrorToPlayer(senderId, "'Ğ' ile biten kelime yazamazsın!");
        return;
    }
    if (!dictionarySet.has(userWord)) {
        sendErrorToPlayer(senderId, `"${userWord}" sözlükte bulunamadı!`);
        return;
    }

    isProcessingTurn = true;
    clearInterval(timerInterval);
    clearTimeout(botThinkTimeout);

    if (senderId === myId) {
        msgEl.textContent = "";
        inputEl.value = "";
    }

    gameState.currentWord = userWord;
    gameState.usedWords.push(userWord);
    gameState.history.push({
        word: userWord,
        senderName: activePlayer.name,
        senderAvatar: activePlayer.avatar,
        senderId: senderId,
        isBot: activePlayer.isBot
    });

    gameState.turnNumber += 1;
    advanceTurn();
    gameState.turnStartedAt = getSyncedNow();

    renderGameState();
    await pushRoomStateToFirebase();
    isProcessingTurn = false;
    startTurnTimer();
    checkIfBotTurn();
}

function advanceTurn() {
    const total = gameState.players.length;
    for (let i = 1; i <= total; i++) {
        const nextIdx = (gameState.turnIndex + i) % total;
        if (!gameState.players[nextIdx].eliminated) {
            gameState.turnIndex = nextIdx;
            return;
        }
    }
}

function startTurnTimer() {
    clearInterval(timerInterval);
    const barEl = document.getElementById("timer-bar");
    const timeTextEl = document.getElementById("time-text");
    const turnStart = gameState.turnStartedAt || getSyncedNow();
    const hostLimitMs = isLocalSolo ? TURN_DURATION_MS : (TURN_DURATION_MS + HOST_GRACE_MS);

    const tick = () => {
        const elapsedMs = Math.max(0, getSyncedNow() - turnStart);
        const remainingSec = Math.max(0, (TURN_DURATION_MS - elapsedMs) / 1000);

        timeTextEl.textContent = remainingSec.toFixed(1);
        barEl.style.width = ((remainingSec / 7.0) * 100) + "%";

        if (remainingSec <= 2.5) {
            barEl.style.background = "linear-gradient(90deg, #ff4757, #ff6b81)";
        } else if (remainingSec <= 4.5) {
            barEl.style.background = "linear-gradient(90deg, #ffa502, #ffc048)";
        } else {
            barEl.style.background = "linear-gradient(90deg, #00d2ff, #00ff88)";
        }

        if (isHost) {
            if (elapsedMs >= hostLimitMs && !isProcessingTurn) {
                clearInterval(timerInterval);
                handleTimeout();
            }
        } else if (remainingSec <= 0) {
            clearInterval(timerInterval);
        }
    };

    tick();
    timerInterval = setInterval(tick, 100);
}

async function handleTimeout() {
    if (isProcessingTurn || gameState.status !== "playing") return;
    isProcessingTurn = true;
    clearTimeout(botThinkTimeout);

    const timedOutPlayer = gameState.players[gameState.turnIndex];
    if (timedOutPlayer) timedOutPlayer.eliminated = true;

    const alivePlayers = gameState.players.filter(p => !p.eliminated);
    if (alivePlayers.length <= 1) {
        gameState.status = "gameover";
        const winner = alivePlayers[0];
        gameState.winnerText = winner
            ? `Oyun Bitti! Kazanan: ${winner.avatar} ${winner.name} 🏆`
            : "Oyun Bitti! Kazanan yok.";
        
        renderGameState();
        await pushRoomStateToFirebase();
        isProcessingTurn = false;
        await recordMatchStats(winner, gameState.history);
    } else {
        gameState.turnNumber += 1;
        advanceTurn();
        gameState.turnStartedAt = getSyncedNow();
        renderGameState();
        await pushRoomStateToFirebase();
        isProcessingTurn = false;
        startTurnTimer();
        checkIfBotTurn();
    }
}

// --- EKRAN ÇİZİMİ ---
function formatWord(word) {
    if (!word) return "";
    return `${word.slice(0, -1)}<span>${word.slice(-1)}</span>`;
}

function renderGameState() {
    const safePlayers = Array.isArray(gameState.players) ? gameState.players : [];
    const safeHistory = Array.isArray(gameState.history) ? gameState.history : [];

    document.getElementById("connection-count").textContent = `${safePlayers.length} Oyuncu`;
    document.getElementById("turn-count").textContent = Math.max(0, safeHistory.length - 1);

    const me = safePlayers.find(p => p.id === myId);
    const amIEliminated = me && me.eliminated && gameState.status === "playing";

    if (amIEliminated) {
        eliminatedBannerEl.classList.remove("hidden");
        inputEl.disabled = true;
        inputEl.value = "";
        inputEl.classList.add("eliminated-input");
        inputEl.placeholder = "Elendiğin için yazı yazamazsın";
        msgEl.textContent = "";
    } else {
        eliminatedBannerEl.classList.add("hidden");
        inputEl.classList.remove("eliminated-input");
        inputEl.placeholder = "Kelimeyi yaz ve Enter'a bas...";
    }

    const playersBar = document.getElementById("players-bar");
    playersBar.innerHTML = "";
    safePlayers.forEach((p, idx) => {
        const chip = document.createElement("div");
        chip.className = "player-chip";
        if (p.isBot) chip.classList.add("is-bot");
        if (gameState.status === "playing" && idx === gameState.turnIndex && !p.eliminated) {
            chip.classList.add("active-turn");
        }
        if (p.eliminated) chip.classList.add("eliminated");

        const label = p.id === myId ? `${p.name} (Sen)` : p.name;
        chip.innerHTML = `<span class="chip-avatar">${p.avatar || "🎮"}</span><span>${label}</span>`;

        if (isHost && gameState.status !== "playing" && p.isBot) {
            const removeBtn = document.createElement("span");
            removeBtn.className = "remove-bot-btn";
            removeBtn.textContent = "×";
            removeBtn.title = "Botu çıkar";
            removeBtn.onclick = () => removeBot(p.id);
            chip.appendChild(removeBtn);
        }
        playersBar.appendChild(chip);
    });

    const hostControls = document.getElementById("host-controls");
    const startBtn = document.getElementById("host-start-btn");
    if (isHost && gameState.status !== "playing") {
        hostControls.classList.remove("hidden");
        startBtn.textContent = gameState.status === "gameover" ? "Tekrar Başlat" : "Oyunu Başlat";
    } else {
        hostControls.classList.add("hidden");
    }

    const turnIndicator = document.getElementById("turn-indicator");
    const botWordEl = document.getElementById("bot-word");

    if (gameState.status === "lobby") {
        turnIndicator.textContent = isHost ? "Arkadaşlarını davet et veya '+ Bot Ekle' ile masayı doldur!" : "Oda kurucusunun oyunu başlatması bekleniyor...";
        turnIndicator.style.color = "var(--cyan)";
        botWordEl.textContent = "BEKLENİYOR";
        inputEl.disabled = true;
    } else if (gameState.status === "playing") {
        botWordEl.innerHTML = formatWord(gameState.currentWord);
        const activePlayer = safePlayers[gameState.turnIndex];
        const isMyTurn = activePlayer && activePlayer.id === myId && !amIEliminated;

        if (isMyTurn) {
            turnIndicator.textContent = `${activePlayer.avatar} SIRA SENDE! '${gameState.currentWord.slice(-1)}' ile başlayan kelime yaz:`;
            turnIndicator.style.color = "var(--emerald)";
            const wasDisabled = inputEl.disabled;
            inputEl.disabled = false;
            inputEl.focus();
            if (wasDisabled && window.innerWidth <= 960) {
                document.getElementById("current-word-box").scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            const statusText = activePlayer && activePlayer.isBot
                ? `${activePlayer.avatar} ${activePlayer.name} düşünüyor...`
                : `Sıra ${activePlayer ? activePlayer.avatar + " " + activePlayer.name : ""} oyuncusunda...`;
            turnIndicator.textContent = statusText;
            turnIndicator.style.color = activePlayer && activePlayer.isBot ? "#d6a2e8" : "var(--warning)";
            inputEl.disabled = true;
            inputEl.value = "";
        }
    } else if (gameState.status === "gameover") {
        eliminatedBannerEl.classList.add("hidden");
        turnIndicator.textContent = gameState.winnerText;
        turnIndicator.style.color = "var(--emerald)";
        inputEl.disabled = true;
    }

    const tbody = document.getElementById("history-tbody");
    const emptyState = document.getElementById("empty-state");
    tbody.innerHTML = "";

    if (safeHistory.length > 0) {
        emptyState.style.display = "none";
        safeHistory.forEach((item, i) => {
            const tr = document.createElement("tr");
            const isMe = item.senderId === myId;
            const badgeClass = isMe ? "badge-me" : (item.isBot ? "badge-bot" : "");
            const avatar = item.senderAvatar || "";
            const displayName = isMe ? `${avatar} Sen` : `${avatar} ${item.senderName}`;
            tr.innerHTML = `
                <td class="col-num">${i + 1}</td>
                <td><span class="badge ${badgeClass}">${displayName}</span></td>
                <td class="col-word">${formatWord(item.word)}</td>
            `;
            tbody.appendChild(tr);
        });
        document.getElementById("total-words-num").textContent = safeHistory.length;
        const wrapper = document.getElementById("table-wrapper");
        wrapper.scrollTop = wrapper.scrollHeight;
    } else {
        emptyState.style.display = "block";
        document.getElementById("total-words-num").textContent = "0";
    }
}

initAnonPlaceholder();
initAvatarSelector();
startActiveRoomsMonitor();
fetchGlobalLeaderboard();
loadDictionary();