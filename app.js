// --- FIREBASE VERİTABANI ADRESİN ---
const FIREBASE_DB_URL = "https://kelime-turetmece-c151c-default-rtdb.europe-west1.firebasedatabase.app";
const TURN_DURATION_MS = 7000;
const HOST_GRACE_MS = 800;

// --- ÇOKLU DİL SİSTEMİ (TR / EN) ---
let currentLang = "tr";

const i18n = {
    tr: {
        activeRooms: "Aktif Odalar",
        noActiveRooms: "Şu an aktif oda yok. Oda kurduğunda burada görünür!",
        lblLang: "Oyun Dili / Game Language",
        lblAvatar: "Avatarını Seç",
        lblNick: "Anonim Takma Adın (Gizlilik Korumalı)",
        btnReroll: "🎲 Değiştir",
        lblPrivacy: "Oda Gizliliği ve Kurulum",
        btnPublic: "🌍 Herkese Açık",
        btnPrivate: "🔒 Gizli Oda",
        btnCreate: "+ Oda Kur (Arkadaşlar & Botlar)",
        lblJoin: "Gizli Odaya Kodla Katıl (6 Haneli)",
        joinPlaceholder: "Örn: A7K9P2",
        btnJoin: "Katıl",
        btnSolo: "⚡ Hızlı Oyun: 3 Bota Karşı Oyna",
        lblCode: "Oda Kodu:",
        inRoom: "Odandasın",
        joinMini: "Katıl",
        inMatch: "Maçta",
        full: "Dolu",
        open: "Açık",
        privateActive: "🔒 Gizli Odada Aktif",
        privateInMatch: " • Maçta",
        playersCount: (n) => `${n} Oyuncu`,
        playersPill: (n) => `${n}/6 Oyuncu`,
        eliminatedBanner: "❌ Süren dolduğu için elendin! Oyun bitene kadar yazı yazamazsın (İzleyici Modu).",
        lblTurn: "Tur:",
        lblTime: "Süre:",
        lblSec: "sn",
        wordPlaceholder: "Kelimeyi yaz ve Enter'a bas...",
        wordPlaceholderElim: "Elendiğin için yazı yazamazsın",
        btnAddBot: "+ Bot Ekle",
        btnStart: "Oyunu Başlat",
        btnRestart: "Tekrar Başlat",
        btnLeave: "Lobiden Çık",
        tabChain: "Kelime Zinciri",
        tabLb: "İlk 5 Lider",
        thPlayer: "Oyuncu",
        thWord: "Kelime",
        thWins: "Galibiyet",
        emptyChain: "Oyun başladığında türetilen kelimeler burada akacak.",
        emptyLb: "Henüz tamamlanmış bir maç yok. İlk kazanan sen ol!",
        lbLive: "🟢 En İyi 5 Oyuncu (Canlı)",
        lbErr: "⚠️ Bulut bağlantısı kurulamadı",
        dictLoading: "Sözlük yükleniyor...",
        dictReady: (n) => `${n.toLocaleString("tr-TR")} kelime doğrulamaya hazır`,
        dictFallback: (n) => `Çekirdek sözlük hazır (${n} kelime)`,
        waiting: "BEKLENİYOR",
        lobbyHostHint: "Arkadaşlarını davet et veya '+ Bot Ekle' ile masayı doldur!",
        lobbyGuestHint: "Oda kurucusunun oyunu başlatması bekleniyor...",
        yourTurn: (av, ch) => `${av} SIRA SENDE! '${ch}' ile başlayan kelime yaz:`,
        botThinking: (av, name) => `${av} ${name} düşünüyor...`,
        playerTurn: (av, name) => `Sıra ${av} ${name} oyuncusunda...`,
        youSuffix: "(Sen)",
        youWord: "Sen",
        systemName: "Sistem",
        winText: (av, name) => `Oyun Bitti! Kazanan: ${av} ${name} 🏆`,
        noWinnerText: "Oyun Bitti! Kazanan yok.",
        codeCopied: (code) => `Gizli oda kodu (${code}) panoya kopyalandı!`,
        errCodeLen: "Lütfen 6 haneli oda kodunu eksiksiz gir!",
        errCreating: "Oda oluşturuluyor...",
        errCreateFail: "Oda kurulamadı, internet bağlantını kontrol et.",
        errJoining: "Odaya bağlanılıyor...",
        errRoomGone: "Bu oda artık aktif değil!",
        errRoomPlaying: "Bu odada oyun şu an devam ediyor, bitmesini bekle!",
        errRoomFull: "Bu oda dolu (6/6)!",
        errJoinFail: "Odaya bağlanırken ağ hatası oluştu.",
        errHostLeft: "Oda kurucusu odadan ayrıldığı için oda kapatıldı.",
        errMaxPlayers: "Odada en fazla 6 oyuncu/bot olabilir!",
        errMinPlayers: "Başlamak için en az 2 oyuncu olmalı (İstersen + Bot Ekle'ye bas)!",
        errEliminated: "Elendiğin için artık kelime yazamazsın!",
        errNoSpace: "Boşluk kullanamazsın, sadece tek kelime!",
        errLettersOnly: "Sadece Türkçe harfler kullanabilirsin!",
        errMinLen: "En az 3 harfli bir kelime yazmalısın!",
        errStartsWith: (ch) => `Kelime '${ch}' harfi ile başlamalı!`,
        errCity: "Şehir isimleri yasak! Cins isim yazmalısın.",
        errUsed: "Bu kelime daha önce kullanıldı!",
        errEndsSoftG: "'Ğ' ile biten kelime yazamazsın!",
        errNotFound: (w) => `"${w}" sözlükte bulunamadı!`
    },
    en: {
        activeRooms: "Active Rooms",
        noActiveRooms: "No active rooms right now. Create a room to appear here!",
        lblLang: "Game Language / Oyun Dili",
        lblAvatar: "Choose Your Avatar",
        lblNick: "Anonymous Nickname (Privacy Protected)",
        btnReroll: "🎲 Reroll",
        lblPrivacy: "Room Privacy & Setup",
        btnPublic: "🌍 Public Room",
        btnPrivate: "🔒 Private Room",
        btnCreate: "+ Create Room (Friends & Bots)",
        lblJoin: "Join Private Room with 6-Char Code",
        joinPlaceholder: "e.g. A7K9P2",
        btnJoin: "Join",
        btnSolo: "⚡ Quick Play: vs 3 Bots",
        lblCode: "Room Code:",
        inRoom: "In Room",
        joinMini: "Join",
        inMatch: "Playing",
        full: "Full",
        open: "Open",
        privateActive: "🔒 Active in Private Room",
        privateInMatch: " • Playing",
        playersCount: (n) => `${n} Players`,
        playersPill: (n) => `${n}/6 Players`,
        eliminatedBanner: "❌ Time ran out! You are eliminated until the match ends (Spectator Mode).",
        lblTurn: "Turn:",
        lblTime: "Time:",
        lblSec: "sec",
        wordPlaceholder: "Type a word and press Enter...",
        wordPlaceholderElim: "Eliminated — spectator mode",
        btnAddBot: "+ Add Bot",
        btnStart: "Start Game",
        btnRestart: "Play Again",
        btnLeave: "Leave Lobby",
        tabChain: "Word Chain",
        tabLb: "Top 5 Leaders",
        thPlayer: "Player",
        thWord: "Word",
        thWins: "Wins",
        emptyChain: "Words played during the match will appear here.",
        emptyLb: "No finished matches yet. Be the first champion!",
        lbLive: "🟢 Top 5 Players (Live)",
        lbErr: "⚠️ Could not connect to cloud",
        dictLoading: "Loading dictionary...",
        dictReady: (n) => `${n.toLocaleString("en-US")} words ready for validation`,
        dictFallback: (n) => `Core dictionary ready (${n} words)`,
        waiting: "WAITING",
        lobbyHostHint: "Invite friends or click '+ Add Bot' to fill the table!",
        lobbyGuestHint: "Waiting for the room host to start the game...",
        yourTurn: (av, ch) => `${av} YOUR TURN! Type a word starting with '${ch}':`,
        botThinking: (av, name) => `${av} ${name} is thinking...`,
        playerTurn: (av, name) => `Waiting for ${av} ${name}...`,
        youSuffix: "(You)",
        youWord: "You",
        systemName: "System",
        winText: (av, name) => `Game Over! Winner: ${av} ${name} 🏆`,
        noWinnerText: "Game Over! No winner.",
        codeCopied: (code) => `Private room code (${code}) copied to clipboard!`,
        errCodeLen: "Please enter the full 6-character room code!",
        errCreating: "Creating room...",
        errCreateFail: "Could not create room, check your connection.",
        errJoining: "Joining room...",
        errRoomGone: "This room is no longer active!",
        errRoomPlaying: "A match is already in progress in this room!",
        errRoomFull: "This room is full (6/6)!",
        errJoinFail: "Network error while joining room.",
        errHostLeft: "The host left, so the room was closed.",
        errMaxPlayers: "Maximum 6 players/bots allowed in a room!",
        errMinPlayers: "Need at least 2 players to start (try '+ Add Bot')!",
        errEliminated: "You are eliminated and cannot type words!",
        errNoSpace: "No spaces allowed, single word only!",
        errLettersOnly: "Only English letters (A-Z) are allowed!",
        errMinLen: "Word must be at least 3 letters long!",
        errStartsWith: (ch) => `Word must start with '${ch}'!`,
        errCity: "City names are not allowed!",
        errUsed: "This word has already been used!",
        errEndsSoftG: "Words ending in 'X' or 'Q' are not allowed!",
        errNotFound: (w) => `"${w}" was not found in the dictionary!`
    }
};

