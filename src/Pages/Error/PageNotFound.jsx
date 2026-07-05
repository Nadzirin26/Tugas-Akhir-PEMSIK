import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 text-center">
      {/* Ilustrasi Angka 404 */}
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-widest">
        404
      </h1>
      
      {/* Label Error */}
      <div className="bg-blue-600 text-white px-2 text-sm rounded rotate-12 absolute mb-20">
        Halaman Tidak Ditemukan
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Kamu Nyasar, Bray?
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Maaf, halaman yang kamu cari tidak tersedia atau mungkin sudah dipindahkan ke alamat lain.
        </p>
        
        {/* Tombol Balik ke Login/Beranda */}
        <Link
          to="/"
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Balik ke Halaman Utama
        </Link>
      </div>

      {/* Footer Kecil */}
      <p className="mt-12 text-gray-400 text-xs uppercase">
        Error Code: 404_PAGE_NOT_FOUND
      </p>
    </div>
  );
};

export default PageNotFound;