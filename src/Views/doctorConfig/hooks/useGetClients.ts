import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { Client } from "../types/client";

interface ApiResponse<T = unknown> {
  data?: T;
  _meta?: {
    page_size: number;
    page_number: number;
    total_elements: number;
    total_pages: number;
  };
  message?: string;
}

export interface UseGetClientsParams {
  page: number;
  limit: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}

export interface PaginatedClients {
  docs: Client[];
  limit: number;
  page: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
}

const CLIENTS_ENDPOINT = "/clients";

export const useGetClients = (raw: UseGetClientsParams) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  const page = Number(raw.page) > 0 ? Number(raw.page) : 1;
  const limit = Number(raw.limit) > 0 ? Number(raw.limit) : 10;
  const { search, status } = raw;

  const filterObj: Record<string, any> = {};
  if (search) {
    filterObj.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  if (status && status !== "all") {
    filterObj.isActive = status === "active";
  }

  const filterParam = Object.keys(filterObj).length
    ? JSON.stringify(filterObj)
    : "{}";

  return useQuery({
    queryKey: ["clients", { page, limit, filter: filterParam }],
    enabled: Boolean(token),
    queryFn: async (): Promise<ApiResponse<Client[]>> =>
      await apiClient.get<ApiResponse<Client[]>>(CLIENTS_ENDPOINT, {
        params: {
          page,
          limit,
          filter: filterParam,
          sort: JSON.stringify({ createdAt: -1 }),
          fields: "id,name,email",
        },
      }),
    select: (res): PaginatedClients => {
      const arr = (res?.data || []) as Client[];
      const meta = res._meta;
      if (meta) {
        const safePageSize =
          meta.page_size && meta.page_size > 0 ? meta.page_size : limit;
        const safeTotalPages =
          meta.total_pages && meta.total_pages > 0 ? meta.total_pages : 1;
        return {
          docs: arr,
          page: meta.page_number || page,
          limit: safePageSize,
          totalDocs: meta.total_elements || arr.length,
          totalPages: safeTotalPages,
          hasNextPage:
            (meta.page_number || page) < (meta.total_pages || safeTotalPages),
          hasPrevPage: (meta.page_number || page) > 1,
          nextPage: (meta.page_number || page) + 1,
          prevPage: (meta.page_number || page) - 1,
        };
      }
      const total = arr.length;
      return {
        docs: arr,
        page,
        limit,
        totalDocs: total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNextPage: total > page * limit,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
