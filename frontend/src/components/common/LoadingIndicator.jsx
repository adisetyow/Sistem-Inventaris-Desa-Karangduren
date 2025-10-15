// src/components/common/LoadingIndicator.jsx

const WarehouseIcon = (
  <svg
    className="w-12 h-12 text-blue-500 animate-spin-slow"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);

/**
 * Komponen Loading Indicator untuk Sistem Inventaris Desa
 * @param {boolean} fullPage - Jika true, akan menutupi seluruh halaman dengan overlay.
 * @param {string} text - Teks yang akan ditampilkan di bawah ikon.
 */
export default function LoadingIndicator({
  fullPage = false,
  text = "Memuat data inventaris desa...",
}) {
  // Komponen animasi untuk teks
  const AnimatedText = () => (
    <p className="mt-4 text-lg font-semibold text-blue-600 animate-pulse">
      {text}
    </p>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-blue-50/90 backdrop-blur-md">
        <div className="relative">
          {/* Lingkaran latar belakang untuk efek estetis */}
          <div className="absolute inset-0 -m-4 bg-blue-100/50 rounded-full animate-pulse-slow"></div>
          {WarehouseIcon}
        </div>
        <AnimatedText />
      </div>
    );
  }

  // Versi inline (tidak menutupi seluruh halaman)
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative">
        {/* Lingkaran latar belakang untuk efek estetis */}
        <div className="absolute inset-0 -m-4 bg-blue-100/30 rounded-full animate-pulse-slow"></div>
        {WarehouseIcon}
      </div>
      <AnimatedText />
    </div>
  );
}
