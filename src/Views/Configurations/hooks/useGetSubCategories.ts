import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";

export interface SubcategoryItem {
  id: number;
  name: string;
  description?: string | null;
  code: string;
  isActive: boolean;
  categoryId: number;
  category?: { id: number; name: string } | string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const ENDPOINT = "/inventory/subcategories/all";

const useGetSubCategories = (categoryId?: number) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  const query = useQuery({
    queryKey: ["subcategories", "all", categoryId ?? "all"],
    queryFn: async (): Promise<SubcategoryItem[]> => {
      const endpoint = categoryId
        ? `${ENDPOINT}?categoryId=${categoryId}`
        : ENDPOINT;
      const res = await apiClient.get<ApiResponse<SubcategoryItem[]>>(endpoint);
      const anyRes: any = res;
      if (Array.isArray(anyRes)) return anyRes;
      if (Array.isArray((anyRes as ApiResponse<SubcategoryItem[]>).data)) {
        return (anyRes as ApiResponse<SubcategoryItem[]>).data;
      }
      return [];
    },
    enabled: true, // siempre (si quieres sólo cuando categoryId exista usar: !!categoryId)
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const optionsSubcategories = (query.data || [])
    .filter(sc => (categoryId ? sc.categoryId === categoryId : true))
    .map(sc => ({
      label: `${sc.name} (${sc.code})`,
      value: sc.name, // enviamos el nombre porque el payload de producto usa 'subcategory' como string
      metaId: sc.id,
    }));

  return {
    ...query,
    subcategories: query.data || [],
    optionsSubcategories,
    loadingSubcategories: query.isLoading,
  };
};

export default useGetSubCategories;