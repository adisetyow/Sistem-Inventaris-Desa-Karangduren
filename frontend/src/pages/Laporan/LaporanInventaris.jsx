// file: src/pages/Laporan/LaporanInventaris.jsx

import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import TableLoader from "../../components/common/TableLoader";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";
import {
  Filter,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Columns,
} from "lucide-react";
const PaginationControls = ({ paginationInfo, onPageChange }) => {
  if (!paginationInfo || paginationInfo.total === 0) {
    return null;
  }
  const { current_page, last_page, from, to, total } = paginationInfo;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-200">
      <span className="text-sm text-slate-600">
        Menampilkan <span className="font-semibold text-slate-800">{from}</span>{" "}
        - <span className="font-semibold text-slate-800">{to}</span> dari{" "}
        <span className="font-semibold text-slate-800">{total}</span> data
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sebelumnya
        </button>
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

const KOLOM_TERSEDIA = [
  { key: "kode_inventaris", label: "Kode Inventaris" },
  { key: "nama_barang", label: "Nama Barang" },
  { key: "kategori", label: "Kategori" },
  { key: "jumlah", label: "Jumlah" },
  { key: "kondisi", label: "Kondisi" },
  { key: "status", label: "Status" },
  { key: "lokasi_penempatan", label: "Lokasi" },
  // { key: "tanggal_masuk", label: "Tgl Masuk" },
  { key: "sumber_dana", label: "Sumber Dana" },
  { key: "harga_perolehan", label: "Harga Satuan" },
  { key: "total_harga", label: "Total Nilai" },
];

export default function LaporanInventaris() {
  const [data, setData] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // State untuk modal & kolom
  const [isKolomModalOpen, setIsKolomModalOpen] = useState(false);
  const [kolomTerpilih, setKolomTerpilih] = useState([
    "kode_inventaris",
    "nama_barang",
    "kategori",
    "kondisi",
    "status",
    "total_harga",
  ]);

  const initialFilters = {
    tanggal_mulai: "",
    tanggal_selesai: "",
    kategori_id: "",
    status: "",
    kondisi: "",
    sumber_dana: "",
    lokasi: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  // Fetch data laporan
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/laporan/inventaris", {
        params: {
          page: currentPage,
          ...filters,
        },
      })
      .then(({ data }) => {
        setData(data.data.data);
        setPaginationInfo(data.data);
      })
      .catch((err) => console.error("Gagal mengambil data laporan:", err))
      .finally(() => setLoading(false));
  }, [currentPage, filters]);

  // Fetch data kategori untuk filter
  useEffect(() => {
    axiosClient.get("/kategori-inventaris?paginate=false").then(({ data }) => {
      setKategoriOptions(data.data);
    });
  }, []);

  const handleKolomChange = (kolomKey) => {
    setKolomTerpilih((prev) =>
      prev.includes(kolomKey)
        ? prev.filter((k) => k !== kolomKey)
        : [...prev, kolomKey]
    );
  };

  const handleExport = async (format) => {
    if (kolomTerpilih.length === 0) {
      toast.error("Pilih setidaknya satu kolom untuk diekspor.");
      return;
    }

    const promise = axiosClient.post(
      `/laporan/inventaris/${format}`,
      {
        ...filters,
        kolom: kolomTerpilih,
      },
      { responseType: "blob" }
    );

    toast.promise(promise, {
      loading: `Membuat laporan ${format.toUpperCase()}...`,
      success: (response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `laporan-inventaris.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return `Laporan ${format.toUpperCase()} berhasil diunduh.`;
      },
      error: `Gagal membuat laporan.`,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const tableHeaders = KOLOM_TERSEDIA.filter((k) =>
    kolomTerpilih.includes(k.key)
  );

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h1 className="text-xl font-bold text-slate-800">
            Laporan Inventaris
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Saring dan ekspor data inventaris sesuai kebutuhan.
          </p>
        </div>

        {/* --- PANEL FILTER BARU --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Filter size={16} />{" "}
              <h3 className="font-semibold text-slate-800">Filter Laporan</h3>
            </div>
            <button onClick={handleResetFilters} className="text-sm ...">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            {/* Menggunakan label yang jelas untuk setiap input */}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Dari Tanggal Masuk
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                value={filters.tanggal_mulai}
                onChange={handleFilterChange}
                className="w-full border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Sampai Tanggal Masuk
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                value={filters.tanggal_selesai}
                onChange={handleFilterChange}
                className="w-full border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Kategori
              </label>
              <select
                name="kategori_id"
                value={filters.kategori_id}
                onChange={handleFilterChange}
                className="w-full border-slate-200 rounded-lg text-sm"
              >
                <option value="">Semua Kategori</option>
                {kategoriOptions.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama_kategori}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border-slate-200 rounded-lg text-sm"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Kondisi
              </label>
              <select
                name="kondisi"
                value={filters.kondisi}
                onChange={handleFilterChange}
                className="w-full border-slate-200 rounded-lg text-sm"
              >
                <option value="">Semua Kondisi</option>
                <option>Baik</option>
                <option>Rusak Ringan</option>
                <option>Rusak Berat</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Sumber Dana
              </label>
              <input
                type="text"
                name="sumber_dana"
                value={filters.sumber_dana}
                onChange={handleFilterChange}
                placeholder="Filter Sumber Dana..."
                className="w-full border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Lokasi
              </label>
              <input
                type="text"
                name="lokasi"
                value={filters.lokasi}
                onChange={handleFilterChange}
                placeholder="Filter Lokasi..."
                className="w-full border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Hasil Data Laporan</h3>
            <div className="flex flex-wrap items-center gap-3">
              {/* Tombol Pilih Kolom */}
              <button
                onClick={() => setIsKolomModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl shadow-sm border border-slate-200 transition-all duration-200"
              >
                <Columns size={16} className="text-slate-600" />
                Pilih Kolom{" "}
                <span className="text-slate-500">({kolomTerpilih.length})</span>
              </button>

              {/* Tombol Export PDF */}
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl shadow-sm border border-red-200 transition-all duration-200"
              >
                <Printer size={16} className="text-red-600" />
                Export PDF
              </button>

              {/* Tombol Export Excel */}
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 rounded-xl shadow-sm border border-emerald-200 transition-all duration-200"
              >
                <FileSpreadsheet size={16} className="text-emerald-600" />
                Export Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <TableLoader />
            ) : data.length === 0 ? (
              <div className="text-center p-16 ...">...</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {/* Header tabel sekarang dinamis */}
                    {tableHeaders.map((col) => (
                      <th
                        key={col.key}
                        className="p-3 text-left font-semibold text-slate-600"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.id}>
                      {/* Isi tabel sekarang dinamis */}
                      {tableHeaders.map((col) => (
                        <td key={col.key} className="p-3">
                          {col.key === "kategori"
                            ? item.kategori.nama_kategori
                            : col.key === "total_harga"
                            ? new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(item.total_harga)
                            : col.key === "tanggal_masuk"
                            ? new Date(item.tanggal_masuk).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : item[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && (
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* --- MODAL UNTUK MEMILIH KOLOM --- */}
      <Modal
        isOpen={isKolomModalOpen}
        onClose={() => setIsKolomModalOpen(false)}
        title="Pilih Kolom untuk Ditampilkan"
      >
        <div className="grid grid-cols-2 gap-3 mt-4 max-h-96 overflow-y-auto">
          {KOLOM_TERSEDIA.map((kolom) => (
            <label
              key={kolom.key}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={kolomTerpilih.includes(kolom.key)}
                onChange={() => handleKolomChange(kolom.key)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                {kolom.label}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsKolomModalOpen(false)}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Selesai
          </button>
        </div>
      </Modal>
    </>
  );
}
