import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { CreateClientInput, Client } from "../types/client";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

const CLIENTS_ENDPOINT = "/clients";

export const useCreateClient = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["clients", "create"],
    mutationFn: async (payload: CreateClientInput): Promise<Client> => {
      return await apiClient.post<Client>(CLIENTS_ENDPOINT, payload);
    },
    onSuccess: (data) => {
      toast.success("Cliente creado");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error creando cliente");
    },
  });
};