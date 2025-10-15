// frontend/src/components/PrivateRoute.jsx - VERSI PERBAIKAN

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Komponen ini sekarang menerima 'children' sebagai prop
export default function PrivateRoute({ children }) {
  const { token } = useAuth();

  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Jika ada token, render komponen anak yang dibungkusnya (yaitu DefaultLayout)
  return children;
}
