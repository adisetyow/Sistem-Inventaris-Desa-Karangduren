// file: src/pages/Inventaris/InventarisPenghapusan.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Upload,
  Send,
  AlertTriangle,
  Trash2,
  Loader2,
  Info,
  FileText,
} from "lucide-react";

// --- Komponen UI Lokal ---
const FormField = ({ label, name, error, children }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-700 mb-2"
    >
      {label}
    </label>
    {children}
    {error && (
      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
        <AlertTriangle size={14} /> {error[0]}
      </p>
    )}
  </div>
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm bg-white hover:border-slate-300 shadow-sm resize-none"
  />
);

export default function InventarisPenghapusan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventaris, setInventaris] = useState(null);
  const [alasan, setAlasan] = useState("");
  const [beritaAcara, setBeritaAcara] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axiosClient.get(`/inventaris/${id}`).then(({ data }) => {
      setInventaris(data.data);
    });
  }, [id]);

  const handleFileChange = (e) => {
    setBeritaAcara(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData();
    formData.append("inventaris_id", id);
    formData.append("alasan_penghapusan", alasan);
    if (beritaAcara) {
      formData.append("berita_acara", beritaAcara);
    }

    const promise = axiosClient.post("/penghapusan/ajukan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.promise(promise, {
      loading: "Mengirim pengajuan...",
      success: () => {
        setTimeout(() => navigate("/inventaris/aktif"), 1500);
        return "Pengajuan penghapusan berhasil dikirim.";
      },
      error: (error) => {
        const response = error.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
          return "Data yang Anda masukkan tidak valid.";
        }
        return "Terjadi kesalahan pada server.";
      },
    });

    promise.finally(() => setIsSubmitting(false));
  };

  if (!inventaris) return <p className="text-center mt-10">Memuat data...</p>;

  return (
    <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* Header Halaman */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden mt-2 mb-6">
          <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Trash2 className="text-rose-500" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-700 tracking-tight">
                  Ajukan Penghapusan Aset
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {inventaris.nama_barang} ({inventaris.kode_inventaris})
                </p>
              </div>
            </div>

            <Link
              to={-1}
              className="px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
          </div>
        </div>

        {/* Kartu Form Utama */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* === Bagian Alasan Penghapusan === */}
            <div>
              <div className="bg-sky-50 border border-sky-100 rounded-lg px-4 py-2 mb-4">
                <h3 className="text-base font-semibold text-sky-700 tracking-wide">
                  Alasan Penghapusan (Wajib)
                </h3>
              </div>
              <FormField
                label=""
                name="alasan_penghapusan"
                error={errors.alasan_penghapusan}
              >
                <Textarea
                  id="alasan_penghapusan"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  rows="5"
                  placeholder="Jelaskan secara rinci mengapa aset ini perlu dihapus. Contoh: Rusak berat, biaya perbaikan tidak sebanding, hilang, dll."
                />
              </FormField>
            </div>

            {/* === Bagian Upload Berita Acara === */}
            <div>
              <div className="bg-sky-50 border border-sky-100 rounded-lg px-4 py-2 mb-4">
                <h3 className="text-base font-semibold text-sky-700 tracking-wide">
                  Upload Berita Acara (Wajib)
                </h3>
              </div>
              <FormField
                label=""
                name="berita_acara"
                error={errors.berita_acara}
              >
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 hover:border-blue-400 transition-colors">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-transparent rounded-lg font-medium text-blue-600 hover:text-blue-700"
                      >
                        <span>Pilih file untuk diupload</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      {beritaAcara
                        ? beritaAcara.name
                        : "PDF, JPG, PNG (Maks. 2MB)"}
                    </p>
                  </div>
                </div>
              </FormField>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-white" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Perhatian</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              Setelah pengajuan ini dikirim, status aset akan diubah menjadi
              "Menunggu Persetujuan" dan tidak dapat diubah hingga ada keputusan
              dari Superadmin. Pastikan semua informasi sudah benar.
            </p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-2 disabled:bg-rose-300 disabled:cursor-not-allowed shadow-md transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            Kirim Pengajuan
          </button>
        </div>
      </form>
    </div>
  );
}
