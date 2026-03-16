import { useForm, FormProvider } from "react-hook-form";
import { useState, useRef } from "react";
import TextField from "@/Components/Input/Input";
import Button from "@/Components/Button";
import Checkbox from "@/Components/Input/CheckBoxN";
import { MODULE_PERMISSIONS } from "../types/user";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import DynamicTable from "@/Components/DynamicTable";
import { useCreateRole } from "./hooks/useCreateRole";
import toast from "react-hot-toast";
import { useGetRoles } from "./hooks/useGetRoles";
import { RoleFormValues } from "../types/roles";

export default function ConfigRoles() {
  const methods = useForm<RoleFormValues>({
    defaultValues: {
      roleName: "",
      active: true,
      // permissions: MODULE_PERMISSIONS,
    },
  });

  const { data: roles, isLoading: loadingRoles, refetch } = useGetRoles();
  const {
    createRoleMutation,
    isPending: creating,
    updateRoleMutation,
    deleteRole,
  } = useCreateRole();

  const [permissions, setPermissions] =
    useState<typeof MODULE_PERMISSIONS>(MODULE_PERMISSIONS);
  const roleNameRef = useRef<HTMLInputElement>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<RoleFormValues | null>(null);

  const togglePermission = (moduleKey: string, actionKey: string) => {
    setPermissions((prev) =>
      prev.map((m) => {
        if (m.moduleKey !== moduleKey) return m;
        return {
          ...m,
          actions: (m.actions || []).map((a) =>
            a.actionKey === actionKey ? { ...a, selected: !a.selected } : a
          ),
        };
      })
    );
  };

  const onSubmit = (data: RoleFormValues) => {
    const roleData = {
      ...data,
      permissions: JSON.stringify(permissions),
    };
    if (editingRole === null) {
      return createRoleMutation.mutate(roleData, {
        onSuccess: () => {
          toast.success("Rol creado con éxito");
          refetch();
          methods.reset();
        },
        onError: () => {
          toast.error("Error al crear el rol");
        },
      });
    }
    updateRoleMutation.mutate(
      { ...roleData, id: editingRole.id },
      {
        onSuccess: () => {
          toast.success("Rol actualizado con éxito");
          refetch();
          methods.reset();
          setEditingRole(null);
        },
        onError: () => {
          toast.error("Error al actualizar el rol");
        },
      }
    );
  };

  const handleDelete = (role: RoleFormValues) => {
    // Here you would call the delete mutation
    console.log("Deleting role", role);
    deleteRole.mutate(role.id!, {
      onSuccess: () => {
        toast.success("Rol eliminado con éxito");
        refetch();
      },
      onError: () => {
        toast.error("Error al eliminar el rol");
      },
    });
  };

  const handleEdit = (role: RoleFormValues) => {
    console.log("🚀 ~ handleEdit ~ role:", role);
    roleNameRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setEditingRole(role);
    methods.setValue("roleName", role.roleName);
    methods.setValue("active", role.active);
    const rolePermissions =
      typeof role.permissions === "string" ? JSON.parse(role.permissions) : [];

    const newPermissions = MODULE_PERMISSIONS.map((mod) => {
      const roleMod = rolePermissions.find(
        (rm: (typeof MODULE_PERMISSIONS)[number]) =>
          rm.moduleKey === mod.moduleKey
      );
      if (!roleMod) return mod;
      return {
        ...mod,
        actions: mod.actions.map((act) => {
          const roleAct = roleMod.actions.find(
            (ra: typeof act) => ra.actionKey === act.actionKey
          );
          return {
            ...act,
            selected: roleAct ? roleAct.selected : false,
          };
        }),
      };
    });
    setPermissions(newPermissions);

    // setPermissions(
    //   typeof role.permissions === "string" && role.permissions !== ""
    //     ? JSON.parse(role.permissions)
    //     : MODULE_PERMISSIONS
    // );
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    methods.reset();
    setPermissions(MODULE_PERMISSIONS);
  };

  const columns = [
    { name: "ID", key: "id" },
    { name: "Nombre del Rol", key: "roleName" },
    { name: "Estado", key: "active" },
  ];

  const actions = [
    {
      label: "Editar",
      icon: <FaEdit />,
      onClick: handleEdit,
    },
    {
      label: "Eliminar",
      icon: <FaTrash />,
      onClick: handleDelete,
    },
  ];

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
            Configuración de Roles
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            ref={roleNameRef}
          >
            <TextField name="roleName" label="Nombre del Rol" />
            <div className="flex items-center gap-2 mt-5">
              <Checkbox name="active" label="Activo" />
            </div>
          </div>

          {/* Accordion de módulos / permisos */}
          <div className="mb-6">
            <h3 className="text-3xl text-center text-optimed-tiber font-bold mb-2">
              Permisos por Módulo
            </h3>
            <div className="divide-y divide-gray-200 border-2 rounded bg-white">
              {permissions.map((mod) => {
                const open = openAccordion === mod.moduleKey;
                return (
                  <div key={mod.moduleKey}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion(open ? null : mod.moduleKey)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100"
                    >
                      <span className="font-medium text-sm">{mod.label}</span>
                      <FaChevronDown
                        className={`w-3 h-3 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <div className="px-4 pb-4 mt-0.5 border-t pt-4 border-gray-200">
                        {mod.actions?.length === 0 && (
                          <p className="text-xs text-gray-500">
                            Sin permisos configurables.
                          </p>
                        )}
                        {mod.actions?.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-4">
                            {mod.actions.map((act) => {
                              return (
                                <Checkbox
                                  name={`${mod.moduleKey}.${act.actionKey}`}
                                  key={act.actionKey}
                                  label={act.label}
                                  checked={act.selected}
                                  onCheckedChange={() =>
                                    togglePermission(
                                      mod.moduleKey,
                                      act.actionKey
                                    )
                                  }
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              color="primary"
              className="w-full"
              disabled={creating}
            >
              {editingRole
                ? "Actualizar Rol"
                : creating
                ? "Guardando..."
                : "Guardar Rol"}
            </Button>
            {editingRole && (
              <Button
                type="button"
                className="w-full"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
      <div className="mt-10">
        <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
          Listado de Roles
        </h2>
        <DynamicTable
          columns={columns}
          data={roles}
          actions={actions}
          onClikcAction={(row, action) => action.onClick(row)}
          loading={loadingRoles}
        />
      </div>
    </>
  );
}
