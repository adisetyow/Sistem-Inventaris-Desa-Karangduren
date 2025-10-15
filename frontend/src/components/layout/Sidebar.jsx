import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axiosClient from "../../api/axiosClient";
import Logo from "../../assets/images/logo.JPG";
import { useState, useEffect } from "react";
import { Home, Package, Users, CheckSquare, History } from "lucide-react";

const DashboardIcon = (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const InventarisIcon = (
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
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);
const UserManagementIcon = (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const ApprovalIcon = (
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
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

//KOMPONEN
const NavItem = ({ to, icon, isCollapsed, children }) => {
  const baseLinkClasses =
    "flex items-center gap-3 p-2.5 rounded-md text-sm text-slate-700 hover:bg-slate-100";
  const activeLinkClasses = "bg-blue-50 text-blue-600 font-semibold";

  return (
    <li className="relative group">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
        }
      >
        <div className="shrink-0">{icon}</div>
        <span
          className={`truncate transition-opacity duration-200 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          {children}
        </span>
      </NavLink>
      {isCollapsed && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 
             bg-slate-800/90 text-white text-sm font-medium 
             rounded-md shadow-lg 
             opacity-0 group-hover:opacity-100 
             translate-x-0 group-hover:translate-x-2
             transition-all duration-200 ease-out 
             whitespace-nowrap z-[999]
             backdrop-blur-sm border border-slate-700/50"
        >
          {children}
        </div>
      )}
    </li>
  );
};

//KOMPONEN
const NavDropdown = ({ icon, title, isCollapsed, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDropdownOpen = !isCollapsed && isOpen;

  return (
    <li className="relative group">
      {" "}
      {/* Tambahkan group di sini untuk tooltip */}
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 p-2.5 rounded-md text-sm text-slate-700 hover:bg-slate-100"
        onClick={() => !isCollapsed && setIsOpen(!isOpen)}
        aria-expanded={isDropdownOpen}
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0">{icon}</div>
          <span
            className={`truncate transition-opacity duration-200 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            {title}
          </span>
        </div>
        {!isCollapsed && (
          <svg
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {isCollapsed && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 
             bg-slate-800/90 text-white text-sm font-medium 
             rounded-md shadow-lg 
             opacity-0 group-hover:opacity-100 
             translate-x-0 group-hover:translate-x-2
             transition-all duration-200 ease-out 
             whitespace-nowrap z-[999]
             backdrop-blur-sm border border-slate-700/50"
        >
          {title}
        </div>
      )}
      {isDropdownOpen && <ul className="pl-8 py-2 space-y-2">{children}</ul>}
    </li>
  );
};

export default function Sidebar({ isOpen, setIsOpen, isCollapsed }) {
  const { user } = useAuth();
  const isAdminOrSuperAdmin = user?.roles?.some(
    (role) => role.name === "admin" || role.name === "super-admin"
  );
  const isSuperAdmin = user?.roles?.some((role) => role.name === "super-admin");

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-[100] flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isCollapsed ? "w-24" : "w-64"}`}
      >
        {/* Logo Section */}
        <div
          className={`flex items-center justify-center border-b border-slate-200 transition-all duration-300 ${
            isCollapsed ? "h-20" : "h-32"
          }`}
        >
          <img
            src={Logo}
            alt="Logo Desa"
            className={`object-contain transition-all duration-300 ease-in-out ${
              isCollapsed ? "h-14 w-14" : "h-24 w-24"
            }`}
          />
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-visible p-4">
          <ul className="space-y-2 overflow-visible">
            <NavItem to="/" icon={DashboardIcon} isCollapsed={isCollapsed}>
              Dashboard
            </NavItem>
            <NavDropdown
              title="Inventaris"
              icon={InventarisIcon}
              isCollapsed={isCollapsed}
            >
              <NavItem to="/inventaris" isCollapsed={isCollapsed}>
                Data Aktif
              </NavItem>
              <NavItem to="/inventaris/tidak-aktif" isCollapsed={isCollapsed}>
                Data Tidak Aktif
              </NavItem>
              <NavItem
                to="/inventaris/riwayat-penghapusan"
                isCollapsed={isCollapsed}
              >
                Riwayat Penghapusan
              </NavItem>
            </NavDropdown>

            {/* 3. Tambahkan menu baru yang hanya bisa dilihat Superadmin */}
            {isSuperAdmin && (
              <>
                <NavItem
                  to="/pengelolaan/persetujuan"
                  icon={ApprovalIcon}
                  isCollapsed={isCollapsed}
                >
                  Persetujuan Hapus
                </NavItem>

                <NavItem
                  to="/users"
                  icon={UserManagementIcon}
                  isCollapsed={isCollapsed}
                >
                  Manajemen Pengguna
                </NavItem>
              </>
            )}
            {isAdminOrSuperAdmin && (
              <NavItem
                to="/pengelolaan/log-aktivitas"
                icon={<History />}
                isCollapsed={isCollapsed}
              >
                Log Aktivitas
              </NavItem>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}
