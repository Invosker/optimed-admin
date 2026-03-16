import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { InventoryItem, InventoryUpdateRequest } from "../types/inventory";

interface UpdateArgs {
  id: number;
  data: InventoryUpdateRequest;
}

export const useUpdateInventoryItem = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["inventory", "update"],
    mutationFn: async ({ data }: UpdateArgs): Promise<InventoryItem> => {
      return await apiClient.put<InventoryItem>(`/inventory/update`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};