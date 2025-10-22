// file: src/pages/Users/UserForm.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  Loader2,
  User,
  Mail,
  Lock,
  Shield,
  Users,
  Info,
} from "lucide-react";

//
// 🎨 KOMPOSISI UI — MODERN DAN LEMBUT
//
const FormSection = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-lg border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="bg-gradient-to-r from-blue-100/80 via-blue-50 to-indigo-50 px-6 py-5 border-b border-slate-200/60 flex items-center gap-3">
      {Icon && (
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
          <Icon className="text-white" size={20} />
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
        )}
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
      {required && <span className="text-red-500">*</span>}
      {info && (
        <div className="group relative cursor-help">
          <Info size={14} className="text-slate-400" />
          <div className="absolute left-0 top-6 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
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
      } pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white hover:border-slate-300 shadow-sm placeholder:text-slate-400`}
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
      } pr-10 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white hover:border-slate-300 shadow-sm appearance-none cursor-pointer`}
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

//
// ✨ FORM UTAMA
//
export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "admin",
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          const userData = data.data;
          setUser({
            ...userData,
            role: userData.roles.length > 0 ? userData.roles[0].name : "admin",
          });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          toast.error("Gagal memuat data pengguna.");
          navigate("/users");
        });
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    let payload;
    let request;

    if (isEditMode) {
      payload = {
        name: user.name,
        email: user.email,
        role: user.role,
      };
      if (user.password) {
        payload.password = user.password;
        payload.password_confirmation = user.password_confirmation;
      }
      request = axiosClient.put(`/users/${id}`, payload);
    } else {
      payload = user;
      request = axiosClient.post("/users", payload);
    }

    toast
      .promise(request, {
        loading: "Menyimpan data...",
        success: () => {
          setTimeout(() => navigate("/users"), 1000);
          return `Pengguna berhasil ${isEditMode ? "diperbarui" : "dibuat"}!`;
        },
        error: (err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
            return "Data yang Anda masukkan tidak valid.";
          }
          return "Terjadi kesalahan pada server.";
        },
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (loading && isEditMode) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin mx-auto mb-4 text-blue-600"
            size={48}
          />
          <p className="text-slate-600 font-medium">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden mt-2 mb-6">
          <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-700 tracking-tight">
                  {isEditMode ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {isEditMode ? user.name : "Buat akun baru untuk staf"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <FormSection
          title="Informasi Akun"
          subtitle="Data login dan hak akses pengguna"
          icon={User}
        >
          <FormField
            label="Nama Lengkap"
            name="name"
            error={errors?.name}
            required
            fullWidth
          >
            <Input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              required
              icon={User}
            />
          </FormField>

          <FormField
            label="Email"
            name="email"
            error={errors?.email}
            required
            fullWidth
          >
            <Input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              placeholder="email@contoh.com"
              required
              icon={Mail}
            />
          </FormField>

          <FormField
            label="Role Pengguna"
            name="role"
            error={errors?.role}
            required
          >
            <Select
              name="role"
              value={user.role}
              onChange={handleInputChange}
              required
              icon={Shield}
            >
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
              <option value="viewer">Viewer</option>
            </Select>
          </FormField>

          <FormField
            label="Password"
            name="password"
            error={errors?.password}
            required={!isEditMode}
          >
            <Input
              type="password"
              name="password"
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={Lock}
            />
            {isEditMode && (
              <p className="mt-2 text-xs text-slate-500 italic">
                Kosongkan jika tidak ingin mengganti password.
              </p>
            )}
          </FormField>

          <FormField label="Konfirmasi Password" name="password_confirmation">
            <Input
              type="password"
              name="password_confirmation"
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={Lock}
            />
          </FormField>
        </FormSection>

        {/* TOMBOL AKSI */}
        <div className="py-4 bg-white/80 backdrop-blur-sm border-t border-slate-200 sticky bottom-0 flex justify-end items-center gap-3 mt-8">
          <Link
            to="/users"
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all duration-150"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:opacity-60 shadow-md transition-all duration-150"
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
