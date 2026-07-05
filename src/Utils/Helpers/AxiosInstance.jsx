import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://my-json-server.typicode.com/Nadzirin26/backend-tugas", // Pastikan hurufnya bener dan nggak ada typo
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;