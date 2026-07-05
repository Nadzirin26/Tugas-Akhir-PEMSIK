import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMataKuliah, createMataKuliah, deleteMataKuliah } from "@/Utils/Helpers/Apis/MataKuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Hook buat Ambil Data (UPDATE TUGAS 11)
export const useMataKuliah = (query = {}) => {
  return useQuery({
    queryKey: ["mata-kuliah", query],
    queryFn: () => getAllMataKuliah(query),
    select: (res) => ({
      data: res?.data || [],
      total: parseInt(res?.headers?.["x-total-count"] || "0", 10),
    }),
    keepPreviousData: true,
  });
};

// Hook buat Tambah Data
export const useStoreMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata Kuliah berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan Mata Kuliah."),
  });
};

// Hook buat Hapus Data
export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata Kuliah berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus Mata Kuliah."),
  });
};