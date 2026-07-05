import axios from "../AxiosInstance";

// Update: Sekarang menerima parameter dan mengembalikan FULL response (bukan cuma .data)
export const getAllMahasiswa = async (params = {}) => {
    const response = await axios.get("/mahasiswa", { params });
    return response; 
};

export const storeMahasiswa = async (data) => {
    const response = await axios.post("/mahasiswa", data);
    return response.data;
};

export const updateMahasiswa = async (id, data) => {
    const response = await axios.put(`/mahasiswa/${id}`, data);
    return response.data;
};

export const deleteMahasiswa = async (id) => {
    const response = await axios.delete(`/mahasiswa/${id}`);
    return response.data;
};