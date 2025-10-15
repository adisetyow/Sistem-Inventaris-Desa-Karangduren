// file: src/pages/Pengelolaan/LogAktivitas.jsx

import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import TableLoader from "../../components/common/TableLoader";
import { Search } from "lucide-react";
import { User, UserCog, Eye } from "lucide-react";

const RoleAvatar = ({ role }) => {
  const roleConfig = {
    "super-admin": {
      icon: <UserCog className="w-4 h-4 text-white" />,
      color: "bg-rose-500",
    },
    admin: {
      icon: <User className="w-4 h-4 text-white" />,
      color: "bg-blue-500",
    },
    viewer: {
      icon: <Eye className="w-4 h-4 text-white" />,
      color: "bg-emerald-500",
    },
    default: {
      icon: <User className="w-4 h-4 text-white" />,
      color: "bg-slate-400",
    },
  };

  const config = roleConfig[role] || roleConfig.default;

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}
    >
      {config.icon}
    </div>
  );
};

const ActivityBadge = ({ event }) => {
  const eventConfig = {
    created: { text: "Tambah", color: "bg-emerald-100 text-emerald-800" },
    updated: { text: "Ubah", color: "bg-blue-100 text-blue-800" },
    deleted: { text: "Hapus", color: "bg-rose-100 text-rose-800" },
  };

  // Untuk log manual yang kita buat
  const customConfig = {
    "Menonaktifkan aset": {
      text: "Nonaktifkan",
      color: "bg-amber-100 text-amber-800",
    },
    "Mengaktifkan kembali aset": {
      text: "Aktifkan",
      color: "bg-green-100 text-green-800",
    },
    "Mengajukan penghapusan": {
      text: "Pengajuan",
      color: "bg-yellow-100 text-yellow-800",
    },
    "Menyetujui penghapusan": {
      text: "Persetujuan",
      color: "bg-indigo-100 text-indigo-800",
    },
    "Menolak penghapusan": {
      text: "Penolakan",
      color: "bg-orange-100 text-orange-800",
    },
    "Akses Ditolak": {
      text: "Akses Ditolak",
      color: "bg-red-200 text-red-900 font-bold",
    },
  };

  let config = eventConfig[event];

  // Cek apakah deskripsi cocok dengan log manual
  const customMatch = Object.keys(customConfig).find((key) =>
    event.startsWith(key)
  );
  if (customMatch) {
    config = customConfig[customMatch];
  }

  if (!config) {
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 capitalize">
        {event}
      </span>
    );
  }

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${config.color}`}
    >
      {config.text}
    </span>
  );
};

// Komponen baru untuk menampilkan detail perubahan
const LogChanges = ({ properties }) => {
  // Pengaman baru yang lebih kuat:
  // Pastikan properties, attributes, dan old ada SEBELUM melanjutkan.
  if (!properties || !properties.attributes || !properties.old) {
    return null;
  }

  const changedKeys = Object.keys(properties.attributes);
  // Jika tidak ada field yang berubah, jangan tampilkan apa-apa
  if (changedKeys.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 pl-5 text-xs text-slate-500 list-disc space-y-1">
      {changedKeys.map(
        (key) =>
          // Tambahkan pengecekan jika nilai 'old' tidak ada untuk key tersebut
          properties.old.hasOwnProperty(key) && (
            <li key={key}>
              <span className="font-semibold">{key}</span> diubah dari{" "}
              <span className="italic">"{properties.old[key]}"</span> menjadi{" "}
              <span className="italic font-semibold">
                "{properties.attributes[key]}"
              </span>
            </li>
          )
      )}
    </ul>
  );
};

// Komponen baru untuk menampilkan informasi paginasi
const PaginationControls = ({ paginationInfo, onPageChange }) => {
  if (!paginationInfo || paginationInfo.total === 0) {
    return null;
  }
  const { current_page, last_page, from, to, total } = paginationInfo;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-200">
      <span className="text-sm text-slate-600">
        Menampilkan <span className="font-semibold text-slate-800">{from}</span>{" "}
        - <span className="font-semibold text-slate-800">{to}</span> dari{" "}
        <span className="font-semibold text-slate-800">{total}</span> data
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sebelumnya
        </button>
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

// Badge untuk tipe aksi
const AksiBadge = ({ aksi }) => {
  const colors = {
    tambah: "bg-emerald-100 text-emerald-800",
    ubah: "bg-blue-100 text-blue-800",
    pengajuan: "bg-amber-100 text-amber-800",
    persetujuan: "bg-indigo-100 text-indigo-800",
    default: "bg-slate-100 text-slate-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[aksi] || colors.default
      }`}
    >
      {aksi.replace("_", " ")}
    </span>
  );
};

export default function LogAktivitas() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", event: "" });

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/log-aktivitas", { params: { page: currentPage, ...filters } })
      .then(({ data }) => {
        setLogs(data.data.data);
        setPaginationInfo(data.data);
      })
      .catch((err) => console.error("Gagal mengambil log:", err))
      .finally(() => setLoading(false));
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
          <h1 className="text-xl font-bold text-slate-800">
            Log Aktivitas Sistem
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Jejak audit semua aktivitas penting yang terjadi dalam sistem.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            {/* Filter UI diperbarui */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Cari pengguna atau deskripsi..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                />
              </div>
              {/* Nama input diganti menjadi 'event' agar cocok dengan state & API */}
              <select
                name="event"
                value={filters.event}
                onChange={handleFilterChange}
                className="border rounded-lg text-sm py-2"
              >
                <option value="">Semua Aktivitas</option>
                <option value="created">Tambah</option>
                <option value="updated">Ubah</option>
                <option value="deleted">Hapus</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <TableLoader />
            ) : logs.length === 0 ? (
              <div className="text-center p-16 text-slate-500">
                Tidak ada log aktivitas.
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase w-[25%]">
                      Pengguna
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase w-[15%]">
                      Aktivitas
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase w-[20%]">
                      Waktu
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-600 uppercase w-[40%]">
                      Deskripsi & Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const roleName = log.causer?.roles?.[0]?.name || "default";
                    return (
                      <tr key={log.id} className="border-b border-slate-100">
                        {/* --- ISI TABEL BARU --- */}
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-3">
                            <RoleAvatar role={roleName} />
                            <div>
                              <div className="font-semibold text-slate-800">
                                {log.causer?.name || "Sistem"}
                              </div>
                              <div className="text-xs text-slate-500 capitalize">
                                {roleName.replace("-", " ")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          {/* Gunakan deskripsi untuk mendapatkan nama aktivitas yang lebih baik */}
                          <ActivityBadge
                            event={
                              log.description.startsWith("Data")
                                ? log.event
                                : log.description
                            }
                          />
                        </td>
                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap align-top">
                          {new Date(log.created_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="p-4 text-sm text-slate-700 align-top">
                          <p>{log.description}</p>
                          <LogChanges properties={log.properties} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {!loading && (
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
