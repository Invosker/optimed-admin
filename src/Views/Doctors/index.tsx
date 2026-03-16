import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import { FaEdit } from "react-icons/fa";
import { useGetDoctors } from "./hooks/useGetDoctors";
import EditDoctorModal from "./Components/EditDoctorModal";
import { APPOINTMENT_TYPE_OPTIONS } from "@/Views/Appointments/types/appointment";
import DynamicTable from "@/Components/DynamicTable";
import { Doctor } from "./types/doctor";
import usePermissions, { Action, Permission } from "@/hooks/usePermissions";

type FilterValues = {
  search: string;
  specialty: string;
};

export default function Doctors() {
  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(50);
  const queryClient = useQueryClient();

  const { permissions } = usePermissions();
  console.log("🚀 ~ Doctors ~ permissions:", permissions);

  const [filters, setFilters] = useState<{
    search?: string;
    specialty?: string;
  }>({});
  const [clearMode, setClearMode] = useState(false);

  const { data, isLoading } = useGetDoctors({
    page: 1,
    limit: limit,
    search: search || undefined,
  });

  const filterMethods = useForm<FilterValues>({
    defaultValues: { search: "", specialty: "all" },
    mode: "onSubmit",
  });

  const onSubmitFilters = (values: FilterValues) => {
    setSearch(values.search.trim());
    setFilters({
      search: values.search.trim() || undefined,
      specialty:
        values.specialty && values.specialty !== "all"
          ? values.specialty
          : undefined,
    });
    setClearMode(false);
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
  };

  const onClear = () => {
    filterMethods.reset({ search: "", specialty: "all" });
    setSearch("");
    setFilters({});
    setClearMode(true);
    queryClient.removeQueries({ queryKey: ["doctors"] });
  };

  const rows = useMemo(() => {
    const docs = data?.docs ?? [];
    return docs.map((d: any) => {
      const id =
        d.id || d.idDoctor || d.doctorId || d._id || d.uuid || d.identifier;
      const name =
        d.fullName ||
        [d.firstName, d.lastName].filter(Boolean).join(" ") ||
        d.name ||
        "-";
      const email = d.email || d.mail || "-";
      const phone = d.phone || d.telephone || d.mobile || "-";
      const specialty = d.specialty || d.speciality || d.specialization || "-";
      const active =
        typeof d.isActive === "boolean"
          ? d.isActive
          : d.status === "active" || d.status === 1;
      return { id, name, email, phone, specialty, active, _raw: d };
    });
  }, [data]);

  const normalize = (s: unknown) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredRows = useMemo(() => {
    if (clearMode) return [];
    let list = rows;

    if (filters.specialty) {
      const target = normalize(filters.specialty);
      return (list = list.filter((r) => normalize(r.specialty) === target));
    }

    // const q = normalize(filters.search || "");
    // if (!q) return list;
    // return list.filter((r) => normalize(r.name).includes(q));
    return list;
  }, [rows, filters.specialty, clearMode]);

  const [selected, setSelected] = useState<any | null>(null);

  const columns = [
    { header: "Doctor", key: "name" },
    { header: "Email", key: "email" },
    { header: "Teléfono", key: "phone" },
    { header: "Especialidad", key: "specialty" },
    {
      key: "isActive",
      header: "Activo",
      cell: (row: Doctor) =>
        row.active ? (
          <span className="inline-block px-2 py-1 text-[11px] rounded bg-green-100 text-green-700 font-medium">
            Activo
          </span>
        ) : (
          <span className="inline-block px-2 py-1 text-[11px] rounded bg-red-100 text-red-600 font-medium">
            Inactivo
          </span>
        ),
    },
  ];

  const actions = [
    {
      label: "Editar",
      icon: <FaEdit />,
      onClick: (doctor: Doctor) => setSelected(doctor._raw),
    },
  ];

  return (
    <div className="min-h-[100dvh] overflow-y-auto w-full bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 p-3 md:p-6">
      <div className="mb-4">
        <header className="bg-optimed-tiber text-white lg:px-8 py-3 grid grid-cols-2 items-center shadow-lg rounded-lg mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide drop-shadow text-white">
            Doctores
          </h1>
        </header>
        <p className="text-sm text-gray-500">
          Administración de doctores •{" "}
          {isLoading ? "Cargando..." : `${data?.totalDocs ?? 0} en total`}
        </p>
      </div>

      <FormProvider {...filterMethods}>
        <form
          onSubmit={filterMethods.handleSubmit(onSubmitFilters)}
          className="mb-4 grid gap-3 md:grid-cols-6"
        >
          <div className="md:col-span-2">
            <TextField
              name="search"
              label="Buscar"
              placeholder="Nombre del doctor..."
            />
          </div>
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-1">
            <SelectN
              name="specialty"
              label="Especialidad"
              options={
                [
                  { label: "Todas", value: "all" },
                  ...APPOINTMENT_TYPE_OPTIONS,
                ] as any
              }
            />
          </div>
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-1">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Límite
            </label>
            <select
              className="peer inline-flex w-full cursor-pointer appearance-none items-center rounded-lg border border-input bg-background text-sm text-foreground shadow-sm shadow-black/5 ring-offset-background transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-muted-foreground h-9 pe-8 ps-3"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>
          <div className="mt-6 flex gap-2 md:col-span-2">
            <Button type="submit" color="primary">
              Buscar
            </Button>
            <Button type="button" color="secondary" onClick={onClear}>
              Limpiar
            </Button>
          </div>
        </form>
      </FormProvider>

      <DynamicTable
        columns={columns}
        data={filteredRows}
        actions={
          permissions
            .find((p: Permission) => p.moduleKey === "doctors")
            ?.actions.find((a: Action) => a.actionKey === "edit").selected ||
          permissions.length === 0
            ? actions
            : undefined
        }
        onClikcAction={(row, action) => action.onClick(row)}
        loading={isLoading}
        emptyMessage="Sin resultados."
      />

      {selected && (
        <EditDoctorModal doctor={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
