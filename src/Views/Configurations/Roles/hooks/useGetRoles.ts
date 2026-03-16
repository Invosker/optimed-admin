import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";
import { Role } from "../../types/roles";

export const useGetRoles = () => {
    const client = useApiClient();

    return useQuery<Role[]>({
        queryKey: ["roles"],
        queryFn: () => {
            return client.get("/roles");
        },
    });
};
