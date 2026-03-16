import { useApiClient } from "@/hooks/useApiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Client } from "../types/client";

const useSearchClient = (props: { identification: string }) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const fnSearchClient = async () => {
    const response = apiClient.get(`/clients/identification/${props.identification}`);
    return response;
  };

  const deleteSearch = () => {
    queryClient.resetQueries({ queryKey: ["searchClient", props.identification] });
  };

  const querySearchClient = useQuery({
    queryKey: ["searchClient", props.identification],
    queryFn: fnSearchClient,
    enabled: !!props.identification,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (querySearchClient.isError) {
      toast.error(querySearchClient.error.message);
    }
  }, [querySearchClient]);

  return {
    clientData: querySearchClient.data as Client,
    deleteSearch,
  };
};

export default useSearchClient;
