import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { getAllDosen, createDosen, deleteDosen } from "@/Utils/Helpers/Apis/DosenApi";

// Hook buat Ambil Data (UPDATE TUGAS 11)
export const useDosen = (query = {}) => {
  return useQuery({
    queryKey: ["dosen", query],
    queryFn: () => getAllDosen(query),
    select: (res) => ({
      data: res?.data || [],
      total: parseInt(res?.headers?.["x-total-count"] || "0", 10),
    }),
    keepPreviousData: true,
  });
};

// Hook buat Tambah Dosen
export const useStoreDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen baru berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan dosen."),
  });
};

// Hook buat Hapus Dosen
export const useDeleteDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus dosen."),
  });
};