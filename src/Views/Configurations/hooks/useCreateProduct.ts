import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import toast from "react-hot-toast";
import useUser from "@/hooks/useUser";
import { mapFormToApi, ProductFormValues, ProductApiPayload } from "../types/product";

interface ApiResponse {
  message: string;
  data?: unknown;
}

const useCreateProduct = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  const fnCreate = async (formData: ProductFormValues): Promise<ApiResponse> => {
    const payload: ProductApiPayload = mapFormToApi(formData);
    const res = await apiClient.post<ApiResponse>("/inventory/", payload);
    return res;
  };

  const mutation = useMutation({
    mutationFn: fnCreate,
    onSuccess: () => {
      toast.success("Producto creado");
      queryClient.invalidateQueries({ queryKey: ["products", "all"] });
    },
    onError: (e: unknown) => {
      console.error(e);
      toast.error("Error al crear producto");
    },
  });

  return {
    createProduct: mutation.mutate,
    creating: mutation.isPending,
  };
};

export default useCreateProduct;