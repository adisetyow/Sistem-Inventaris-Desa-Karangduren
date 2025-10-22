// src/components/common/TableLoader.jsx

// Komponen untuk satu baris skeleton, sekarang dinamis
const SkeletonRow = ({ columns }) => (
  <tr className="animate-pulse">
    {columns.map((col, index) => (
      <td key={index} className="px-3 py-4">
        {" "}
        {/* Menggunakan padding yang sama dengan tabel utama */}
        <div className="h-4 bg-slate-200 rounded-md"></div>
      </td>
    ))}
  </tr>
);

// Komponen utama loader tabel, sekarang menerima 'headers'
export default function TableLoader({ headers, rowCount = 10 }) {
  // Pengaman jika prop headers tidak dikirim
  if (!headers || headers.length === 0) {
    return <div className="p-8 text-center">Memuat...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-sky-50 border-y border-slate-100">
          <tr>
            {/* Membuat header skeleton secara dinamis */}
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase whitespace-nowrap"
                style={{
                  width: header.style?.width,
                  minWidth: header.style?.minWidth,
                }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {/* Membuat beberapa baris skeleton sesuai prop rowCount */}
          {Array.from({ length: rowCount }).map((_, index) => (
            <SkeletonRow key={index} columns={headers} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
