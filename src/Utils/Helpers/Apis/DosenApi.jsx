import axios from "../AxiosInstance";

// UPDATE TUGAS 11: Menerima params dan return full response
export const getAllDosen = async (params = {}) => {
  const response = await axios.get("/dosen", { params });
  return response; 
};

export const createDosen = async (data) => {
  const response = await axios.post("/dosen", data);
  return response.data;
};

export const deleteDosen = async (id) => {
  const response = await axios.delete(`/dosen/${id}`);
  return response.data;
};