// Data awal hanya dipakai jika belum ada data tersimpan di localStorage
let daftarTugas = muatTugas([
    { id: 1, nama: "Belajar JavaScript", selesai: false },
    { id: 2, nama: "Olahraga pagi", selesai: false },
]);

// Membuat id baru yang unik untuk tugas
function buatIdTugasBaru() {
    return daftarTugas.length
        ? Math.max(...daftarTugas.map((t) => t.id)) + 1
        : 1;
}

// Menambahkan tugas baru
function tambahTugas(nama) {
    daftarTugas.push({ id: buatIdTugasBaru(), nama, selesai: false });
    simpanTugas(daftarTugas);
    renderTugas();
}

// Menghapus tugas
function hapusTugas(id) {
    daftarTugas = daftarTugas.filter((t) => t.id !== id);
    simpanTugas(daftarTugas);
    renderTugas();
}

// Mengubah status tugas selesai / belum
function toggleSelesai(id) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, selesai: !t.selesai } : t
    );
    simpanTugas(daftarTugas);
    renderTugas();
}

// Mengedit isi tugas
function editTugas(id, namaBaru) {
    const nama = namaBaru.trim();
    if (nama === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }
    daftarTugas = daftarTugas.map((t) => (t.id === id ? { ...t, nama } : t));
    simpanTugas(daftarTugas);
    renderTugas();
}

// Menampilkan dan memfilter tugas
function renderTugas(filter = "semua") {
    const list = document.getElementById("daftar-tugas");
    if (!list) return;
    list.innerHTML = "";

    const tersaring = daftarTugas.filter((t) => {
        if (filter === "selesai") return t.selesai;
        if (filter === "belum") return !t.selesai;
        return true;
    });

    tersaring.forEach((t) => {
        const li = document.createElement("li");
        li.className = "tugas-item";
        li.dataset.id = t.id;

        const teks = document.createElement("span");
        teks.textContent = t.nama;
        teks.style.textDecoration = t.selesai ? "line-through" : "none";
        li.appendChild(teks);

        // Edit tugas dengan klik dua kali
        li.addEventListener("dblclick", (event) => {
            event.stopPropagation();
            const namaBaru = prompt("Ubah tugas:", t.nama);
            if (namaBaru !== null) editTugas(t.id, namaBaru);
        });

        // Mengubah status selesai saat diklik
        li.addEventListener("click", () => toggleSelesai(t.id));

        // Tombol hapus tugas
        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", (event) => {
            event.stopPropagation(); // agar tidak ikut toggle selesai
            hapusTugas(t.id);
        });
        li.appendChild(tombolHapus);

        list.appendChild(li);
    });

    aktifkanDragDrop();
}

// Menampilkan hasil pencarian (versi tampilan sederhana)
function renderTugasKustom(data) {
    const list = document.getElementById("daftar-tugas");
    if (!list) return;
    list.innerHTML = "";
    data.forEach((t) => {
        const li = document.createElement("li");
        li.className = "tugas-item";
        li.dataset.id = t.id;
        li.textContent = t.nama;
        li.style.textDecoration = t.selesai ? "line-through" : "none";
        list.appendChild(li);
    });
}

// Mengaktifkan fitur drag and drop
function aktifkanDragDrop() {
    const items = document.querySelectorAll(".tugas-item");
    items.forEach((item) => {
        item.draggable = true;
        item.addEventListener("dragstart", () => item.classList.add("dragging"));
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });

    const list = document.getElementById("daftar-tugas");
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const itemYangDipindahkan = document.querySelector(".dragging");
        const itemTujuan = e.target.closest(".tugas-item");
        if (!itemTujuan || itemYangDipindahkan === itemTujuan) return;

        const rect = itemTujuan.getBoundingClientRect();
        const tengah = rect.top + rect.height / 2;

        if (e.clientY > tengah) {
            list.insertBefore(itemYangDipindahkan, itemTujuan.nextSibling);
        } else {
            list.insertBefore(itemYangDipindahkan, itemTujuan);
        }
    });

    list.addEventListener("drop", () => {
        const itemsBaru = document.querySelectorAll(".tugas-item");
        daftarTugas = Array.from(itemsBaru).map((item) =>
            daftarTugas.find((t) => t.id == item.dataset.id)
        );
        simpanTugas(daftarTugas);
    });
}

// Mencari tugas berdasarkan kata kunci — dipakai oleh kotak pencarian di script.js
function cariTugas(kataKunci) {
    const kunci = kataKunci.toLowerCase();
    if (kunci === "") {
        renderTugas();
        return;
    }
    const hasil = daftarTugas.filter((t) =>
        t.nama.toLowerCase().includes(kunci)
    );
    renderTugasKustom(hasil);
}

// Membangun UI fitur Daftar Tugas di dalam elemen `kolom` yang diberikan
function initTugas(kolom) {
    const tugas = document.createElement("section");
    kolom.appendChild(tugas);

    const judulTugas = document.createElement("h3");
    judulTugas.textContent = "Daftar Tugas";
    tugas.appendChild(judulTugas);

    // Kotak pencarian tugas
    const inputCariTugas = document.createElement("input");
    inputCariTugas.id = "cari-tugas";
    inputCariTugas.type = "text";
    inputCariTugas.placeholder = "Cari tugas...";
    tugas.appendChild(inputCariTugas);

    inputCariTugas.addEventListener("input", (e) => {
        cariTugasDebounced(e.target.value);
    });

    const inputTugas = document.createElement("input");
    inputTugas.placeholder = "Masukkan tugas...";
    tugas.appendChild(inputTugas);

    const tombolTambahTugas = document.createElement("button");
    tombolTambahTugas.textContent = "Tambah";
    tugas.appendChild(tombolTambahTugas);

    tombolTambahTugas.addEventListener("click", () => {
        const nilai = inputTugas.value.trim();
        if (nilai === "") {
            alert("Tugas tidak boleh kosong!");
            return;
        }
        tambahTugas(nilai);
        inputTugas.value = "";
    });

    // Bisa juga tambah tugas dengan menekan Enter
    inputTugas.addEventListener("keydown", (e) => {
        if (e.key === "Enter") tombolTambahTugas.click();
    });

    const filterWrap = document.createElement("div");
    tugas.appendChild(filterWrap);

    const tombolSemua = document.createElement("button");
    tombolSemua.textContent = "Semua";
    tombolSemua.addEventListener("click", () => renderTugas("semua"));
    filterWrap.appendChild(tombolSemua);

    const tombolSelesai = document.createElement("button");
    tombolSelesai.textContent = "Selesai";
    tombolSelesai.addEventListener("click", () => renderTugas("selesai"));
    filterWrap.appendChild(tombolSelesai);

    const tombolBelum = document.createElement("button");
    tombolBelum.textContent = "Belum Selesai";
    tombolBelum.addEventListener("click", () => renderTugas("belum"));
    filterWrap.appendChild(tombolBelum);

    const ul = document.createElement("ul");
    ul.id = "daftar-tugas";
    tugas.appendChild(ul);

    renderTugas();
}


function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const cariTugasDebounced = debounce((kataKunci) => {
    cariTugas(kataKunci);
}, 300);
