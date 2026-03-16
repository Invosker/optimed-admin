import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { Doctor } from "../types/doctor";

interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

interface PaginatedDoctors {
  docs: Doctor[];
//   totalDocs: number;
  limit: number;
  page: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
//   nextPage?: number;
//   prevPage?: number;
}

interface UseGetDoctorsParams {
  page: number;
  limit: number;
  search: string;
  status?: "all" | "active" | "inactive";
}

const DOCTORS_ENDPOINT = "/doctors";

export const useGetDoctors = (params: UseGetDoctorsParams) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async (): Promise<ApiResponse<Doctor[]>> => {
      //   const qs = buildQueryString(params);
      return await apiClient.get<ApiResponse<Doctor[]>>(
        `${DOCTORS_ENDPOINT}`,
        { params }
      );
    },
    select: (res) => {
        return {
            docs: res?.data,
            totalDocs: res?.data?.length,
            limit: params.limit,
            page: params.page,
            totalPages: res?.data?.length,
            hasNextPage: res?.data?.length ?? 0 > params.limit,
            hasPrevPage: params.page > 1,
            nextPage: params.page + 1,
            prevPage: params.page - 1,
        } as PaginatedDoctors;
    },
  });
};
