import React, { useState } from "react";
import Heading from "@/Pages/Admin/Components/Heading";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

// Import Hooks React Query
import { useDosen, useStoreDosen, useDeleteDosen } from "@/Utils/Helpers/Hooks/useDosen";

const Dosen = () => {
  const [nidn, setNidn] = useState("");
  const [nama, setNama] = useState("");

  // State baru untuk fitur Pagination & Filter (TUGAS 11)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Panggil hook dengan parameter lengkap
  const { data: result = { data: [], total: 0 }, isLoading } = useDosen({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: dosenList = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const { mutate: store } = useStoreDosen();
  const { mutate: remove } = useDeleteDosen();

  const handleAddDosen = (e) => {
    e.preventDefault();
    if (!nidn || !nama) return toastError("Isi semua field bro!");

    store({ nidn, nama }, {
      onSuccess: () => {
        setNidn("");
        setNama("");
      }
    });
  };

  const handleDeleteDosen = (id) => {
    if (window.confirm("Beneran mau hapus dosen ini bro?")) {
      remove(id);
      if (dosenList.length === 1 && page > 1) setPage(page - 1);
    }
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6">
      <Heading as="h1" className="text-3xl font-bold mb-6 text-gray-800">
        Manajemen Data Dosen
      </Heading>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-md">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Tambah Dosen Baru</h3>
        <form onSubmit={handleAddDosen} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">NIDN</label>
            <input
              type="text"
              value={nidn}
              onChange={(e) => setNidn(e.target.value)}
              placeholder="Contoh: 0601020304"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Dosen</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap dan gelar"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Simpan Dosen
          </button>
        </form>
      </div>

      {/* FILTER & PENCARIAN DOSEN */}
      <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <input
          type="text"
          placeholder="Cari nama/NIDN..."
          className="border border-gray-300 px-3 py-2 rounded-lg flex-grow outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="nama">Urutkan: Nama</option>
          <option value="nidn">Urutkan: NIDN</option>
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

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-700">No</th>
              <th className="p-4 font-bold text-gray-700">NIDN</th>
              <th className="p-4 font-bold text-gray-700">Nama Dosen</th>
              <th className="p-4 text-center font-bold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-blue-600 font-bold">Sedang memuat data... 🚀</td>
              </tr>
            ) : dosenList.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">Belum ada data dosen bray.</td>
              </tr>
            ) : (
              dosenList.map((dosen, index) => (
                <tr key={dosen.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{(page - 1) * limit + index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">{dosen.nidn}</td>
                  <td className="p-4 text-gray-600">{dosen.nama}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteDosen(dosen.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* NAVIGASI PAGINATION DOSEN */}
        {!isLoading && dosenList.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t">
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
        )}
      </div>
    </div>
  );
};

export default Dosen;