function t(key, ...args) {
    const val = i18n[currentLang]?.[key] ?? i18n.tr[key];
    return typeof val === "function" ? val(...args) : val;
}

// --- 6 HANELİ ALFANÜMERİK ODA KODU ÜRETİCİ (Yalnızca A-Z ve 0-9) ---
const ROOM_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRoomCode() {
    let code = "";
    if (window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint32Array(6);
        window.crypto.getRandomValues(arr);
        for (let i = 0; i < 6; i++) {
            code += ROOM_CODE_CHARS[arr[i] % ROOM_CODE_CHARS.length];
        }
    } else {
        for (let i = 0; i < 6; i++) {
            code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
        }
    }
    return code;
}

function sanitizeRoomCode(raw) {
    return String(raw ?? "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);
}

// --- RASTGELE ANONİM TAKMA AD SİSTEMİ (MAX 15 KARAKTER GARANTİLİ) ---
const nickAdjectivesTR = [
    "Hızlı", "Gizem", "Atik", "Zeki", "Süper", "Keskin", "Sessiz", "Çevik",
    "Usta", "Gölge", "Kozmik", "Buzul", "Fırtına", "Kıvrak", "Şimşek", "Asil",
    "Parlak", "Çılgın", "Bilge", "Kızıl", "Mavi", "Altın", "Demir", "Yıldız"
];
const nickNounsTR = [
    "Tilki", "Baykuş", "Kurt", "Kartal", "Panda", "Ejder", "Vaşak", "Şahin",
    "Gezgin", "Kaşif", "Avcı", "Korsan", "Ninja", "Kuzgun", "Pars", "Kaplan",
    "Aslan", "Yunus", "Kutup", "Süvari", "Ozan", "Kahin", "Atom", "Rüzgar"
];

const nickAdjectivesEN = [
    "Swift", "Shadow", "Clever", "Hyper", "Sharp", "Silent", "Agile", "Cosmic",
    "Frost", "Storm", "Flash", "Noble", "Bright", "Wild", "Wise", "Ruby",
    "Azure", "Golden", "Iron", "Star", "Mystic", "Turbo", "Solar", "Cyber"
];
const nickNounsEN = [
    "Fox", "Owl", "Wolf", "Eagle", "Panda", "Dragon", "Lynx", "Falcon",
    "Rover", "Scout", "Hunter", "Pirate", "Ninja", "Raven", "Tiger", "Lion",
    "Shark", "Knight", "Bard", "Oracle", "Atom", "Vortex", "Spark", "Hawk"
];

const allAdjectives = [...nickAdjectivesTR, ...nickAdjectivesEN];
const allNouns = [...nickNounsTR, ...nickNounsEN];
const validNickPattern = new RegExp(`^(${allAdjectives.join("|")})(${allNouns.join("|")})\\d{2}$`);
const validBotNamePattern = /^(Bot (Alp|Derin|Mert|Ece|Kaan)|Bot-\d{2})$/;

function generateAnonNick(lang = currentLang) {
    const adjs = lang === "en" ? nickAdjectivesEN : nickAdjectivesTR;
    const nouns = lang === "en" ? nickNounsEN : nickNounsTR;
    for (let attempt = 0; attempt < 25; attempt++) {
        const adj = adjs[Math.floor(Math.random() * adjs.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(10 + Math.random() * 89);
        const candidate = `${adj}${noun}${num}`;
        if (candidate.length <= 15) return candidate;
    }
    return lang === "en" ? "SwiftFox42" : "AtikTilki42";
}

let currentAnonNick = generateAnonNick("tr");

function initAnonNickBox() {
    const displayEl = document.getElementById("anon-nick-display");
    if (displayEl) displayEl.textContent = currentAnonNick;
}

function rerollAnonNick() {
    let nextNick = generateAnonNick(currentLang);
    while (nextNick === currentAnonNick) {
        nextNick = generateAnonNick(currentLang);
    }
    currentAnonNick = nextNick;
    myName = currentAnonNick;
    const displayEl = document.getElementById("anon-nick-display");
    if (displayEl) displayEl.textContent = currentAnonNick;
}

function sanitizeAnonNick(raw, fallback = "AtikTilki10") {
    const cleaned = String(raw ?? "").trim();
    if (
        cleaned.length <= 18 &&
        (validNickPattern.test(cleaned) || cleaned === "Sistem" || cleaned === "System" || validBotNamePattern.test(cleaned))
    ) {
        return cleaned;
    }
    return fallback;
}

function setGameLanguage(lang, rerollNick = true) {
    currentLang = lang === "en" ? "en" : "tr";
    const btnTr = document.getElementById("btn-lang-tr");
    const btnEn = document.getElementById("btn-lang-en");
    if (btnTr && btnEn) {
        btnTr.className = currentLang === "tr" ? "privacy-btn active-public" : "privacy-btn";
        btnEn.className = currentLang === "en" ? "privacy-btn active-public" : "privacy-btn";
    }

    if (rerollNick) {
        currentAnonNick = generateAnonNick(currentLang);
        myName = currentAnonNick;
        initAnonNickBox();
    }

    applyLanguageToUI();
    ensureDictionaryLoaded(currentLang);
    fetchActiveRooms();
    renderLeaderboard();
}

function applyLanguageToUI() {
    document.getElementById("ui-active-rooms-title").textContent = t("activeRooms");
    document.getElementById("ui-lbl-lang").textContent = t("lblLang");
    document.getElementById("ui-lbl-avatar").textContent = t("lblAvatar");
    document.getElementById("ui-lbl-nick").textContent = t("lblNick");
    document.getElementById("ui-btn-reroll").textContent = t("btnReroll");
    document.getElementById("ui-lbl-privacy").textContent = t("lblPrivacy");
    document.getElementById("btn-privacy-public").textContent = t("btnPublic");
    document.getElementById("btn-privacy-private").textContent = t("btnPrivate");
    document.getElementById("ui-btn-create").textContent = t("btnCreate");
    document.getElementById("ui-lbl-join").textContent = t("lblJoin");
    document.getElementById("join-code-input").placeholder = t("joinPlaceholder");
    document.getElementById("ui-btn-join").textContent = t("btnJoin");
    document.getElementById("ui-btn-solo").textContent = t("btnSolo");
    document.getElementById("ui-lbl-code").textContent = t("lblCode");
    document.getElementById("eliminated-banner").textContent = t("eliminatedBanner");
    document.getElementById("ui-lbl-turn").textContent = t("lblTurn");
    document.getElementById("ui-lbl-time").textContent = t("lblTime");
    document.getElementById("ui-lbl-sec").textContent = t("lblSec");
    document.getElementById("add-bot-btn").textContent = t("btnAddBot");
    document.getElementById("ui-btn-leave").textContent = t("btnLeave");
    document.getElementById("ui-tab-chain").textContent = t("tabChain");
    document.getElementById("ui-tab-lb").textContent = t("tabLb");
    document.getElementById("ui-th-player").textContent = t("thPlayer");
    document.getElementById("ui-th-word").textContent = t("thWord");
    document.getElementById("ui-th-lb-player").textContent = t("thPlayer");
    document.getElementById("ui-th-lb-wins").textContent = t("thWins");
    document.getElementById("ui-th-lb-words").textContent = t("thWord");
    document.getElementById("empty-state").textContent = t("emptyChain");
    document.getElementById("lb-empty-state").textContent = t("emptyLb");
}

// --- GÜVENLİK VE TEMİZLEME YARDIMCILARI ---
const avatarOptions = ["🦊", "🐱", "🐺", "🦁", "🐼", "🐸", "🦉", "🐲", "👾", "🚀", "🎸", "⚡"];

function escapeHTML(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function sanitizeAvatar(rawAvatar, fallback = "🎮") {
    const allowed = new Set([...avatarOptions, "🎮", "🤖", "🦾", "🛸", "🧠", "⚙️", "🎯"]);
    return allowed.has(rawAvatar) ? rawAvatar : fallback;
}

function sanitizeWord(rawWord, lang = currentLang) {
    if (lang === "en") {
        return String(rawWord ?? "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 30);
    }
    return toTurkishUpper(String(rawWord ?? "")).replace(/[^A-ZÇĞİÖŞÜ]/g, "").slice(0, 30);
}

// --- SUNUCU SAATİ FARKI (SIFIR YAZMA MALİYETLİ) ---
let serverTimeOffset = 0;
function getSyncedNow() {
    return Date.now() + serverTimeOffset;
}

function syncClockFromHeader(response) {
    try {
        const dateHeader = response && response.headers ? response.headers.get("Date") : null;
        if (dateHeader) {
            const serverMs = Date.parse(dateHeader);
            if (!Number.isNaN(serverMs)) {
                serverTimeOffset = serverMs - Date.now();
            }
        }
    } catch (err) {
        console.warn("Clock header sync skipped:", err);
    }
}

async function initServerTimeSync() {
    try {
        const t0 = Date.now();
        const res = await fetch(`${FIREBASE_DB_URL}/activeRooms.json?shallow=true`, { cache: "no-store" });
        const t1 = Date.now();
        const dateHeader = res.headers.get("Date");
        if (dateHeader) {
            const serverMs = Date.parse(dateHeader) + Math.round((t1 - t0) / 2);
            if (!Number.isNaN(serverMs)) serverTimeOffset = serverMs - t1;
        }
    } catch (err) {
        console.warn("Initial clock sync unavailable:", err);
    }
}

// --- AVATAR SEÇİCİ & GİRİŞ FİLTRESİ ---
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

    const joinInput = document.getElementById("join-code-input");
    if (joinInput) {
        joinInput.addEventListener("input", () => {
            const clean = sanitizeRoomCode(joinInput.value);
            if (joinInput.value !== clean) joinInput.value = clean;
        });
    }
}

// --- ODA GİZLİLİK SEÇİMİ ---
let isRoomPublic = true;

function setRoomPrivacy(publicFlag) {
    isRoomPublic = Boolean(publicFlag);
    const pubBtn = document.getElementById("btn-privacy-public");
    const privBtn = document.getElementById("btn-privacy-private");
    if (isRoomPublic) {
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

// --- AKTİF ODALAR / LOBİLER LİSTESİ (KOTA DOSTU) ---
let activeRoomsPollInterval = null;
let isLeavingRoom = false;

async function sendRoomHeartbeat() {
    if (!currentRoomCode || !isHost || isLocalSolo || isLeavingRoom) return;

    try {
        const publicCodeField = isRoomPublic ? currentRoomCode : "PRIVATE";
        const res = await fetch(`${FIREBASE_DB_URL}/activeRooms/${currentRoomCode}.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: publicCodeField,
                hostName: sanitizeAnonNick(myName),
                hostAvatar: sanitizeAvatar(selectedAvatar),
                isPublic: Boolean(isRoomPublic),
                lang: currentLang,
                status: gameState.status,
                playerCount: Math.min(6, Math.max(1, gameState.players.length)),
                lastSeen: { ".sv": "timestamp" }
            })
        });
        if (!res.ok) console.warn("Heartbeat rejected:", res.status);
    } catch (err) {
        console.warn("Heartbeat network error:", err);
    }
}

async function removeRoomByCode(code, wasHost) {
    const safeCode = sanitizeRoomCode(code);
    if (safeCode.length !== 6) return;
    try {
        if (wasHost) {
            await Promise.all([
                fetch(`${FIREBASE_DB_URL}/activeRooms/${safeCode}.json`, { method: "DELETE", keepalive: true }),
                fetch(`${FIREBASE_DB_URL}/rooms/${safeCode}.json`, { method: "DELETE", keepalive: true })
            ]);
        } else {
            await fetch(`${FIREBASE_DB_URL}/rooms/${safeCode}/joins/${encodeURIComponent(myId)}.json`, { method: "DELETE", keepalive: true });
        }
    } catch (err) {
        console.warn("Room cleanup failed:", err);
    }
}

async function removeMyActiveRoom() {
    if (!currentRoomCode || isLocalSolo) return;
    isLeavingRoom = true;
    await removeRoomByCode(currentRoomCode, isHost);
}

async function fetchActiveRooms() {
    if (document.hidden) return;
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/activeRooms.json?t=${Date.now()}`, {
            cache: "no-store"
        });
        if (!res.ok) return;
        syncClockFromHeader(res);
        const serverNow = getSyncedNow();
        const data = await res.json();
        const validRooms = [];

        if (data && typeof data === "object") {
            for (const [rCode, info] of Object.entries(data)) {
                if (!info || !/^[A-Z0-9]{6}$/.test(rCode)) continue;
                const roomLastSeen = typeof info.lastSeen === "number" ? info.lastSeen : serverNow;

                if (serverNow - roomLastSeen <= 90000) {
                    validRooms.push({ ...info, roomKey: rCode });
                } else if (rCode !== currentRoomCode) {
                    fetch(`${FIREBASE_DB_URL}/activeRooms/${rCode}.json`, { method: "DELETE" });
                }
            }
        }

        renderActiveRooms(validRooms);
    } catch (err) {
        console.warn("Active rooms fetch failed:", err);
    }
}

function renderActiveRooms(rooms) {
    const container = document.getElementById("online-rooms-list");
    const countBadge = document.getElementById("online-count-badge");
    container.innerHTML = "";
    countBadge.textContent = rooms.length;

    if (rooms.length === 0) {
        container.innerHTML = `<div class="online-empty-msg">${escapeHTML(t("noActiveRooms"))}</div>`;
        return;
    }

    rooms.forEach(room => {
        const safeKey = sanitizeRoomCode(room.roomKey);
        const safeCode = sanitizeRoomCode(room.code);
        const safeHostName = escapeHTML(sanitizeAnonNick(room.hostName));
        const safeHostAvatar = sanitizeAvatar(room.hostAvatar, "🎮");
        const safePlayerCount = Math.min(6, Math.max(1, Number(room.playerCount) || 1));
        const langTag = room.lang === "en" ? "🇬🇧 EN" : "🇹🇷 TR";

        const card = document.createElement("div");
        card.className = "online-room-card" + (room.isPublic ? " is-public" : "");

        const isPlaying = room.status === "playing";
        const isFull = safePlayerCount >= 6;
        const isMyRoom = safeKey === currentRoomCode;

        let rightActionHtml = "";
        let subInfoHtml = "";

        if (room.isPublic && safeCode.length === 6) {
            subInfoHtml = `<span class="room-player-pill">${langTag} • ${escapeHTML(t("playersPill", safePlayerCount))}</span>`;

            if (isMyRoom) {
                rightActionHtml = `<span style="font-size: 0.72rem; color: var(--cyan); font-weight: 700;">${escapeHTML(t("inRoom"))}</span>`;
            } else if (!isPlaying && !isFull) {
                rightActionHtml = `<button class="quick-join-mini" onclick="joinRoom('${safeCode}')">${escapeHTML(t("joinMini"))}</button>`;
            } else {
                const badgeText = isPlaying ? t("inMatch") : (isFull ? t("full") : t("open"));
                rightActionHtml = `<span class="in-game-badge">${escapeHTML(badgeText)}</span>`;
            }
        } else {
            const privText = t("privateActive") + (isPlaying ? t("privateInMatch") : "");
            subInfoHtml = `<span class="private-status-tag">${langTag} • ${escapeHTML(privText)}</span>`;
        }

        card.innerHTML = `
            <div class="online-room-info">
                <div class="online-user-left">
                    <span class="online-user-avatar">${safeHostAvatar}</span>
                    <span class="online-user-name">${safeHostName}</span>
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
        if (document.hidden) return;
        if (isHost && currentRoomCode && !isLocalSolo && !isLeavingRoom) {
            await sendRoomHeartbeat();
        }
        if (!currentRoomCode || gameState.status === "lobby") {
            await fetchActiveRooms();
        }
    }, 12000);

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
    return sanitizeAnonNick(name).replace(/[.#$\[\]\/]/g, "_").trim();
}

async function fetchGlobalLeaderboard() {
    const infoEl = document.getElementById("lb-sync-info");
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/leaderboard.json?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        leaderboardData = (data && typeof data === "object") ? data : {};
        infoEl.textContent = t("lbLive");
        renderLeaderboard();
    } catch (err) {
        console.warn("Leaderboard fetch failed:", err);
        infoEl.textContent = t("lbErr");
        renderLeaderboard();
    }
}

async function recordMatchStats(winnerPlayer, historyList) {
    const matchSummary = {};
    const safeHistory = Array.isArray(historyList) ? historyList : [];

    safeHistory.forEach(item => {
        if (item.senderId === "sys" || item.isBot) return;
        const cleanName = sanitizeAnonNick(item.senderName);
        const key = sanitizeFirebaseKey(cleanName);
        if (!matchSummary[key]) {
            matchSummary[key] = {
                name: cleanName,
                avatar: sanitizeAvatar(item.senderAvatar, "🎮"),
                winsToAdd: 0,
                wordsToAdd: 0
            };
        }
        matchSummary[key].wordsToAdd = Math.min(100, matchSummary[key].wordsToAdd + 1);
        matchSummary[key].avatar = sanitizeAvatar(item.senderAvatar, matchSummary[key].avatar);
    });

    if (winnerPlayer && !winnerPlayer.isBot) {
        const cleanWinnerName = sanitizeAnonNick(winnerPlayer.name);
        const wKey = sanitizeFirebaseKey(cleanWinnerName);
        if (!matchSummary[wKey]) {
            matchSummary[wKey] = {
                name: cleanWinnerName,
                avatar: sanitizeAvatar(winnerPlayer.avatar, "🎮"),
                winsToAdd: 0,
                wordsToAdd: 0
            };
        }
        matchSummary[wKey].winsToAdd = 1;
        matchSummary[wKey].avatar = sanitizeAvatar(winnerPlayer.avatar, "🎮");
    }

    Object.entries(matchSummary).forEach(([key, delta]) => {
        const existing = leaderboardData[key] || { name: delta.name, avatar: delta.avatar, wins: 0, words: 0 };
        leaderboardData[key] = {
            name: delta.name,
            avatar: delta.avatar,
            wins: (Number(existing.wins) || 0) + delta.winsToAdd,
            words: (Number(existing.words) || 0) + delta.wordsToAdd
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
                wins: (Number(currentData.wins) || 0) + delta.winsToAdd,
                words: (Number(currentData.words) || 0) + delta.wordsToAdd
            };

            const putRes = await fetch(`${FIREBASE_DB_URL}/leaderboard/${encodeURIComponent(key)}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRecord)
            });
            if (!putRes.ok) console.warn("Leaderboard write rejected:", putRes.status);
        } catch (err) {
            console.warn("Leaderboard update error:", err);
        }
    }

    await fetchGlobalLeaderboard();
}

function renderLeaderboard() {
    const tbody = document.getElementById("leaderboard-tbody");
    const emptyEl = document.getElementById("lb-empty-state");
    tbody.innerHTML = "";

    const topFive = Object.values(leaderboardData)
        .filter(entry => entry && typeof entry === "object" && !entry.isBot && validNickPattern.test(String(entry.name || "")))
        .sort((a, b) => {
            if ((Number(b.wins) || 0) !== (Number(a.wins) || 0)) return (Number(b.wins) || 0) - (Number(a.wins) || 0);
            return (Number(b.words) || 0) - (Number(a.words) || 0);
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

        const cleanName = sanitizeAnonNick(entry.name);
        const safeName = escapeHTML(cleanName);
        const safeAvatar = sanitizeAvatar(entry.avatar, "🎮");
        const safeWins = Math.max(0, Number(entry.wins) || 0);
        const safeWords = Math.max(0, Number(entry.words) || 0);

        const badgeClass = cleanName === myName ? "badge-me" : "";
        tr.innerHTML = `
            <td class="col-num">${rankDisplay}</td>
            <td><span class="badge ${badgeClass}">${safeAvatar} ${safeName}</span></td>
            <td style="text-align: center; font-weight: 800; color: var(--emerald);">${safeWins}</td>
            <td style="text-align: right; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">${safeWords}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- TÜRKÇE KELİME HAVUZU ---
const commonBotWordsTR = [
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

// --- İNGİLİZCE KELİME HAVUZU (~360 COMMON WORDS) ---
const commonBotWordsEN = [
    "APPLE", "ARROW", "ARTIST", "ACTION", "ANCHOR", "ANIMAL", "ANSWER", "AUTUMN", "AVENUE", "AWARD",
    "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIVE", "ANGEL", "ANGER", "ANGLE", "ANKLE", "APRON",
    "ARENA", "ARMOR", "AROMA", "ASSET", "ATLAS", "ATOM", "ATTIC", "AUDIO", "AUTHOR", "AWAKE",
    "BADGE", "BAKER", "BALANCE", "BALLOON", "BANANA", "BANDIT", "BANNER", "BARREL", "BASKET", "BATTLE",
    "BEACH", "BEACON", "BEAUTY", "BEAVER", "BEETLE", "BELIEF", "BENCH", "BERRY", "BICYCLE", "BISHOP",
    "BLANKET", "BLAZE", "BLOSSOM", "BOARD", "BOAT", "BOLT", "BONE", "BOOK", "BORDER", "BOTTLE",
    "BOTTOM", "BOUNCE", "BRANCH", "BRAVE", "BREAD", "BREEZE", "BRICK", "BRIDGE", "BRIGHT", "BRONZE",
    "BROOK", "BROTHER", "BRUSH", "BUBBLE", "BUCKET", "BUDGET", "BUFFALO", "BUILDER", "BULLET", "BUNDLE",
    "BURGER", "BUTTER", "BUTTON", "CABIN", "CACTUS", "CAGE", "CAKE", "CAMERA", "CAMP", "CANAL",
    "CANDLE", "CANDY", "CANYON", "CAPTAIN", "CARBON", "CARD", "CARGO", "CARPET", "CARROT", "CASTLE",
    "CATCH", "CATTLE", "CAVERN", "CEILING", "CELLAR", "CENTER", "CHAIN", "CHAIR", "CHALK", "CHAMPION",
    "CHANCE", "CHANGE", "CHANNEL", "CHAPTER", "CHARGE", "CHARM", "CHASE", "CHEESE", "CHERRY", "CHEST",
    "CHICKEN", "CHILD", "CHIMNEY", "CHOICE", "CHORD", "CIRCLE", "CIRCUS", "CITIZEN", "CLAY", "CLIFF",
    "CLIMATE", "CLOCK", "CLOUD", "CLOVER", "COACH", "COAST", "COFFEE", "COIN", "COLLAR", "COLOR",
    "COLUMN", "COMET", "COMFORT", "COMPASS", "CONCERT", "COOKIE", "COPPER", "CORAL", "CORNER", "COTTON",
    "COUGAR", "COUNCIL", "COUNTRY", "COURAGE", "COURSE", "COURT", "CRADLE", "CRAFT", "CRANE", "CRATER",
    "CREAM", "CREEK", "CRICKET", "CROWN", "CRYSTAL", "CURTAIN", "CUSTOM", "CYCLE", "DAGGER", "DAISY",
    "DANCE", "DANGER", "DAWN", "DAYLIGHT", "DEBATE", "DECADE", "DEER", "DEFENSE", "DEGREE", "DELAY",
    "DELIGHT", "DELTA", "DEMAND", "DESERT", "DESIGN", "DESK", "DETAIL", "DEVICE", "DIAMOND", "DIARY",
    "DINNER", "DOCTOR", "DOLPHIN", "DOMAIN", "DONKEY", "DOOR", "DOUBLE", "DRAGON", "DRAMA", "DREAM",
    "DRESS", "DRIFT", "DRIVER", "DROP", "DRUM", "DUCK", "DUST", "EAGLE", "EARTH", "ECHO",
    "EDGE", "EFFECT", "EFFORT", "ELBOW", "ELDER", "ELEMENT", "ELEPHANT", "EMERALD", "EMPIRE", "ENERGY",
    "ENGINE", "ENTRY", "ENVY", "EQUAL", "ERASER", "ERROR", "ESCAPE", "ESSAY", "EVENING", "EVENT",
    "EVIDENCE", "EXAMPLE", "EXPERT", "FABRIC", "FACTOR", "FACTORY", "FALCON", "FAMILY", "FARMER", "FASHION",
    "FATHER", "FEATHER", "FEATURE", "FENCE", "FESTIVAL", "FIBER", "FIELD", "FIGURE", "FILTER", "FINGER",
    "FIRE", "FISH", "FLAME", "FLAVOR", "FLIGHT", "FLOAT", "FLOOD", "FLOOR", "FLOUR", "FLOWER",
    "FLUTE", "FOCUS", "FOREST", "FORK", "FORTUNE", "FOSSIL", "FOUNTAIN", "FRAME", "FREEDOM", "FRIEND",
    "FROG", "FRONT", "FROST", "FRUIT", "FUEL", "FURNACE", "FUTURE", "GADGET", "GALAXY", "GALLERY",
    "GAME", "GARAGE", "GARDEN", "GARLIC", "GATE", "GENTLE", "GHOST", "GIANT", "GIFT", "GINGER",
    "GIRAFFE", "GLACIER", "GLASS", "GLOBE", "GLOVE", "GOAL", "GOAT", "GOLD", "GOOSE", "GRAIN",
    "GRAPE", "GRASS", "GRAVEL", "GRAVITY", "GREEN", "GROUND", "GROUP", "GUARD", "GUEST", "GUIDE",
    "GUITAR", "HABIT", "HAMMER", "HANDLE", "HARBOR", "HARMONY", "HARVEST", "HAWK", "HAZARD", "HEALTH",
    "HEART", "HEAVEN", "HELMET", "HERITAGE", "HERO", "HIGHWAY", "HISTORY", "HOBBY", "HOLLOW", "HONEY",
    "HONOR", "HORIZON", "HORN", "HORSE", "HOSPITAL", "HOTEL", "HOUSE", "HUMOR", "HUNTER", "HURRICANE",
    "ICEBERG", "IDEA", "IMAGE", "IMPACT", "IMPULSE", "INCOME", "INSECT", "INSTANT", "ISLAND", "IVORY",
    "JACKET", "JAGUAR", "JASMINE", "JEWEL", "JIGSAW", "JOURNEY", "JUDGE", "JUICE", "JUNGLE", "JUNIOR",
    "KEEPER", "KETTLE", "KEY", "KINGDOM", "KITCHEN", "KITE", "KITTEN", "KNIGHT", "KNOWLEDGE", "LABEL",
    "LADDER", "LAGOON", "LAKE", "LAMP", "LANTERN", "LAPTOP", "LASER", "LAUGHTER", "LAVA", "LAWYER",
    "LAYER", "LEADER", "LEAF", "LEAGUE", "LEATHER", "LEGEND", "LEMON", "LEOPARD", "LESSON", "LETTER",
    "LEVEL", "LIBERTY", "LIBRARY", "LIGHT", "LIGHTNING", "LILY", "LIMIT", "LION", "LIQUID", "LIZARD",
    "LOCK", "LOCUST", "LODGE", "LOGIC", "LOTUS", "LOUNGE", "LOYALTY", "LUMBER", "LUNAR", "MACHINE",
    "MAGNET", "MAJESTY", "MAMMOTH", "MANAGER", "MANGO", "MANSION", "MANTLE", "MAPLE", "MARBLE", "MARCH",
    "MARGIN", "MARKET", "MARVEL", "MASTER", "MATCH", "MATTER", "MEADOW", "MEASURE", "MEDAL", "MELODY",
    "MELON", "MEMORY", "MENTOR", "MERCHANT", "MERCURY", "MESSAGE", "METAL", "METEOR", "METHOD", "MIDDLE",
    "MIDNIGHT", "MILLION", "MINERAL", "MIRACLE", "MIRROR", "MISSILE", "MISSION", "MIST", "MODEL", "MODERN",
    "MOMENT", "MONARCH", "MONEY", "MONKEY", "MONSTER", "MONTH", "MONUMENT", "MOON", "MORNING", "MOTION",
    "MOTOR", "MOUNTAIN", "MOUSE", "MUSEUM", "MUSIC", "MYSTERY", "NATION", "NATURE", "NEBULA", "NEEDLE",
    "NEIGHBOR", "NERVE", "NETWORK", "NIGHT", "NOISE", "NOODLE", "NORTH", "NOTE", "NOVEL", "NUMBER",
    "NURSE", "NUTMEG", "OAK", "OASIS", "OBJECT", "OCEAN", "OCTOPUS", "OFFICE", "OLIVE", "ONION",
    "OPERA", "OPINION", "ORANGE", "ORBIT", "ORCHARD", "ORDER", "ORGAN", "ORIGIN", "OSTRICH", "OTTER",
    "OUTLINE", "OVEN", "OWL", "OWNER", "OXYGEN", "OYSTER", "PACKAGE", "PADDLE", "PAGE", "PAINT",
    "PALACE", "PALM", "PANCAKE", "PANDA", "PANEL", "PANTHER", "PAPER", "PARADE", "PARCEL", "PARENT",
    "PARK", "PARROT", "PARTNER", "PARTY", "PASSAGE", "PASSPORT", "PASTA", "PATH", "PATIENCE", "PATTERN",
    "PEACE", "PEACH", "PEACOCK", "PEAK", "PEARL", "PEBBLE", "PELICAN", "PENCIL", "PENGUIN", "PEPPER",
    "PERIOD", "PERSON", "PETAL", "PHANTOM", "PHONE", "PHOTO", "PIANO", "PICTURE", "PIECE", "PIGEON",
    "PILLAR", "PILLOW", "PILOT", "PINE", "PIONEER", "PIRATE", "PISTOL", "PLANET", "PLANT", "PLASTIC",
    "PLATE", "PLATFORM", "PLAYER", "POCKET", "POEM", "POET", "POINT", "POISON", "POLAR", "POLICE",
    "POLICY", "POND", "PONY", "POPCORN", "PORT", "PORTAL", "PORTRAIT", "POSTER", "POTATO", "POTTERY",
    "POWDER", "POWER", "PRACTICE", "PRAIRIE", "PRESENT", "PRESSURE", "PRICE", "PRIDE", "PRINCE", "PRISM",
    "PRIZE", "PROBLEM", "PROCESS", "PRODUCT", "PROFILE", "PROGRAM", "PROJECT", "PROMISE", "PROPHET", "PUZZLE",
    "PYRAMID", "QUARTZ", "QUEEN", "QUEST", "QUESTION", "RABBIT", "RACCOON", "RADAR", "RADIO", "RAILWAY",
    "RAIN", "RAINBOW", "RANCH", "RANGER", "RAPTOR", "RAVEN", "REACH", "REACTOR", "REASON", "REBEL",
    "RECIPE", "RECORD", "REFUGE", "REGION", "RELIC", "REMEDY", "REPORT", "RESCUE", "RESERVE", "RESORT",
    "RESULT", "REWARD", "RHYTHM", "RIBBON", "RIDGE", "RIFLE", "RING", "RIVER", "ROAD", "ROBOT",
    "ROCKET", "ROOF", "ROOT", "ROPE", "ROSE", "ROUTE", "ROYAL", "RUBBER", "RUBY", "RULER",
    "RUNNER", "SADDLE", "SAFARI", "SAFETY", "SAILOR", "SALAD", "SALMON", "SALT", "SAMPLE", "SAND",
    "SANDAL", "SAPPHIRE", "SATELLITE", "SATURN", "SAUCE", "SAVANNA", "SCALE", "SCARF", "SCENE", "SCHOOL",
    "SCIENCE", "SCISSORS", "SCOUT", "SCREEN", "SCULPTURE", "SEASON", "SECRET", "SECTOR", "SEED", "SENSOR",
    "SERIES", "SERVANT", "SERVICE", "SHADOW", "SHARK", "SHEEP", "SHELTER", "SHIELD", "SHIP", "SHIRT",
    "SHOE", "SHORE", "SHOVEL", "SHOWER", "SHRIMP", "SIGNAL", "SILENCE", "SILK", "SILVER", "SINGER",
    "SISTER", "SKETCH", "SKILL", "SKY", "SLATE", "SLEEP", "SLOPE", "SMILE", "SMOKE", "SNAKE",
    "SNOW", "SOCCER", "SOCKET", "SODA", "SOIL", "SOLDIER", "SOLUTION", "SONG", "SOUND", "SOURCE",
    "SOUTH", "SPACE", "SPARK", "SPARROW", "SPEAKER", "SPEAR", "SPECIES", "SPEED", "SPHERE", "SPIDER",
    "SPIRIT", "SPONGE", "SPOON", "SPORT", "SPRING", "SQUARE", "SQUIRREL", "STADIUM", "STAGE", "STAR",
    "STATION", "STATUE", "STEAM", "STEEL", "STEP", "STICK", "STONE", "STORM", "STORY", "STREAM",
    "STREET", "STRENGTH", "STRING", "STUDENT", "STUDIO", "STYLE", "SUBJECT", "SUGAR", "SUMMER", "SUMMIT",
    "SUN", "SUNRISE", "SUNSET", "SUPPORT", "SURFACE", "SURPRISE", "SWALLOW", "SWAMP", "SWAN", "SWEATER",
    "SWORD", "SYMBOL", "SYSTEM", "TABLE", "TABLET", "TAIL", "TALENT", "TARGET", "TASK", "TEACHER",
    "TEAM", "TEMPLE", "TENNIS", "TENT", "TERRAIN", "THEATER", "THEORY", "THIEF", "THORN", "THREAD",
    "THRONE", "THUNDER", "TICKET", "TIDE", "TIGER", "TIMBER", "TIME", "TITLE", "TOAST", "TOKEN",
    "TOMATO", "TONGUE", "TOOL", "TOOTH", "TOPIC", "TORCH", "TORNADO", "TORTOISE", "TOUCH", "TOURIST",
    "TOWER", "TOWN", "TRACK", "TRACTOR", "TRADE", "TRAFFIC", "TRAIL", "TRAIN", "TRANSIT", "TRAVEL",
    "TREASURE", "TREE", "TRIANGLE", "TRIBE", "TRICK", "TRIGGER", "TROPHY", "TRUCK", "TRUMPET", "TRUST",
    "TRUTH", "TUNNEL", "TURBINE", "TURTLE", "TWILIGHT", "TYPHOON", "UMBRELLA", "UNICORN", "UNIFORM", "UNION",
    "UNIVERSE", "VALLEY", "VALUE", "VAMPIRE", "VANILLA", "VAPOR", "VAULT", "VECTOR", "VELVET", "VENTURE",
    "VESSEL", "VICTORY", "VIDEO", "VILLAGE", "VINE", "VIOLIN", "VIPER", "VISION", "VISITOR", "VOICE",
    "VOLCANO", "VOLTAGE", "VOLUME", "VORTEX", "VOYAGE", "VULTURE", "WAGON", "WALL", "WALNUT", "WALRUS",
    "WANDERER", "WARRIOR", "WATCH", "WATER", "WAVE", "WEALTH", "WEAPON", "WEATHER", "WEB", "WELCOME",
    "WEST", "WHALE", "WHEAT", "WHEEL", "WHISPER", "WHISTLE", "WILLOW", "WIND", "WINDOW", "WING",
    "WINTER", "WIRE", "WISDOM", "WITCH", "WIZARD", "WOLF", "WONDER", "WOOD", "WOOL", "WORKER",
    "WORLD", "WORM", "WRITER", "YACHT", "YARD", "YEAR", "YELLOW", "YOGURT", "YOUTH", "ZEBRA", "ZENITH", "ZONE"
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

const majorWorldCitiesEN = new Set([
    "LONDON", "PARIS", "BERLIN", "MADRID", "ROME", "TOKYO", "SEOUL", "BEIJING", "MOSCOW", "ISTANBUL",
    "ANKARA", "IZMIR", "NEWYORK", "CHICAGO", "BOSTON", "MIAMI", "SEATTLE", "TORONTO", "SYDNEY", "DUBAI", "CAIRO"
]);

const botProfiles = [
    { name: "Bot Alp", avatar: "🤖", skill: 0.90 },
    { name: "Bot Derin", avatar: "🦾", skill: 0.85 },
    { name: "Bot Mert", avatar: "🛸", skill: 0.82 },
    { name: "Bot Ece", avatar: "🧠", skill: 0.88 },
    { name: "Bot Kaan", avatar: "⚙️", skill: 0.80 }
];

let dictionarySetTR = new Set(commonBotWordsTR);
let dictionarySetEN = new Set(commonBotWordsEN);
let isLoadedTR = false;
let isLoadedEN = false;

const cleanBotWordsTR = commonBotWordsTR.filter(w => !w.endsWith("Ğ") && !turkishCities.has(w));
const cleanBotWordsEN = commonBotWordsEN.filter(w => !w.endsWith("X") && !w.endsWith("Q") && !majorWorldCitiesEN.has(w));

function toTurkishUpper(str) {
    return str.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase().trim();
}

function updateDictStatusBadge() {
    const size = currentLang === "en" ? dictionarySetEN.size : dictionarySetTR.size;
    const el = document.getElementById("dict-status");
    if (el) el.textContent = t("dictReady", size);
}

async function ensureDictionaryLoaded(lang = currentLang) {
    updateDictStatusBadge();
    if (lang === "tr") {
        if (isLoadedTR) return;
        isLoadedTR = true;
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3500);
        try {
            const res = await fetch("https://cdn.jsdelivr.net/gh/mertemin/turkish-word-list@master/words.txt", { signal: controller.signal });
            clearTimeout(tid);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            text.split(/\r?\n/).forEach(line => {
                const w = line.trim();
                if (w.length >= 3 && !w.includes(" ") && /^[a-zA-ZçğıöşüÇĞİÖŞÜ]+$/.test(w)) {
                    const upper = toTurkishUpper(w);
                    if (!turkishCities.has(upper)) dictionarySetTR.add(upper);
                }
            });
        } catch (err) {
            isLoadedTR = false;
            console.warn("TR external dictionary fallback used:", err);
        }
    } else if (lang === "en") {
        if (isLoadedEN) return;
        isLoadedEN = true;
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3500);
        try {
            const res = await fetch("https://cdn.jsdelivr.net/gh/dwyl/english-words@master/words_alpha.txt", { signal: controller.signal });
            clearTimeout(tid);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            text.split(/\r?\n/).forEach(line => {
                const w = line.trim();
                if (w.length >= 3 && w.length <= 24 && /^[a-zA-Z]+$/.test(w)) {
                    const upper = w.toUpperCase();
                    if (!majorWorldCitiesEN.has(upper)) dictionarySetEN.add(upper);
                }
            });
        } catch (err) {
            isLoadedEN = false;
            console.warn("EN external dictionary fallback used:", err);
        }
    }
    updateDictStatusBadge();
}

// --- %100 FIREBASE ÇOK OYUNCULU ODA MOTORU ---
let isHost = false;
let isLocalSolo = false;
let myId = "p_" + Math.random().toString(36).substring(2, 10);
let myName = currentAnonNick;
let currentRoomCode = "";
let syncInterval = null;
let lastRenderedTurnNumber = -1;
let lastRenderedTurnStart = 0;
let isSwitchingRoom = false;

let gameState = {
    status: "lobby",
    isPublic: true,
    lang: "tr",
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
    const s = (raw && typeof raw === "object") ? raw : {};
    const roomLang = s.lang === "en" ? "en" : "tr";
    const rawPlayers = Array.isArray(s.players) ? s.players : [];
    const safePlayers = rawPlayers.slice(0, 6).map(p => ({
        id: String(p?.id || "").replace(/[^a-zA-Z0-9._-]/g, ""),
        name: sanitizeAnonNick(p?.name),
        avatar: sanitizeAvatar(p?.avatar, "🎮"),
        isBot: Boolean(p?.isBot),
        skill: typeof p?.skill === "number" ? p.skill : 0.85,
        eliminated: Boolean(p?.eliminated)
    }));

    const rawHistory = Array.isArray(s.history) ? s.history : [];
    const safeHistory = rawHistory.slice(-200).map(h => ({
        word: sanitizeWord(h?.word, roomLang),
        senderName: sanitizeAnonNick(h?.senderName),
        senderAvatar: sanitizeAvatar(h?.senderAvatar, "🎮"),
        senderId: String(h?.senderId || "").replace(/[^a-zA-Z0-9._-]/g, ""),
        isBot: Boolean(h?.isBot)
    }));

    return {
        status: ["lobby", "playing", "gameover"].includes(s.status) ? s.status : "lobby",
        isPublic: s.isPublic !== false,
        lang: roomLang,
        players: safePlayers,
        turnIndex: Math.max(0, Math.min(safePlayers.length - 1, Number(s.turnIndex) || 0)),
        turnNumber: Math.max(0, Number(s.turnNumber) || 0),
        currentWord: sanitizeWord(s.currentWord, roomLang),
        usedWords: Array.isArray(s.usedWords) ? s.usedWords.map(w => sanitizeWord(w, roomLang)).filter(Boolean) : [],
        history: safeHistory,
        winnerText: String(s.winnerText || "").slice(0, 80),
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
    return sanitizeAnonNick(currentAnonNick);
}

function showGameScreen() {
    document.getElementById("lobby-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("room-banner").classList.remove("hidden");
    if (window.innerWidth <= 960) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function updateRoomBannerPrivacy(publicFlag, code, lang = currentLang) {
    const codeWrapper = document.getElementById("private-code-wrapper");
    const badge = document.getElementById("room-privacy-badge");
    const langBadge = document.getElementById("room-lang-badge");

    if (langBadge) {
        langBadge.textContent = lang === "en" ? "🇬🇧 EN" : "🇹🇷 TR";
    }

    if (publicFlag) {
        codeWrapper.classList.add("hidden");
        badge.textContent = t("btnPublic");
        badge.className = "room-privacy-pill";
    } else {
        codeWrapper.classList.remove("hidden");
        document.getElementById("room-code-text").textContent = code;
        badge.textContent = t("btnPrivate");
        badge.className = "room-privacy-pill private-pill";
    }
}

async function pushRoomStateToFirebase() {
    if (!currentRoomCode || isLocalSolo || isSwitchingRoom) return;
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/state.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gameState)
        });
        if (!res.ok) console.warn("State push rejected:", res.status);
        await sendRoomHeartbeat();
    } catch (err) {
        console.warn("State push network error:", err);
    }
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
                syncClockFromHeader(joinRes);

                const joins = await joinRes.json();
                let stateChanged = false;

                if (joins && typeof joins === "object" && gameState.status === "lobby") {
                    for (const [pid, pdata] of Object.entries(joins)) {
                        const safePid = String(pid).replace(/[^a-zA-Z0-9._-]/g, "");
                        if (pdata && safePid && !gameState.players.some(p => p.id === safePid) && gameState.players.length < 6) {
                            gameState.players.push({
                                id: safePid,
                                name: sanitizeAnonNick(pdata.name),
                                avatar: sanitizeAvatar(pdata.avatar, "🎮"),
                                isBot: false,
                                eliminated: false
                            });
                            stateChanged = true;
                        }
                    }
                }

                const subs = await subRes.json();
                if (subs && typeof subs === "object" && gameState.status === "playing") {
                    const sortedSubs = Object.entries(subs).sort((a, b) => (a[1]?.ts || 0) - (b[1]?.ts || 0));
                    for (const [subKey, subData] of sortedSubs) {
                        const safeSubKey = String(subKey).replace(/[^a-zA-Z0-9._-]/g, "");
                        if (safeSubKey && subData && subData.word && subData.senderId) {
                            await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/submissions/${encodeURIComponent(safeSubKey)}.json`, { method: "DELETE" });
                            await validateAndProcessWord(sanitizeWord(subData.word, gameState.lang), String(subData.senderId), subData.turnNumber);
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
                    fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/errors/${encodeURIComponent(myId)}.json?t=${Date.now()}`, { cache: "no-store" })
                ]);

                if (currentRoomCode !== loopRoomCode || isSwitchingRoom) return;
                syncClockFromHeader(stateRes);

                const remoteState = await stateRes.json();
                const remoteErr = await errRes.json();

                if (remoteErr && remoteErr.text) {
                    msgEl.style.color = "var(--danger)";
                    msgEl.textContent = String(remoteErr.text).slice(0, 120);
                    fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/errors/${encodeURIComponent(myId)}.json`, { method: "DELETE" });
                }

                if (!remoteState) {
                    clearInterval(syncInterval);
                    clearInterval(timerInterval);
                    currentRoomCode = "";
                    document.getElementById("game-screen").classList.add("hidden");
                    document.getElementById("lobby-screen").classList.remove("hidden");
                    msgEl.style.color = "var(--warning)";
                    msgEl.textContent = t("errHostLeft");
                    fetchActiveRooms();
                    return;
                }

                const prevStatus = gameState.status;
                gameState = normalizeGameState(remoteState);
                if (gameState.lang !== currentLang) {
                    setGameLanguage(gameState.lang, false);
                }

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
        } catch (err) {
            console.warn("Room sync tick warning:", err);
        }
    }, 800);
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
    gameState.lang = currentLang;
    ensureDictionaryLoaded(currentLang);
    showGameScreen();
    document.getElementById("room-banner").classList.add("hidden");

    gameState.players = [{ id: myId, name: myName, avatar: sanitizeAvatar(selectedAvatar), isBot: false, eliminated: false }];
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
    currentRoomCode = generateRoomCode();
    ensureDictionaryLoaded(currentLang);

    msgEl.style.color = "var(--cyan)";
    msgEl.textContent = t("errCreating");

    gameState = normalizeGameState({
        status: "lobby",
        isPublic: isRoomPublic,
        lang: currentLang,
        players: [{ id: myId, name: myName, avatar: sanitizeAvatar(selectedAvatar), isBot: false, eliminated: false }],
        turnNumber: 0,
        turnStartedAt: getSyncedNow()
    });

    try {
        const res = await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: gameState })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        syncClockFromHeader(res);

        msgEl.textContent = "";
        await sendRoomHeartbeat();
        await fetchActiveRooms();

        showGameScreen();
        updateRoomBannerPrivacy(isRoomPublic, currentRoomCode, currentLang);
        document.getElementById("host-controls").classList.remove("hidden");
        renderGameState();
        startRoomSyncLoop();
    } catch (err) {
        console.error("Create room failed:", err);
        currentRoomCode = "";
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = t("errCreateFail");
    }
}

