import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";

export interface CategoryItem {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  isActive?: boolean;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const ENDPOINT = "/inventory/categories/all"; 

const useGetCategories = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  const query = useQuery({
    queryKey: ["categories", "all"],
    queryFn: async (): Promise<CategoryItem[]> => {
      const res = await apiClient.get<ApiResponse<CategoryItem[]>>(ENDPOINT);
      console.log("🚀 ~ useGetCategories ~ res:", res)
      // Ajusta según estructura real del backend
      return Array.isArray(res) ? (res as unknown as CategoryItem[]) :
        (res as unknown as ApiResponse<CategoryItem[]>).data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const options = (query.data || []).map(c => ({
    label: `${c.name} (${c.code})`,
    value: c.id,
  }));
    console.log("🚀 ~ useGetCategories ~ query.data:", query.data);

  return {
    ...query,
    categories: query.data || [],
    optionsCategories: options,
    loadingCategories: query.isLoading,
  };
};

export default useGetCategories;