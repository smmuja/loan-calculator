// 1. Jadwal Angsuran

function angsuran(OTR, DP, jangka_waktu) {
  const pokok_utang = OTR - DP;

  //   Bunga berdasarkan jangka waktu
  switch (true) {
    case jangka_waktu <= 12:
      bunga = 0.12;
      break;
    case jangka_waktu > 12 && jangka_waktu < 24:
      bunga = 0.14;
      break;
    case jangka_waktu >= 24:
      bunga = 0.165;
      break;
    default:
      bunga = 0;
      break;
  }

  return (pokok_utang + pokok_utang * bunga) / jangka_waktu;
}

// Simulasi input
const OTR = 240_000_000;
const DP = (20 / 100) * 240_000_000;
const jangka_waktu = 18;

const cicilan = angsuran(OTR, DP, jangka_waktu);

// Meng-generate jadwal cicilan per bulan berdasar OTR (On The Road/Harga Jual), DP, dan jangka waktu

function generateCicilanPerbulan(tanggalMulai, jangka_waktu, jumlahCicilan) {
  const daftarCicilan = Array.from({ length: jangka_waktu }).map((_, index) => {
    const date = new Date(tanggalMulai);
    date.setMonth(date.getMonth() + index);
    return {
      date: new Date(date.getFullYear(), date.getMonth(), 25),
      jumlahCicilan,
    };
  });

  return daftarCicilan;
}

const tanggalMulai = new Date("2024-01-25");
const jadwalCicilan = generateCicilanPerbulan(
  tanggalMulai,
  jangka_waktu,
  cicilan
);

jadwalCicilan.forEach(({ date, jumlahCicilan }, index) => {
  console.log(
    `Angsuran ke ${
      index + 1
    }, Angsuran per bulan: Rp${jumlahCicilan.toLocaleString(
      "id-ID"
    )}, Tanggal Jatuh Tempo: ${date.toLocaleDateString("en-CA")}, `
  );
});

// 2. Total angsuran jatuh tempo
// Total angsuran jatuh tempo dari tanggal mulai angsuran hingga bulan akhir jatuh tempo yang dipilih (Tidak menyertakan tagihan pada bulan yang belum jatuh tempo)

function calculateTotalAngsuranJatuhTempo(jadwalCicilan, queryDate) {
  const query = new Date(queryDate);
  const jatuhTempo = jadwalCicilan.filter(({ date }) => date <= query);
  const totalAngsuran = jatuhTempo.reduce(
    (sum, { jumlahCicilan }) => sum + jumlahCicilan,
    0
  );

  return totalAngsuran;
}

const queryDate = "2024-08-14";

const totalJatuhTempo = calculateTotalAngsuranJatuhTempo(
  jadwalCicilan,
  queryDate
);

console.log(
  `Total angsuran jatuh tempo hingga ${queryDate}: Rp${totalJatuhTempo.toLocaleString(
    "id-ID"
  )}`
);

// 3. Denda telat bayar

function total_hari_telat(hari_awal_telat, hari_ini) {
  const hari_awal = new Date(hari_awal_telat);
  hari_ini = new Date(hari_ini);

  const selisihMiliseconds = hari_ini - hari_awal;
  const selisihHari = Math.floor(selisihMiliseconds / (1000 * 60 * 60 * 24));

  return selisihHari;
}

console.log(`selisih hari: ${total_hari_telat("2024-05-25", "2024-08-14")}`);

function denda_telat_bayar(awalTelat, hariIni, schedule) {
  const totalHariTelat = total_hari_telat(awalTelat, hariIni);

  const tanggalAwalTelat = new Date(awalTelat);
  const tanggalHariIni = new Date(hariIni);

  const angsuranBelumTerbayar = schedule.filter(
    ({ date }) =>
      new Date(date) >= tanggalAwalTelat && new Date(date) <= tanggalHariIni
  );

  const totalAngsuranBelumTerbayar = angsuranBelumTerbayar.reduce(
    (sum, { jumlahCicilan }) => sum + jumlahCicilan,
    0
  );

  const dendaPerHari = 0.001 * totalAngsuranBelumTerbayar;
  const totalDenda = dendaPerHari * totalHariTelat;

  return {
    totalHariTelat,
    totalAngsuranBelumTerbayar,
    dendaPerHari,
    totalDenda,
  };
}

const denda = denda_telat_bayar("2024-05-25", "2024-08-14", jadwalCicilan);

console.log(
  `Denda telat bayar || Total Hari Telat: ${
    denda.totalHariTelat
  } || Total Angsuran Belum Terbayar ${denda.totalAngsuranBelumTerbayar.toLocaleString(
    "id-ID"
  )} || Denda per hari: Rp${denda.dendaPerHari.toLocaleString(
    "id-ID"
  )} || Total Denda: Rp${denda.totalDenda.toLocaleString("id-ID")}`
);
