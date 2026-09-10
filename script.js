/* =================================
   DATABASE
================================= */

let data = JSON.parse(
    localStorage.getItem("leleFarm")
) || {
    kolam: [],
    biaya: [],
    pakan: [],
    bersih: [],
    rawat: [],
    jual: []
};


/* =================================
   SIMPAN DATA
================================= */

function save() {

    localStorage.setItem(
        "leleFarm",
        JSON.stringify(data)
    );

    renderAll();
}


/* =================================
   FORMAT RUPIAH
================================= */

function rupiah(angka) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka || 0);

}


/* =================================
   NAVIGASI
================================= */

function showSection(id, button) {

    document
        .querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document
        .querySelectorAll(".nav")
        .forEach(nav => {
            nav.classList.remove("active");
        });

    document
        .getElementById(id)
        .classList.add("active");

    if (button) {
        button.classList.add("active");
    }

}


/* =================================
   HAPUS DATA
================================= */

function hapus(type, id) {

    data[type] = data[type].filter(
        item => item.id !== id
    );

    save();

}


/* =================================
   KOLAM
================================= */

function tambahKolam() {

    const nama =
        document.getElementById("namaKolam").value;

    const luas =
        Number(
            document.getElementById("luasKolam").value
        );

    const bibit =
        Number(
            document.getElementById("bibitKolam").value
        );

    const tanggal =
        document.getElementById("tanggalKolam").value;


    if (!nama || !luas || !bibit) {

        alert("Lengkapi data kolam!");

        return;
    }


    data.kolam.push({

        id: Date.now(),

        nama,

        luas,

        bibit,

        tanggal

    });


    save();


    document.getElementById("namaKolam").value = "";

    document.getElementById("luasKolam").value = "";

    document.getElementById("bibitKolam").value = "";

    document.getElementById("tanggalKolam").value = "";

}


function renderKolam() {

    let html = "";


    data.kolam.forEach(item => {

        html += `

        <tr>

            <td>${item.nama}</td>

            <td>${item.luas} m²</td>

            <td>
                ${item.bibit.toLocaleString("id-ID")}
            </td>

            <td>${item.tanggal || "-"}</td>

            <td>

                <button
                    class="btn btn-danger"
                    onclick="hapus('kolam', ${item.id})"
                >
                    Hapus
                </button>

            </td>

        </tr>

        `;

    });


    document.getElementById(
        "tabelKolam"
    ).innerHTML = html || `

        <tr>
            <td colspan="5">
                Belum ada data kolam.
            </td>
        </tr>

    `;

}


/* =================================
   BIAYA
================================= */

function tambahBiaya() {

    const tanggal =
        document.getElementById("biayaTanggal").value;

    const jenis =
        document.getElementById("biayaJenis").value;

    const nominal =
        Number(
            document.getElementById("biayaNominal").value
        );

    const catatan =
        document.getElementById("biayaCatatan").value;


    if (!nominal) {

        alert("Masukkan nominal biaya!");

        return;
    }


    data.biaya.push({

        id: Date.now(),

        tanggal,

        jenis,

        nominal,

        catatan

    });


    save();


    document.getElementById("biayaNominal").value = "";

    document.getElementById("biayaCatatan").value = "";

}


function renderBiaya() {

    let html = "";


    data.biaya.forEach(item => {

        html += `

        <tr>

            <td>${item.tanggal || "-"}</td>

            <td>${item.jenis}</td>

            <td>${rupiah(item.nominal)}</td>

            <td>${item.catatan || "-"}</td>

            <td>

                <button
                    class="btn btn-danger"
                    onclick="hapus('biaya', ${item.id})"
                >
                    Hapus
                </button>

            </td>

        </tr>

        `;

    });


    document.getElementById(
        "tabelBiaya"
    ).innerHTML = html || `

        <tr>
            <td colspan="5">
                Belum ada biaya.
            </td>
        </tr>

    `;

}


/* =================================
   PAKAN
================================= */

function tambahPakan() {

    const tanggal =
        document.getElementById("pakanTanggal").value;

    const jam =
        document.getElementById("pakanJam").value;

    const kolam =
        document.getElementById("pakanKolam").value;

    const jumlah =
        document.getElementById("pakanJumlah").value;


    if (!tanggal || !jam || !kolam) {

        alert("Lengkapi jadwal pakan!");

        return;
    }


    data.pakan.push({

        id: Date.now(),

        tanggal,

        jam,

        kolam,

        jumlah,

        selesai: false

    });


    save();

}


