import { useState, useEffect, Fragment } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, Transition } from "@headlessui/react";

// --- Ikon-ikon ---
const MenuIcon = (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const UserCircleIcon = (
  <svg
    className="w-8 h-8 text-slate-400"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z"
      clipRule="evenodd"
    />
  </svg>
);
const ClockIcon = (
  <svg
    className="w-5 h-5 text-slate-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Komponen Jam Digital
const DigitalClock = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Opsi format untuk tanggal dan waktu
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return (
    <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-md px-3 py-1.5">
      {ClockIcon}
      <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <span>{dateTime.toLocaleTimeString("id-ID", timeOptions)}</span>
        <span className="text-slate-300">|</span>
        <span>{dateTime.toLocaleDateString("id-ID", dateOptions)}</span>
      </div>
    </div>
  );
};

export default function Header({ onMenuClick, onCollapseClick }) {
  const { user, setToken, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm border-b border-slate-200">
      <div className="flex h-16 max-w-full items-center justify-between pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8">
        <div className="flex items-center gap-4">
          {/* Tombol Toggle untuk Desktop (Revisi #2) */}
          <button
            type="button"
            onClick={onCollapseClick}
            className="hidden lg:flex rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
          >
            <span className="sr-only">Tutup/Buka menu</span>
            {MenuIcon}
          </button>
          {/* Tombol menu untuk Mobile */}
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          >
            <span className="sr-only">Buka menu</span>
            {MenuIcon}
          </button>

          {/* Judul Aplikasi  */}
          <div>
            <p className="text-xl font-bold text-blue-600 leading-tight">
              Sistem Inventaris Desa
            </p>
            <p className="text-sm text-slate-500 leading-tight">Karangduren</p>
          </div>
        </div>

        {/* Area Kanan: Jam dan Profil */}
        <div className="flex items-center gap-4">
          <DigitalClock />
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          {/* Garis pemisah */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex items-center gap-3 rounded-full hover:bg-slate-100 p-1 transition-colors">
                <span className="hidden sm:inline-flex text-sm font-medium text-slate-700">
                  {user?.name ?? "Pengguna"}
                </span>
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  {UserCircleIcon}
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-slate-100" : ""
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
