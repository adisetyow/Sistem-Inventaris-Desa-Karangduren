import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/common/Modal";
import {
  ArrowLeft,
  Edit,
  Power,
  Trash2,
  FileText,
  Info,
  FileClock,
  MessageSquareWarning,
  Paperclip,
  DollarSign,
  Tag,
  ShieldCheck,
  Download,
  Upload,
  Eye,
} from "lucide-react";

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

const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-2.5 py-1 text-xs font-semibold rounded-full inline-block";
  let colorClasses = "";
  switch (status) {
    case "aktif":
      colorClasses = "bg-emerald-100 text-emerald-800";
      break;
    case "tidak_aktif":
      colorClasses = "bg-amber-100 text-amber-800";
      break;
    case "menunggu_persetujuan_penghapusan":
      colorClasses = "bg-rose-100 text-rose-800";
      break;
    default:
      colorClasses = "bg-slate-100 text-slate-800";
  }
  const formattedStatus = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <span className={`${baseClasses} ${colorClasses}`}>{formattedStatus}</span>
  );
};

const DetailItem = ({ label, value, children }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-slate-100 last:border-b-0">
    <dt className="text-sm font-medium text-slate-500">{label}</dt>
    <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-medium">
      {children || value || "-"}
    </dd>
  </div>
);

const HighlightItem = ({ icon, label, children }) => (
  <div className="flex flex-col gap-1">
    <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
      {icon}
      {label}
    </div>
    <div className="text-lg font-bold text-slate-800">{children}</div>
  </div>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
    <div className="p-4 border-b border-slate-200">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          {title}
        </h3>
      </div>
    </div>
    <div className="p-4">
      <dl>{children}</dl>
    </div>
  </div>
);

const TruncatedText = ({ text, limit = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= limit) {
    return (
      <p className="text-sm text-slate-600 whitespace-pre-line">
        {text || "-"}
      </p>
    );
  }

  return (
    <div>
      <p
        className={`text-sm text-slate-600 whitespace-pre-line break-words ${
          !isExpanded && "line-clamp-2"
        }`}
      >
        {text}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 hover:underline font-semibold mt-1"
      >
        {isExpanded ? "Sembunyikan" : "Selengkapnya"}
      </button>
    </div>
  );
};

// KAMUS UNTUK SEMUA FIELD DETAIL SPESIFIK
const specificFieldMappings = {
  merk: "Merk",
  bahan: "Bahan",
  tahun_perolehan: "Tahun Perolehan",
  warna: "Warna",
  nomor_inventaris_internal: "Nomor Inventaris Internal",
  frekuensi: "Frekuensi",
  serial_number: "Serial Number",
  jenis_peralatan: "Jenis Peralatan",
  nama_bangunan: "Nama Bangunan",
  alamat: "Alamat",
  luas: "Luas (m²)",
  tahun_bangun: "Tahun Bangun",
  status_sertifikat: "Status Sertifikat",
  nomor_sertifikat: "Nomor Sertifikat",
  kondisi_fisik: "Kondisi Fisik",
  tahun_diperoleh: "Tahun Diperoleh",
  penggunaan_saat_ini: "Penggunaan Saat Ini",
  jenis_kendaraan: "Jenis Kendaraan",
  merk_tipe: "Merk/Tipe",
  nomor_polisi: "Nomor Polisi",
  nomor_rangka: "Nomor Rangka",
  nomor_mesin: "Nomor Mesin",
  nama_alat: "Nama Alat",
  jenis_infrastruktur: "Jenis Infrastruktur",
  lokasi: "Lokasi",
  panjang: "Panjang (m)",
  lebar: "Lebar (m)",
  status_kepemilikan: "Status Kepemilikan",
  jenis_alat: "Jenis Alat",
  lokasi_penyimpanan: "Lokasi Penyimpanan",
  nama_aset: "Nama Aset",
  deskripsi: "Deskripsi",
};

