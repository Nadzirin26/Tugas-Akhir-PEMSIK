import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import { 
  useMahasiswa, 
  useStoreMahasiswa, 
  useUpdateMahasiswa, 
  useDeleteMahasiswa 
} from "@/Utils/Helpers/Hooks/useMahasiswa";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // State baru untuk fitur Pagination & Filter (TUGAS 11)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Panggil hook dengan parameter lengkap
  const { data: result = { data: [], total: 0 }, isLoading } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: mahasiswa = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedMahasiswa) {
      confirmUpdate(() => {
        update({ id: selectedMahasiswa.id, data: formData });
        setModalOpen(false);
      });
    } else {
      store(formData);
      setModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
      // Jika data terakhir di halaman dihapus, mundur 1 halaman
      if (mahasiswa.length === 1 && page > 1) setPage(page - 1);
    });
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Heading as="h2" className="mb-0 text-blue-600 font-bold uppercase">
          Management Mahasiswa
        </Heading>
        {user?.permission?.includes("mahasiswa.create") && (
          <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
        )}
      </div>

      {/* FILTER & PENCARIAN (TUGAS 11) */}
      <div className="flex flex-wrap gap-3 mb-6 bg-gray-50 p-4 rounded-lg border">
        <input
          type="text"
          placeholder="Cari nama/NIM..."
          className="border border-gray-300 px-3 py-2 rounded-lg flex-grow outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset ke halaman 1 kalau lagi nyari
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="nama">Urutkan: Nama</option>
          <option value="nim">Urutkan: NIM</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
        </select>
        
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value={5}>5 Data / Halaman</option>
          <option value={10}>10 Data / Halaman</option>
          <option value={25}>25 Data / Halaman</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center text-blue-600 font-bold py-8 border-2 border-dashed rounded-lg">
          Sedang mencari data... 🚀
        </div>
      ) : (
        user?.permission?.includes("mahasiswa.read") && (
          <>
            <MahasiswaTable 
              mahasiswa={mahasiswa} 
              openEditModal={openEditModal} 
              onDelete={handleDelete} 
            />

            {/* NAVIGASI PAGINATION (TUGAS 11) */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-4 sm:mb-0">
                Menampilkan halaman <span className="font-bold text-blue-600">{page}</span> dari <span className="font-bold">{totalPages}</span> 
                <span className="ml-2 text-gray-400">({totalCount} Total Data)</span>
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={handlePrev}
                  disabled={page === 1}
                >
                  &laquo; Prev
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={handleNext}
                  disabled={page === totalPages || totalPages === 0}
                >
                  Next &raquo;
                </button>
              </div>
            </div>
          </>
        )
      )}

      <MahasiswaModal 
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </Card>
  );
};

export default Mahasiswa;