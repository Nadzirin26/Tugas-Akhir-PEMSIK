import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-blue-600 text-white font-bold">
          <tr>
            <th className="py-3 px-4">NIM</th>
            <th className="py-3 px-4">NAMA</th>
            <th className="py-3 px-4">STATUS</th> {/* <-- Kolom Status Kembali! */}
            <th className="py-3 px-4 text-center">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.length === 0 ? (
            <tr>
              {/* colSpan diganti jadi 4 karena kolomnya nambah */}
              <td colSpan="4" className="text-center py-4 text-gray-500">Belum ada data mahasiswa bray.</td>
            </tr>
          ) : (
            mahasiswa.map((mhs) => (
              <tr key={mhs.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-mono">{mhs.nim}</td>
                <td className="py-3 px-4">{mhs.nama}</td>
                <td className="py-3 px-4">
                  {/* Badge Status Aktif/Tidak Aktif */}
                  <span className={`px-2 py-1 rounded text-xs font-bold ${mhs.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {mhs.status ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center space-x-3">
                  <button onClick={() => navigate(`/admin/mahasiswa/${mhs.id}`)} className="text-blue-600 font-bold text-xs hover:underline">DETAIL</button>
                  
                  {user?.permission?.includes("mahasiswa.update") && (
                    <button onClick={() => openEditModal(mhs)} className="text-yellow-600 font-bold text-xs hover:underline">EDIT</button>
                  )}

                  {user?.permission?.includes("mahasiswa.delete") && (
                    <button onClick={() => onDelete(mhs.id)} className="text-red-500 font-bold text-xs hover:underline">HAPUS</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;