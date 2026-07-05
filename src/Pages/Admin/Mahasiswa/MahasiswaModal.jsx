import React, { useState, useEffect } from "react";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";
// Import Toast Helpers
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa }) => {
  const [form, setForm] = useState({ nim: "", nama: "", status: true });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm(selectedMahasiswa);
    } else {
      setForm({ nim: "", nama: "", status: true });
    }
  }, [selectedMahasiswa, isModalOpen]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama) {
      toastError("Data kurang terisi bray!"); 
      return;
    }
    
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold">
            {selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleLocalSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input name="nim" value={form.nim} onChange={handleChange} readOnly={!!selectedMahasiswa} placeholder="Masukkan NIM" required />
          </div>
          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input name="nama" value={form.nama} onChange={handleChange} placeholder="Masukkan Nama" required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="status" checked={form.status} onChange={handleChange} />
            <Label>Mahasiswa Aktif</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={onClose} className="bg-gray-200 text-black">Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;