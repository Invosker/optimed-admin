import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";
import type { SalesPage, Sale } from "../types/sale";

export interface GetSalesParams {
  page?: number;
  limit?: number;
}

export const useGetSales = (params: GetSalesParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      const { page = 1, limit = 10 } = params;
      const res = await apiClient.get("/sales", { params: { page, limit } });
      return res?.data ?? res;
    },
    select: (data: any): SalesPage => {
      if (Array.isArray(data)) {
        const docs = data as Sale[];
        return {
          docs,
          page: 1,
          limit: docs.length,
          totalDocs: docs.length,
          totalPages: 1,
          hasPrevPage: false,
          hasNextPage: false,
        };
      }
      if (data?.docs) return data as SalesPage;
      const docs = (data?.data ?? []) as Sale[];
      return {
        docs,
        page: Number(data?.page ?? 1),
        limit: Number(data?.limit ?? docs.length ?? 10),
        totalDocs: Number(data?.totalDocs ?? data?.total ?? docs.length ?? 0),
        totalPages: Number(data?.totalPages ?? 1),
        hasPrevPage: Boolean(data?.hasPrevPage ?? (data?.page ?? 1) > 1),
        hasNextPage: Boolean(
          data?.hasNextPage ??
            (data?.page ?? 1) < (data?.totalPages ?? 1)
        ),
      };
    },
    staleTime: 30_000,
    retry: 1,
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error al cargar ventas");
    },
  });
};