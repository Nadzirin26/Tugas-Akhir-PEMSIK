import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Helpers/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// Hook buat Ambil Data (UPDATE TUGAS 11 - Pagination & Filter)
export const useMahasiswa = (query = {}) => {
  return useQuery({
    queryKey: ["mahasiswa", query], // Cache sekarang memantau perubahan parameter
    queryFn: () => getAllMahasiswa(query),
    select: (res) => ({
      data: res?.data || [],
      total: parseInt(res?.headers?.["x-total-count"] || "0", 10), // Ambil total baris dari header
    }),
    keepPreviousData: true, // Biar tabel nggak nge-blink pas ganti halaman
  });
};

// Hook buat Tambah Data
export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan mahasiswa."),
  });
};

// Hook buat Edit Data
export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui mahasiswa."),
  });
};

// Hook buat Hapus Data
export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus mahasiswa."),
  });
};