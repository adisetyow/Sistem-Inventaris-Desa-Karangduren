import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  // State untuk input form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State untuk pesan error
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(null);

    const payload = {
      email: email,
      password: password,
    };

    try {
      // Kirim request ke API
      const response = await axiosClient.post("/login", payload);

      // Jika berhasil, panggil fungsi dari context
      setUser(response.data.data.user);
      setToken(response.data.data.access_token);

      setTimeout(() => {
        // Arahkan ke halaman dashboard
        navigate("/");
      }, 1750);
    } catch (error) {
      // Tangani error dari server
      const response = error.response;
      if (response && response.status === 422) {
        // 422 Unprocessable Entity (Validation Error)
        setErrors(response.data.errors);
      } else {
        // Handle error lain (misal: server down)
        console.error("Login error:", error);
        setErrors({ general: ["Terjadi kesalahan pada server."] });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Sistem Inventaris Desa
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masuk untuk mengelola inventaris desa dengan mudah
          </p>
        </div>

        {/* Tampilkan pesan error general jika ada */}
        {errors?.general && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{errors.general[0]}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Input Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {/* Tampilkan error validasi email jika ada */}
              {errors?.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {/* Tampilkan error validasi password jika ada */}
              {errors?.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Masuk
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
