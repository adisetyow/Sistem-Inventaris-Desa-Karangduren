import { useEffect, useState, Fragment } from "react";
import axiosClient from "../../api/axiosClient";
import TableLoader from "../../components/common/TableLoader";
import Modal from "../../components/common/Modal";
import { useConfirmDialog } from "../../hooks/ConfirmDialog";
import {
  FileClock,
  Eye,
  Download,
  Check,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const PaginationControls = ({ paginationInfo, onPageChange }) => {
  if (!paginationInfo || paginationInfo.total <= paginationInfo.per_page) {
    return null;
  }
  const { current_page, last_page, from, to, total } = paginationInfo;
  return (
    <div className="flex items-center justify-between p-4 border-t border-slate-200">
      <span className="text-sm text-slate-600">
        Menampilkan {from}-{to} dari {total} data
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="px-3 py-1 text-sm bg-white border rounded-md disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="px-3 py-1 text-sm bg-white border rounded-md disabled:opacity-50"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

// PERBAIKAN: Terima fungsi confirm dari props, bukan panggil hook lagi
const DetailRow = ({ pengajuan, onActionSuccess, onLihatBukti, confirmFn }) => {
  const [catatanPenolakan, setCatatanPenolakan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetujuiClick = async () => {
    const ok = await confirmFn({
      title: "Setujui Penghapusan Aset?",
      message: `Aset akan diarsipkan dan tidak dapat dikembalikan. Lanjutkan?`,
      confirmText: "Ya, Setujui",
      cancelText: "Batal",
    });
    if (!ok) return;

    setIsSubmitting(true);
    const promise = axiosClient.post(`/penghapusan/${pengajuan.id}/setujui`);
    toast.promise(promise, {
      loading: "Menyetujui...",
      success: "Pengajuan berhasil disetujui.",
      error: "Gagal memproses persetujuan.",
    });
    promise
      .then(onActionSuccess)
      .catch(console.error)
      .finally(() => setIsSubmitting(false));
  };

  const handleTolakClick = async () => {
    if (!catatanPenolakan) {
      toast.error("Catatan penolakan wajib diisi.");
      return;
    }
    const ok = await confirmFn({
      title: "Tolak Pengajuan?",
      message: "Aset akan dikembalikan ke status aktif. Lanjutkan?",
      confirmText: "Ya, Tolak",
      cancelText: "Batal",
    });
    if (!ok) return;

    setIsSubmitting(true);
    const promise = axiosClient.post(`/penghapusan/${pengajuan.id}/tolak`, {
      catatan_penolakan: catatanPenolakan,
    });
    toast.promise(promise, {
      loading: "Menolak...",
      success: "Pengajuan berhasil ditolak.",
      error: "Gagal memproses penolakan.",
    });
    promise
      .then(onActionSuccess)
      .catch(console.error)
      .finally(() => setIsSubmitting(false));
  };

  return (
    <td colSpan="5" className="p-0">
      <div className="bg-slate-50 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-500">
                Alasan Penghapusan
              </h4>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">
                {pengajuan.alasan_penghapusan}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-1">
                Berita Acara
              </h4>
              <button
                onClick={() => onLihatBukti(pengajuan.berita_acara_path)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
              >
                <Eye className="w-4 h-4" /> Lihat Dokumen
              </button>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label
                htmlFor={`catatan_${pengajuan.id}`}
                className="text-sm font-semibold text-slate-500"
              >
                Catatan Penolakan
              </label>
              <textarea
                id={`catatan_${pengajuan.id}`}
                value={catatanPenolakan}
                onChange={(e) => setCatatanPenolakan(e.target.value)}
                rows="3"
                className="w-full mt-1 text-sm border-slate-300 rounded-lg"
                placeholder="Isi alasan jika menolak..."
              />
            </div>
            <div className="flex justify-end items-center gap-3">
              <button
                onClick={handleTolakClick}
                disabled={isSubmitting || !catatanPenolakan}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:bg-rose-300"
              >
                <X className="w-4 h-4" /> Tolak
              </button>
              <button
                onClick={handleSetujuiClick}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:bg-emerald-300"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Setujui
              </button>
            </div>
          </div>
        </div>
      </div>
    </td>
  );
};

export default function PersetujuanHapus() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isBuktiModalOpen, setIsBuktiModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState(null);

  // PERBAIKAN: Ambil KEDUA confirm dan ConfirmDialog dari SATU instance hook
  const { confirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/penghapusan/menunggu?page=${currentPage}`)
      .then(({ data }) => {
        setPengajuanList(data.data.data);
        setPaginationInfo(data.data);
      })
      .catch((err) => {
        console.error("Gagal mengambil data pengajuan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, needsRefresh]);

  const handleLihatBukti = async (filePath) => {
    if (!filePath) return;
    const fileName = filePath.split("/").pop();
    const isPdf = fileName.toLowerCase().endsWith(".pdf");

    setFileToView({
      name: fileName,
      path: filePath,
      url: null,
      loading: true,
      isPdf: isPdf,
    });
    setIsBuktiModalOpen(true);

    try {
      const response = await axiosClient.get("/stream-file", {
        params: { path: filePath },
        responseType: "blob",
      });

      // PERBAIKAN: Tentukan MIME type yang tepat berdasarkan ekstensi file
      let mimeType = "application/octet-stream";
      if (isPdf) {
        mimeType = "application/pdf";
      } else if (fileName.toLowerCase().match(/\.(jpg|jpeg)$/)) {
        mimeType = "image/jpeg";
      } else if (fileName.toLowerCase().endsWith(".png")) {
        mimeType = "image/png";
      }

      const blob = new Blob([response.data], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);
      setFileToView((prev) => ({ ...prev, url: blobUrl, loading: false }));
    } catch (error) {
      console.error("Error loading file:", error);
      toast.error("Gagal memuat pratinjau file.");
      setFileToView((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  const handleDownloadBukti = async (path, filename) => {
    try {
      const response = await axiosClient.get("/download", {
        params: { path },
        responseType: "blob",
      });
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Gagal mengunduh file.");
      console.error(error);
    }
  };

  const refreshData = () => {
    setExpandedRow(null);
    setNeedsRefresh((p) => !p);
  };

  return (
    <>
      <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden p-4 mt-2 mb-6">
            <h1 className="text-xl font-bold text-slate-700 tracking-tight">
              Persetujuan Penghapusan Aset
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tinjau dan berikan persetujuan untuk penghapusan aset yang
              diajukan.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <TableLoader />
              ) : pengajuanList.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <FileClock className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="font-semibold">Tidak ada pengajuan</h3>
                  <p className="text-sm">
                    Saat ini tidak ada pengajuan penghapusan aset yang menunggu
                    persetujuan.
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-sky-50 border-y border-blue-100">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Nama Aset
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Diajukan Oleh
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Tgl Pengajuan
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Alasan
                      </th>
                      <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pengajuanList.map((pengajuan) => (
                      <Fragment key={pengajuan.id}>
                        <tr
                          className={`hover:bg-slate-50 ${
                            expandedRow === pengajuan.id ? "bg-slate-50" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">
                              {pengajuan.inventaris.nama_barang}
                            </div>
                            <div className="text-xs text-blue-600">
                              {pengajuan.inventaris.kode_inventaris}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-slate-700">
                            {pengajuan.admin.name}
                          </td>
                          <td className="p-4 text-sm text-slate-700">
                            {new Date(pengajuan.created_at).toLocaleDateString(
                              "id-ID",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </td>
                          <td
                            className="p-4 text-sm text-slate-700 max-w-xs truncate"
                            title={pengajuan.alasan_penghapusan}
                          >
                            {pengajuan.alasan_penghapusan}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === pengajuan.id
                                    ? null
                                    : pengajuan.id
                                )
                              }
                              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                                expandedRow === pengajuan.id
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              }`}
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  expandedRow === pengajuan.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                              {expandedRow === pengajuan.id
                                ? "Tutup"
                                : "Tinjau"}
                            </button>
                          </td>
                        </tr>
                        {expandedRow === pengajuan.id && (
                          <tr>
                            <DetailRow
                              pengajuan={pengajuan}
                              onActionSuccess={refreshData}
                              onLihatBukti={handleLihatBukti}
                              confirmFn={confirm}
                            />
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog />

      {fileToView && (
        <Modal
          isOpen={isBuktiModalOpen}
          onClose={() => setIsBuktiModalOpen(false)}
          title="Lihat Berita Acara"
        >
          <div className="mt-4 min-h-[300px] flex items-center justify-center bg-slate-50 rounded-lg">
            {fileToView.loading && (
              <Loader2 className="animate-spin text-slate-400" size={32} />
            )}
            {fileToView.error && (
              <p className="text-rose-500">Gagal memuat pratinjau.</p>
            )}

            {fileToView.url &&
              (fileToView.isPdf ? (
                <embed
                  src={fileToView.url}
                  className="w-full h-[70vh] rounded-lg border"
                  title="PDF Viewer"
                />
              ) : (
                <img
                  src={fileToView.url}
                  alt="Berita Acara"
                  className="max-w-full max-h-[70vh] mx-auto rounded-lg"
                />
              ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                handleDownloadBukti(fileToView.path, fileToView.name)
              }
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
