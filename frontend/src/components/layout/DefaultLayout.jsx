import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DefaultLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 overflow-visible">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
      />

      <div
        className={`relative z-0 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:pl-24" : "lg:pl-64"
        }`}
      >
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onCollapseClick={toggleSidebarCollapse} //
        />
        {/* Mengirim props yang dibutuhkan ke Header */}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
