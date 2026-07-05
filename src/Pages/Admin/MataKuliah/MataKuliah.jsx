import React, { useState } from "react";
import Heading from "@/Pages/Admin/Components/Heading";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

// Import Hooks React Query
import { useMataKuliah, useStoreMataKuliah, useDeleteMataKuliah } from "@/Utils/Helpers/Hooks/useMataKuliah";

const MataKuliah = () => {
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [sks, setSks] = useState("");

  // State baru untuk fitur Pagination & Filter (TUGAS 11)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Panggil hook dengan parameter lengkap
  const { data: result = { data: [], total: 0 }, isLoading } = useMataKuliah({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: matkulList = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const { mutate: store } = useStoreMataKuliah();
  const { mutate: remove } = useDeleteMataKuliah();

  const handleAddMatkul = (e) => {
    e.preventDefault();
    if (!kode || !nama || !sks) return toastError("Isi semua field bro!");

    store({ kode, nama, sks: Number(sks) }, {
      onSuccess: () => {
        setKode("");
        setNama("");
        setSks("");
      }
    });
  };

  const handleDeleteMatkul = (id) => {
    if (window.confirm("Yakin mau hapus matkul ini?")) {
      remove(id);
      if (matkulList.length === 1 && page > 1) setPage(page - 1);
    }
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6">
      <Heading as="h1" className="text-3xl font-bold mb-6 text-gray-800">
        Manajemen Data Mata Kuliah
      </Heading>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-md">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Tambah Mata Kuliah</h3>
        <form onSubmit={handleAddMatkul} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kode Matkul</label>
            <input type="text" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="Contoh: A11.54321" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Mata Kuliah</label>
            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Pemrograman Web" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">SKS</label>
            <input type="number" value={sks} onChange={(e) => setSks(e.target.value)} placeholder="Contoh: 3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Simpan Mata Kuliah
          </button>
        </form>
      </div>

      {/* FILTER & PENCARIAN MATKUL */}
      <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <input
          type="text"
          placeholder="Cari nama/kode..."
          className="border border-gray-300 px-3 py-2 rounded-lg flex-grow outline-none focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value="nama">Urutkan: Nama</option>
          <option value="kode">Urutkan: Kode</option>
          <option value="sks">Urutkan: SKS</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
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
          className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
        >
          <option value={5}>5 Data / Halaman</option>
          <option value={10}>10 Data / Halaman</option>
          <option value={25}>25 Data / Halaman</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-700">No</th>
              <th className="p-4 font-bold text-gray-700">Kode</th>
              <th className="p-4 font-bold text-gray-700">Nama Mata Kuliah</th>
              <th className="p-4 font-bold text-gray-700">SKS</th>
              <th className="p-4 text-center font-bold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-purple-600 font-bold">Sedang memuat data... 🚀</td>
              </tr>
            ) : matkulList.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Belum ada data bray.</td></tr>
            ) : (
              matkulList.map((matkul, index) => (
                <tr key={matkul.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{(page - 1) * limit + index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">{matkul.kode}</td>
                  <td className="p-4 text-gray-600">{matkul.nama}</td>
                  <td className="p-4 text-gray-600">{matkul.sks}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDeleteMatkul(matkul.id)} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* NAVIGASI PAGINATION MATKUL */}
        {!isLoading && matkulList.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 font-medium mb-4 sm:mb-0">
              Menampilkan halaman <span className="font-bold text-purple-600">{page}</span> dari <span className="font-bold">{totalPages}</span> 
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={handleNext}
                disabled={page === totalPages || totalPages === 0}
              >
                Next &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MataKuliah;