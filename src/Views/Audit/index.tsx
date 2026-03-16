import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form"; // NUEVO
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import { FaSearch, FaEye } from "react-icons/fa";
import { useGetAudits } from "./hooks/useGetAudits";
import AuditDetailModal from "./Components/AuditDetailModal";

type FilterValues = {
  search: string;
  from?: string;
  to?: string;
};

export default function Audit() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState<string>("");
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);

  const { data, isLoading, isFetching } = useGetAudits({
    page,
    limit,
    search: search || undefined,
    from,
    to,
  });

  const filterMethods = useForm<FilterValues>({
    defaultValues: {
      search: "",
      from: "",
      to: "",
    },
    mode: "onSubmit",
  });
  const { handleSubmit, reset } = filterMethods;

  const onSubmitFilters = (values: FilterValues) => {
    setPage(1);
    setSearch(values.search.trim());
    setFrom(values.from ? values.from : undefined);
    setTo(values.to ? values.to : undefined);
  };

  const onClearFilters = () => {
    reset({ search: "", from: "", to: "" });
    setPage(1);
    setSearch("");
    setFrom(undefined);
    setTo(undefined);
  };

  const rows = useMemo(() => {
    const docs = data?.docs ?? [];
    return docs.map((a: any) => {
      const createdAt = a.dateReg || a.createdAt || a.date || a.timestamp;
      const user =
        a.userName ||
        a.user?.name ||
        [a.user?.name, a.user?.lastName].filter(Boolean).join(" ") ||
        a.user ||
        a.createdByName ||
        "-";
      const action = a.process || a.action || a.event || a.type || "-";
      const id = a.idAudit || a.entityId || a.resourceId || a.targetId || a.id || a._id || "-";
      const ip = a.ip || a.ipAddress || "-";
      const formatted = createdAt ? new Date(createdAt).toLocaleString() : "-";
      return {
        id,
        action,
        user,
        moduleName: a.module || a.feature || a.entity || a.table || "-", 
        ip,
        date: formatted,
        _raw: a,
      };
    });
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto w-full px-3 md:px-6 py-6 overflow-y-auto">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-optimed-tiber">
          Auditoría
        </h1>
        <p className="text-sm text-gray-500">
          Registros del sistema •{" "}
          {isLoading ? "Cargando..." : `${data?.totalDocs ?? 0} en total`}
        </p>
      </div>
      <FormProvider {...filterMethods}>
        <form
          onSubmit={handleSubmit(onSubmitFilters)}
          className="mb-4 grid gap-3 md:grid-cols-5 items-end"
        >
          <div className="md:col-span-2">
            <TextField
              name="search"
              label="Buscar"
              placeholder="Acción, usuario, módulo..."
            />
          </div>
          <div>
            <TextField name="from" label="Desde" type="date" />
          </div>
          <div>
            <TextField name="to" label="Hasta" type="date" />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" color="primary" title="Buscar">
              <FaSearch className="w-4 h-4 mx-3" />
            </Button>
            <Button type="button" color="secondary" onClick={onClearFilters}>
              Limpiar
            </Button>
          </div>
        </form>
      </FormProvider>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="grid grid-cols-12 bg-gray-50 px-3 md:px-4 py-2 text-[11px] md:text-xs font-semibold uppercase tracking-wide text-gray-600">
          <div className="col-span-2">Acción</div>
          <div className="col-span-3">Usuario</div>
          <div className="col-span-3">Módulo</div>
          <div className="col-span-2">IP</div>
          <div className="col-span-2 text-right md:text-left">Fecha</div>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Cargando auditorías...
            </div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              Sin resultados.
            </div>
          ) : (
            rows.map((r) => (
              <div
                key={`${r.id}-${r.date}-${r.action}`}
                className="grid grid-cols-12 px-3 md:px-4 py-2 text-sm hover:bg-gray-50"
              >
                <div className="col-span-2 font-medium text-optimed-tiber">
                  {r.action}
                </div>
                <div className="col-span-3">{r.user}</div>
                <div className="col-span-3">{r.moduleName}</div>
                <div className="col-span-2">{r.ip}</div>
                <div className="col-span-2 flex items-center justify-end md:justify-start gap-2">
                  <span className="text-xs text-gray-600">{r.date}</span>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => setSelected(r._raw)}
                  >
                    <div className="flex items-center gap-1">
                      <FaEye /> Ver
                    </div>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-xs text-gray-600">
          Página {data?.page ?? page} de {data?.totalPages ?? 1}
          {isFetching && <span className="ml-2">Actualizando...</span>}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 12, 20, 30].map((n) => (
              <option key={n} value={n}>
                {n} por página
              </option>
            ))}
          </select>
          <Button
            type="button"
            color="secondary"
            disabled={!data?.hasPrevPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <Button
            type="button"
            color="secondary"
            disabled={!data?.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
      {selected && (
        <AuditDetailModal audit={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
