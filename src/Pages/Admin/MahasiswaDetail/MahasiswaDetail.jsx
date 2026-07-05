import React from "react";
import { useParams, Link } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import { mahasiswaList } from "@/Data/Dummy";

const MahasiswaDetail = () => {
  const { nim } = useParams(); // Ambil NIM dari URL parameter
  const mhs = mahasiswaList.find((i) => i.nim === nim);

  if (!mhs) {
    return (
      <Card>
        <div className="text-red-600 font-bold">Data mahasiswa tidak ditemukan!</div>
        <Link to="/admin/mahasiswa" className="text-blue-600 underline mt-4 inline-block">
          Kembali ke Daftar Mahasiswa
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <Heading as="h2" className="mb-0 text-left text-blue-600">
          Detail Mahasiswa
        </Heading>
        <Link 
          to="/admin/mahasiswa" 
          className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
        >
          Kembali
        </Link>
      </div>

      <table className="w-full text-sm text-gray-700">
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4 font-bold bg-gray-100 w-1/3">NIM</td>
            <td className="py-2 px-4">{mhs.nim}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-bold bg-gray-100">Nama Lengkap</td>
            <td className="py-2 px-4">{mhs.nama}</td>
          </tr>
 
          <tr className="border-b">
            <td className="py-2 px-4 font-bold bg-gray-100">Status</td>
<td className="py-2 px-4">
  <span className={mhs.status ? "text-green-600" : "text-red-600"}>
    {mhs.status ? "Aktif" : "Tidak Aktif"}
  </span>
</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;