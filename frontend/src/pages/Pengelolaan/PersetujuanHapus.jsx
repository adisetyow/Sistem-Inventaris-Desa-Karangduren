// file: src/pages/Pengelolaan/PersetujuanHapus.jsx

import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import TableLoader from "../../components/common/TableLoader";
import Modal from "../../components/common/Modal";
import { FileClock, Eye, Download, Check, X } from "lucide-react";

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

export default function PersetujuanHapus() {
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const [isTinjauModalOpen, setIsTinjauModalOpen] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [catatanPenolakan, setCatatanPenolakan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isBuktiModalOpen, setIsBuktiModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState(null);

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

  const handleTinjau = (pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setCatatanPenolakan("");
    setIsTinjauModalOpen(true);
  };

  const handleLihatBukti = (filePath) => {
    if (!filePath) return;
    const fileName = filePath.split("/").pop();
    const fileUrl = `${import.meta.env.VITE_API_URL}/storage/${filePath}`;
    setFileToView({ url: fileUrl, name: fileName, path: filePath });
    setIsBuktiModalOpen(true);
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
      alert("Gagal mengunduh file.");
      console.error(error);
    }
  };

  const handleSetujui = async () => {
    if (
      !selectedPengajuan ||
      !window.confirm(
        "Apakah Anda yakin ingin MENYETUJUI penghapusan aset ini?"
      )
    )
      return;
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post(
        `/penghapusan/${selectedPengajuan.id}/setujui`
      );
      alert(response.data.message);
      setIsTinjauModalOpen(false);
      setNeedsRefresh((prev) => !prev);
    } catch (error) {
      alert("Gagal memproses persetujuan.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTolak = async () => {
    if (!selectedPengajuan || !catatanPenolakan) {
      alert("Catatan penolakan wajib diisi.");
      return;
    }
    if (!window.confirm("Apakah Anda yakin ingin MENOLAK pengajuan ini?"))
      return;
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post(
        `/penghapusan/${selectedPengajuan.id}/tolak`,
        {
          catatan_penolakan: catatanPenolakan,
        }
      );
      alert(response.data.message);
      setIsTinjauModalOpen(false);
      setNeedsRefresh((prev) => !prev);
    } catch (error) {
      alert("Gagal memproses penolakan.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-slate-50 min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
            <h1 className="text-xl font-bold text-slate-800">
              Persetujuan Penghapusan Aset
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tinjau dan berikan persetujuan untuk penghapusan aset yang
              diajukan.
            </p>
          </div>

          {/* Tabel Daftar Pengajuan */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                  <thead className="bg-slate-50">
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
                      <tr key={pengajuan.id} className="hover:bg-slate-50/70">
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
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
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
                            onClick={() => handleTinjau(pengajuan)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" /> Tinjau
                          </button>
                        </td>
                      </tr>
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

      {selectedPengajuan && (
        <Modal
          isOpen={isTinjauModalOpen}
          onClose={() => setIsTinjauModalOpen(false)}
          title="Tinjau Pengajuan Penghapusan"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500">Aset</h4>
              <p className="font-semibold text-slate-800">
                {selectedPengajuan.inventaris.nama_barang}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500">
                Diajukan oleh
              </h4>
              <p className="font-semibold text-slate-800">
                {selectedPengajuan.admin.name}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500">Alasan</h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border">
                {selectedPengajuan.alasan_penghapusan}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-1">
                Berita Acara
              </h4>
              <button
                onClick={() =>
                  handleLihatBukti(selectedPengajuan.berita_acara_path)
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
              >
                <Eye className="w-4 h-4" /> Lihat Dokumen
              </button>
            </div>

            <div className="border-t pt-4 space-y-2">
              <label
                htmlFor="catatan_penolakan"
                className="text-sm font-medium text-slate-700"
              >
                Catatan Penolakan (isi jika menolak)
              </label>
              <textarea
                id="catatan_penolakan"
                value={catatanPenolakan}
                onChange={(e) => setCatatanPenolakan(e.target.value)}
                rows="3"
                className="w-full text-sm border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleTolak}
              disabled={isSubmitting || !catatanPenolakan}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:bg-rose-300 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" /> Tolak
            </button>
            <button
              onClick={handleSetujui}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> Setujui
            </button>
          </div>
        </Modal>
      )}
      {fileToView && (
        <Modal
          isOpen={isBuktiModalOpen}
          onClose={() => setIsBuktiModalOpen(false)}
          title="Lihat Berita Acara"
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
                alt="Berita Acara"
                className="max-w-full max-h-[70vh] mx-auto rounded-lg"
              />
            )}
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
