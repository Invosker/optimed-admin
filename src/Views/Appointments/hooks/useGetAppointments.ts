import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import {
  Appointment,
  PaginatedAppointments,
  UseGetAppointmentsParams,
} from "../types/appointment";

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

const APPOINTMENTS_ENDPOINT = "/appointments";

export const useGetAppointments = (params: UseGetAppointmentsParams) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["appointments", params],
    enabled: !!token,
    queryFn: async (): Promise<ApiResponse<Appointment[]>> =>
      await apiClient.get<ApiResponse<Appointment[]>>(APPOINTMENTS_ENDPOINT, {
        params,
      }),
    select: (res): PaginatedAppointments => {
      const arr = (res?.data || []) as Appointment[];

      const { page, limit } = params;
      const meta = res._meta;
      if (meta) {
        return {
          docs: arr,
          page: meta.page_number,
          limit: meta.page_size,
          totalDocs: meta.total_elements,
          totalPages: meta.total_pages || 1,
          hasNextPage: meta.page_number < meta.total_pages,
          hasPrevPage: meta.page_number > 1,
          nextPage: meta.page_number + 1,
          prevPage: meta.page_number - 1,
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
  });
};
