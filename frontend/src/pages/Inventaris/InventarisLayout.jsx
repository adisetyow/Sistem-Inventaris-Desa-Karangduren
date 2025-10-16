import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";
import TableLoader from "../../components/common/TableLoader";
import Modal from "../../components/common/Modal";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  RefreshCw,
  RotateCcw,
  Download,
} from "lucide-react";
import { Transition } from "@headlessui/react";

const KondisiBadge = ({ kondisi }) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
  let colorClasses = "";

  switch (kondisi) {
    case "Baik":
      colorClasses = "bg-emerald-100 text-emerald-800";
      break;
    case "Rusak Ringan":
      colorClasses = "bg-amber-100 text-amber-800";
      break;
    case "Rusak Berat":
      colorClasses = "bg-rose-100 text-rose-800";
      break;
    default:
      colorClasses = "bg-slate-100 text-slate-800";
  }

  return <span className={`${baseClasses} ${colorClasses}`}>{kondisi}</span>;
};
const FilterPanel = ({ filters, setFilters, onReset, isHistoryPage }) => {
  const [kategoriOptions, setKategoriOptions] = useState([]);

  // Ambil data kategori untuk dropdown filter
  useEffect(() => {
    axiosClient.get("/kategori-inventaris?paginate=false").then(({ data }) => {
      setKategoriOptions(data.data);
    });
  }, []);

  const kondisiOptions = ["Baik", "Rusak Ringan", "Rusak Berat"];

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800">Filter Data</h3>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Kategori
          </label>
          <select
            value={filters.kategori_id}
            onChange={(e) =>
              setFilters({ ...filters, kategori_id: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
          >
            <option value="">Semua Kategori</option>
            {kategoriOptions.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_kategori}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Kondisi hanya untuk halaman non-riwayat */}
        {!isHistoryPage && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kondisi
            </label>
            <select
              value={filters.kondisi}
              onChange={(e) =>
                setFilters({ ...filters, kondisi: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
            >
              <option value="">Semua Kondisi</option>
              {kondisiOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Rentang Nilai Aset
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) =>
              setFilters({ ...filters, priceRange: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white"
          >
            <option value="">Semua Harga</option>
            <option value="0-10000000">Rp 0 - 10 Juta</option>
            <option value="10000000-50000000">Rp 10 - 50 Juta</option>
            <option value="50000000-100000000">Rp 50 - 100 Juta</option>
            <option value="100000000-500000000">Rp 100 - 500 Juta</option>
            <option value="500000000-999999999999999">
              Di atas Rp 500 Juta
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

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

export default function InventarisLayout({
  pageTitle,
  description,
  apiEndpoint,
  statusFilter = null,
  isHistoryPage = false,
}) {
  const [inventaris, setInventaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState(null);

  const [forceRefresh, setForceRefresh] = useState(false);

  const [filters, setFilters] = useState({
    kondisi: "",
    kategori_id: "",
    priceRange: "",
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState(null);

  useEffect(() => {
    const fetchInventaris = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchQuery,
          per_page: pageSize,
          page: currentPage,
          ...filters,
        };
        if (statusFilter) params.status = statusFilter;

        const response = await axiosClient.get(apiEndpoint, { params });

        const inventarisData = response.data.data.inventaris.data;
        const paginationMeta = response.data.data.inventaris;

        setInventaris(inventarisData || []);
        setPaginationInfo(paginationMeta);
      } catch (error) {
        console.error("Gagal mengambil data inventaris:", error);
        setInventaris([]);
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => fetchInventaris(), 300);
    return () => clearTimeout(handler);
  }, [
    searchQuery,
    pageSize,
    currentPage,
    apiEndpoint,
    statusFilter,
    filters,
    forceRefresh,
  ]);

  const handleViewFile = (filePath) => {
    if (!filePath) return;
    const fileName = filePath.split("/").pop();
    const fileUrl = `${import.meta.env.VITE_API_URL}/storage/${filePath}`;

    // Simpan juga path relatif untuk download
    setFileToView({ url: fileUrl, name: fileName, path: filePath });
    setIsViewModalOpen(true);
  };

  const handleAktifkan = (itemId) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin mengaktifkan kembali aset dengan ID: ${itemId}?`
      )
    )
      return;

    axiosClient
      .post(`/inventaris/${itemId}/set-aktif`, {
        alasan: "Aset diaktifkan kembali dari daftar aset tidak aktif.",
      })
      .then((response) => {
        alert(response.data.message);
        // Picu refresh data dengan mengubah state
        setForceRefresh((prev) => !prev);
      })
      .catch((error) => {
        alert("Gagal mengaktifkan data.");
        console.error(error);
      });
  };

  const handleDownload = async (relativePath, filename) => {
    try {
      // Panggil API download kita, bukan URL file langsung
      const response = await axiosClient.get("/download", {
        params: {
          path: relativePath,
        },
        responseType: "blob", // SANGAT PENTING: Minta data sebagai file
      });

      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);

      // Logika untuk trigger download tetap sama
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      a.remove();
    } catch (error) {
      console.error("Error saat download:", error);
      alert("Tidak dapat mengunduh file. Periksa konsol untuk detail.");
    }
  };

  const resetFilters = () => {
    setFilters({ kondisi: "", kategori_id: "", priceRange: "" });
    setShowFilter(false);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== ""
  ).length;

  return (
    <>
      <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden mt-2 mb-6">
          <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-700 tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>
            {!isHistoryPage && (
              <Link to="/inventaris/tambah" className="w-full sm:w-auto">
                <button className="px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-blue-200">
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Search dll */}
        <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-hidden">
          <div className="border-t border-slate-200 p-3">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <label
                  htmlFor="pageSize"
                  className="text-sm font-medium text-slate-600 flex-shrink-0"
                >
                  Tampilkan
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="w-auto px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm bg-white shadow-sm"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full flex-1 relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari data..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-sm bg-white shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition-all duration-200 ease-in-out shadow-sm flex-shrink-0 focus:ring-4 ${
                    showFilter || activeFilterCount > 0
                      ? "bg-sky-100 text-sky-700 border border-sky-200 hover:bg-sky-200 focus:ring-sky-200"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-sky-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-1">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <Transition
            show={showFilter}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 max-h-0"
            enterTo="opacity-100 max-h-96"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 max-h-96"
            leaveTo="opacity-0 max-h-0"
          >
            <div className="p-2 border-t border-slate-100 bg-slate-50/50 overflow-hidden">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onReset={resetFilters}
                isHistoryPage={isHistoryPage}
              />
            </div>
          </Transition>

          {/* Daftar Inventaris */}
          <div className="overflow-x-auto lg:overflow-x-visible">
            {loading ? (
              <div className="p-8">
                <TableLoader />
              </div>
            ) : inventaris.length === 0 ? (
              <div className="text-center py-16 bg-slate-50">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-md">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-700 text-lg font-medium">
                  Tidak ada data inventaris ditemukan
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Coba ubah pencarian atau filter Anda.
                </p>
              </div>
            ) : (
              // Tabel Inventaris
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-sky-50 border-y border-blue-100">
                    <tr>
                      <th
                        className="px-2 py-3 text-left text-xs font-bold text-slate-700 uppercase whitespace-nowrap"
                        style={{ width: "60px" }}
                      >
                        No.
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase whitespace-nowrap"
                        style={{ width: "140px" }}
                      >
                        Kode
                      </th>
                      <th
                        className="px-2 py-3 text-left text-xs font-bold text-slate-700 uppercase"
                        style={{ minWidth: "200px", width: "5%" }}
                      >
                        Nama Barang
                      </th>

                      {statusFilter === "tidak_aktif" ? (
                        <>
                          <th
                            className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase whitespace-nowrap"
                            style={{ width: "100px" }}
                          >
                            Bukti
                          </th>
                          <th
                            className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase"
                            style={{ minWidth: "180px", width: "15%" }}
                          >
                            Keterangan
                          </th>
                        </>
                      ) : isHistoryPage ? (
                        <>
                          {/* Lebar Kategori disamakan */}
                          <th
                            className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase"
                            style={{ width: "150px" }}
                          >
                            Kategori
                          </th>
                          <th
                            className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase whitespace-nowrap"
                            style={{ width: "140px" }}
                          >
                            Tgl Dihapus
                          </th>
                        </>
                      ) : (
                        <>
                          {/* Lebar Kategori disamakan */}
                          <th
                            className="px-1 py-3 text-left text-xs font-bold text-slate-700 uppercase"
                            style={{ width: "150px" }}
                          >
                            Kategori
                          </th>
                          {/* Lebar Kondisi ditambah agar tidak terpotong */}
                          <th
                            className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase whitespace-nowrap"
                            style={{ width: "170px" }}
                          >
                            Kondisi
                          </th>
                        </>
                      )}

                      {/* Lebar Total Nilai ditambah */}
                      <th
                        className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase whitespace-nowrap"
                        style={{ width: "180px" }}
                      >
                        Total Nilai
                      </th>
                      <th
                        className="px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase whitespace-nowrap"
                        style={{ width: "100px" }}
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventaris.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors duration-150"
                      >
                        <td className="px-2 py-3">
                          <span className="text-sm font-medium text-slate-600">
                            {paginationInfo.from + index}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                            {item.kode_inventaris}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className="text-sm font-medium text-slate-800 truncate max-w-[200px] block"
                            title={item.nama_barang}
                          >
                            {item.nama_barang}
                          </span>
                        </td>

                        {statusFilter === "tidak_aktif" ? (
                          <>
                            {/* Padding disamakan menjadi px-4 */}
                            <td className="px-4 py-3">
                              {item.log_status_terakhir?.file_pendukung_path ? (
                                <button
                                  onClick={() =>
                                    handleViewFile(
                                      item.log_status_terakhir
                                        .file_pendukung_path
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap"
                                >
                                  Lihat
                                </button>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  -
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="text-sm text-slate-600 truncate max-w-[180px] block"
                                title={item.log_status_terakhir?.alasan}
                              >
                                {item.log_status_terakhir?.alasan || "-"}
                              </span>
                            </td>
                          </>
                        ) : isHistoryPage ? (
                          <>
                            {/* Padding disamakan menjadi px-4 */}
                            <td className="px-4 py-3">
                              <span className="text-sm truncate block">
                                {item.kategori?.nama_kategori || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm whitespace-nowrap">
                                {new Date(item.deleted_at).toLocaleDateString(
                                  "id-ID"
                                )}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            {/* Padding disamakan menjadi px-4 */}
                            <td className="px-1 py-3">
                              <span className="text-sm truncate block">
                                {item.kategori?.nama_kategori || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <KondisiBadge kondisi={item.kondisi} />
                            </td>
                          </>
                        )}

                        <td className="px-4 py-3">
                          <span
                            className="text-sm font-semibold text-slate-800 truncate block"
                            title={new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(item.total_harga)}
                          >
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(item.total_harga)}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            {/* Tombol Detail */}
                            <Link
                              to={`/inventaris/${item.id}`}
                              title="Detail"
                              className="p-2 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 hover:bg-sky-100 hover:border-sky-200 hover:text-sky-700 shadow-sm transition-all duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Tombol Edit (hanya di halaman Aktif) */}
                            {statusFilter === "aktif" && (
                              <Link
                                to={`/inventaris/edit/${item.id}`}
                                title="Edit"
                                className="p-2 rounded-lg bg-green-50 border border-green-100 text-green-600 hover:bg-green-100 hover:border-green-200 hover:text-green-700 shadow-sm transition-all duration-200"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                            )}

                            {/* Tombol Aktifkan (hanya di halaman Tidak Aktif) */}
                            {statusFilter === "tidak_aktif" && (
                              <button
                                onClick={() => handleAktifkan(item.id)}
                                title="Aktifkan Kembali"
                                className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-200 hover:text-emerald-700 shadow-sm transition-all duration-200"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

      {fileToView && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Lihat Bukti Pendukung"
        >
          <div className="mt-4">
            {fileToView.url.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={fileToView.url}
                className="w-full h-[70vh] rounded-lg border"
                title="PDF Viewer"
              ></iframe>
            ) : (
              <img
                src={fileToView.url}
                alt="Bukti pendukung"
                className="max-w-full max-h-[70vh] mx-auto rounded-lg"
              />
            )}
          </div>
          <div className="mt-6 flex justify-end">
            {/* Tombol Download diubah menjadi <button> yang memanggil fungsi handleDownload */}
            <button
              // Panggil handleDownload dengan path relatif dan nama file
              onClick={() => handleDownload(fileToView.path, fileToView.name)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
