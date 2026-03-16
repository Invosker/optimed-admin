import { useApiClient } from "@/hooks/useApiClient";
import { useMutation } from "@tanstack/react-query";
import { mapRoleFormToApi, RoleFormValues } from "../../types/roles";

export const useCreateRole = () => {
  const client = useApiClient();

  const createRoleMutation = useMutation({
    mutationFn: (data: RoleFormValues) => {
      const apiData = mapRoleFormToApi(data);
      return client.post("/roles", apiData);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: RoleFormValues) => {
      const apiData = mapRoleFormToApi(data);
      return client.put(`/roles/update/`, apiData);
    },
  });

  const deleteRole = useMutation({
    mutationFn: (roleId: number) => {
      return client.delete(`/roles/${roleId}`);
    },
  });

  return {
    createRoleMutation,
    updateRoleMutation,
    deleteRole,
    isPending: createRoleMutation.isPending || updateRoleMutation.isPending || deleteRole.isPending,
  };
};
