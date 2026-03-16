import { FormProvider, useForm } from "react-hook-form";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import { FaSearch } from "react-icons/fa";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAppointments } from "./hooks/useGetAppointments";
import { Appointment } from "./types/appointment";
import EditAppointmentModal from "./Components/EditAppointmentModal";
import { useNavigate } from "react-router-dom";
import { FaCalendarPlus } from "react-icons/fa";
import usePermissions, { Action, Permission } from "@/hooks/usePermissions";
import DynamicTable from "@/Components/DynamicTable";

export default function AppointmentsMedical() {
  const methods = useForm<{
    search: string;
    status: string;
  }>({
    defaultValues: { search: "", status: "all" },
  });

  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
  }>({});

  const [clearMode, setClearMode] = useState(false);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Appointment | null>(null);
  const navigate = useNavigate();

  const { permissions } = usePermissions();
  console.log("🚀 ~ AppointmentsMedical ~ permissions:", permissions);

  const {
    data: apptsPage,
    isLoading,
    isFetching,
  } = useGetAppointments({
    page: 1,
    limit: 1000,
    // El search y el status lo ignora el hook
    search: filters.search,
    status: filters.status,
  });

  const appointments = apptsPage?.docs || [];

  const onSubmitFilters = () => {
    const { search, status } = methods.getValues();
    setFilters({
      search: search || undefined,
      status: status !== "all" ? status : undefined,
    });
    setClearMode(false);
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  };

  const clearFilters = () => {
    methods.reset({ search: "", status: "all" });
    setFilters({});
    setClearMode(true);
    queryClient.removeQueries({ queryKey: ["appointments"] });
  };

  const statusOptions = [
    { label: "Todos", value: "all" },
    { label: "Programado", value: "scheduled" },
    { label: "Completado", value: "completed" },
    { label: "Cancelado", value: "cancelled" },
  ];

  const statusLabel: Record<string, string> = {
    scheduled: "Programado",
    completed: "Completado",
    cancelled: "Cancelado",
  };

  //Filtros hasta que haya endpoint
  const normalize = (s: unknown) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredAppointments = useMemo(() => {
    if (clearMode) return [];

    const byStatus = filters.status
      ? appointments.filter((a) => a.status === filters.status)
      : appointments;

    const q = normalize(filters.search || "");
    if (!q) return byStatus;

    return byStatus.filter((a) => {
      const doctorFull = normalize(
        `${a?.doctor?.name ?? ""} ${a?.doctor?.lastName ?? ""}`.trim()
      );
      const doctorId = String(a?.doctorId ?? "").toLowerCase();

      return (
        (doctorFull && doctorFull.includes(q)) ||
        (q && doctorId && doctorId === q)
      );
    });
  }, [appointments, filters.status, filters.search, clearMode]);

  return (
    <FormProvider {...methods}>
      <main className="min-h-[100dvh] pb-14 overflow-y-auto w-full bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 p-3 md:p-6">
        <header className="bg-optimed-tiber text-white lg:px-4 py-3 shadow-lg mt-4 lg:mt-0 rounded-lg mb-6">
          <h2 className="text-4xl md:text-5xl px-3 font-extrabold tracking-wide drop-shadow text-white">
            Citas Médicas
          </h2>
        </header>
        {(permissions
          .find((x: Permission) => x.moduleKey === "newService")
          ?.actions.find((a: Action) => a.actionKey === "medicalAppointment")
          ?.selected ||
          permissions.length === 0) && (
          <section className="mb-6">
            <div className="rounded-xl border border-optimed-tiber/20 bg-gradient-to-r from-optimed-tiber/10 to-white p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-optimed-tiber">
                  Agenda una nueva cita
                </h2>
                <p className="text-sm text-gray-600">
                  Crea rápidamente una cita médica para un cliente existente o
                  nuevo.
                </p>
              </div>
              <Button
                color="primary"
                className="w-full md:w-auto h-11 px-4 flex items-center justify-center gap-2"
                onClick={() =>
                  navigate(
                    "/Home/Inventory?newService=1&serviceType=3&openForm=1"
                  )
                }
              >
                <FaCalendarPlus className="text-base" />
                <span>Agendar cita</span>
              </Button>
            </div>
          </section>
        )}
        <form
          onSubmit={methods.handleSubmit(onSubmitFilters)}
          className="grid gap-4 md:grid-cols-6 mb-6 items-end"
        >
          <div className="md:col-span-3">
            <TextField
              name="search"
              label="Buscar (Doctor)"
              placeholder="Ej: Dr. Juan..."
            />
          </div>
          <div className="md:col-span-2">
            <SelectN name="status" label="Estado" options={statusOptions} />
          </div>
          <div className="flex gap-2 md:col-span-1">
            <Button
              type="submit"
              color="primary"
              className="h-10 px-3 flex items-center gap-2"
              disabled={isLoading || isFetching}
              title="Buscar"
            >
              <FaSearch className="text-xs" />
              <span className="hidden lg:inline">Buscar</span>
            </Button>
            <Button
              type="button"
              color="secondary"
              className="h-10 px-3"
              onClick={clearFilters}
              disabled={isLoading || isFetching}
            >
              Limpiar
            </Button>
          </div>
          {(isLoading || isFetching) && (
            <div className="flex gap-2 md:col-span-6">
              <span className="text-xs text-gray-500">Actualizando...</span>
            </div>
          )}
        </form>

        {(isLoading || isFetching) && (
          <p className="text-xs text-gray-500 mb-2">Cargando citas...</p>
        )}

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {!isLoading && filteredAppointments.length === 0 ? (
            <div className="rounded border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
              Sin resultados.
            </div>
          ) : (
            filteredAppointments.map((c, idx) => (
              <div
                key={c.id || `${c.date}-${c.time}-${idx}`}
                className="rounded border border-gray-200 bg-white p-3 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold">{c.appointmentType}</p>
                  <button
                    className="text-xs text-optimed-tiber underline"
                    onClick={() => setEditing(c)}
                  >
                    Editar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  {c.date} • {c.time}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Cliente</p>
                    <p className="font-medium">
                      {c.client
                        ? `${c.client.firstName} ${c.client.lastName}`
                        : `#${c.clientId}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Doctor</p>
                    <p className="font-medium">
                      {c.doctor
                        ? `${c.doctor.name} ${c.doctor.lastName}`
                        : `#${c.doctorId}`}
                    </p>
                  </div>
                </div>
                <p className="text-xs mt-2">
                  <span className="font-medium">Motivo: </span>
                  {c.reason}
                </p>
                {c.notes && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Notas: {c.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block mb-10">
          <DynamicTable<Appointment>
            data={filteredAppointments}
            columns={[
              {
                key: "id",
                header: "ID",
                cell: (row) => row.id ?? "—",
              },
              {
                key: "client",
                header: "Cliente",
                cell: (row) => (
                  <div
                    className="truncate max-w-[150px]"
                    title={
                      row.client
                        ? `${row.client.firstName} ${row.client.lastName}`
                        : `#${row.clientId}`
                    }
                  >
                    {row.client
                      ? `${row.client.firstName} ${row.client.lastName}`
                      : `#${row.clientId}`}
                  </div>
                ),
              },
              {
                key: "doctor",
                header: "Doctor",
                cell: (row) => (
                  <div
                    className="truncate max-w-[150px]"
                    title={
                      row.doctor
                        ? `${row.doctor.name} ${row.doctor.lastName}`
                        : `#${row.doctorId}`
                    }
                  >
                    {row.doctor
                      ? `${row.doctor.name} ${row.doctor.lastName}`
                      : `#${row.doctorId}`}
                  </div>
                ),
              },
              {
                key: "date",
                header: "Fecha",
              },
              {
                key: "time",
                header: "Hora",
              },
              {
                key: "appointmentType",
                header: "Tipo",
                cell: (row) => (
                  <div className="truncate max-w-[150px]">
                    {row.appointmentType}
                  </div>
                ),
              },
              {
                key: "reason",
                header: "Motivo",
                cell: (row) => (
                  <div className="truncate max-w-[150px]" title={row.reason}>
                    {row.reason}
                  </div>
                ),
              },
              {
                key: "status",
                header: "Estado",
                cell: (row) => (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      row.status === "scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : row.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : row.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusLabel[row.status] ?? row.status}
                  </span>
                ),
              },
            ]}
            actions={[
              {
                label: "Editar",
                icon: <FaCalendarPlus className="text-sm" />,
                onClick: (row) => setEditing(row),
              },
            ]}
            loading={isLoading || isFetching}
            emptyMessage="Sin resultados."
          />
        </div>

        {editing && (
          <EditAppointmentModal
            item={editing}
            onClose={() => setEditing(null)}
          />
        )}
      </main>
    </FormProvider>
  );
}
