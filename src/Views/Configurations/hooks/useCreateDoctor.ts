import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import {
  DoctorFormValues,
  DoctorApiPayload,
  Doctor,
  mapDoctorFormToApi,
} from "../types/doctor";

interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

const DOCTORS_ENDPOINT = "/doctors";

const useCreateDoctor = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  const fnCreate = async (form: DoctorFormValues): Promise<ApiResponse<Doctor>> => {
    const payload: DoctorApiPayload = mapDoctorFormToApi(form);
    return await apiClient.post<ApiResponse<Doctor>>(DOCTORS_ENDPOINT, payload);
  };

  const mutation = useMutation({
    mutationFn: fnCreate,
    onSuccess: (res) => {
      toast.success(res?.message || "Médico creado");
      queryClient.invalidateQueries({ queryKey: ["doctors", "all"] });
    },
    onError: (e: unknown) => {
      const msg = fnParseGetMessage(e as AxiosError);
      toast.error(msg || "Error al crear médico");
    },
  });

  return {
    createDoctor: mutation.mutate,
    creating: mutation.isPending,
  };
};

export default useCreateDoctor;