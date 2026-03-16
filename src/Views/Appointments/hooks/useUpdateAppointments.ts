import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { Appointment, AppointmentUpdateRequest } from "../types/appointment";
import toast from "react-hot-toast";

const APPOINTMENTS_ENDPOINT = "/appointments";

interface UpdateArgs {
  id: number;
  data: AppointmentUpdateRequest;
}

export const useUpdateAppointments = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["appointments", "update"],
    mutationFn: async ({ data }: UpdateArgs): Promise<Appointment> => {
      return await apiClient.put<Appointment>(
        `${APPOINTMENTS_ENDPOINT}/update`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Cita actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: () => {
      toast.error("Error al actualizar cita");
    },
  });
};
