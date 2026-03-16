import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

export interface CategoryUpdateRequest {
  id: number;
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
}

interface UpdateArgs {
  data: CategoryUpdateRequest;
}

const CATEGORIES_UPDATE_ENDPOINT = "inventory/categories";

export const useUpdateCategory = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["categories", "update"],
    mutationFn: async ({ data }: UpdateArgs) => {
      return await apiClient.put(CATEGORIES_UPDATE_ENDPOINT, data);
    },
    onSuccess: () => {
      toast.success("Categoría actualizada");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error actualizando categoría");
    },
  });
};