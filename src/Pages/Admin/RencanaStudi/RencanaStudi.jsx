import React, { useState, useEffect } from "react";
import Card from "@/Pages/Auth/Components/Card"; // Sesuaikan path Card lu
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

// Import API Callings
import { getAllKelas, storeKelas, updateKelas, deleteKelas } from "@/Utils/Helpers/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Helpers/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Helpers/Apis/MahasiswaApi";
import { getAllMataKuliah } from "@/Utils/Helpers/Apis/MataKuliahApi";

import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();
  
  // State Data Master
  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  // State Pilihan Dropdown per Baris Tabel
  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});

  // State Modal & Form Tambah Kelas
  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil semua data secara paralel saat halaman dibuka (TUGAS 13 - Promise.all)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resKelas, resDosen, resMahasiswa, resMataKuliah] = await Promise.all([
        getAllKelas(),
        getAllDosen({ _limit: 100 }),      // Ambil semua data tanpa pagination limit halaman
        getAllMahasiswa({ _limit: 100 }),  
        getAllMataKuliah({ _limit: 100 })
      ]);

      setKelas(resKelas.data || []);
      setDosen(resDosen.data || []);
      setMahasiswa(resMahasiswa.data || []);
      setMataKuliah(resMataKuliah.data || []);
    } catch (err) {
      toastError("Gagal mengambil data sistem krs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logika Bisnis: Menyaring mata kuliah yang belum dibuat kelasnya (1 Matkul = 1 Kelas)
  const mataKuliahSudahDipakai = kelas.map((k) => k.mata_kuliah_id);
  const mataKuliahBelumAdaKelas = mataKuliah.filter((m) => !mataKuliahSudahDipakai.includes(m.id));

  // Fungsi pembaca batasan maksimal SKS pribadi
  const getMaxSks = (id) => mahasiswa.find((m) => m.id === id)?.max_sks || 0;
  const getDosenMaxSks = (id) => dosen.find((d) => d.id === id)?.max_sks || 0;

  // HANDLER ACTION 1: Tambah Mahasiswa ke dalam kelas (Validasi SKS Maksimal)
  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    if (!mhsId) return toastError("Pilih mahasiswa dulu bro!");

    const matkul = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id);
    const sksBaru = matkul?.sks || 0;

    // Hitung total SKS yang sudah diambil mahasiswa dari seluruh kelas yang dia ikuti
    const totalSksMahasiswa = kelas
      .filter((k) => k.mahasiswa_ids.includes(mhsId))
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const maxSks = getMaxSks(mhsId);
    
    // Validasi aturan bisnis batas SKS Mahasiswa
    if (totalSksMahasiswa + sksBaru > maxSks) {
      toastError(`Gagal! SKS Mahasiswa melebihi batas maksimal (${maxSks} SKS).`);
      return;
    }
    
    if (kelasItem.mahasiswa_ids.includes(mhsId)) {
      toastError("Mahasiswa sudah terdaftar di kelas ini bray.");
      return;
    }

    const updated = {
      ...kelasItem,
      mahasiswa_ids: [...kelasItem.mahasiswa_ids, mhsId]
    };

    try {
      await updateKelas(kelasItem.id, updated);
      toastSuccess("Mahasiswa berhasil dimasukkan ke kelas!");
      setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" })); // Reset dropdown row
      fetchData();
    } catch (err) {
      toastError("Gagal memperbarui data kelas.");
    }
  };

  // HANDLER ACTION 2: Hapus Mahasiswa dari Kelas
  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    if (window.confirm("Yakin ingin mengeluarkan mahasiswa ini dari kelas?")) {
      const updated = {
        ...kelasItem,
        mahasiswa_ids: kelasItem.mahasiswa_ids.filter((id) => id !== mhsId)
      };

      try {
        await updateKelas(kelasItem.id, updated);
        toastSuccess("Mahasiswa berhasil dikeluarkan dari kelas.");
        fetchData();
      } catch (err) {
        toastError("Gagal memproses pengeluaran mahasiswa.");
      }
    }
  };

  // HANDLER ACTION 3: Ganti Dosen Pengampu (Validasi SKS Dosen)
  const handleChangeDosen = async (kelasItem) => {
    const dsnId = selectedDsn[kelasItem.id];
    if (!dsnId) return toastError("Pilih dosen pengganti terlebih dahulu!");

    // Hitung total SKS beban mengajar dosen saat ini dari seluruh kelas lain
    const totalSksDosen = kelas
      .filter((k) => k.dosen_id === dsnId)
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const kelasSks = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
    const maxSks = getDosenMaxSks(dsnId);

    // Validasi beban kerja SKS Dosen
    if (totalSksDosen + kelasSks > maxSks) {
      toastError(`Gagal! Mengajar kelas ini membuat beban Dosen melebihi batas maksimal (${maxSks} SKS).`);
      return;
    }

    try {
      await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
      toastSuccess("Dosen pengampu kelas berhasil diperbarui!");
      fetchData();
    } catch (err) {
      toastError("Gagal memperbarui dosen.");
    }
  };

  // HANDLER ACTION 4: Hapus Kelas (Hanya jika kosong)
  const handleDeleteKelas = async (kelasId) => {
    if (window.confirm("Beneran mau hapus kelas mata kuliah ini bro?")) {
      try {
        await deleteKelas(kelasId);
        toastSuccess("Kelas berhasil dihapus dari sistem.");
        fetchData();
      } catch (err) {
        toastError("Gagal menghapus kelas.");
      }
    }
  };

  // HANDLER ACTION 5: Submit Modal Tambah Kelas Baru
  const handleSubmitKelas = async (e) => {
    e.preventDefault();
    if (!form.mata_kuliah_id || !form.dosen_id) {
      toastError("Form input kelas tidak lengkap bray!");
      return;
    }
    try {
      await storeKelas({ ...form, mahasiswa_ids: [] });
      setIsModalOpen(false);
      setForm({ mata_kuliah_id: "", dosen_id: "" });
      toastSuccess("Kelas perkuliahan baru berhasil ditambahkan!");
      fetchData();
    } catch (err) {
      toastError("Gagal menambahkan kelas.");
    }
  };

  const openAddModal = () => {
    setForm({ mata_kuliah_id: "", dosen_id: "" });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return <div className="p-6 text-center text-blue-600 font-bold">Menghubungkan data relasi KRS... 🚀</div>;
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Heading as="h2" className="mb-0 text-blue-600 font-bold uppercase">
            Sistem Rencana Studi (KRS)
          </Heading>
          {user?.permission?.includes("rencana-studi.create") && (
            <Button onClick={openAddModal}>+ Tambah Kelas Baru</Button>
          )}
        </div>

        {user?.permission?.includes("rencana-studi.read") ? (
          <TableRencanaStudi
            kelas={kelas}
            mahasiswa={mahasiswa}
            dosen={dosen}
            mataKuliah={mataKuliah}
            selectedMhs={selectedMhs}
            setSelectedMhs={setSelectedMhs}
            selectedDsn={selectedDsn}
            setSelectedDsn={setSelectedDsn}
            handleAddMahasiswa={handleAddMahasiswa}
            handleDeleteMahasiswa={handleDeleteMahasiswa}
            handleChangeDosen={handleChangeDosen}
            handleDeleteKelas={handleDeleteKelas}
          />
        ) : (
          <div className="text-center text-red-500 font-bold py-4">
            Anda tidak memiliki akses untuk melihat rencana studi.
          </div>
        )}
      </Card>

      <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleSubmitKelas}
        form={form}
        dosen={dosen}
        mataKuliah={mataKuliahBelumAdaKelas}
      />
    </>
  );
};

export default RencanaStudi;