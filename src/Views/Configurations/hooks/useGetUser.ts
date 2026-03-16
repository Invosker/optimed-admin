import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { User } from "../types/user";

interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

interface PaginatedUsers {
  docs: User[];
  limit: number;
  page: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
}

interface UseGetUsersParams {
  page: number;
  limit: number;
  search?: string; 
  status?: "all" | "active" | "inactive";
}

const USERS_ENDPOINT = "/admins";

export const useGetUsers = (params: UseGetUsersParams) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["users", params],
    queryFn: async (): Promise<ApiResponse<User[]>> => {
      return await apiClient.get<ApiResponse<User[]>>(USERS_ENDPOINT, {
        params,
      });
    },
    select: (res): PaginatedUsers => {
      const arr = (res?.data || []) as User[];
      const total = arr.length;
      const { page, limit } = params;
      return {
        docs: arr,
        totalDocs: total,
        limit,
        page,
        totalPages: total, // mimicking doctor logic (cada item = 1 página si luego ajustas)
        hasNextPage: total > limit,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
      };
    },
  });
};