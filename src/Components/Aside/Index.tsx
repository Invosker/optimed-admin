import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import usePermissions from "@/hooks/usePermissions";

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { asideOptions } = usePermissions();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useLayoutEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const menuOpenIcon = document.getElementById("menu-open-icon");
    const menuCloseIcon = document.getElementById("menu-close-icon");
    if (isOpen) {
      sidebar?.classList.remove("-translate-x-full");
      sidebar?.classList.add("translate-x-0");
      menuOpenIcon?.classList.add("hidden");
      menuCloseIcon?.classList.remove("hidden");
    } else {
      sidebar?.classList.remove("translate-x-0");
      sidebar?.classList.add("-translate-x-full");
      menuOpenIcon?.classList.remove("hidden");
      menuCloseIcon?.classList.add("hidden");
    }
  }, [isOpen]);

  const itemBase =
    "relative group flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ease-out overflow-hidden";
  const activeStyles = "bg-blue-50 text-[#0a3042] font-semibold shadow-inner";
  const hoverStyles =
    "hover:bg-blue-50 hover:text-[#0a3042] hover:translate-x-1";

  return (
    <div className="bg-gray-100 font-sans leading-normal tracking-normal h-screen flex flex-col w-screen text-gray-700">
      <header className="shadow-lg p-4 flex justify-between items-center bg-optimed-tiber">
        <div className="flex items-center space-x-4 align-middle"></div>
      </header>
      <button
        id="sidebar-toggle"
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-md shadow-lg"
        onClick={toggleSidebar}
      >
        <svg
          id="menu-open-icon"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          id="menu-close-icon"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 hidden"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex flex-1 overflow-hidden">
        <aside
          id="sidebar"
          className="fixed lg:static top-0 left-0 h-full w-76 bg-white shadow-lg z-40 transform lg:translate-x-0 transition-transform duration-300 ease-in-out -translate-x-full lg:block"
        >
          <div className="flex h-full flex-col overflow-y-auto">
            <Link
              to="/Home/Account"
              className="flex justify-center items-center flex-shrink-0 px-4 py-2"
            >
              <img
                src={`/images/Optimed_Logo.jpg`}
                alt="Tu compañía"
                className="h-40 w-40 self-center"
              />
            </Link>
            <nav className=" flex-1 px-2 space-y-1">
              {asideOptions.map((opt) => {
                const active = pathname === opt.path;
                return (
                  <NavLink
                    key={opt.id}
                    to={opt.path}
                    className={`${itemBase} ${hoverStyles} ${
                      active ? activeStyles : "text-optimed-tiber"
                    } ${opt.name === "Salir" ? "mt-8" : ""}`}
                  >
                    {/* Barra lateral animada */}
                    <span
                      className={`absolute left-0 top-0 h-full w-1 bg-optimed-tiber rounded-r transition-transform duration-300 origin-top ${
                        active
                          ? "scale-y-100"
                          : "scale-y-0 group-hover:scale-y-100"
                      }`}
                    />
                    <span
                      className={`mr-2 h-6 w-6 flex items-center transition-colors duration-200 ${
                        active ? "text-[#0a3042]" : ""
                      }`}
                    >
                      {opt.icon}
                    </span>
                    <span className="truncate">{opt.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex flex-1 overflow-y-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Aside;
