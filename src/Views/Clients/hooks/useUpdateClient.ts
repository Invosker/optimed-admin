import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

export type UpdateClientBody = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  identificationType: string;
  address: string;
  description: string;
  dateOfBirth: string; // YYYY-MM-DD
  id: number | string;
  isActive: boolean;
  isAdmin: boolean;
  createdBy: number | string;
};

export const useUpdateClient = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["client:update"],
    mutationFn: async (body: UpdateClientBody) => {
      const res = await apiClient.put("/clients/update", body);
      return res?.data ?? res;
    },
    onSuccess: () => {
      toast.success("Cliente actualizado");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error al actualizar cliente");
    },
  });
};