export interface RoleFormValues {
  id?: number;
  roleName: string;
  name?: string;
  active: boolean;
  permissions: string; // JSON stringified ModulePermissionDefinition
}

export interface Role extends RoleFormValues {
  id: number; // Override to make id required (not optional)
  createdAt?: string;
  updatedAt?: string;
}

export const mapRoleFormToApi = (f: RoleFormValues): RoleFormValues => ({
  ...f,
  roleName: f.roleName.trim(),
});
