import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Form from "@/Pages/Admin/Components/Form";

// Import API & Helper
import { login } from "@/Utils/Helpers/Apis/AuthApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Import Context dari Tugas 9
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext(); // <-- Ambil state global dari Context

  // Kalau di Context sudah ada data user (sudah login), otomatis lempar ke dashboard admin
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userData = await login(email, password);
      
      // Simpan data user ke Context (otomatis masuk localStorage juga lewat mesin Provider)
      setUser(userData); 
      
      toastSuccess("Login berhasil bray! 🎉");

      // Beri jeda 10ms supaya React selesai memperbarui state Context sebelum pindah halaman
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 10);
    } catch (err) {
      toastError(err.message || "Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <Heading as="h2" className="text-2xl font-bold text-center text-gray-800 mb-6">
          Masuk Aplikasi
        </Heading>

        <Form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
            <Input 
              type="email" 
              name="email" 
              placeholder="Masukkan email" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="password" title="Password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
            <Input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
          >
            Masuk Sekarang
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun admin?{" "}
          <button 
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-bold hover:underline"
          >
            Daftar di sini
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Login;