// --- ODAYA KATIL ---
async function joinRoom(directCode = null) {
    const rawCode = directCode
        ? sanitizeRoomCode(directCode)
        : sanitizeRoomCode(document.getElementById("join-code-input").value);

    if (rawCode.length !== 6) {
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = t("errCodeLen");
        return;
    }

    if (rawCode === currentRoomCode) return;

    myName = getPlayerName();
    msgEl.style.color = "var(--cyan)";
    msgEl.textContent = t("errJoining");

    try {
        const checkRes = await fetch(`${FIREBASE_DB_URL}/rooms/${rawCode}/state.json?t=${Date.now()}`, { cache: "no-store" });
        if (!checkRes.ok) throw new Error(`HTTP ${checkRes.status}`);
        syncClockFromHeader(checkRes);
        const rawRoomState = await checkRes.json();

        if (!rawRoomState || !Array.isArray(rawRoomState.players)) {
            msgEl.style.color = "var(--danger)";
            msgEl.textContent = t("errRoomGone");
            fetchActiveRooms();
            return;
        }
        if (rawRoomState.status === "playing") {
            msgEl.style.color = "var(--warning)";
            msgEl.textContent = t("errRoomPlaying");
            return;
        }
        if (rawRoomState.players.length >= 6) {
            msgEl.style.color = "var(--warning)";
            msgEl.textContent = t("errRoomFull");
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

        gameState = normalizeGameState(rawRoomState);
        if (gameState.lang !== currentLang) {
            setGameLanguage(gameState.lang, true);
            myName = getPlayerName();
        }
        ensureDictionaryLoaded(gameState.lang);

        const joinPut = await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/joins/${encodeURIComponent(myId)}.json`, {
            method: "PUT",
            cache: "no-store",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: myName,
                avatar: sanitizeAvatar(selectedAvatar)
            })
        });
        if (!joinPut.ok) throw new Error(`HTTP ${joinPut.status}`);

        msgEl.textContent = "";
        if (!gameState.players.some(p => p.id === myId)) {
            gameState.players.push({
                id: myId,
                name: myName,
                avatar: sanitizeAvatar(selectedAvatar),
                isBot: false,
                eliminated: false
            });
        }

        showGameScreen();
        updateRoomBannerPrivacy(gameState.isPublic, currentRoomCode, gameState.lang);
        document.getElementById("host-controls").classList.add("hidden");
        renderGameState();
        fetchActiveRooms();
        startRoomSyncLoop();
    } catch (err) {
        console.error("Join room failed:", err);
        isSwitchingRoom = false;
        currentRoomCode = "";
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = t("errJoinFail");
    }
}

// --- BOT EKLE / ÇIKAR ---
async function addBotToRoom(silent = false) {
    if (!isHost || gameState.status === "playing") return;
    if (gameState.players.length >= 6) {
        if (!silent) {
            msgEl.style.color = "var(--warning)";
            msgEl.textContent = t("errMaxPlayers");
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
        id: "bot-" + Date.now() + Math.floor(Math.random() * 1000),
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
    msgEl.textContent = t("codeCopied", code);
    setTimeout(() => { msgEl.textContent = ""; }, 2000);
}

async function hostStartMultiplayer() {
    if (!isHost) return;
    if (gameState.players.length < 2) {
        msgEl.style.color = "var(--warning)";
        msgEl.textContent = t("errMinPlayers");
        return;
    }
    msgEl.textContent = "";
    switchRightTab("chain");
    gameState.lang = currentLang;
    gameState.players.forEach(p => p.eliminated = false);
    gameState.turnIndex = 0;
    gameState.turnNumber = 1;
    gameState.status = "playing";
    gameState.usedWords = [];
    gameState.history = [];
    gameState.winnerText = "";
    gameState.turnStartedAt = getSyncedNow();

    const wordPool = gameState.lang === "en" ? cleanBotWordsEN : cleanBotWordsTR;
    const starter = wordPool[Math.floor(Math.random() * wordPool.length)];
    gameState.currentWord = starter;
    gameState.usedWords.push(starter);
    gameState.history.push({ word: starter, senderName: t("systemName"), senderAvatar: "🎯", senderId: "sys", isBot: false });

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
    const wordPool = gameState.lang === "en" ? cleanBotWordsEN : cleanBotWordsTR;

    botThinkTimeout = setTimeout(() => {
        if (gameState.status !== "playing" || gameState.turnNumber !== expectedTurn) return;
        const currentActive = gameState.players[gameState.turnIndex];
        if (!currentActive || currentActive.id !== activePlayer.id) return;

        const requiredLetter = gameState.currentWord.slice(-1);
        const possibleWords = wordPool.filter(w =>
            w.startsWith(requiredLetter) &&
            !gameState.usedWords.includes(w)
        );

        const roll = Math.random();
        const hardLetters = gameState.lang === "en" ? ["X", "Q", "Z", "J", "K", "V"] : ["J", "V", "F", "P", "Z", "Ö", "Ü"];
        const isHardLetter = hardLetters.includes(requiredLetter);
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
            msgEl.textContent = t("errEliminated");
            return;
        }

        const rawInput = gameState.lang === "en" ? inputEl.value.toUpperCase().trim() : toTurkishUpper(inputEl.value);
        if (!rawInput) return;

        const submittedTurn = gameState.turnNumber;

        if (isHost) {
            validateAndProcessWord(rawInput, myId, submittedTurn);
        } else if (currentRoomCode) {
            inputEl.value = "";
            msgEl.textContent = "";
            const subId = "s_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
            try {
                await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/submissions/${subId}.json`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        word: rawInput.slice(0, 30),
                        senderId: myId,
                        turnNumber: submittedTurn,
                        ts: getSyncedNow()
                    })
                });
            } catch (err) {
                console.warn("Word submission failed:", err);
            }
        }
    }
});

