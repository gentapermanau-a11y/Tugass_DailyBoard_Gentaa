async function ambilKutipan() {
    const el = document.getElementById("kutipan-harian");
    try {
        const res = await fetch("https://dummyjson.com/quotes/random");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        if (el) el.textContent = data.quote;
        return data.quote;
    } catch (error) {
        if (el) el.textContent = "Gagal memuat kutipan hari ini.";
        console.error("Gagal mengambil motivasi hari ini:", error);
        throw error;
    }
}

// Mengambil data cuaca berdasarkan nama kota
async function ambilCuaca(kota) {
    const el = document.getElementById("info-cuaca");
    try {
        const resKota = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id&format=json`
        );
        const dataKota = await resKota.json();

        if (!dataKota.results) {
            throw new Error("Kota tidak ditemukan");
        }

        const lokasi = dataKota.results[0];
        const resCuaca = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lokasi.latitude}&longitude=${lokasi.longitude}&current=temperature_2m,weather_code&timezone=auto`
        );
        const dataCuaca = await resCuaca.json();
        const suhu = dataCuaca.current.temperature_2m;

        if (el) {
            el.innerHTML = `
                <p><strong>${lokasi.name}</strong></p>
                <p>Suhu: ${suhu}°C</p>`;
        }
        return { nama: lokasi.name, suhu };
    } catch (error) {
        if (el) el.textContent = error.message;
        throw error;
    }
}

// Membangun UI fitur Motivasi Harian
function initMotivasi(kolom) {
    const kutipanSection = document.createElement("section");
    kolom.appendChild(kutipanSection);

    const kutipanHeader = document.createElement("div");
    kutipanHeader.className = "kutipan-header";

    const judulKutipan = document.createElement("h3");
    judulKutipan.textContent = "Motivasi Harian";

    const btnGantiKutipan = document.createElement("button");
    btnGantiKutipan.type = "button";
    btnGantiKutipan.textContent = "Ganti Motivasi";

    kutipanHeader.append(judulKutipan, btnGantiKutipan);

    const kutipanHarian = document.createElement("p");
    kutipanHarian.id = "kutipan-harian";
    kutipanHarian.textContent = "Memuat motivasi...";

    kutipanSection.append(kutipanHeader, kutipanHarian);

    btnGantiKutipan.addEventListener("click", () => ambilKutipan());
}

// Membangun UI fitur Cek Cuaca
function initCuaca(kolom) {
    const sectionCuaca = document.createElement("section");
    kolom.appendChild(sectionCuaca);

    const judulCuaca = document.createElement("h3");
    judulCuaca.textContent = "Cek Cuaca";
    sectionCuaca.appendChild(judulCuaca);

    const inputKota = document.createElement("input");
    inputKota.placeholder = "Masukkan nama kota";
    sectionCuaca.appendChild(inputKota);

    const tombolCuaca = document.createElement("button");
    tombolCuaca.textContent = "Cek Cuaca";
    sectionCuaca.appendChild(tombolCuaca);

    const infoCuaca = document.createElement("div");
    infoCuaca.id = "info-cuaca";
    infoCuaca.textContent = "Masukkan nama kota";
    sectionCuaca.appendChild(infoCuaca);

    tombolCuaca.addEventListener("click", () => {
        const kota = inputKota.value.trim();
        if (kota === "") {
            infoCuaca.textContent = "Nama kota tidak boleh kosong!";
            return;
        }
        infoCuaca.textContent = "Memuat data cuaca...";
        ambilCuaca(kota);
    });
}
