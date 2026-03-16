import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

export interface DoctorUpdateRequest {
  id: number;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  identification: string;
  identificationType: string;
  isActive: boolean;
  isAdmin?: boolean;
  createdBy?: number;
}

interface UpdateArgs {
  data: DoctorUpdateRequest;
}

const DOCTORS_UPDATE_ENDPOINT = "/doctors/update";

export const useUpdateDoctor = () => {
  const { token, user } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["doctors", "update"],
    mutationFn: async ({ data }: UpdateArgs) => {
      const payload = {
        ...data,
        createdBy: data.createdBy ?? (user?.id ? Number(user.id) : undefined),
      };
      return await apiClient.put(DOCTORS_UPDATE_ENDPOINT, payload);
    },
    onSuccess: () => {
      toast.success("Médico actualizado");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error actualizando médico");
    },
  });
};