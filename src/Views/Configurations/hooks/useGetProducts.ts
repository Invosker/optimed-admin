import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";

export interface ProductItem {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  category?: string | { id: number; name: string };
  subcategory?: string | { id: number; name: string };
  purchasePrice?: string | number;
  salePrice: string | number;
  minimumStock?: number;
  stock?: number;
  isActive?: boolean;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const ENDPOINT = "/inventory/all"; 

const useGetProducts = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  const query = useQuery({
    queryKey: ["products", "all"],
    queryFn: async (): Promise<ProductItem[]> => {
      const res = await apiClient.get<ApiResponse<ProductItem[]>>(ENDPOINT);
      // Si el ApiClient ya devuelve res.data directamente ajusta esta línea:
      const dataCandidate: any = res as any;
      if (Array.isArray(dataCandidate)) return dataCandidate;
      if (Array.isArray((dataCandidate as ApiResponse<ProductItem[]>).data)) {
        return (dataCandidate as ApiResponse<ProductItem[]>).data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    ...query,
    products: query.data || [],
    loadingProducts: query.isLoading,
  };
};

export default useGetProducts;