import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";

interface RepositionItem {
  id: number;
  category: string;
  quantity: number;
  unitAmount?: string;
  note?: string;
}

interface RepositionData {
  items: RepositionItem[];
}

const REPOSITION_ENDPOINT = "/inventory/restock/massive";

export const useRepositionProducts = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  const repositionMutation = useMutation({
    mutationFn: async (repositionData: RepositionData) => {
      const response = await apiClient.post<ApiResponse>(REPOSITION_ENDPOINT, repositionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Reposición realizada con éxito");
    },
    onError: (err: any) => {
      toast.error(fnParseGetMessage(err) || "Error realizando reposición");
    },
  });

  return {
    repositionProducts: repositionMutation.mutate,
    isLoading: repositionMutation.isPending,
    isSuccess: repositionMutation.isSuccess,
    isError: repositionMutation.isError,
    error: repositionMutation.error,
  };
};
