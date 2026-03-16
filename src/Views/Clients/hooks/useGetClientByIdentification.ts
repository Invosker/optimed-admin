import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

export interface ClientPage<T = any> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const useGetClientByIdentification = (identification?: string) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["clientByIdentification", identification],
    enabled: Boolean(identification && identification.trim().length > 0),
    queryFn: async () => {
      const res = await apiClient.get(`/clients/identification/${identification}`);
      return res?.data ?? res;
    },
    select: (data: any): ClientPage => {
      const doc = Array.isArray(data) ? data[0] : data;
      const docs = doc ? [doc] : [];
      return {
        docs,
        page: 1,
        limit: 1,
        totalDocs: docs.length,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
      };
    },
    staleTime: 30_000,
    retry: 1,
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Cliente no encontrado");
    },
  });
};