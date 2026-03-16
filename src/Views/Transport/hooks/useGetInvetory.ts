import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { ApiResponse, DocPage, InventoryItem, InventoryQueryParams, PaginatedInventory } from "../types/inventory";

const INVENTORY_ENDPOINT = "/inventory";

export const useGetInventory = (params: InventoryQueryParams) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  const { page, limit, search, category, status } = params;

  const filter = {
    name: search
  }
  console.log("🚀 ~ useGetInventory ~ filter:", filter, JSON.stringify(filter))

  const queryInventory = useQuery({
    queryKey: ["inventory", page, limit, search ?? null, category ?? null, status ?? null],
    enabled: Boolean(token),
    retry: false, // desactiva reintentos mientras depuras loop
    queryFn: async (): Promise<ApiResponse<InventoryItem[]>> =>
      await apiClient.get<ApiResponse<InventoryItem[]>>(INVENTORY_ENDPOINT, {
        params: { page, limit, filter:JSON.stringify(filter) },
      }),
    select: (res): PaginatedInventory => {
      const raw = res?.data || [];
      const normalized: InventoryItem[] = raw.map((r: any) => ({
        ...r,
        purchasePrice: r.purchasePrice ? parseFloat(r.purchasePrice) : 0,
        salePrice: r.salePrice ? parseFloat(r.salePrice) : 0,
        tax: r.tax && !isNaN(Number(r.tax)) ? Number(r.tax) : 0,
        discountPercentage: r.discountPercentage ? parseFloat(r.discountPercentage) : 0,
      }));

      const meta = res._meta;
      return {
        docs: normalized,
        page: meta?.page_number ?? page,
        limit: meta?.page_size ?? limit,
        totalDocs: meta?.total_elements ?? normalized.length,
        totalPages: meta?.total_pages ?? 1,
        hasNextPage: meta ? meta.page_number < meta.total_pages : false,
        hasPrevPage: meta ? meta.page_number > 1 : page > 1,
        nextPage: meta ? meta.page_number + 1 : page + 1,
        prevPage: meta ? meta.page_number - 1 : page - 1,
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    data: queryInventory.data as DocPage,
    isLoading: queryInventory.isLoading,
    isError: queryInventory.isError,
    error: queryInventory.error,
  };
};
