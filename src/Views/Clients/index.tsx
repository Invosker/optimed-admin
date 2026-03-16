import { FormProvider, useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import { useClientSearch } from "./hooks/useClientSearch";
import { useGetClientByIdentification } from "./hooks/useGetClientByIdentification";
import EditClientModal from "./Components/EditClientModal";
import type { Client } from "@/Views/doctorConfig/types/client";

export default function ClientsList() {
  const methods = useForm<{
    search: string;
    status: "all" | "active" | "inactive";
  }>({
    defaultValues: { search: "", status: "active" },
  });

  const [filters, setFilters] = useState<{
    search?: string;
    status?: "all" | "active" | "inactive";
  }>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editing, setEditing] = useState<Client | null>(null);
  const [clearMode, setClearMode] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: clientsPage,
    isLoading,
    isFetching,
  } = useClientSearch({
    page,
    limit,
    search: undefined,
    status: filters.status ?? "all",
  });

  const isSearchMode = Boolean(
    filters.search && filters.search.trim().length > 0
  );
  const {
    data: idResult,
    isLoading: isLoadingId,
    isFetching: isFetchingId,
  } = useGetClientByIdentification(isSearchMode ? filters.search : undefined);

  const clients = useMemo(() => {
    if (clearMode) return [];
    if (isSearchMode) {
      const list = idResult?.docs ?? [];
      if (!filters.status || filters.status === "all") return list;
      const wantActive = filters.status === "active";
      return list.filter((c: any) => Boolean(c?.isActive) === wantActive);
    }
    return clientsPage?.docs ?? [];
  }, [
    clearMode,
    isSearchMode,
    idResult?.docs,
    clientsPage?.docs,
    filters.status,
  ]);

  const loading = isLoading || isFetching || isLoadingId || isFetchingId;

  const onSubmitFilters = () => {
    const { search, status } = methods.getValues();
    setFilters({
      search: search?.trim() || undefined,
      status: status || "all",
    });
    setPage(1);
    setClearMode(false);
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["clientByIdentification"] });
  };

  const clearFilters = () => {
    methods.reset({ search: "", status: "all" });
    setFilters({});
    setPage(1);
    setClearMode(true);
    queryClient.removeQueries({ queryKey: ["clients"] });
    queryClient.removeQueries({ queryKey: ["clientByIdentification"] });
  };

  return (
    <FormProvider {...methods}>
      <main className="min-h-[100dvh] w-full p-4 md:p-6 bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 overflow-auto pb-14">
        <header className="bg-optimed-tiber text-white lg:px-8 py-3 grid grid-cols-2 items-center shadow-lg rounded-lg mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide drop-shadow text-white">
            Clientes
          </h1>
        </header>

        <form
          onSubmit={methods.handleSubmit(onSubmitFilters)}
          className="grid gap-4 md:grid-cols-6 mb-6 items-end"
        >
          <div className="md:col-span-3">
            <TextField
              name="search"
              label="Buscar por identificación"
              placeholder="Ej: V12345678"
              rules={{}}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
            <SelectN
              name="status"
              label="Estado"
              options={[
                { label: "Activos", value: "active" },
                { label: "Inactivos", value: "inactive" },
                { label: "Todos", value: "all" },
              ]}
            />
          </div>

          <div className="flex gap-2 md:col-span-1">
            <Button
              type="submit"
              color="primary"
              className="h-10 px-3 flex items-center gap-2"
              disabled={loading}
            >
              <FaSearch className="text-xs" />
              <span className="hidden lg:inline">Buscar</span>
            </Button>
            <Button
              type="button"
              color="secondary"
              className="h-10 px-3"
              onClick={clearFilters}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>

          <div className="flex items-end gap-2 md:col-span-6">
            <label className="block text-xs font-semibold">Límite</label>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded border border-gray-300 px-2 py-2 text-sm outline-none bg-white"
              disabled={isSearchMode}
            >
              {[5, 10, 15, 20, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {loading && (
              <span className="text-xs text-gray-500 ml-2">
                Actualizando...
              </span>
            )}
          </div>
        </form>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {!loading && clients.length === 0 ? (
            <div className="rounded border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
              Sin resultados.
            </div>
          ) : (
            clients.map((c: any) => (
              <div
                key={c.id}
                className="rounded border border-gray-200 bg-white p-3 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.email ?? c.phone ?? "—"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500">#{c.id}</p>
                    <button
                      className="text-xs text-optimed-tiber underline mt-2"
                      onClick={() => setEditing(c)}
                    >
                      Ver / Editar
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <div>
                    Identificación: {c.identification} ({c.identificationType})
                  </div>
                  <div>F. Nac: {c.dateOfBirth ?? "—"}</div>
                </div>
              </div>
            ))
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Página {isSearchMode ? 1 : clientsPage?.page || page} de{" "}
              {isSearchMode ? 1 : clientsPage?.totalPages || 1}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                color="secondary"
                disabled={isSearchMode || !clientsPage?.hasPrevPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                type="button"
                color="secondary"
                disabled={isSearchMode || !clientsPage?.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block mb-10">
          <div className="overflow-hidden rounded border border-gray-200 bg-white">
            <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Nombre</div>
              <div className="col-span-2">Email / Tel</div>
              <div className="col-span-2">Identificación</div>
              <div className="col-span-2">F. Nac</div>
              <div className="col-span-2">Acciones</div>
            </div>

            <div className="divide-y divide-gray-100">
              {!loading && clients.length === 0 ? (
                <div className="grid grid-cols-12 px-4 py-6 text-sm">
                  <div className="col-span-12 text-center text-gray-500">
                    Sin resultados.
                  </div>
                </div>
              ) : (
                clients.map((c: any) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-12 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="col-span-1">{c.id}</div>
                    <div
                      className="col-span-3 truncate"
                      title={`${c.firstName} ${c.lastName}`}
                    >
                      {c.firstName} {c.lastName}
                      <span
                        className={`px-2 ml-2 rounded-full text-white ${
                          c.isActive ? "bg-optimed-tiber" : "bg-red-500"
                        }`}
                      >
                        {c.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="col-span-2 truncate">
                      {c.email ?? c.phone ?? "—"}
                    </div>
                    <div className="col-span-2 truncate">
                      {c.identification} ({c.identificationType})
                    </div>
                    <div className="col-span-2 truncate">
                      {c.dateOfBirth ?? "—"}
                    </div>
                    <div className="col-span-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          color="secondary"
                          onClick={() => setEditing(c)}
                        >
                          Ver / Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Página {isSearchMode ? 1 : clientsPage?.page || page} de{" "}
              {isSearchMode ? 1 : clientsPage?.totalPages || 1}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                color="secondary"
                disabled={isSearchMode || !clientsPage?.hasPrevPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                type="button"
                color="secondary"
                disabled={isSearchMode || !clientsPage?.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
        {editing && (
          <EditClientModal client={editing} onClose={() => setEditing(null)} />
        )}
      </main>
    </FormProvider>
  );
}
