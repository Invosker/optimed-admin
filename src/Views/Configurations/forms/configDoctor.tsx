import { useForm, FormProvider } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import Button from "@/Components/Button";
import { useState, useEffect, useMemo } from "react";
import useCreateDoctor from "../hooks/useCreateDoctor";
import { DoctorFormValues, Doctor } from "../types/doctor";
import SelectN from "@/Components/Input/Select";
import { useGetDoctors } from "../hooks/useGetDoctor";
import { FaSearch, FaTrash } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import EditDoctorModal from "./EditDoctorModal";
import { useQueryClient } from "@tanstack/react-query";
import { APPOINTMENT_TYPE_OPTIONS } from "@/Views/Appointments/types/appointment";

export default function ConfigDoctor() {
  const methods = useForm<DoctorFormValues>({
    defaultValues: {
      email: "",
      name: "",
      lastName: "",
      phone: "",
      licenseNumber: "",
      specialty: "",
      identification: "",
      identificationType: "",
    },
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);

  const filterMethods = useForm<{ search: string; status: number }>({
    defaultValues: { search: "", status: 0 },
  });
  const { handleSubmit, reset: resetFilters, watch } = filterMethods;

  const { createDoctor, creating } = useCreateDoctor();
  const {
    data: doctorsPage,
    isLoading,
    refetch,
    isFetching,
  } = useGetDoctors({
    page,
    limit,
    search,
  });

  const queryClient = useQueryClient();
  const doctors: Doctor[] = doctorsPage?.docs || [];

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const onSubmit = (formData: DoctorFormValues) => {
    createDoctor(formData, {
      onSuccess: () => {
        methods.reset();
        refetch();
      },
    });
  };

  const onSubmitFilters = (values: { search: string; status: number }) => {
    setSearch(values.search.trim());
    setStatus(values.status);
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
  };

  const onClearFilters = () => {
    resetFilters({ search: "", status: 0 });
    setSearch("");
    setStatus(0);
    setPage(1);
    queryClient.removeQueries({ queryKey: ["doctors"] });
  };

  const watchStatus = watch("status");

  const normalize = (s: unknown) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredDoctors = useMemo(() => {
    const byStatus =
      watchStatus === 0
        ? doctors
        : doctors.filter((d: any) => d.status === watchStatus);
    const q = normalize(search);
    if (!q) return byStatus;
    return byStatus.filter((d: any) =>
      normalize(`${d.name ?? ""} ${d.lastName ?? ""}`).includes(q)
    );
  }, [doctors, watchStatus, search]);

  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["doctors"] });
      await queryClient.refetchQueries({ queryKey: ["doctors"] });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
            Configuración de Médico
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TextField
              name="email"
              label="Email"
              type="email"
              rules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email inválido",
                },
              }}
            />
            <TextField name="name" label="Nombre" />
            <TextField name="lastName" label="Apellido" />
            <TextField name="identification" label="Identificación" />
            <SelectN
              name="identificationType"
              label="Tipo de identificación"
              options={[
                { value: "V", label: "Cédula de identidad" },
                { value: "E", label: "Cédula de extranjería" },
                { value: "J", label: "RIF" },
                { value: "G", label: "Pasaporte" },
              ]}
            />
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
            <TextField
              name="licenseNumber"
              label="N° Licencia"
              rules={{
                pattern: {
                  value: /^[A-Za-z0-9-]+$/,
                  message: "Solo letras, números y guiones",
                },
              }}
            />
            <SelectN
              name="specialty"
              label="Especialidad"
              options={APPOINTMENT_TYPE_OPTIONS as any}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full"
            disabled={creating}
          >
            {creating ? "Guardando..." : "Guardar médico"}
          </Button>
        </form>
      </FormProvider>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold">Médicos registrados</h3>
          <Button
            type="button"
            color="secondary"
            onClick={handleRefresh}
            disabled={refreshing || isFetching || isLoading}
            title="Refrescar"
            className="rounded-md px-3 h-10 w-24"
          >
            <span className="flex items-center gap-2">
              <FiRefreshCcw className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refrescar</span>
            </span>
          </Button>
        </div>

        <FormProvider {...filterMethods}>
          <form
            onSubmit={handleSubmit(onSubmitFilters)}
            className="mt-4 mb-4 grid gap-4 md:grid-cols-5"
          >
            <div className="md:col-span-3 flex gap-2 items-end">
              <div className="col-span-2 w-full">
                <TextField name="search" label="Buscar por nombre" />
              </div>
              <div className="col-span-1">
                <Button
                  type="submit"
                  color="primary"
                  disabled={isFetching || isLoading}
                >
                  <FaSearch className="w-4 h-4 mx-3" />
                </Button>
              </div>
            </div>
            <div>
              <SelectN
                name="status"
                label="Estatus"
                rules={{ valueAsNumber: true }}
                options={[
                  { value: 0, label: "Todos" },
                  { value: 1, label: "Activos" },
                  { value: 2, label: "Inactivos" },
                ]}
              />
            </div>
            <div className="flex items-end gap-2">
              <label className="block text-xs font-semibold mb-1">Límite</label>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="appearance-none rounded border border-gray-300 pl-2 pr-8 py-2 text-sm outline-none focus:border-optimed-tiber bg-white w-full"
                >
                  {[5, 10, 15, 20, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                color="secondary"
                onClick={onClearFilters}
                title="Limpiar filtros"
                className="h-9 aspect-square flex items-center justify-center"
              >
                <FaTrash className="w-4 h-4 mx-3" />
              </Button>
            </div>
          </form>
        </FormProvider>

        {(isLoading || isFetching) && (
          <p className="text-sm text-gray-500 mb-4">Cargando médicos...</p>
        )}

        <div className="mt-2">
          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {!isLoading && filteredDoctors.length === 0 ? (
              <div className="rounded border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                Sin resultados.
              </div>
            ) : (
              filteredDoctors.map((d) => (
                <div
                  key={d.id || d.email}
                  className="rounded border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold">
                        {d.name} {d.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">{d.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          d.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {d.status === 1 ? "Activo" : "Inactivo"}
                      </span>
                      <Button
                        className="h-10 w-20"
                        type="button"
                        color="secondary"
                        onClick={() => setEditingDoctor(d)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div>
                      <p className="text-gray-500">Especialidad</p>
                      <p className="font-medium">{d.specialty}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Licencia</p>
                      <p className="font-medium">{d.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Teléfono</p>
                      <p className="font-medium">{d.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Identificación</p>
                      <p className="font-medium">
                        {d.identificationType}-{d.identification}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded border border-gray-200 bg-white">
              <div className="grid grid-cols-12 bg-gray-50 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <div className="col-span-2">Nombre</div>
                <div className="col-span-2">Apellido</div>
                <div className="col-span-2">Email</div>
                <div className="col-span-1">Licencia</div>
                <div className="col-span-1">Especialidad</div>
                <div className="col-span-1">Identificación</div>
                <div className="col-span-1">Estado</div>
                <div className="col-span-1">Teléfono</div>
                <div className="col-span-1 text-right">Acciones</div>
              </div>
              <div className="divide-y divide-gray-100">
                {!isLoading && filteredDoctors.length === 0 ? (
                  <div className="grid grid-cols-12 px-4 py-6 text-sm">
                    <div className="col-span-12 text-center text-gray-500">
                      Sin resultados.
                    </div>
                  </div>
                ) : (
                  filteredDoctors.map((d) => (
                    <div
                      key={d.id || d.email}
                      className="grid grid-cols-12 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <div className="col-span-2 font-medium">{d.name}</div>
                      <div className="col-span-2 font-medium">{d.lastName}</div>
                      <div className="col-span-2 truncate">{d.email}</div>
                      <div className="col-span-1">{d.licenseNumber}</div>
                      <div className="col-span-1">{d.specialty}</div>
                      <div className="col-span-1">
                        {d.identificationType}-{d.identification}
                      </div>
                      <div className="col-span-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            d.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {d.status === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className="col-span-1">{d.phone}</div>
                      <div className="col-span-1 text-right">
                        <Button
                          type="button"
                          color="secondary"
                          onClick={() => setEditingDoctor(d)}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

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
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingDoctor && (
        <EditDoctorModal
          doctor={editingDoctor}
          onClose={() => setEditingDoctor(null)}
        />
      )}
    </>
  );
}
