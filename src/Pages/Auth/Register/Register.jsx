import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import Label from "@/Pages/Auth/Components/Label";
import Input from "@/Pages/Auth/Components/Input";
import Form from "@/Pages/Admin/Components/Form";

// Panggil fungsi register dari AuthApi
import { register } from "@/Utils/Helpers/Apis/AuthApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Data yang mau dikirim ke db.json
    const newData = { name, email, password };

    try {
      await register(newData);
      toastSuccess("Registrasi Berhasil! Silakan Login."); 
      // Kalau sukses, lempar balik ke halaman Login
      navigate("/");
    } catch (err) {
      toastError(err.message || "Gagal daftar bro!"); 
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <Heading as="h2" className="text-2xl font-bold text-center text-gray-800 mb-6">
          Daftar Akun Baru
        </Heading>

        <Form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</Label>
            <Input 
              type="text" 
              name="name" 
              placeholder="Masukkan nama" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required 
            />
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
            <Input 
              type="email" 
              name="email" 
              placeholder="emailmu@mail.com" 
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-4"
          >
            Daftar Sekarang
          </Button>
        </Form>

        {/* Tombol balik ke Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <button 
            type="button"
            onClick={() => navigate("/")}
            className="text-blue-600 font-bold hover:underline"
          >
            Masuk di sini
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Register;