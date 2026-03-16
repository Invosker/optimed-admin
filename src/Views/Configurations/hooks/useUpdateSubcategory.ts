import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

export interface SubcategoryUpdateRequest {
  id: number;
  name: string;
  description?: string;
  code: string;
  isActive: boolean;
  categoryId: number;
}

interface UpdateArgs {
  data: SubcategoryUpdateRequest;
}

const SUBCATEGORIES_ENDPOINT = "/inventory/subcategories";

export const useUpdateSubcategory = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["subcategories", "update"],
    mutationFn: async ({ data }: UpdateArgs) => {
      return await apiClient.put(SUBCATEGORIES_ENDPOINT, data);
    },
    onSuccess: () => {
      toast.success("Subcategoría actualizada");
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error actualizando subcategoría");
    },
  });
};