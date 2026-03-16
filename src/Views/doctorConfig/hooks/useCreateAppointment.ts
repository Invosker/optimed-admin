import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";
import { Appointment, AppointmentCreateInput } from "../types/appointment";

const APPOINTMENTS_ENDPOINT = "/appointments";

export const useCreateAppointment = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["appointments", "create"],
    mutationFn: async (payload: AppointmentCreateInput): Promise<Appointment> => {
      return await apiClient.post<Appointment>(APPOINTMENTS_ENDPOINT, payload);
    },
    onSuccess: () => {
      toast.success("Cita creada");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (err: any) => {
      console.log("🚀 ~ useCreateAppointment ~ err:", err)
      toast.error(fnParseGetMessage(err) || "Error creando cita");
    },
  });
};