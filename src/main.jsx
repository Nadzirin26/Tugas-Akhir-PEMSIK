import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';

// Import Mesin React Query (TUGAS 10)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/Utils/Contexts/AuthContext";
import AuthLayout from "@/Pages/Auth/AuthLayout";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";  

import Login from "@/Pages/Auth/Login/Login";
import Register from "@/Pages/Auth/Register/Register"; 
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen"; 
import MataKuliah from "@/Pages/Admin/MataKuliah/MataKuliah"; 
import RencanaStudi from "@/Pages/Admin/RencanaStudi/RencanaStudi"; // <-- IMPORT TUGAS 13 BRAY
import PageNotFound from "@/Pages/Error/PageNotFound";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { Toaster } from "react-hot-toast";

// Inisialisasi Mesin Query
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> } 
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { 
        path: "mahasiswa", 
        children: [
          { index: true, element: <Mahasiswa /> },
          { path: ":id", element: <MahasiswaDetail /> } 
        ]
      },
      { path: "dosen", element: <Dosen /> },
      { path: "matakuliah", element: <MataKuliah /> },
      { path: "rencana-studi", element: <RencanaStudi /> } // <-- RUTE TUGAS 13 BRAY
    ]
  },
  { path: "*", element: <PageNotFound /> }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Bungkus aplikasi dengan QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);