import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Package,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  History,
} from "lucide-react";

// Komponen Kartu Statistik dengan desain modern pastel
const StatCard = ({ title, value, icon: Icon, color, format = (v) => v }) => (
  <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100/60 transition-all duration-300 hover:shadow-lg hover:border-blue-200 group">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
        <p className="text-2xl font-bold text-slate-800 transition-colors group-hover:text-blue-700">
          {format(value)}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 ml-4`}
      >
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

// Custom Tooltip untuk Chart dengan styling pastel
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-blue-100">
        <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-lg font-bold text-blue-600">
          {payload[0].value} unit
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  // Simulasi data untuk demo
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/dashboard")
      .then(({ data }) => setStats(data.data))
      .catch((err) => console.error("Gagal mengambil data:", err))
      .finally(() => setLoading(false));
  }, []);

  const statusData = [
    { name: "Aktif", value: stats?.grafikDistribusiStatus.aktif || 0 },
    {
      name: "Tidak Aktif",
      value: stats?.grafikDistribusiStatus.tidak_aktif || 0,
    },
    {
      name: "Menunggu",
      value:
        stats?.grafikDistribusiStatus.menunggu_persetujuan_penghapusan || 0,
    },
  ];
  const STATUS_COLORS = ["#60A5FA", "#93C5FD", "#DBEAFE"];

  const kondisiData = [
    { name: "Baik", value: stats?.distribusiKondisi.baik || 0 },
    { name: "Rusak Ringan", value: stats?.distribusiKondisi.rusakRingan || 0 },
    { name: "Rusak Berat", value: stats?.distribusiKondisi.rusakBerat || 0 },
  ];
  const KONDISI_COLORS = ["#60A5FA", "#F59E0B", "#EF4444"];

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );

  if (!stats)
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 inline-block">
          <p className="text-red-600 font-medium">Gagal memuat data dasbor.</p>
        </div>
      </div>
    );

  const { statistikUtama, grafikAsetPerKategori, aktivitasTerbaru } = stats;

  return (
    <div className="bg-slate-50 min-h-screen p-2 md:p-4 lg:p-0">
      <div className="max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-200 to-cyan-200  rounded-2xl shadow-md overflow-hidden mt-2 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Dashboard Inventaris
              </h1>
              <p className="text-slate-500 mt-2 text-sm lg:text-base flex items-center gap-2">
                <span>
                  Selamat datang kembali,{" "}
                  <span className="font-semibold text-slate-700">
                    {user?.name}
                  </span>
                  !
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Kartu Statistik Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Aset Tercatat"
            value={statistikUtama.totalAset}
            icon={Package}
            color="from-blue-400 to-cyan-400"
          />
          <StatCard
            title="Total Nilai Aset"
            value={statistikUtama.totalNilaiAset}
            icon={DollarSign}
            color="from-emerald-400 to-green-400"
            format={(v) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                notation: "compact",
              }).format(v)
            }
          />
          <StatCard
            title="Total Pengguna Sistem"
            value={statistikUtama.totalPengguna}
            icon={Users}
            color="from-violet-400 to-purple-400"
          />
        </div>

        {/* Grafik Donut - Status & Kondisi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Distribusi Status */}
          <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                Distribusi Status Aset
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => (
                    <span className="text-sm font-medium text-slate-700">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Distribusi Kondisi */}
          <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-md">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                Distribusi Kondisi Aset
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={kondisiData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {kondisiData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={KONDISI_COLORS[index % KONDISI_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => (
                    <span className="text-sm font-medium text-slate-700">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik Kategori & Aktivitas */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Bar Chart Kategori */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md">
                <Activity size={20} className="text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                Aset per Kategori
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={grafikAsetPerKategori}
                margin={{ top: 10, right: 10, left: -10, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E0E7FF"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  height={60}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  fontSize={12}
                  allowDecimals={false}
                  stroke="#64748B"
                  tick={{ fill: "#64748B" }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#EFF6FF" }}
                />
                <Bar
                  dataKey="jumlah"
                  name="Jumlah Aset"
                  fill="url(#barGradient)"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Log Aktivitas */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-sm border border-blue-100/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-md">
                <History size={20} className="text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                Aktivitas Terbaru
              </h3>
            </div>
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              {aktivitasTerbaru.map((log) => (
                <div
                  key={log.id}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/40 hover:shadow-md hover:border-blue-200/60 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <History size={18} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm text-slate-700 leading-relaxed mb-1"
                      dangerouslySetInnerHTML={{
                        __html: log.description.replace(
                          /'([^']*)'/,
                          "'<span class=\"font-semibold text-blue-600\">$1</span>'"
                        ),
                      }}
                    ></p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-600">
                        {log.causer?.name || "Sistem"}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(log.created_at).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
