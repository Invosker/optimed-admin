import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import TextField from "@/Components/Input/Input";
import Button from "@/Components/Button";
import Checkbox from "@/Components/Input/CheckBoxN";
import SelectN from "@/Components/Input/Select";
import useCreateUser from "../hooks/useCreateUser";
import { useGetUsers } from "../hooks/useGetUser";
import { UserFormValues } from "../types/user";
import { FaSearch, FaTrash } from "react-icons/fa";
import { useGetRoles } from "../Roles/hooks/useGetRoles";
import { Role } from "../types/roles";

export default function ConfigUser() {
  const methods = useForm<UserFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      roleId: "1",
      description: "",
      name: "",
      lastName: "",
      phone: "",
      isSuperAdmin: false,
      receiveNewsletter: false,
      receiveNotifications: true,
      idTrainingCenter: "1",
      trainingCenterName: "",
    },
  });

  const { createUser, creating } = useCreateUser();
  const { data: roles, isLoading: loadingRoles } = useGetRoles();

  const roleOptions = useMemo(() => {
    if (!roles) return [];
    // roles can be either an array of roles or an ApiResponse containing the array in `.data`
    const list = Array.isArray(roles) ? roles : [];
    if (!Array.isArray(list)) return [];
    return list.map((role: Role) => ({
      value: role.id?.toString?.() ?? String(role.id),
      label: role.roleName ?? role.name ?? String(role.id),
    }));
  }, [roles]);

  // Filtros listado backend
  const filterMethods = useForm<{
    search: string;
    status: "all" | "active" | "inactive";
  }>({
    defaultValues: { search: "", status: "all" },
  });
  const {
    handleSubmit: handleFilterSubmit,
    reset: resetFilterForm,
    watch: watchFilters,
  } = filterMethods;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: usersPage,
    isLoading: loadingUsers,
    isFetching: fetchingUsers,
    refetch,
  } = useGetUsers({
    page,
    limit,
    search,
    status: statusFilter,
  });

  const backendUsers = usersPage?.docs || [];

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, limit]);

  const onSubmitFilters = (values: {
    search: string;
    status: "all" | "active" | "inactive";
  }) => {
    setSearch(values.search.trim());
    setStatusFilter(values.status);
  };

  const clearFilters = () => {
    resetFilterForm({ search: "", status: "all" });
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  // After create refetch
  const onSubmit = (data: UserFormValues) => {
    createUser(data, {
      onSuccess: () => {
        methods.reset({
          username: "",
          email: "",
          password: "",
          roleId: "1",
          description: "",
          name: "",
          lastName: "",
          phone: "",
          isSuperAdmin: false,
          receiveNewsletter: false,
          receiveNotifications: true,
          idTrainingCenter: "1",
          trainingCenterName: "",
        });
        refetch();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
          Configuración de Usuario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TextField name="username" label="Usuario" />
          <TextField name="email" label="Correo" type="email" />
          <TextField
            name="password"
            label="Contraseña"
            type="password"
            rules={{
              minLength: { value: 6, message: "Mínimo 6" },
            }}
          />
          <TextField name="name" label="Nombre" />
          <TextField name="lastName" label="Apellido" />
          <TextField
            name="phone"
            label="Teléfono"
            rules={{
              pattern: {
                value: /^[0-9+\-() ]{7,20}$/,
                message: "Formato inválido",
              },
            }}
          />
          <SelectN
            name="roleId"
            label="Rol"
            options={roleOptions}
            disabled={loadingRoles}
          />
          <TextField name="description" label="Descripción" rules={{}} />
          <div className="flex items-center gap-2 mt-5">
            <Checkbox name="isSuperAdmin" label="Superadmin" />
          </div>
          {/* <TextField
            name="idTrainingCenter"
            label="ID Centro Formación"
            type="number"
            rules={{ required: "Obligatorio" }}
          />
          <TextField
            name="trainingCenterName"
            label="Nombre Centro Formación"
            rules={{ required: "Obligatorio" }}
          /> */}
        </div>

        <Button
          type="submit"
          color="primary"
          className="w-full"
          disabled={creating}
        >
          {creating ? "Guardando..." : "Guardar Usuario"}
        </Button>
      </form>

      {/* Filtros listado usuarios backend */}
      <div className="mt-10">
        <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
          Listado de Usuarios
        </h2>

        <FormProvider {...filterMethods}>
          <form
            onSubmit={handleFilterSubmit(onSubmitFilters)}
            className="mt-10 mb-4 grid gap-4 md:grid-cols-5"
          >
            <div className="md:col-span-3 flex gap-2 items-end">
              <div className="col-span-2 w-full">
                <TextField
                  name="search"
                  label="Buscar (nombre, apellido, email, licencia, especialidad)"
                  rules={{}}
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="submit"
                  color="primary"
                  disabled={loadingUsers || fetchingUsers}
                  className=""
                >
                  <FaSearch className="w-4 h-4 mx-3" />
                </Button>
              </div>
              <div className="col-span-1 w-full">
                <SelectN
                  name="status"
                  label="Estado"
                  value={watchFilters("status")}
                  onChange={(v: any) =>
                    filterMethods.setValue(
                      "status",
                      v.target ? v.target.value : v
                    )
                  }
                  options={[
                    { value: "all", label: "Todos" },
                    { value: "active", label: "Activos" },
                    { value: "inactive", label: "Inactivos" },
                  ]}
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Límite
                </label>
                <div className="relative">
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="appearance-none rounded border border-gray-300 pl-2 pr-8.7 py-2 text-sm outline-none focus:border-optimed-tiber bg-white w-full"
                  >
                    {[5, 10, 15, 20, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                type="button"
                color="secondary"
                onClick={clearFilters}
                title="Limpiar filtros"
                className=" aspect-square flex items-center justify-center"
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </FormProvider>

        {(loadingUsers || fetchingUsers) && (
          <p className="text-xs text-gray-500 mb-2">Cargando usuarios...</p>
        )}

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {!loadingUsers && backendUsers.length === 0 ? (
            <div className="rounded border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
              Sin resultados.
            </div>
          ) : (
            backendUsers.map((u) => (
              <div
                key={u.id || u.email}
                className="rounded border border-gray-200 bg-white p-3 shadow-sm"
              >
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">{u.username}</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{u.email}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Nombre</p>
                    <p className="font-medium">
                      {u.name} {u.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Teléfono</p>
                    <p className="font-medium">{u.phone}</p>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Mobile pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">Página {page}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                color="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                type="button"
                color="secondary"
                disabled={
                  !usersPage?.hasNextPage && backendUsers.length < limit
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded border border-gray-200 bg-white">
            <div className="grid grid-cols-10 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <div className="col-span-2">Usuario</div>
              <div className="col-span-2">Nombre</div>
              <div className="col-span-2">Apellido</div>
              <div className="col-span-2">Correo</div>
              <div className="col-span-1">Teléfono</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-2">Rol</div>
            </div>
            <div className="divide-y divide-gray-100">
              {!loadingUsers && backendUsers.length === 0 ? (
                <div className="grid grid-cols-10 px-4 py-6 text-sm">
                  <div className="col-span-10 text-center text-gray-500">
                    Sin resultados.
                  </div>
                </div>
              ) : (
                backendUsers.map((u) => (
                  <div
                    key={u.id || u.email}
                    className="grid grid-cols-10 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="col-span-2 font-medium">{u.username}</div>
                    <div className="col-span-2">{u.name}</div>
                    <div className="col-span-2">{u.lastName}</div>
                    <div className="col-span-2 truncate">{u.email}</div>
                    <div className="col-span-1">{u.phone}</div>
                    <div className="col-span-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          u.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {u.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="col-span-2">{u.roleId}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Página {page} de {usersPage?.totalPages || 1}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                color="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                type="button"
                color="secondary"
                disabled={!usersPage?.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
