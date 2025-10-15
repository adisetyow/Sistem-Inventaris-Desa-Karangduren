// file: src/pages/Inventaris/InventarisPenghapusan.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { ArrowLeft, Upload, Send } from "lucide-react";

export default function InventarisPenghapusan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventaris, setInventaris] = useState(null);
  const [alasan, setAlasan] = useState("");
  const [beritaAcara, setBeritaAcara] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Ambil data dasar inventaris untuk ditampilkan
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

    try {
      await axiosClient.post("/penghapusan/ajukan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Pengajuan penghapusan berhasil dikirim.");
      navigate("/inventaris/aktif");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!inventaris) return <p>Memuat...</p>;

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-5">
          <Link
            to={`/inventaris/${id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Batal dan Kembali ke Detail
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6"
        >
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Formulir Pengajuan Penghapusan Aset
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Aset:{" "}
              <span className="font-semibold">{inventaris.nama_barang}</span> (
              {inventaris.kode_inventaris})
            </p>
          </div>

          <div>
            <label
              htmlFor="alasan"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Alasan Penghapusan
            </label>
            <textarea
              id="alasan"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Rusak berat dan biaya perbaikan melebihi nilai aset."
            />
            {errors.alasan_penghapusan && (
              <p className="text-sm text-red-600 mt-1">
                {errors.alasan_penghapusan[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Upload Berita Acara (PDF, JPG, PNG)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Pilih file untuk diupload</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  {beritaAcara ? beritaAcara.name : "Maks. 2MB"}
                </p>
              </div>
            </div>
            {errors.berita_acara && (
              <p className="text-sm text-red-600 mt-1">
                {errors.berita_acara[0]}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                "Mengirim..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> Kirim Pengajuan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
