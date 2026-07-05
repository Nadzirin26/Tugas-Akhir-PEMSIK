import React from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; // Import konteks user

export default function TableRencanaStudi({ kelas, mahasiswa, dosen, mataKuliah, selectedMhs, setSelectedMhs, selectedDsn, setSelectedDsn, handleAddMahasiswa, handleDeleteMahasiswa, handleChangeDosen, handleDeleteKelas }) {
  
  // Panggil user aktif untuk mengecek permission
  const { user } = useAuthStateContext();

  // Cek apakah user punya hak akses update/delete
  const canUpdate = user?.permission?.includes("rencana-studi.update");
  const canDelete = user?.permission?.includes("rencana-studi.delete");

  return (
    <div className="space-y-6">
      {kelas.map((kls) => {
        const matkul = mataKuliah.find(m => m.id === kls.mata_kuliah_id);
        const dosenPengampu = dosen.find(d => d.id === kls.dosen_id);
        const mhsInClass = kls.mahasiswa_ids.map(id => mahasiswa.find(m => m.id === id)).filter(Boolean);

        return (
          <div key={kls.id} className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
            {/* Header Kelas */}
            <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b bg-blue-50">
              <div className="mb-3 md:mb-0">
                <h3 className="text-xl font-bold text-blue-800">{matkul?.nama || "-"} <span className="text-sm font-normal text-gray-600">({matkul?.sks || 0} SKS)</span></h3>
                <p className="text-sm text-gray-700 mt-1">Dosen Pengampu: <strong>{dosenPengampu?.nama || "-"}</strong></p>
              </div>
              
              {/* SEMBUNYIKAN DROPDOWN DOSEN JIKA BUKAN ADMIN */}
              {canUpdate && (
                <div className="flex items-center gap-2">
                  <select value={selectedDsn[kls.id] || ""} onChange={(e) => setSelectedDsn({ ...selectedDsn, [kls.id]: e.target.value })} className="border px-3 py-2 rounded-lg text-sm outline-none">
                    <option value="">-- Ganti Dosen --</option>
                    {dosen.map(d => (
                      <option key={d.id} value={d.id}>{d.nama}</option>
                    ))}
                  </select>
                  <button onClick={() => handleChangeDosen(kls)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg font-bold text-sm">Update Dosen</button>
                  
                  {mhsInClass.length === 0 && canDelete && (
                    <button onClick={() => handleDeleteKelas(kls.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm">Hapus Kelas</button>
                  )}
                </div>
              )}
            </div>

            {/* Tabel Mahasiswa */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-6">No</th>
                    <th className="py-3 px-6">Nama Mahasiswa</th>
                    <th className="py-3 px-6">NIM</th>
                    <th className="py-3 px-6 text-center">Total SKS Diambil</th>
                    <th className="py-3 px-6 text-center">Max SKS</th>
                    
                    {/* SEMBUNYIKAN KOLOM AKSI JIKA BUKAN ADMIN */}
                    {canUpdate && <th className="py-3 px-6 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {mhsInClass.length > 0 ? (
                    mhsInClass.map((m, i) => {
                      const totalSks = kelas
                        .filter(k => k.mahasiswa_ids.includes(m.id))
                        .map(k => mataKuliah.find(mk => mk.id === k.mata_kuliah_id)?.sks || 0)
                        .reduce((a, b) => a + b, 0);

                      return (
                        <tr key={m.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-6">{i + 1}</td>
                          <td className="py-3 px-6 font-medium">{m.nama}</td>
                          <td className="py-3 px-6 text-gray-500">{m.nim}</td>
                          <td className="py-3 px-6 text-center font-bold text-blue-600">{totalSks}</td>
                          <td className="py-3 px-6 text-center">{m.max_sks}</td>
                          
                          {/* SEMBUNYIKAN TOMBOL HAPUS MAHASISWA JIKA BUKAN ADMIN */}
                          {canUpdate && (
                            <td className="py-3 px-6 text-center">
                              <button onClick={() => handleDeleteMahasiswa(kls, m.id)} className="text-red-500 hover:text-red-700 font-bold text-xs underline">Hapus</button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={canUpdate ? "6" : "5"} className="py-6 text-center text-gray-400 italic">Belum ada mahasiswa di kelas ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* SEMBUNYIKAN FORM TAMBAH MAHASISWA BARU JIKA BUKAN ADMIN */}
            {canUpdate && (
              <div className="flex flex-col sm:flex-row items-center gap-3 px-6 py-4 bg-gray-50 border-t">
                <select value={selectedMhs[kls.id] || ""} onChange={(e) => setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })} className="border px-4 py-2 rounded-lg text-sm outline-none w-full sm:w-64">
                  <option value="">-- Tambah Mahasiswa ke Kelas --</option>
                  {mahasiswa.map((m) => (
                    <option key={m.id} value={m.id}>{m.nama} (Max: {m.max_sks})</option>
                  ))}
                </select>
                <button onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  + Tambah
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}