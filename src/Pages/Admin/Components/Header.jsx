import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import Helper Swal
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleProfileMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    // Panggil helper confirmLogout yang nerima callback
    confirmLogout(() => {
      // Logic ini cuma jalan kalau user klik "Ya, Logout"
      localStorage.removeItem("user");
      
      // Pakai window.location.href sesuai instruksi Notion 
      // supaya state bener-bener bersih (hard reload)
      window.location.href = "/";
    });
  };

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
        Panel Admin Mahasiswa
      </h1>

      <div className="flex items-center gap-4">
        <span className="hidden md:block text-sm text-gray-600 font-medium">
          Halo, {user?.name || "Admin"}
        </span>

        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shadow-md font-bold"
          >
            {user?.name?.charAt(0) || "A"}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border py-2 z-50">
              <div className="px-4 py-2 text-xs text-gray-400 border-b mb-1 uppercase font-bold">
                Akun Saya
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition"
              >
                Keluar / Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;