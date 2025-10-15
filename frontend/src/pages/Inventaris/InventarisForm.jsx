import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  Loader2,
  Package,
  Calendar,
  MapPin,
  Banknote,
  FileText,
  Info,
} from "lucide-react";

// --- Komponen-komponen UI Lokal untuk Form ---

const FormSection = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-slate-200/60">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <Icon className="text-white" size={20} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {children}
    </div>
  </div>
);

const FormField = ({
  label,
  name,
  error,
  required,
  info,
  children,
  fullWidth,
}) => (
  <div className={`${fullWidth ? "md:col-span-2" : "w-full"}`}>
    <label
      htmlFor={name}
      className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2.5"
    >
      {label}
      {required && <span className="text-red-500 text-base">*</span>}
      {info && (
        <div className="group relative">
          <Info size={14} className="text-slate-400 cursor-help" />
          <div className="absolute left-0 top-6 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            {info}
          </div>
        </div>
      )}
    </label>
    {children}
    {error && (
      <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
        <AlertTriangle size={14} /> {error[0]}
      </p>
    )}
  </div>
);

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={18} />
      </div>
    )}
    <input
      {...props}
      className={`w-full ${
        Icon ? "pl-11" : "px-4"
      } pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white hover:border-slate-300 shadow-sm`}
    />
  </div>
);

const Select = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
        <Icon size={18} />
      </div>
    )}
    <select
      {...props}
      className={`w-full ${
        Icon ? "pl-11" : "px-4"
      } pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white hover:border-slate-300 shadow-sm appearance-none cursor-pointer`}
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white hover:border-slate-300 shadow-sm resize-none"
  />
);

const InfoCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div
      className={`${colorClasses[color]} border-2 rounded-xl p-4 flex items-center gap-3`}
    >
      <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium opacity-80">{title}</p>
        <p className="text-sm font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default function InventarisForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [kategoris, setKategoris] = useState([]);
  const [detailFields, setDetailFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [generatedKode, setGeneratedKode] = useState("");
  const [displayHarga, setDisplayHarga] = useState("");

  const [formData, setFormData] = useState({
    kategori_id: "",
    nama_barang: "",
    kode_inventaris: "",
    jumlah: "",
    kondisi: "Baik",
    lokasi_penempatan: "",
    tanggal_masuk: new Date().toISOString().slice(0, 10),
    sumber_dana: "",
    harga_perolehan: "",
    catatan: "",
  });

  // Efek untuk mengambil data utama
  useEffect(() => {
    axiosClient.get("/kategori").then(({ data }) => {
      setKategoris(data.data?.data || data.data || []);
    });

    if (isEditMode) {
      setLoading(true);
      axiosClient
        .get(`/inventaris/${id}`)
        .then(({ data }) => {
          const inventarisData = data.data;
          setFormData(inventarisData);
          setGeneratedKode(inventarisData.kode_inventaris || "");
          if (inventarisData.harga_perolehan) {
            setDisplayHarga(
              new Intl.NumberFormat("id-ID").format(
                inventarisData.harga_perolehan
              )
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Gagal memuat data inventaris untuk diedit.");
          setLoading(false);
          navigate("/inventaris");
        });
    }
  }, [id, isEditMode, navigate]);

  // Efek untuk detail & kode dinamis
  useEffect(() => {
    const selectedKategoriId = formData.kategori_id;
    if (!selectedKategoriId) {
      setDetailFields([]);
      return;
    }

    axiosClient
      .get(`/get-kategori-detail/${selectedKategoriId}`)
      .then(({ data }) => {
        const fieldsObject = data.data.fields;
        const fieldsArray = Object.keys(fieldsObject).map((key) => ({
          name: key,
          ...fieldsObject[key],
        }));
        setDetailFields(fieldsArray);
      });

    if (!isEditMode) {
      axiosClient
        .get(`/inventaris/generate-kode/${selectedKategoriId}`)
        .then(({ data }) => {
          const kode = data.kode;
          setGeneratedKode(kode);
          setFormData((prev) => ({ ...prev, kode_inventaris: kode }));
        });
    }
  }, [formData.kategori_id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle jumlah dengan keyboard support
  const handleJumlahChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, jumlah: value }));
  };

  const handleHargaChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, harga_perolehan: numericValue }));
    setDisplayHarga(
      numericValue ? new Intl.NumberFormat("id-ID").format(numericValue) : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const promise = isEditMode
      ? axiosClient.put(`/inventaris/${id}`, formData)
      : axiosClient.post("/inventaris", formData);

    toast
      .promise(promise, {
        loading: "Menyimpan data...",
        success: (res) => {
          setTimeout(() => navigate("/inventaris/aktif"), 1000);
          return `Data berhasil ${isEditMode ? "diperbarui" : "disimpan"}!`;
        },
        error: (error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
            return "Data yang Anda masukkan tidak valid. Silakan periksa kembali.";
          }
          return "Terjadi kesalahan pada server.";
        },
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Hitung total harga
  const totalHarga =
    formData.jumlah && formData.harga_perolehan
      ? parseInt(formData.jumlah) * parseInt(formData.harga_perolehan)
      : 0;

  if (loading && isEditMode) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4 text-blue-600"
            size={48}
          />
          <p className="text-slate-600 font-medium">
            Memuat data inventaris...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        {/* Header dengan Gradient Background */}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden mt-2 mb-6">
          <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Package className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {isEditMode ? "Edit Inventaris" : "Tambah Inventaris Baru"}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {isEditMode
                    ? formData.nama_barang
                    : "Lengkapi formulir untuk menambah aset baru"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section - Informasi Utama */}
        <FormSection
          title="Informasi Utama Aset"
          subtitle="Data dasar inventaris yang wajib diisi"
          icon={Package}
        >
          {/* Kategori */}
          <FormField
            label="Kategori Aset"
            name="kategori_id"
            error={errors?.kategori_id}
            required
            info="Pilih kategori yang sesuai dengan jenis aset"
          >
            <Select
              name="kategori_id"
              value={formData.kategori_id}
              onChange={handleChange}
              required
              disabled={isEditMode}
              icon={Package}
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoris.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kategori}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Kode Inventaris */}
          <FormField
            label="Kode Inventaris"
            name="kode_inventaris"
            info="Kode unik yang dibuat otomatis oleh sistem"
          >
            <div className="w-full px-4 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-700 flex items-center justify-between shadow-sm">
              <span>
                {generatedKode || "Pilih kategori untuk membuat kode"}
              </span>
              {generatedKode && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </FormField>

          {/* Nama Barang */}
          <FormField
            label="Nama Barang"
            name="nama_barang"
            error={errors?.nama_barang}
            required
            info="Masukkan nama lengkap aset inventaris"
          >
            <Input
              type="text"
              name="nama_barang"
              value={formData.nama_barang || ""}
              onChange={handleChange}
              required
              placeholder="Contoh: Laptop Dell Latitude 5420"
              icon={FileText}
            />
          </FormField>

          {/* Jumlah - Fixed untuk keyboard input */}
          <FormField
            label="Jumlah Unit"
            name="jumlah"
            error={errors?.jumlah}
            required
            info="Masukkan jumlah unit aset yang ditambahkan"
          >
            <Input
              type="text"
              inputMode="numeric"
              name="jumlah"
              value={formData.jumlah || ""}
              onChange={handleJumlahChange}
              required
              placeholder="Contoh: 5"
              icon={Package}
            />
          </FormField>

          {/* Kondisi */}
          <FormField
            label="Kondisi Aset"
            name="kondisi"
            error={errors?.kondisi}
            required
            info="Pilih kondisi fisik aset saat ini"
          >
            <Select
              name="kondisi"
              value={formData.kondisi || "Baik"}
              onChange={handleChange}
              required
            >
              <option value="Baik">Baik </option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </Select>
          </FormField>

          {/* Lokasi Penempatan */}
          <FormField
            label="Lokasi Penempatan"
            name="lokasi_penempatan"
            error={errors?.lokasi_penempatan}
            required
            info="Sebutkan lokasi spesifik penempatan aset"
          >
            <Input
              type="text"
              name="lokasi_penempatan"
              value={formData.lokasi_penempatan || ""}
              onChange={handleChange}
              required
              placeholder="Contoh: Ruang IT Lantai 2"
              icon={MapPin}
            />
          </FormField>
        </FormSection>

        {/* Form Section - Informasi Keuangan */}
        <FormSection
          title="Informasi Keuangan & Akuisisi"
          subtitle="Data terkait perolehan dan nilai aset"
          icon={Banknote}
        >
          {/* Tanggal Masuk */}
          <FormField
            label="Tanggal Masuk"
            name="tanggal_masuk"
            error={errors?.tanggal_masuk}
            required
            info="Tanggal aset diterima dan dicatat"
          >
            <Input
              type="date"
              name="tanggal_masuk"
              value={
                formData.tanggal_masuk
                  ? formData.tanggal_masuk.slice(0, 10)
                  : ""
              }
              onChange={handleChange}
              required
              icon={Calendar}
            />
          </FormField>

          {/* Sumber Dana */}
          <FormField
            label="Sumber Dana"
            name="sumber_dana"
            error={errors?.sumber_dana}
            required
            info="Asal pendanaan untuk pembelian aset"
          >
            <Input
              type="text"
              name="sumber_dana"
              value={formData.sumber_dana || ""}
              onChange={handleChange}
              required
              placeholder="Contoh: APBN, Hibah, Dana BOS"
              icon={Banknote}
            />
          </FormField>

          {/* Harga Satuan */}
          <FormField
            label="Harga Satuan"
            name="harga_perolehan"
            error={errors?.harga_perolehan}
            required
            info="Harga per unit dalam Rupiah"
          >
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                Rp
              </span>
              <Input
                type="text"
                name="harga_perolehan_display"
                value={displayHarga}
                onChange={handleHargaChange}
                placeholder="15.000.000"
                required
                className="pl-12"
              />
            </div>
          </FormField>

          {/* Total Harga - Info Box */}
          <FormField
            label="Total Nilai Aset"
            name="total_harga"
            info="Kalkulasi otomatis dari jumlah × harga satuan"
          >
            <div className="w-full px-4 py-3 bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-sm font-medium text-slate-600">
                Total Investasi
              </span>
              <span className="text-lg font-bold text-sky-700">
                Rp {new Intl.NumberFormat("id-ID").format(totalHarga)}
              </span>
            </div>
          </FormField>

          {/* Catatan */}
          <FormField
            label="Catatan Tambahan"
            name="catatan"
            fullWidth
            info="Informasi tambahan atau keterangan khusus tentang aset"
          >
            <Textarea
              name="catatan"
              value={formData.catatan || ""}
              onChange={handleChange}
              rows="4"
              placeholder="Tambahkan catatan atau keterangan khusus mengenai aset ini..."
            />
          </FormField>
        </FormSection>

        {/* Form Section - Detail Spesifik */}
        {formData.kategori_id && detailFields.length > 0 && (
          <FormSection
            title="Detail Spesifikasi Teknis"
            subtitle="Informasi detail sesuai kategori aset"
            icon={FileText}
          >
            {detailFields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                error={errors && errors[field.name]}
                required={field.required}
                info={`Masukkan ${field.label.toLowerCase()} aset`}
              >
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  step={field.step || undefined}
                  placeholder={`Masukkan ${field.label.toLowerCase()}`}
                />
              </FormField>
            ))}
          </FormSection>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Info className="text-white" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Informasi Penting</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pastikan semua data yang diisi sudah benar dan lengkap. Field yang
              ditandai dengan tanda bintang (
              <span className="text-red-500">*</span>) wajib diisi. Data
              inventaris yang tersimpan akan digunakan untuk laporan dan
              tracking aset.
            </p>
          </div>
        </div>

        <div className="py-4 bg-white/80 backdrop-blur-s border-t border-slate-200 sticky bottom-0 flex justify-end items-center gap-3 mt-8">
          <Link
            to={-1}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Check size={18} />
            )}
            Simpan Data
          </button>
        </div>
      </form>
    </div>
  );
}
