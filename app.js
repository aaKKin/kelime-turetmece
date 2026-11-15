// --- RASTGELE ANONİM TAKMA AD SİSTEMİ (MAX 14 KARAKTER GARANTİLİ) ---
const nickAdjectives = [
    "Hızlı", "Gizem", "Atik", "Zeki", "Süper", "Keskin", "Sessiz", "Çevik",
    "Usta", "Gölge", "Kozmik", "Buzul", "Fırtına", "Kıvrak", "Şimşek", "Asil",
    "Parlak", "Çılgın", "Bilge", "Kızıl", "Mavi", "Altın", "Demir", "Yıldız"
];
const nickNouns = [
    "Tilki", "Baykuş", "Kurt", "Kartal", "Panda", "Ejder", "Vaşak", "Şahin",
    "Gezgin", "Kaşif", "Avcı", "Korsan", "Ninja", "Kuzgun", "Pars", "Kaplan",
    "Aslan", "Yunus", "Kutup", "Süvari", "Ozan", "Kahin", "Atom", "Rüzgar"
];

const validNickPattern = new RegExp(`^(${nickAdjectives.join("|")})(${nickNouns.join("|")})\\d{2}$`);

function generateAnonNick() {
    const adj = nickAdjectives[Math.floor(Math.random() * nickAdjectives.length)];
    const noun = nickNouns[Math.floor(Math.random() * nickNouns.length)];
    const num = Math.floor(10 + Math.random() * 89);
    return `${adj}${noun}${num}`;
}

let currentAnonNick = generateAnonNick();

function initAnonNickBox() {
    const displayEl = document.getElementById("anon-nick-display");
    if (displayEl) displayEl.textContent = currentAnonNick;
}

function rerollAnonNick() {
    let nextNick = generateAnonNick();
    while (nextNick === currentAnonNick) {
        nextNick = generateAnonNick();
    }
    currentAnonNick = nextNick;
    const displayEl = document.getElementById("anon-nick-display");
    if (displayEl) displayEl.textContent = currentAnonNick;
}

function sanitizeAnonNick(raw, fallback = "AtikTilki10") {
    const cleaned = String(raw ?? "").trim();
    if (validNickPattern.test(cleaned) || cleaned === "Sistem" || /^Bot/.test(cleaned)) {
        return cleaned;
    }
    return fallback;
}
