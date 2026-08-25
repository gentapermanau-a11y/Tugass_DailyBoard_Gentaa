function simpanTugas(daftarTugas) {
    localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatTugas(dataAwal) {
    const data = localStorage.getItem("daftarTugas");
    return data ? JSON.parse(data) : dataAwal;
}

function simpanCatatan(daftarCatatan) {
    localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

function muatCatatan() {
    const data = localStorage.getItem("daftarCatatan");
    return data ? JSON.parse(data) : [];
}

function simpanTema(tema) {
    localStorage.setItem("tema", tema);
}

function muatTema() {
    return localStorage.getItem("tema");
}