const InfoNonaktif = ({ log, onLihatBukti }) => {
  const [isAlasanExpanded, setIsAlasanExpanded] = useState(false);

  if (!log) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm p-5 mb-6 overflow-hidden">
      {/* Flex container utama */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-y-4 lg:gap-x-6">
        {/* Kiri: Info waktu & bukti */}
        <div className="flex flex-col gap-4 flex-shrink-0 w-full lg:w-1/3">
          {/* Waktu Dinonaktifkan */}
          <div className="flex items-start gap-3">
            <FileClock className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-700">
                Waktu Dinonaktifkan
              </h4>
              <p className="text-sm text-slate-600 break-words">
                {new Date(log.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Bukti Pendukung */}
          <div className="flex items-start gap-3">
            <Paperclip className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-700">Bukti Pendukung</h4>
              {log.file_pendukung_path ? (
                <button
                  onClick={() => onLihatBukti(log.file_pendukung_path)}
                  className="text-sm text-blue-600 hover:underline font-semibold text-left break-words"
                >
                  Lihat Bukti
                </button>
              ) : (
                <p className="text-sm text-slate-500 italic">Tidak ada</p>
              )}
            </div>
          </div>
        </div>

        {/* Garis pemisah */}
        <div className="hidden lg:block w-px bg-amber-200 self-stretch"></div>
        <div className="block lg:hidden h-px bg-amber-200 w-full"></div>

        {/* Kanan: Alasan */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <MessageSquareWarning className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-700">
              Alasan Penonaktifan
            </h4>
            <p
              className={`text-sm text-slate-600 whitespace-pre-line break-words ${
                !isAlasanExpanded && "line-clamp-2"
              }`}
            >
              {log.alasan || "-"}
            </p>
            {(log.alasan?.length || 0) > 100 && (
              <button
                onClick={() => setIsAlasanExpanded(!isAlasanExpanded)}
                className="text-sm text-blue-600 hover:underline font-semibold mt-1"
              >
                {isAlasanExpanded ? "Sembunyikan" : "Selengkapnya"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

//STATE
export default function InventarisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inventaris, setInventaris] = useState(null);
  const [loading, setLoading] = useState(true);
  const [specificDetails, setSpecificDetails] = useState([]);
  // Cek hak akses
  const canPerformActions = user?.roles?.some(
    (role) => role.name === "admin" || role.name === "super-admin"
  );

  //State Modal Konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [filePendukung, setFilePendukung] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //State Modal Bukti
  const [isBuktiModalOpen, setIsBuktiModalOpen] = useState(false);
  const [selectedBukti, setSelectedBukti] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/inventaris/${id}`)
      .then(({ data }) => {
        const inventarisData = data.data;
        setInventaris(inventarisData);

        const details = Object.keys(specificFieldMappings)
          .filter(
            (key) =>
              inventarisData[key] !== null &&
              inventarisData[key] !== undefined &&
              inventarisData[key] !== ""
          )
          .map((key) => ({
            label: specificFieldMappings[key],
            value: inventarisData[key],
          }));
        setSpecificDetails(details);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        alert("Gagal memuat detail inventaris.");
      });
  }, [id]);

  const handleLihatBukti = (filePath) => {
    if (!filePath) return;
    const fileName = filePath.split("/").pop();
    const fileUrl = `${import.meta.env.VITE_API_URL}/storage/${filePath}`;
    setSelectedBukti({ url: fileUrl, name: fileName, path: filePath });
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

  const handleNonaktifkan = async () => {
    if (!alasan) {
      alert("Alasan tidak boleh kosong.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("alasan", alasan);
    if (filePendukung) {
      formData.append("file_pendukung", filePendukung);
    }

    try {
      const response = await axiosClient.post(
        `/inventaris/${id}/set-tidak-aktif`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(response.data.message);
      setIsModalOpen(false);
      navigate("/inventaris/aktif");
    } catch (error) {
      alert("Gagal menonaktifkan data.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAktifkan = () => {
    if (
      !window.confirm("Apakah Anda yakin ingin mengaktifkan kembali aset ini?")
    )
      return;

    axiosClient
      .post(`/inventaris/${id}/set-aktif`, {
        alasan: "Aset diaktifkan kembali",
      })
      .then((response) => {
        alert(response.data.message);
        navigate("/inventaris/tidak-aktif"); // Redirect ke halaman yang sesuai
      })
      .catch((error) => {
        alert("Gagal mengaktifkan data.");
        console.error(error);
      });
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!inventaris) {
    return <p>Data inventaris tidak ditemukan.</p>;
  }
  return (
    <>
      <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
        <div className="max-w-4xl mx-auto">
          {/* --- KARTU HEADER (NAVIGASI & EDIT) --- */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
            <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {inventaris.nama_barang}
                </h1>
                <p className="text-sm font-semibold text-blue-600 mt-1">
                  {inventaris.kode_inventaris}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Link
                  to={-1}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>
                {canPerformActions &&
                  !inventaris.deleted_at &&
                  inventaris.status === "aktif" && (
                    <Link
                      to={`/inventaris/edit/${id}`}
                      className="px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-blue-200"
                    >
                      <Edit className="w-4 h-4" /> Edit Data
                    </Link>
                  )}
              </div>
            </div>
          </div>

          {/* --- PANEL SOROTAN (HIGHLIGHT) --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <HighlightItem
              icon={<ShieldCheck className="w-4 h-4 text-slate-500" />}
              label="Status"
            >
              <StatusBadge
                status={inventaris.deleted_at ? "dihapus" : inventaris.status}
              />
            </HighlightItem>
            <HighlightItem
              icon={<Info className="w-4 h-4 text-slate-500" />}
              label="Kondisi"
            >
              <KondisiBadge kondisi={inventaris.kondisi} />
            </HighlightItem>
            <HighlightItem
              icon={<Tag className="w-4 h-4 text-slate-500" />}
              label="Kategori"
            >
              {inventaris.kategori?.nama_kategori}
            </HighlightItem>
            <HighlightItem
              icon={<DollarSign className="w-4 h-4 text-slate-500" />}
              label="Total Nilai"
            >
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(inventaris.total_harga)}
            </HighlightItem>
          </div>

          {/* --- KARTU RIWAYAT PENGHAPUSAN --- */}
          {inventaris.deleted_at && inventaris.riwayat_penghapusan && (
            <SectionCard
              title="Riwayat Penghapusan Aset"
              icon={<Trash2 className="w-5 h-5 text-rose-500" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                <div>
                  <DetailItem
                    label="Tanggal Dihapus"
                    value={new Date(inventaris.deleted_at).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  />
                  <DetailItem label="Diajukan Oleh">
                    {inventaris.riwayat_penghapusan.admin ? (
                      <span>
                        {inventaris.riwayat_penghapusan.admin.name}
                        <span className="text-slate-500 italic">
                          {" ("}
                          {inventaris.riwayat_penghapusan.admin.roles[0]?.name.replace(
                            "-",
                            " "
                          )}
                          )
                        </span>
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </DetailItem>
                  <DetailItem label="Disetujui Oleh">
                    {inventaris.riwayat_penghapusan.superadmin ? (
                      <span>
                        {inventaris.riwayat_penghapusan.superadmin.name}
                        <span className="text-slate-500 italic">
                          {" ("}
                          {inventaris.riwayat_penghapusan.superadmin.roles[0]?.name.replace(
                            "-",
                            " "
                          )}
                          )
                        </span>
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </DetailItem>
                </div>
                <div>
                  <DetailItem label="Alasan Penghapusan">
                    <TruncatedText
                      text={inventaris.riwayat_penghapusan.alasan_penghapusan}
                    />
                  </DetailItem>
                  <DetailItem label="Berita Acara">
                    <button
                      onClick={() =>
                        handleLihatBukti(
                          inventaris.riwayat_penghapusan.berita_acara_path
                        )
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      <Eye className="w-4 h-4" /> Lihat Dokumen
                    </button>
                  </DetailItem>
                </div>
              </div>
            </SectionCard>
          )}

          {/* --- KARTU INFO NONAKTIF --- */}
          {inventaris?.status === "tidak_aktif" &&
            inventaris.log_status_terakhir && (
              <InfoNonaktif
                log={inventaris.log_status_terakhir}
                onLihatBukti={handleLihatBukti}
              />
            )}

          {/* --- KARTU INFORMASI UMUM & FINANSIAL --- */}
          <SectionCard
            title="Informasi Umum & Finansial"
            icon={<Info className="w-5 h-5 text-slate-500" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
              <div>
                <DetailItem label="Jumlah" value={inventaris.jumlah} />
                <DetailItem
                  label="Lokasi Penempatan"
                  value={inventaris.lokasi_penempatan}
                />
                <DetailItem
                  label="Tanggal Masuk"
                  value={new Date(inventaris.tanggal_masuk).toLocaleDateString(
                    "id-ID",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                />
              </div>
              <div>
                <DetailItem
                  label="Sumber Dana"
                  value={inventaris.sumber_dana}
                />
                <DetailItem
                  label="Harga Satuan"
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(inventaris.harga_perolehan)}
                />
                <DetailItem label="Catatan" value={inventaris.catatan} />
              </div>
            </div>
          </SectionCard>

          {/* --- KARTU DETAIL SPESIFIK ASET --- */}
          {specificDetails.length > 0 && (
            <SectionCard
              title="Detail Spesifik Aset"
              icon={<FileText className="w-5 h-5 text-slate-500" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                {specificDetails.map((detail) => (
                  <DetailItem
                    key={detail.label}
                    label={detail.label}
                    value={detail.value}
                  />
                ))}
              </div>
            </SectionCard>
          )}

          {/* --- ZONA AKSI (DANGER ZONE) --- */}
          {canPerformActions &&
            !inventaris.deleted_at &&
            (inventaris.status === "aktif" ||
              inventaris.status === "tidak_aktif") && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-8 p-5">
                <h3 className="text-base font-bold text-slate-800 tracking-tight mb-4">
                  Aksi Lanjutan
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {inventaris.status === "aktif" && (
                    <>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-3 py-2 text-sm font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-amber-200"
                      >
                        <Power className="w-4 h-4" /> Nonaktifkan
                      </button>
                      <Link
                        to={`/inventaris/penghapusan/${id}`}
                        className="px-3 py-2 text-sm font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-rose-200"
                      >
                        <Trash2 className="w-4 h-4" /> Ajukan Hapus
                      </Link>
                    </>
                  )}
                  {inventaris.status === "tidak_aktif" && (
                    <button
                      onClick={handleAktifkan}
                      className="px-3 py-2 text-sm font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-emerald-200"
                    >
                      <Power className="w-4 h-4" /> Aktifkan Kembali
                    </button>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* --- MODAL UNTUK KONFIRMASI NONAKTIFKAN --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Konfirmasi Nonaktifkan Aset"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Anda akan menonaktifkan aset{" "}
            <span className="font-semibold text-slate-800">
              {inventaris?.nama_barang}
            </span>
            . Harap berikan alasan yang jelas.
          </p>
          <div>
            <label
              htmlFor="alasan-modal"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Alasan (Wajib)
            </label>
            <textarea
              id="alasan-modal"
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan alasan penonaktifan..."
            />
          </div>
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Bukti Pendukung (Opsional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-lg bg-slate-50 hover:border-blue-300">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-10 w-10 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700"
                  >
                    <span>Pilih file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setFilePendukung(e.target.files[0])}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  {filePendukung
                    ? filePendukung.name
                    : "JPG, PNG, PDF (Maks. 2MB)"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleNonaktifkan}
              disabled={isSubmitting || alasan.trim() === ""}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan..." : "Konfirmasi"}
            </button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL UNTUK MELIHAT BUKTI (DARI RIWAYAT HAPUS ATAU INFO NONAKTIF) --- */}
      <Modal
        isOpen={isBuktiModalOpen}
        onClose={() => setIsBuktiModalOpen(false)}
        title="Lihat Bukti Pendukung"
      >
        {selectedBukti && (
          <>
            <div className="mt-4">
              {selectedBukti.url.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={selectedBukti.url}
                  className="w-full h-[70vh] rounded-lg border"
                  title="PDF Viewer"
                ></iframe>
              ) : (
                <img
                  src={selectedBukti.url}
                  alt="Bukti Pendukung"
                  className="max-w-full max-h-[70vh] mx-auto rounded-lg"
                />
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  handleDownloadBukti(selectedBukti.path, selectedBukti.name)
                }
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
