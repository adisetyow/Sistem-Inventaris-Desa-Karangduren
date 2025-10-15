// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Menambahkan interceptor untuk request
axiosClient.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (atau tempat Anda menyimpannya)
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Lakukan sesuatu jika ada error pada request
    return Promise.reject(error);
  }
);

// Menambahkan interceptor untuk response
axiosClient.interceptors.response.use(
  (response) => {
    // Semua status code 2xx akan masuk ke sini
    return response;
  },
  (error) => {
    // Semua status code di luar 2xx akan masuk ke sini
    // Contoh: menangani error 401 (Unauthenticated)
    if (error.response && error.response.status === 401) {
      // Hapus token yang tidak valid
      localStorage.removeItem("ACCESS_TOKEN");
      // Mungkin redirect ke halaman login
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
