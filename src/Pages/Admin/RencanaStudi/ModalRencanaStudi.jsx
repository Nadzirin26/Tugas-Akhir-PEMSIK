import React from "react";
import Button from "@/Pages/Auth/Components/Button"; // Sesuaikan path button lu

const ModalRencanaStudi = ({ isOpen, onClose, onSubmit, onChange, form, dosen, mataKuliah }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-gray-800">Tambah Kelas Baru</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-xl">&times;</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
            <select name="mata_kuliah_id" value={form.mata_kuliah_id} onChange={onChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliah.map((m) => (
                <option key={m.id} value={m.id}>{m.nama} ({m.sks} SKS)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Pengampu</label>
            <select name="dosen_id" value={form.dosen_id} onChange={onChange} className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">-- Pilih Dosen --</option>
              {dosen.map((d) => (
                <option key={d.id} value={d.id}>{d.nama} (Max: {d.max_sks} SKS)</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 font-bold">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ModalRencanaStudi;