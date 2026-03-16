import { ApiResponse } from "@/types/ApiResponse";
import { useApiClient } from "./useApiClient";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFactor = () => {
  const apiClient = useApiClient({
    otherUrl: "https://lightsoftwareqa.com/factorls/api/",
  });

  const fnGetFactor = async () => {
    const response = await apiClient.get<ApiResponse>("getfactortoday/v1");
    console.log("🚀 ~ fnGetFactor ~ response:", response);
    return response.data;
  };

  const queryFactor = useQuery({
    queryKey: ["factor"],
    queryFn: fnGetFactor,
    enabled: true,
    refetchIntervalInBackground: true,
    refetchInterval: 60000,
    staleTime: 60000,
  });

  useEffect(() => {
    if (queryFactor.isError) {
      toast.error(queryFactor.error.message);
    }
  }, [queryFactor]);

  return {
    factorData: queryFactor.data,
  };
};

export default useFactor;