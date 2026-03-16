import { fnParseGetMessage } from "@/Api/utils/fnParseGetMessage";
import { useApiClient } from "@/hooks/useApiClient";
import { ApiResponse } from "@/types/ApiResponse";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { User } from "./useUpdateUser";

export type Props = {
  currentUser: number;
};

const useCurrentUserToUpdate = (props: Props) => {
  const apiClient = useApiClient();

  const fnGetCurrentUser = async () => {
    const response = await apiClient.get<ApiResponse>(`/users/${props.currentUser}`);
    return response;
  };

  const queryCurrentUser = useQuery({
    queryKey: ["currentUser", props.currentUser],
    queryFn: fnGetCurrentUser,
    enabled: !!props.currentUser, // Only run the query if currentUser is provided
    // staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    // cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
  });
  console.log("🚀 ~ useCurrentUserToUpdate ~ queryCurrentUser:", queryCurrentUser.data);

  useEffect(() => {
    if (queryCurrentUser.isError) {
      toast.error(fnParseGetMessage(queryCurrentUser.error as AxiosError));
    }
  }, [queryCurrentUser]);

  return {
    currentUserData: queryCurrentUser.data as unknown as User,
  };
};

export { useCurrentUserToUpdate };