async function sendErrorToPlayer(playerId, text) {
    const safePlayerId = String(playerId || "").replace(/[^a-zA-Z0-9._-]/g, "");
    if (!safePlayerId) return;

    if (safePlayerId === myId) {
        msgEl.style.color = "var(--danger)";
        msgEl.textContent = text;
    } else if (currentRoomCode && !isLocalSolo) {
        try {
            await fetch(`${FIREBASE_DB_URL}/rooms/${currentRoomCode}/errors/${encodeURIComponent(safePlayerId)}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: String(text).slice(0, 120), ts: getSyncedNow() })
            });
        } catch (err) {
            console.warn("Send error notice failed:", err);
        }
    }
}

async function validateAndProcessWord(rawWord, senderId, submittedTurn = null) {
    if (isProcessingTurn || gameState.status !== "playing") return;

    if (submittedTurn !== null && Number(submittedTurn) !== gameState.turnNumber) {
        return;
    }

    const senderPlayer = gameState.players.find(p => p.id === senderId);
    if (!senderPlayer || senderPlayer.eliminated) {
        sendErrorToPlayer(senderId, t("errEliminated"));
        return;
    }

    const activePlayer = gameState.players[gameState.turnIndex];
    if (!activePlayer || activePlayer.id !== senderId) return;

    const isEn = gameState.lang === "en";
    const userWord = isEn ? String(rawWord || "").toUpperCase().trim() : toTurkishUpper(String(rawWord || ""));
    const requiredLetter = gameState.currentWord.slice(-1);

    if (userWord.includes(" ")) {
        sendErrorToPlayer(senderId, t("errNoSpace"));
        return;
    }
    if (isEn ? !/^[A-Z]+$/.test(userWord) : !/^[A-ZÇĞİÖŞÜ]+$/.test(userWord)) {
        sendErrorToPlayer(senderId, t("errLettersOnly"));
        return;
    }
    if (userWord.length < 3) {
        sendErrorToPlayer(senderId, t("errMinLen"));
        return;
    }
    if (!userWord.startsWith(requiredLetter)) {
        sendErrorToPlayer(senderId, t("errStartsWith", requiredLetter));
        return;
    }
    if (isEn ? majorWorldCitiesEN.has(userWord) : turkishCities.has(userWord)) {
        sendErrorToPlayer(senderId, t("errCity"));
        return;
    }
    if (gameState.usedWords.includes(userWord)) {
        sendErrorToPlayer(senderId, t("errUsed"));
        return;
    }
    if (isEn ? (userWord.endsWith("X") || userWord.endsWith("Q")) : userWord.endsWith("Ğ")) {
        sendErrorToPlayer(senderId, t("errEndsSoftG"));
        return;
    }
    const activeDict = isEn ? dictionarySetEN : dictionarySetTR;
    if (!activeDict.has(userWord)) {
        sendErrorToPlayer(senderId, t("errNotFound", userWord.slice(0, 20)));
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
        senderName: sanitizeAnonNick(activePlayer.name),
        senderAvatar: sanitizeAvatar(activePlayer.avatar, "🎮"),
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
        const safeWinnerName = winner ? sanitizeAnonNick(winner.name) : "";
        const safeWinnerAvatar = winner ? sanitizeAvatar(winner.avatar, "🎮") : "";
        gameState.winnerText = winner
            ? t("winText", safeWinnerAvatar, safeWinnerName)
            : t("noWinnerText");
        
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
function formatWord(word, lang = gameState.lang) {
    const cleanWord = sanitizeWord(word, lang);
    if (!cleanWord) return "";
    return `${escapeHTML(cleanWord.slice(0, -1))}<span>${escapeHTML(cleanWord.slice(-1))}</span>`;
}

function renderGameState() {
    const safePlayers = Array.isArray(gameState.players) ? gameState.players : [];
    const safeHistory = Array.isArray(gameState.history) ? gameState.history : [];

    document.getElementById("connection-count").textContent = t("playersCount", safePlayers.length);
    document.getElementById("turn-count").textContent = Math.max(0, safeHistory.length - 1);

    const me = safePlayers.find(p => p.id === myId);
    const amIEliminated = me && me.eliminated && gameState.status === "playing";

    if (amIEliminated) {
        eliminatedBannerEl.classList.remove("hidden");
        inputEl.disabled = true;
        inputEl.value = "";
        inputEl.classList.add("eliminated-input");
        inputEl.placeholder = t("wordPlaceholderElim");
        msgEl.textContent = "";
    } else {
        eliminatedBannerEl.classList.add("hidden");
        inputEl.classList.remove("eliminated-input");
        inputEl.placeholder = t("wordPlaceholder");
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

        const cleanName = sanitizeAnonNick(p.name);
        const safeAvatar = sanitizeAvatar(p.avatar, "🎮");
        const label = p.id === myId ? `${cleanName} ${t("youSuffix")}` : cleanName;
        chip.innerHTML = `<span class="chip-avatar">${safeAvatar}</span><span>${escapeHTML(label)}</span>`;

        if (isHost && gameState.status !== "playing" && p.isBot) {
            const removeBtn = document.createElement("span");
            removeBtn.className = "remove-bot-btn";
            removeBtn.textContent = "×";
            removeBtn.onclick = () => removeBot(p.id);
            chip.appendChild(removeBtn);
        }
        playersBar.appendChild(chip);
    });

    const hostControls = document.getElementById("host-controls");
    const startBtn = document.getElementById("host-start-btn");
    if (isHost && gameState.status !== "playing") {
        hostControls.classList.remove("hidden");
        startBtn.textContent = gameState.status === "gameover" ? t("btnRestart") : t("btnStart");
    } else {
        hostControls.classList.add("hidden");
    }

    const turnIndicator = document.getElementById("turn-indicator");
    const botWordEl = document.getElementById("bot-word");

    if (gameState.status === "lobby") {
        turnIndicator.textContent = isHost ? t("lobbyHostHint") : t("lobbyGuestHint");
        turnIndicator.style.color = "var(--cyan)";
        botWordEl.textContent = t("waiting");
        inputEl.disabled = true;
    } else if (gameState.status === "playing") {
        botWordEl.innerHTML = formatWord(gameState.currentWord, gameState.lang);
        const activePlayer = safePlayers[gameState.turnIndex];
        const isMyTurn = activePlayer && activePlayer.id === myId && !amIEliminated;

        if (isMyTurn) {
            const safeActiveAvatar = sanitizeAvatar(activePlayer.avatar, "🎮");
            turnIndicator.textContent = t("yourTurn", safeActiveAvatar, gameState.currentWord.slice(-1));
            turnIndicator.style.color = "var(--emerald)";
            const wasDisabled = inputEl.disabled;
            inputEl.disabled = false;
            inputEl.focus();
            if (wasDisabled && window.innerWidth <= 960) {
                document.getElementById("current-word-box").scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } else {
            const activeName = activePlayer ? sanitizeAnonNick(activePlayer.name) : "";
            const activeAvatar = activePlayer ? sanitizeAvatar(activePlayer.avatar, "🎮") : "";
            const statusText = activePlayer && activePlayer.isBot
                ? t("botThinking", activeAvatar, activeName)
                : t("playerTurn", activeAvatar, activeName);
            turnIndicator.textContent = statusText;
            turnIndicator.style.color = activePlayer && activePlayer.isBot ? "#d6a2e8" : "var(--warning)";
            inputEl.disabled = true;
            inputEl.value = "";
        }
    } else if (gameState.status === "gameover") {
        eliminatedBannerEl.classList.add("hidden");
        turnIndicator.textContent = String(gameState.winnerText || t("noWinnerText")).slice(0, 80);
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
            const avatar = sanitizeAvatar(item.senderAvatar, "🎮");
            const cleanSenderName = escapeHTML(sanitizeAnonNick(item.senderName));
            const displayName = isMe ? `${avatar} ${escapeHTML(t("youWord"))}` : `${avatar} ${cleanSenderName}`;
            tr.innerHTML = `
                <td class="col-num">${i + 1}</td>
                <td><span class="badge ${badgeClass}">${displayName}</span></td>
                <td class="col-word">${formatWord(item.word, gameState.lang)}</td>
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

initServerTimeSync();
initAnonNickBox();
initAvatarSelector();
applyLanguageToUI();
startActiveRoomsMonitor();
fetchGlobalLeaderboard();
ensureDictionaryLoaded("tr");
