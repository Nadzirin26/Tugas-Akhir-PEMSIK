import React from "react";
import { Navigate } from "react-router-dom";
// Import Context dari Tugas 9
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStateContext(); // <-- Ambil status login user dari Context secara realtime

  // Jika tidak ada user yang login di Context, paksa tendang balik ke halaman Login ("/")
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Jika user lolos verifikasi (sudah login), izinkan komponen admin dirender
  return children;
};

export default ProtectedRoute;