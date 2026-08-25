console.log("DailyBoard siap dijalankan!");

// Mengambil elemen app di html
const app = document.getElementById("app");

// Membuat judul di body
const judul = document.createElement("h2");
judul.textContent = "Selamat Datang di DailyBoard!";
judul.style.color = "#2563eb";
judul.style.textAlign = "center";
app.appendChild(judul);

// Memuat widget status
const statusText = document.createElement("p");
statusText.id = "status";
statusText.style.textAlign = "center";
app.appendChild(statusText);

// Tombol dark mode di dalam header (sebelah kanan judul)
const headerEl = document.querySelector("header");
const toggleTema = document.createElement("button");
toggleTema.id = "toggle-tema";
toggleTema.textContent = "🌙 Dark Mode";
headerEl.appendChild(toggleTema);

// ===== Membuat wadah dua kolom (2 fitur kiri, 2 fitur kanan) =====
const papan = document.createElement("div");
papan.className = "papan";
app.appendChild(papan);

const kolomKiri = document.createElement("div");
kolomKiri.className = "kolom kolom-kiri";
papan.appendChild(kolomKiri);

const kolomKanan = document.createElement("div");
kolomKanan.className = "kolom kolom-kanan";
papan.appendChild(kolomKanan);

// Kiri: Daftar Tugas lalu Cek Cuaca
initTugas(kolomKiri);
initCuaca(kolomKiri);

// Kanan: Catatan Cepat lalu Motivasi Harian
initCatatan(kolomKanan);
initMotivasi(kolomKanan);

// Memuat semua widget berbasis API sekaligus saat halaman dibuka
async function muatSemuaWidget() {
    statusText.textContent = "Memuat data...";
    try {
        await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);
        statusText.textContent = "✅ Data berhasil dimuat";
    } catch (error) {
        statusText.textContent = "Gagal memuat data";
        console.error("Gagal memuat widget:", error);
    }
}
window.addEventListener("DOMContentLoaded", muatSemuaWidget);

// ===== Mode gelap (dark mode) =====
function terapkanTema() {
    const tema = muatTema();
    if (tema === "gelap") {
        document.body.classList.add("dark-mode");
        toggleTema.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        toggleTema.textContent = "🌙 Dark Mode";
    }
}

toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    simpanTema(modeAktif ? "gelap" : "terang");
    toggleTema.textContent = modeAktif ? "☀️ Light Mode" : "🌙 Dark Mode";
});

window.addEventListener("DOMContentLoaded", terapkanTema);


