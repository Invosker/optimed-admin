import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { SubcategoryFormValues, SubcategoryApiPayload, mapSubcategoryFormToApi } from "../types/subcategories";

interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

const useCreateSubCategories = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient(); // <— añadido

  const fnCreate = async (form: SubcategoryFormValues): Promise<ApiResponse> => {
    const payload: SubcategoryApiPayload = mapSubcategoryFormToApi(form);
    return await apiClient.post<ApiResponse>("/inventory/subcategories", payload);
  };

  const mutation = useMutation({
    mutationFn: fnCreate,
    onSuccess: () => {
      toast.success("Subcategoría creada");
      // Invalidar todos los listados (sin y con filtros)
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
    onError: (e: unknown) => {
      const msg = fnParseGetMessage(e as AxiosError);
      toast.error(msg || "Error al crear subcategoría");
    },
  });

  return {
    createSubcategory: mutation.mutate,
    creating: mutation.isPending,
  };
};

export default useCreateSubCategories;