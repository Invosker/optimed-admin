import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

export type UpdateDoctorBody = {
  email: string;
  name: string;
  identification: string;
  identificationType: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  id: number | string;
  isActive: boolean;
  isAdmin: boolean;
  createdBy: number | string;
};

export const useUpdateDoctor = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["doctor:update"],
    mutationFn: async (body: UpdateDoctorBody) => {
      const res = await apiClient.put("/doctors/update", body);
      return res?.data ?? res;
    },
    onSuccess: () => {
      toast.success("Doctor actualizado");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error al actualizar doctor");
    },
  });
};