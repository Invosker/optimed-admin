import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ApiClient from "@/Api";
import toast from "react-hot-toast";
import { ApiResponse } from "@/types/ApiResponse";

// import type { Register } from "@/types/Register";
import { Login } from "@/types/login";
import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { AxiosError } from "axios";

const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const apiClient = new ApiClient(queryClient); // Instantiate ApiClient with QueryClient

  // Login function using ApiClient
  const fnLogin = async (data: Login): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>("/auth/admin/login", data);
    return response;
  };

  // React Query Mutation
  const mutationLogin = useMutation({
    mutationFn: fnLogin,
    onSuccess: (data: ApiResponse) => {
      console.log("🚀 ~ useAuth ~ data:", data);
      toast.success("Bienvenido");
      // Store user data in React Query for persistence
      queryClient.setQueryData(["user"], data);
      navigate("/Home/Account");

      // Automatically set token in ApiClient
      // apiClient.setToken(data.data.token);

      // Navigate to home page
    },
    onError: (error: unknown) => {
      const message = fnParseGetMessage(error as AxiosError);
      toast.error(message);
    },
  });

  const handleLogOut = () => {
    queryClient.removeQueries({ queryKey: ["user"] });
    navigate(`${import.meta.env.VITE_BASE_URL}`);
  };

  //   const fnRegister = async (data: Register): Promise<ApiResponse> => {
  //     try {
  //       const response = await apiClient.post<ApiResponse>("client/postapk", data);
  //       return response;
  //     } catch (error: unknown) {
  //       if (
  //         error &&
  //         typeof error === "object" &&
  //         "response" in error &&
  //         error.response &&
  //         typeof error.response === "object" &&
  //         "data" in error.response &&
  //         error.response.data &&
  //         typeof error.response.data === "object" &&
  //         "message" in error.response.data
  //       ) {
  //         throw new Error((error.response as { data: { message?: string } }).data?.message ?? "Login failed");
  //       }
  //       throw new Error("Login failed");
  //     }
  //   };

  //   const mutationRegister = useMutation({
  //     mutationFn: fnRegister,
  //     onSuccess: (data: ApiResponse) => {
  //       console.log("🚀 ~ useAuth ~ data:", data);
  //       toast.success("Registro exitoso");
  //     },
  //     onError: (error: unknown) => {
  //       const message =
  //         error instanceof Error
  //           ? error.message
  //           : typeof error === "object" && error && "message" in error
  //           ? (error as { message?: string }).message
  //           : "Error desconocido";
  //       toast.error(message ?? "Error desconocido");
  //     },
  //   });

  return {
    fnLogin,
    mutationLogin,
    handleLogOut,
    // loading: mutationLogin.isPending || mutationRegister.isPending,
    // mutationRegister,
  };
};

export default useAuth;
