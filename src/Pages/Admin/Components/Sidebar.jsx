import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  return (
    <aside className="w-64 bg-blue-900 text-white p-4">
      <div className="font-bold text-xl mb-6 border-b border-blue-700 pb-2">
        Menu Utama
      </div>
      <div className="space-y-1">
        
        {/* Cek permission sebelum nampilin menu Dashboard */}
        {user?.permission?.includes("dashboard.page") && (
          <NavLink to="/admin/dashboard" className={({ isActive }) => 
            `block p-2 rounded transition-colors ${isActive ? "bg-blue-700 font-semibold" : "hover:bg-blue-800"}`
          }>Dashboard</NavLink>
        )}
        
        {/* Cek permission sebelum nampilin menu Mahasiswa */}
        {user?.permission?.includes("mahasiswa.page") && (
          <NavLink to="/admin/mahasiswa" className={({ isActive }) => 
            `block p-2 rounded transition-colors ${isActive ? "bg-blue-700 font-semibold" : "hover:bg-blue-800"}`
          }>Mahasiswa</NavLink>
        )}

        {/* Cek permission sebelum nampilin menu Dosen */}
        {user?.permission?.includes("dosen.page") && (
          <NavLink to="/admin/dosen" className={({ isActive }) => 
            `block p-2 rounded transition-colors ${isActive ? "bg-blue-700 font-semibold" : "hover:bg-blue-800"}`
          }>Dosen</NavLink>
        )}

        {/* Cek permission sebelum nampilin menu Mata Kuliah */}
        {user?.permission?.includes("matakuliah.page") && (
          <NavLink to="/admin/matakuliah" className={({ isActive }) => 
            `block p-2 rounded transition-colors ${isActive ? "bg-blue-700 font-semibold" : "hover:bg-blue-800"}`
          }>Mata Kuliah</NavLink>
        )}

        {/* Cek permission sebelum nampilin menu Rencana Studi (TUGAS 13) */}
        {user?.permission?.includes("rencana-studi.page") && (
          <NavLink to="/admin/rencana-studi" className={({ isActive }) => 
            `block p-2 rounded transition-colors mt-4 border-t border-blue-700 pt-2 ${isActive ? "bg-blue-700 font-semibold" : "hover:bg-blue-800"}`
          }>
            <span className="mr-2">📚</span>Rencana Studi
          </NavLink>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;