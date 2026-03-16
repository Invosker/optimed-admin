import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { useApiClient } from "@/hooks/useApiClient";
import { ApiResponse } from "@/types/ApiResponse";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  roleId: number;
  description: string;
  name: string;
  lastName: string;
  phone: string;
  id: number;
  preferenceLanguage: number;
  preference: number;
  notificationsNew: boolean;
  notifications: boolean;
  reporting: number;
}

const useUpdateUser = () => {
  const apiClient = useApiClient();

  const fnUpdateUser = async (data: User) => {
    delete data.confirmPassword;
    const response = await apiClient.put<ApiResponse>(`/users/update`, data);
    return response.data;
  };

  const mutationUpdateUser = useMutation({
    mutationFn: fnUpdateUser,
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
      toast.success("Perfil actualizado con exito");
    },
    onError: (error: AxiosError) => {
      const message = fnParseGetMessage(error);
      toast.error(message);
    },
  });

  return { mutationUpdateUser };
};
export { useUpdateUser };
