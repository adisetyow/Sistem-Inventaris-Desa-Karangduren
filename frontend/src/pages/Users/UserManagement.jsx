// src/pages/Users/UserManagement.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users,
  Plus,
  Loader2,
  Edit3,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useConfirmDialog } from "../../hooks/ConfirmDialog";

const RoleBadge = ({ role }) => {
  const roleStyles = {
    "super-admin": "bg-red-100 text-red-800 border-red-200/60",
    admin: "bg-blue-100 text-blue-800 border-blue-200/60",
    viewer: "bg-slate-100 text-slate-800 border-slate-200/60",
  };

  const style =
    roleStyles[role] || "bg-gray-100 text-gray-800 border-gray-200/60";
  const text = role ? role.replace("-", " ") : "N/A";

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold capitalize rounded-full border ${style}`}
    >
      {text}
    </span>
  );
};

//
// ✨ HALAMAN UTAMA MANAJEMEN PENGGUNA
//
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setUsers(data.data.data || data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error("Gagal memuat data pengguna.");
      });
  };

  const handleDelete = async (userId) => {
    const ok = await confirm({
      title: "Hapus Pengguna?",
      message:
        "Tindakan ini tidak dapat dibatalkan. Pengguna akan dihapus secara permanen dari sistem.",
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
    });
    if (!ok) return;

    const promise = axiosClient.delete(`/users/${userId}`);
    toast.promise(promise, {
      loading: "Menghapus pengguna...",
      success: () => {
        fetchUsers();
        return "Pengguna berhasil dihapus.";
      },
      error: "Gagal menghapus pengguna.",
    });
  };
  return (
    <>
      <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
        {/* HEADER HALAMAN */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden mb-6">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-700 tracking-tight">
                  Manajemen Pengguna
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Daftar semua pengguna yang terdaftar di sistem
                </p>
              </div>
            </div>
            <Link
              to="/users/tambah"
              className="px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-blue-200"
            >
              <Plus size={18} />
              Tambah Pengguna
            </Link>
          </div>
        </div>

        {/* KONTAINER TABEL */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max divide-y divide-slate-200/60">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Nama
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200/60">
                  {loading ? (
                    // STATE LOADING
                    <tr>
                      <td colSpan="4" className="text-center p-12">
                        <Loader2
                          className="animate-spin mx-auto text-blue-600"
                          size={32}
                        />
                        <p className="text-slate-500 mt-3">Memuat data...</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    // STATE KOSONG
                    <tr>
                      <td colSpan="4" className="text-center p-12">
                        <AlertTriangle
                          className="mx-auto text-slate-400"
                          size={32}
                        />
                        <p className="text-slate-500 mt-3 font-medium">
                          Tidak Ada Data
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          Belum ada pengguna yang terdaftar.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    // STATE ADA DATA
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleBadge
                            role={
                              user.roles.length > 0 ? user.roles[0].name : null
                            }
                          />
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                          <Link
                            to={`/users/edit/${user.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all duration-150"
                          >
                            <Edit3 size={14} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 shadow-sm transition-all duration-150"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </>
  );
}
