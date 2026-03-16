import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import toast from "react-hot-toast";
import useUser from "@/hooks/useUser";
import { CategoryFormValues, CategoryApiPayload, mapCategoryFormToApi } from "../types/categories";
import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { AxiosError } from "axios";

interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

const useCreateCategory = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  const fnCreate = async (formData: CategoryFormValues): Promise<ApiResponse> => {
    const payload: CategoryApiPayload = mapCategoryFormToApi(formData);
    return await apiClient.post<ApiResponse>("inventory/categories", payload);
  };

  const mutation = useMutation({
    mutationFn: fnCreate,
    onSuccess: () => {
      toast.success("Categoría creada");
      queryClient.invalidateQueries({ queryKey: ["categories", "all"] });
    },
    onError: (e: unknown) => {
      const msg = fnParseGetMessage(e as AxiosError);
      toast.error(msg || "Error al crear categoría");
    },
  });

  return {
    createCategory: mutation.mutate,
    creating: mutation.isPending,
  };
};

export default useCreateCategory;
