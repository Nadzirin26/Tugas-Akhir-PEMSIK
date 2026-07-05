import axios from "../AxiosInstance";

// UPDATE TUGAS 11: Menerima params dan return full response
export const getAllMataKuliah = async (params = {}) => {
  const response = await axios.get("/matakuliah", { params });
  return response;
};

export const createMataKuliah = async (data) => {
  const response = await axios.post("/matakuliah", data);
  return response.data;
};

export const deleteMataKuliah = async (id) => {
  const response = await axios.delete(`/matakuliah/${id}`);
  return response.data;
};