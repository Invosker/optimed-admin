import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { useApiClient } from "@/hooks/useApiClient";
import { ApiResponse } from "@/types/ApiResponse";
import type { Login } from "@/types/login";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
const useLogin = () => {
  const apiClient = useApiClient();
  const fnLogin = async (data: Login): Promise<ApiResponse> => {
    const newData = {
      ...data,
    };
    const response = await apiClient.post<ApiResponse>("/login", newData);
    return response;
    // if (captcha !== undefined) {
    // } else {
    // 	toast.error('Por favor validar el captcha')
    // }
  };

  const mutationLogin = useMutation({
    mutationFn: fnLogin,
    onSuccess: (data: ApiResponse) => {
      console.log("🚀 ~ Example ~ data:", data);
    },
    onError: (error: unknown) => {
      const message = fnParseGetMessage(error as AxiosError);
      toast.error(message);
    },
  });

  return {
    mutationLogin,
    loading: mutationLogin.isPending,
  };
};

export default useLogin;
