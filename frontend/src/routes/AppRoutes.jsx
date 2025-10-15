import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "../components/layout/DefaultLayout";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import InventarisAktif from "../pages/Inventaris/InventarisAktif";
import InventarisTidakAktif from "../pages/Inventaris/InventarisTidakAktif";
import InventarisPenghapusan from "../pages/Inventaris/InventarisPenghapusan";
import RiwayatPenghapusan from "../pages/Inventaris/RiwayatPenghapusan";
import InventarisForm from "../pages/Inventaris/InventarisForm";
import InventarisDetail from "../pages/Inventaris/InventarisDetail";
import UserManagement from "../pages/Users/UserManagement";
import UserForm from "../pages/Users/UserForm";
import PersetujuanHapus from "../pages/Pengelolaan/PersetujuanHapus";
import LogAktivitas from "../pages/Pengelolaan/LogAktivitas";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DefaultLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/inventaris/aktif" element={<InventarisAktif />} />
        <Route
          path="/inventaris/tidak-aktif"
          element={<InventarisTidakAktif />}
        />
        <Route path="/pengelolaan/persetujuan" element={<PersetujuanHapus />} />
        <Route
          path="/inventaris/penghapusan/:id"
          element={<InventarisPenghapusan />}
        />
        <Route
          path="/inventaris/riwayat-penghapusan"
          element={<RiwayatPenghapusan />}
        />
        <Route
          path="/inventaris"
          element={<Navigate to="/inventaris/aktif" replace />}
        />
        <Route path="inventaris/tambah" element={<InventarisForm />} />
        <Route path="inventaris/edit/:id" element={<InventarisForm />} />
        <Route path="inventaris/:id" element={<InventarisDetail />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/tambah" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} />

        <Route path="/pengelolaan/log-aktivitas" element={<LogAktivitas />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
