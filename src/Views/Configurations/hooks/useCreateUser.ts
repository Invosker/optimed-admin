import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { UserFormValues, UserApiPayload, User, mapUserFormToApi } from "../types/user";

interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

const USERS_ENDPOINT = "/admins";

const useCreateUser = () => {
  const { token } = useUser();
  const apiClient = useApiClient({ otherToken: token });
  const queryClient = useQueryClient();

  const fnCreate = async (form: UserFormValues): Promise<ApiResponse<User>> => {
    const payload: UserApiPayload = mapUserFormToApi(form);
    return await apiClient.post<ApiResponse<User>>(USERS_ENDPOINT, payload);
  };

  const mutation = useMutation({
    mutationFn: fnCreate,
    onSuccess: (res) => {
      toast.success(res?.message || "Usuario creado");
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
    },
    onError: (e: unknown) => {
      const msg = fnParseGetMessage(e as AxiosError);
      toast.error(msg || "Error al crear usuario");
    },
  });

  return {
    createUser: mutation.mutate,
    creating: mutation.isPending,
  };
};

export default useCreateUser;