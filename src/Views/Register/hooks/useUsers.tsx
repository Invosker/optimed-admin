import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { useApiClient } from "@/hooks/useApiClient";
import { ApiResponse } from "@/types/ApiResponse";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export type UserData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  accept?: boolean;
}

const useUsers = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();

  const fnRegisterUser = async (data: UserData) => {
    delete data.confirmPassword;
    delete data.accept;
    const newData = {
      ...data,
      roleId: 2,
    };
    const response = await apiClient.post<ApiResponse>("/users", newData);
    return response.data;
  };

  const mutationUsers = useMutation({
    mutationFn: fnRegisterUser,
    onSuccess: (data) => {
      console.log("User created successfully:", data);
      navigate(`${import.meta.env.VITE_BASE_URL}`);
      toast.success("Proceso realizado con exito");
    },
    onError: (error: AxiosError) => {
      const message = fnParseGetMessage(error);
      toast.error(message);
    },
  });

  return { mutationUsers };
};
export { useUsers };
