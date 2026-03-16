import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

const ENDPOINT = "/audits";

export interface GetAuditsParams {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
}

export interface AuditPage<T = any> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const useGetAudits = (params: GetAuditsParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["audits", params],
    queryFn: async () => {
      // Enviamos los params tal cual (el wrapper ya añade baseURL y token)
      const res = await apiClient.get(ENDPOINT, { params });
      return res;
    },
    select: (res: any): AuditPage => {
      const data = res?.data ?? res;

      // Caso 1: backend del ejemplo -> { data: [...], _meta: {...}, _links: {...} }
      if (Array.isArray(data?.data) && data?._meta) {
        const docs = data.data;
        const meta = data._meta;
        const page = Number(meta.page_number ?? params.page ?? 1);
        const limit = Number(meta.page_size ?? params.limit ?? docs.length);
        const totalDocs = Number(meta.total_elements ?? docs.length);
        const totalPages = Number(meta.total_pages ?? Math.ceil(totalDocs / Math.max(1, limit)));
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        return {
          docs,
          page,
          limit,
          totalDocs,
          totalPages,
          hasPrevPage,
          hasNextPage,
        };
      }

      // Caso 2: { docs, ...meta }
      if (Array.isArray(data?.docs)) {
        const page = Number(data.page ?? params.page ?? 1);
        const limit = Number(data.limit ?? params.limit ?? data.docs.length);
        const totalDocs = Number(data.totalDocs ?? data.total ?? data.count ?? data.docs.length);
        const totalPages = Number(data.totalPages ?? Math.ceil(totalDocs / Math.max(1, limit)));
        const hasPrevPage = Boolean(data.hasPrevPage ?? data.prevPage ?? page > 1);
        const hasNextPage = Boolean(data.hasNextPage ?? data.nextPage ?? page < totalPages);
        return { docs: data.docs, page, limit, totalDocs, totalPages, hasPrevPage, hasNextPage };
      }

      // Caso 3: array plano
      if (Array.isArray(data)) {
        const page = params.page ?? 1;
        const limit = params.limit ?? data.length;
        const totalDocs = data.length;
        const totalPages = Math.max(1, Math.ceil(totalDocs / Math.max(1, limit)));
        const slice = data.slice((page - 1) * limit, page * limit);
        return {
          docs: slice,
          page,
          limit,
          totalDocs,
          totalPages,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages,
        };
      }

      // Fallback seguro
      return {
        docs: [],
        page: 1,
        limit: params.limit ?? 10,
        totalDocs: 0,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
      };
    },
    staleTime: 30_000,
    retry: 1,
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error al cargar auditorías");
    },
  });
};