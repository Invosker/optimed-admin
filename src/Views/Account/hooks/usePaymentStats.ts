import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import type {
  DateRangeParams,
  PaymentStatsByTypeResponse,
  PaymentStatsByOriginResponse,
  PaymentStatsByDateResponse,
  PaymentStatsByDateRangeResponse,
  PaymentStatsSumByTypeResponse,
  PaymentStatsByMonthResponse,
  PaymentStatsByYearResponse,
} from "../types/paymentStats";

// Hook for payment stats by type
export const usePaymentStatsByType = (params: DateRangeParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  console.log("🔍 usePaymentStatsByType - Token:", !!token, "Params:", params);

  return useQuery({
    queryKey: ["paymentStats", "byType", params],
    queryFn: async () => {
      console.log("📡 Calling /payments/stats/by-type with params:", params);
      const res = await apiClient.get("/payments/stats/by-type", { params });
      console.log("✅ Response from /payments/stats/by-type:", res);
      return res?.data ?? res;
    },
    select: (data): PaymentStatsByTypeResponse => {
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
    staleTime: 60000,
    retry: 1,
  });
};

// Hook for payment stats by origin
export const usePaymentStatsByOrigin = (params: DateRangeParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["paymentStats", "byOrigin", params],
    queryFn: async () => {
      const res = await apiClient.get("/payments/stats/by-origin", { params });
      return res?.data ?? res;
    },
    select: (data): PaymentStatsByOriginResponse => {
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
    staleTime: 60000,
    retry: 1,
  });
};

// Hook for payment stats by date (no params)
export const usePaymentStatsByDate = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["paymentStats", "byDate"],
    queryFn: async () => {
      const res = await apiClient.get("/payments/stats/by-date");
      return res?.data ?? res;
    },
    select: (data): PaymentStatsByDateResponse => {
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
    staleTime: 60000,
    retry: 1,
  });
};

// Hook for payment stats by date range
export const usePaymentStatsByDateRange = (params: DateRangeParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["paymentStats", "byDateRange", params],
    queryFn: async () => {
      const res = await apiClient.get("/payments/stats/by-date-range", {
        params,
      });
      return res?.data ?? res;
    },
    select: (data): PaymentStatsByDateRangeResponse => {
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
    staleTime: 60000,
    retry: 1,
  });
};

// Hook for payment stats sum by type
export const usePaymentStatsSumByType = (params: DateRangeParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["paymentStats", "sumByType", params],
    queryFn: async () => {
      const res = await apiClient.get("/payments/stats/sum-by-type", {
        params,
      });
      return res?.data ?? res;
    },
    select: (data): PaymentStatsSumByTypeResponse => {
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
    staleTime: 60000,
    retry: 1,
  });
};

// Hook for payment stats by month
export const usePaymentStatsByMonth = (params: DateRangeParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["paymentStats", "byMonth", params],
    queryFn: async () => {
      const res = await apiClient.get("/payments/stats/by-month", { params });
      return res?.data ?? res;
    },
    select: (data): PaymentStatsByMonthResponse => {
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
    staleTime: 60000,
    retry: 1,
  });
};

// Hook for payment stats by year
export const usePaymentStatsByYear = (params: DateRangeParams = {}) => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });

  return useQuery({
    queryKey: ["paymentStats", "byYear", params],
    queryFn: async () => {
      const res = await apiClient.get("/payments/stats/by-year", { params });
      return res?.data ?? res;
    },
    select: (data): PaymentStatsByYearResponse => {
      return Array.isArray(data) ? data : [];
    },
    enabled: !!token,
    staleTime: 60000,
    retry: 1,
  });
};
