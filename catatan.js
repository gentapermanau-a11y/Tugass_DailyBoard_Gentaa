let daftarCatatan = muatCatatan();

// Menambahkan catatan baru
function tambahCatatan(isi) {
    daftarCatatan.push({
        id: Date.now(),
        isi,
        tanggal: new Date().toLocaleDateString("id-ID"),
    });
    simpanCatatan(daftarCatatan);
    renderCatatan();
}

// Menghapus catatan berdasarkan ID
function hapusCatatan(id) {
    daftarCatatan = daftarCatatan.filter((c) => c.id !== id);
    simpanCatatan(daftarCatatan);
    renderCatatan();
}

// Mengedit catatan
function editCatatan(id, isiBaru) {
    daftarCatatan = daftarCatatan.map((c) =>
        c.id === id ? { ...c, isi: isiBaru.trim() } : c
    );
    simpanCatatan(daftarCatatan);
    renderCatatan();
}

// Menampilkan semua catatan sebagai kotak/kartu
function renderCatatan() {
    const container = document.getElementById("daftar-catatan");
    if (!container) return;
    container.innerHTML = "";

    daftarCatatan.forEach((catatan) => {
        const div = document.createElement("div");
        div.className = "catatan-item"; // kotak/kartu untuk tiap catatan

        const isiCatatan = document.createElement("p");
        isiCatatan.textContent = catatan.isi;

        const tanggalCatatan = document.createElement("small");
        tanggalCatatan.textContent = catatan.tanggal;

        const aksiWrap = document.createElement("div");
        aksiWrap.className = "catatan-aksi";

        // Tombol edit
        const tombolEditCatatan = document.createElement("button");
        tombolEditCatatan.textContent = "Edit";
        tombolEditCatatan.addEventListener("click", () => {
            const catatanBaru = prompt("Edit catatan:", catatan.isi);
            if (catatanBaru === null) return;
            if (catatanBaru.trim() === "") {
                alert("Catatan tidak boleh kosong!");
                return;
            }
            if (catatanBaru.length > 100) {
                alert("Catatan maksimal 100 karakter!");
                return;
            }
            editCatatan(catatan.id, catatanBaru);
        });

        // Tombol hapus
        const tombolHapusCatatan = document.createElement("button");
        tombolHapusCatatan.textContent = "Hapus";
        tombolHapusCatatan.addEventListener("click", () => {
            hapusCatatan(catatan.id);
        });

        aksiWrap.appendChild(tombolEditCatatan);
        aksiWrap.appendChild(tombolHapusCatatan);

        div.appendChild(isiCatatan);
        div.appendChild(tanggalCatatan);
        div.appendChild(aksiWrap);

        container.appendChild(div);
    });
}

// Membangun UI fitur Catatan Cepat di dalam elemen `kolom` yang diberikan
function initCatatan(kolom) {
    const sectionCatatan = document.createElement("section");
    kolom.appendChild(sectionCatatan);

    const judulCatatan = document.createElement("h3");
    judulCatatan.textContent = "Fitur Catatan Cepat";
    sectionCatatan.appendChild(judulCatatan);

    const inputCatatan = document.createElement("textarea");
    inputCatatan.id = "input-catatan";
    inputCatatan.placeholder = "Tulis catatan...";
    inputCatatan.rows = 4;
    sectionCatatan.appendChild(inputCatatan);

    const tombolCatatan = document.createElement("button");
    tombolCatatan.id = "tombol-catatan";
    tombolCatatan.textContent = "Tambah Catatan";
    sectionCatatan.appendChild(tombolCatatan);

    const containerCatatan = document.createElement("div");
    containerCatatan.id = "daftar-catatan";
    sectionCatatan.appendChild(containerCatatan);

    tombolCatatan.addEventListener("click", () => {
        const isi = inputCatatan.value.trim();
        if (isi === "") {
            alert("Catatan tidak boleh kosong!");
            return;
        }
        tambahCatatan(isi);
        inputCatatan.value = "";
    });

    renderCatatan();
}
