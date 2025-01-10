import { useState } from "react";

function angsuran(OTR, DP, jangka_waktu) {
  const pokok_utang = OTR - DP;
  let bunga;

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

function generateCicilanPerbulan(tanggalMulai, jangka_waktu, jumlahCicilan) {
  const daftarCicilan = Array.from({ length: jangka_waktu }).map((_, index) => {
    const date = new Date(tanggalMulai);
    date.setMonth(date.getMonth() + index);
    return {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      jumlahCicilan,
    };
  });

  return daftarCicilan;
}

export default function Home() {
  const [OTR, setOTR] = useState("");
  const [DP, setDP] = useState("");
  const [jangkaWaktu, setJangkaWaktu] = useState("");
  const [jadwalCicilan, setJadwalCicilan] = useState([]);

  const handleCalculate = () => {
    const DPValue = (DP / 100) * OTR;
    const cicilan = angsuran(OTR, DPValue, jangkaWaktu);
    const tanggalMulai = new Date();
    const jadwal = generateCicilanPerbulan(tanggalMulai, jangkaWaktu, cicilan);
    setJadwalCicilan(jadwal);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Cicilan Angsuran</h1>

      <div className="mb-4">
        <label className="block mb-2">OTR (Harga Barang)</label>
        <input
          type="number"
          value={OTR}
          onChange={(e) => setOTR(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">DP (%)</label>
        <input
          type="number"
          value={DP}
          onChange={(e) => setDP(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Jangka Waktu (Bulan)</label>
        <input
          type="number"
          value={jangkaWaktu}
          onChange={(e) => setJangkaWaktu(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Hitung Cicilan
      </button>

      {jadwalCicilan.length > 0 && (
        <div className="mt-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Angsuran Ke</th>
                <th className="border px-4 py-2">Tanggal Jatuh Tempo</th>
                <th className="border px-4 py-2">Jumlah Cicilan</th>
              </tr>
            </thead>
            <tbody>
              {jadwalCicilan.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    {item.date.toLocaleDateString("en-CA")}
                  </td>
                  <td className="border px-4 py-2">
                    Rp {item.jumlahCicilan.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-4 my-10 text-slate-600 text-xs">
        <div className="flex items-center justify-between">
          <div className="w-1/3">Jangka Waktu (≤ 12 bulan)</div>
          <div className="w-1/3">Bunga: 12%</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-1/3">Jangka Waktu ({">"} 12 dan ≤ 24 bulan)</div>
          <div className="w-1/3">Bunga: 14%</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-1/3">Jangka Waktu ({">"} 24+ bulan)</div>
          <div className="w-1/3">Bunga: 16.5%</div>
        </div>
      </div>
    </div>
  );
}
