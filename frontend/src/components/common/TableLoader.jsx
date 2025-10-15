// src/components/common/TableLoader.jsx

// Komponen untuk satu baris skeleton
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded"></div>
    </td>
  </tr>
);

// Komponen utama loader tabel
export default function TableLoader({ rowCount = 5 }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Kode
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Nama Barang
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Nilai
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Kondisi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {/* Membuat beberapa baris skeleton sesuai prop rowCount */}
          {Array.from({ length: rowCount }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
