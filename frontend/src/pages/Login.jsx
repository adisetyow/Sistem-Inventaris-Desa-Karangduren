// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/images/LOGO.PNG";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    try {
      const response = await axiosClient.post("/login", { email, password });
      setUser(response.data.data.user);
      setToken(response.data.data.access_token);
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      const response = error.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      } else {
        setErrors({ general: ["Terjadi kesalahan pada server."] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-sky-200 overflow-hidden">
      {/* Ornamen Bokeh Latar */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl top-10 left-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl bottom-10 right-20 animate-pulse"></div>
      </div>

      {/* Kartu Login */}
      <div className="relative z-10 backdrop-blur-2xl bg-white/30 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fadeUp">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 mb-4">
            <img
              src={Logo}
              alt="Logo Desa Karangduren"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 text-center tracking-wide drop-shadow-sm">
            Sistem Inventaris Desa Karangduren
          </h1>
          <p className="text-sm text-slate-600 mt-1 text-center">
            Kelola aset desa secara mudah, aman, dan efisien
          </p>
        </div>

        {/* Error */}
        {errors?.general && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm text-center mb-4">
            {errors.general[0]}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/40 text-slate-800 placeholder-slate-500 border border-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
            />
            {errors?.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/40 text-slate-800 placeholder-slate-500 border border-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
            />
            {errors?.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password[0]}</p>
            )}
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3 font-semibold text-white text-sm rounded-xl overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-700 shadow-md hover:shadow-blue-300/50 transition-all duration-300 group disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Memproses...</span>
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-500 opacity-0 group-hover:opacity-25 blur-xl transition-all duration-700" />
          </button>
        </form>

        {/* Footer Info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2025 Pemerintah Desa Karangduren
        </p>
      </div>
    </div>
  );
}
