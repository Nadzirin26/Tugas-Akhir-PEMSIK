import React from "react";
import Heading from "@/Pages/Admin/Components/Heading";
import { useMahasiswa } from "@/Utils/Helpers/Hooks/useMahasiswa";
import { useDosen } from "@/Utils/Helpers/Hooks/useDosen";
import { useMataKuliah } from "@/Utils/Helpers/Hooks/useMataKuliah";

// Import komponen dari Recharts
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const Dashboard = () => {
  // 1. Ambil semua data pakai mesin React Query dari Tugas 11
  // Kita set _limit tinggi biar semua data ke-fetch untuk dihitung grafiknya
  const { data: resMahasiswa, isLoading: loadMhs } = useMahasiswa({ _limit: 100 });
  const { data: resDosen, isLoading: loadDsn } = useDosen({ _limit: 100 });
  const { data: resMatkul, isLoading: loadMk } = useMataKuliah({ _limit: 100 });

  const mahasiswa = resMahasiswa?.data || [];
  const dosen = resDosen?.data || [];
  const matakuliah = resMatkul?.data || [];

  const isLoading = loadMhs || loadDsn || loadMk;

  // 2. Olah Data untuk Chart 1: Total Entitas (Bar Chart)
  const dataTotal = [
    { name: "Mahasiswa", jumlah: mahasiswa.length },
    { name: "Dosen", jumlah: dosen.length },
    { name: "Mata Kuliah", jumlah: matakuliah.length },
  ];

  // 3. Olah Data untuk Chart 2: Status Mahasiswa (Pie Chart)
  const mhsAktif = mahasiswa.filter(m => m.status === true).length;
  const mhsTidakAktif = mahasiswa.filter(m => m.status === false).length;
  const dataStatus = [
    { name: "Aktif", value: mhsAktif },
    { name: "Tidak Aktif", value: mhsTidakAktif },
  ];
  const PIE_COLORS = ["#10B981", "#EF4444"]; // Hijau untuk Aktif, Merah untuk Tidak Aktif

  // 4. Olah Data untuk Chart 3: SKS per Mata Kuliah (Bar Chart)
  const dataSks = matakuliah.map(m => ({
    name: m.nama,
    sks: m.sks
  }));

  if (isLoading) {
    return <div className="p-6 text-center text-blue-600 font-bold">Sedang memuat grafik Dashboard... 🚀</div>;
  }

  return (
    <div className="p-6">
      <Heading as="h1" className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard Analitik
      </Heading>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* CHART 1: Total Data Sistem */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-700 text-center">Total Data Sistem</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTotal} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Legend />
                <Bar dataKey="jumlah" fill="#3B82F6" name="Total Keseluruhan" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Status Keaktifan Mahasiswa */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-700 text-center">Rasio Keaktifan Mahasiswa</h3>
          <div className="h-72 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dataStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Persebaran SKS Mata Kuliah */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 xl:col-span-2">
          <h3 className="text-lg font-bold mb-4 text-gray-700 text-center">Bobot SKS per Mata Kuliah</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSks} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Legend />
                <Bar dataKey="sks" fill="#8B5CF6" name="Jumlah SKS" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;