function togglePakan(id) {

    const item =
        data.pakan.find(
            item => item.id === id
        );


    if (item) {

        item.selesai =
            !item.selesai;

    }


    save();

}


function renderPakan() {

    let html = "";


    data.pakan
        .sort(
            (a, b) =>
                (a.tanggal + a.jam)
                .localeCompare(
                    b.tanggal + b.jam
                )
        )
        .forEach(item => {

            html += `

            <div class="task">

                <div>

                    <b>
                        ${item.tanggal}
                        •
                        ${item.jam}
                    </b>

                    <br>

                    ${item.kolam}
                    —
                    ${item.jumlah || "-"}

                </div>


                <div>

                    <span
                        class="badge ${
                            item.selesai
                            ? ""
                            : "pending"
                        }"
                    >

                        ${
                            item.selesai
                            ? "Sudah"
                            : "Belum"
                        }

                    </span>


                    <button
                        class="btn btn-secondary"
                        onclick="togglePakan(${item.id})"
                    >
                        ✓
                    </button>


                    <button
                        class="btn btn-danger"
                        onclick="hapus('pakan', ${item.id})"
                    >
                        Hapus
                    </button>

                </div>

            </div>

            `;

        });


    document.getElementById(
        "listPakan"
    ).innerHTML =
        html || "Belum ada jadwal pakan.";

}


/* =================================
   PEMBERSIHAN
================================= */

function tambahBersih() {

    const tanggal =
        document.getElementById("bersihTanggal").value;

    const kolam =
        document.getElementById("bersihKolam").value;

    const catatan =
        document.getElementById("bersihCatatan").value;


    if (!tanggal || !kolam) {

        alert("Lengkapi jadwal!");

        return;
    }


    data.bersih.push({

        id: Date.now(),

        tanggal,

        kolam,

        catatan,

        selesai: false

    });


    save();

}


function toggleBersih(id) {

    const item =
        data.bersih.find(
            item => item.id === id
        );


    if (item) {

        item.selesai =
            !item.selesai;

    }


    save();

}


function renderBersih() {

    let html = "";


    data.bersih.forEach(item => {

        html += `

        <div class="task">

            <div>

                <b>${item.tanggal}</b>

                <br>

                ${item.kolam}
                —
                ${item.catatan || "-"}

            </div>


            <div>

                <span
                    class="badge ${
                        item.selesai
                        ? ""
                        : "pending"
                    }"
                >

                    ${
                        item.selesai
                        ? "Sudah"
                        : "Belum"
                    }

                </span>


                <button
                    class="btn btn-secondary"
                    onclick="toggleBersih(${item.id})"
                >
                    ✓
                </button>


                <button
                    class="btn btn-danger"
                    onclick="hapus('bersih', ${item.id})"
                >
                    Hapus
                </button>

            </div>

        </div>

        `;

    });


    document.getElementById(
        "listBersih"
    ).innerHTML =
        html || "Belum ada jadwal pembersihan.";

}


/* =================================
   PERAWATAN
================================= */

function tambahRawat() {

    const tanggal =
        document.getElementById("rawatTanggal").value;

    const kolam =
        document.getElementById("rawatKolam").value;

    const jenis =
        document.getElementById("rawatJenis").value;

    const biaya =
        Number(
            document.getElementById("rawatBiaya").value
        );


    if (!tanggal || !kolam || !jenis) {

        alert("Lengkapi data perawatan!");

        return;
    }


    data.rawat.push({

        id: Date.now(),

        tanggal,

        kolam,

        jenis,

        biaya

    });


    /* Masukkan biaya perawatan
       ke total biaya */

    if (biaya > 0) {

        data.biaya.push({

            id: Date.now() + 1,

            tanggal,

            jenis: "Perawatan",

            nominal: biaya,

            catatan:
                jenis + " - " + kolam

        });

    }


    save();

}


