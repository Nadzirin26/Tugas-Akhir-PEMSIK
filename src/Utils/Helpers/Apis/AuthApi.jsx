import axios from "../AxiosInstance";

// Fungsi Login (Yang udah lu bikin tadi)
export const login = async ( email, password ) => {
    const res = await axios.get("/user", { params: { email } });
    const user = res.data[0];

    if (!user) throw new Error("Email tidak ditemukan");
    if (user.password !== password) throw new Error("Password salah");

    return user;
};

// Fungsi Register (BARU)
export const register = async (data) => {
    // Cek dulu apakah email udah dipakai
    const checkEmail = await axios.get("/user", { params: { email: data.email } });
    if (checkEmail.data.length > 0) {
        throw new Error("Email sudah terdaftar bro!");
    }
    
    // Kalau email aman, simpan data user baru
    const res = await axios.post("/user", data);
    return res.data;
};