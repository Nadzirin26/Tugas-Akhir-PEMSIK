import React from "react";
import { useParams, Link } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";

const MahasiswaDetail = () => {
  // Ambil parameter NIM dari URL
  const { nim } = useParams();

  return (
    <Card>
      <Heading as="h2" className="text-blue-600">Detail Mahasiswa</Heading>
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <p className="text-lg">Menampilkan data untuk Mahasiswa dengan NIM: <strong>{nim}</strong></p>
        <p className="text-gray-500 mt-2 italic">*Data ini diambil menggunakan useParams() sesuai tugas 4.*</p>
      </div>
      <div className="mt-6">
        <Link to="/admin/mahasiswa" className="text-blue-600 hover:underline">
          &larr; Kembali ke Daftar Mahasiswa
        </Link>
      </div>
    </Card>
  );
};

export default MahasiswaDetail;