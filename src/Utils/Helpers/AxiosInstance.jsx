import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://github.com/Nadzirin26/backend-tugas.git", // Pastikan hurufnya bener dan nggak ada typo
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;