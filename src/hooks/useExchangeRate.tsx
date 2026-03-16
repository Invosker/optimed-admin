import { ApiResponse } from "@/types/ApiResponse";
import { useApiClient } from "./useApiClient";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Custom hook to fetch and manage the exchange rate data from the API.
 * It uses react-query to handle caching, refetching, and stale data.
 * It also handles errors and displays a toast message if the API call fails.
 */
const useExchangeRate = () => {
  const apiClient = useApiClient({
    otherUrl: "https://lightsoftwareqa.com/factorls/api/",
  });

  const fnGetExchangeRate = async () => {
    const response = await apiClient.get<ApiResponse>("getfactortoday/v1");
    console.log("🚀 ~ fnGetExchangeRate ~ response:", response);
    return response.data;
  };

  const queryExchangeRate = useQuery({
    queryKey: ["factor"],
    queryFn: fnGetExchangeRate,
    enabled: true,
    refetchIntervalInBackground: true,
    refetchInterval: 60000,
    staleTime: 60000,
  });

  useEffect(() => {
    if (queryExchangeRate.isError) {
      toast.error(queryExchangeRate.error.message);
    }
  }, [queryExchangeRate]);

  return {
    factorData: queryExchangeRate.data,
  };
};

export default useExchangeRate;
