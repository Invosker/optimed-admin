import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

const ENDPOINT = "/doctors";

export interface GetDoctorsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DoctorsPage<T = any> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const useGetDoctors = (params: GetDoctorsParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async () => {
      const filter = {
        identification: params?.search
      }
      const res = await apiClient.get(ENDPOINT, { params: { page: params.page, limit: params.limit, filter: JSON.stringify(filter) } });
      return res;
    },
    select: (res: any): DoctorsPage => {
      const data = res?.data ?? res;

      // // Forma común: { data: [...], _meta: {...} }
      // if (Array.isArray(data?.data) && data?._meta) {
      //   const docs = data.data;
      //   const meta = data._meta;
      //   const page = Number(meta.page_number ?? params.page ?? 1);
      //   const limit = Number(meta.page_size ?? params.limit ?? docs.length);
      //   const totalDocs = Number(meta.total_elements ?? docs.length);
      //   const totalPages = Number(meta.total_pages ?? Math.ceil(totalDocs / Math.max(1, limit)));
      //   return {
      //     docs,
      //     page,
      //     limit,
      //     totalDocs,
      //     totalPages,
      //     hasPrevPage: page > 1,
      //     hasNextPage: page < totalPages,
      //   };
      // }

      // // { docs, ...meta }
      // if (Array.isArray(data?.docs)) {
      //   const page = Number(data.page ?? params.page ?? 1);
      //   const limit = Number(data.limit ?? params.limit ?? data.docs.length);
      //   const totalDocs = Number(data.totalDocs ?? data.total ?? data.count ?? data.docs.length);
      //   const totalPages = Number(data.totalPages ?? Math.ceil(totalDocs / Math.max(1, limit)));
      //   return {
      //     docs: data.docs,
      //     page,
      //     limit,
      //     totalDocs,
      //     totalPages,
      //     hasPrevPage: page > 1,
      //     hasNextPage: page < totalPages,
      //   };
      // }

      // Array plano
      // if (Array.isArray(data)) {
      const page = params.page ?? 1;
      const limit = params.limit ?? data.length;
      const totalDocs = data.length;
      const totalPages = Math.max(1, Math.ceil(totalDocs / Math.max(1, limit)));
      const slice = data
      return {
        docs: slice,
        page,
        limit,
        totalDocs,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      };
      // }

      // return {
      //   docs: [],
      //   page: 1,
      //   limit: params.limit ?? 10,
      //   totalDocs: 0,
      //   totalPages: 1,
      //   hasPrevPage: false,
      //   hasNextPage: false,
      // };
    },
    staleTime: 30_000,
    retry: 1,
  });
};