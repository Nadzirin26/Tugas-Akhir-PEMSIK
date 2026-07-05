import { useQuery } from "@tanstack/react-query";
import axios from "@/Utils/Helpers/AxiosInstance";

const getAllKelas = async () => {
  const res = await axios.get("/kelas");
  return res.data;
};

export const useKelas = () => {
  return useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
    select: (res) => res || [],
  });
};