function renderRawat() {

    let html = "";


    data.rawat.forEach(item => {

        html += `

        <tr>

            <td>${item.tanggal}</td>

            <td>${item.kolam}</td>

            <td>${item.jenis}</td>

            <td>${rupiah(item.biaya)}</td>

            <td>

                <button
                    class="btn btn-danger"
                    onclick="hapus('rawat', ${item.id})"
                >
                    Hapus
                </button>

            </td>

        </tr>

        `;

    });


    document.getElementById(
        "tabelRawat"
    ).innerHTML = html || `

        <tr>

            <td colspan="5">
                Belum ada data.
            </td>

        </tr>

    `;

}


/* =================================
   PEMASUKAN
================================= */

function tambahPemasukan() {

    const tanggal =
        document.getElementById("jualTanggal").value;

    const kolam =
        document.getElementById("jualKolam").value;

    const berat =
        Number(
            document.getElementById("jualBerat").value
        );

    const harga =
        Number(
            document.getElementById("jualHarga").value
        );


    if (!tanggal || !berat || !harga) {

        alert("Lengkapi data penjualan!");

        return;
    }


    data.jual.push({

        id: Date.now(),

        tanggal,

        kolam,

        berat,

        harga,

        total: berat * harga

    });


    save();

}


function renderJual() {

    let html = "";


    data.jual.forEach(item => {

        html += `

        <tr>

            <td>${item.tanggal}</td>

            <td>${item.kolam || "-"}</td>

            <td>${item.berat} kg</td>

            <td>${rupiah(item.harga)}</td>

            <td>
                <b>${rupiah(item.total)}</b>
            </td>

            <td>

                <button
                    class="btn btn-danger"
                    onclick="hapus('jual', ${item.id})"
                >
                    Hapus
                </button>

            </td>

        </tr>

        `;

    });


    document.getElementById(
        "tabelJual"
    ).innerHTML = html || `

        <tr>

            <td colspan="6">
                Belum ada pemasukan.
            </td>

        </tr>

    `;

}


/* =================================
   DASHBOARD
================================= */

function renderDashboard() {

    const totalBiaya =
        data.biaya.reduce(
            (total, item) =>
                total + Number(item.nominal),
            0
        );


    const totalPemasukan =
        data.jual.reduce(
            (total, item) =>
                total + Number(item.total),
            0
        );


    const laba =
        totalPemasukan - totalBiaya;


    document.getElementById(
        "totalModal"
    ).textContent =
        rupiah(totalBiaya);


    document.getElementById(
        "totalPemasukan"
    ).textContent =
        rupiah(totalPemasukan);


    document.getElementById(
        "labaRugi"
    ).textContent =
        rupiah(laba);


    document.getElementById(
        "totalKolam"
    ).textContent =
        data.kolam.length;


    document.getElementById(
        "dashBiaya"
    ).textContent =
        rupiah(totalBiaya);


    document.getElementById(
        "dashPemasukan"
    ).textContent =
        rupiah(totalPemasukan);


    document.getElementById(
        "dashLaba"
    ).textContent =
        rupiah(laba);


    const rata =
        data.kolam.length
        ? totalBiaya / data.kolam.length
        : 0;


    document.getElementById(
        "modalRata"
    ).textContent =
        rupiah(rata);


    const labaElement =
        document.getElementById("labaRugi");


    labaElement.className =
        laba >= 0
        ? "green"
        : "red";


    /* JADWAL TERDEKAT */

    const jadwal = [

        ...data.pakan.map(item => ({

            tanggal: item.tanggal,

            teks:
                `🍽️ Pakan ${item.kolam} - ${item.jam}`

        })),

        ...data.bersih.map(item => ({

            tanggal: item.tanggal,

            teks:
                `🧹 Bersihkan ${item.kolam}`

        }))

    ].sort(
        (a, b) =>
            a.tanggal.localeCompare(
                b.tanggal
            )
    );


    document.getElementById(
        "jadwalDashboard"
    ).innerHTML =

        jadwal.length

        ?

        jadwal
            .slice(0, 5)
            .map(item => `

                <div class="task">

                    <b>${item.tanggal}</b>

                    <span>
                        ${item.teks}
                    </span>

                </div>

            `)
            .join("")

        :

        "Belum ada jadwal.";

}


/* =================================
   RENDER SEMUA
================================= */

function renderAll() {

    renderKolam();

    renderBiaya();

    renderPakan();

    renderBersih();

    renderRawat();

    renderJual();

    renderDashboard();

}


/* =================================
   JALANKAN SAAT WEBSITE DIBUKA
================================= */

renderAll();