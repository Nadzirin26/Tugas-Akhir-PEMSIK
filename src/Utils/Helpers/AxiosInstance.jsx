import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Pastikan hurufnya bener dan nggak ada typo
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;