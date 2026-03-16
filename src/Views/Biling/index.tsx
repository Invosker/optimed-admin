import { FormProvider, useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FiRefreshCcw } from "react-icons/fi";
import Button from "@/Components/Button";
import SelectN from "@/Components/Input/Select";
import { useGetSales } from "./hooks/useGetSales";
import type { Sale } from "./types/sale";
import Modal from "@/Components/Modal";
import DynamicTable from "@/Components/DynamicTable";

type FilterValues = {
  status: "all" | "paid" | "unpaid" | "partial";
};

const normalizeStatus = (
  raw: unknown
): "paid" | "unpaid" | "partial" | "unknown" => {
  const v = String(raw ?? "").toLowerCase();
  if (["paid", "pagada", "payed", "completa"].includes(v)) return "paid";
  if (["partial", "partially_paid", "incompleta", "cuotas"].includes(v))
    return "partial";
  if (["unpaid", "impagada", '"pending"', "due"].includes(v)) return "unpaid";
  return "unknown";
};

const statusLabel: Record<string, string> = {
  paid: "Pagada",
  unpaid: "Impagada",
  partial: "Pago a cuotas",
  unknown: "—",
};

export default function Billing() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const openModal = (sale: Sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSale(null);
  };

  const filterMethods = useForm<FilterValues>({
    defaultValues: { status: "all" },
  });

  const { data, isLoading, isFetching } = useGetSales({ page, limit });
  const rows: Sale[] = (data?.docs ?? []) as Sale[];

  const filters = filterMethods.watch();

  const filteredRows: Sale[] = useMemo(() => {
    if (!rows?.length) return [];
    if (!filters?.status || filters.status === "all") return rows;
    return rows.filter(
      (s: Sale) => normalizeStatus(s.status) === filters.status
    );
  }, [rows, filters]);

  const refreshing = isFetching;
  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["sales"] });
    await queryClient.refetchQueries({ queryKey: ["sales"] });
  };

  const formatTotal = (v: any, curr?: string) =>
    `${curr ?? ""} ${Number(v ?? 0).toFixed(2)}`;

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (row: Sale) => row.id,
    },
    {
      key: "createdAt",
      header: "Fecha",
      cell: (row: Sale) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "client",
      header: "Cliente",
      cell: (row: Sale) => {
        const clientText =
          row.clientName ||
          `${row.client?.firstName ?? ""} ${row.client?.lastName ?? ""}`;
        return clientText || "—";
      },
    },
    {
      key: "status",
      header: "Estado",
      cell: (row: Sale) => {
        const sN = normalizeStatus(row.status);
        return (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              sN === "paid"
                ? "bg-green-100 text-green-700"
                : sN === "partial"
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {statusLabel[sN]}
          </span>
        );
      },
    },
    {
      key: "total",
      header: "Total",
      cell: (row: Sale) => formatTotal(row.total, row.currency),
    },
    {
      key: "actionButton",
      header: "Detalle",
    },
  ];

  return (
    <FormProvider {...filterMethods}>
      <main className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 px-4 md:px-10 py-8 overflow-auto pb-10">
        <section className="max-w-7xl mx-auto w-full grid gap-6">
          {/* Header */}
          <header className="rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-optimed-tiber to-blue-600 text-white px-5 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 items-center">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-center sm:text-left">
                Ventas
              </h1>
            </div>
          </header>

          {/* Filtros */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5">
            <h2 className="text-sm font-semibold text-optimed-tiber mb-3">
              Filtros
            </h2>
            <form className="grid gap-4 md:grid-cols-3 items-end">
              <div className="md:col-span-2">
                <SelectN
                  name="status"
                  label="Estado"
                  options={[
                    { label: "Todas", value: "all" },
                    { label: "Pagadas", value: "paid" },
                    { label: "Impagadas", value: "unpaid" },
                    { label: "Pago a cuotas", value: "partial" },
                  ]}
                />
              </div>
              <div className="flex gap-2 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Límite
                  </label>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="peer inline-flex w-full cursor-pointer appearance-none items-center rounded-lg border border-input bg-background text-sm text-foreground shadow-sm shadow-black/5 ring-offset-background transition-shadow focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-muted-foreground h-9 pe-8 ps-3"
                  >
                    {[5, 10, 15, 20, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center sm:justify-end mt-3 sm:mt-0">
                  <Button
                    type="button"
                    color="secondary"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="bg-optimed-tiber text-white hover:bg-optimed-tiber/90 h-10 px-4 rounded-md ml-0 md:ml-4"
                    title="Refrescar"
                  >
                    <span className="flex items-center gap-2">
                      <FiRefreshCcw
                        className={refreshing ? "animate-spin" : ""}
                      />
                      <span className="hidden md:inline">Refrescar</span>
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          </section>

          {/* Meta/Conteo */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Lista de ventas •{" "}
              {isLoading
                ? "Cargando..."
                : `${filteredRows.length} de ${data?.totalDocs ?? 0}`}
            </span>
            {isFetching && <span className="text-xs">Actualizando...</span>}
          </div>

          {/* Mobile cards */}
          <section className="space-y-3 md:hidden">
            <h2 className="text-sm font-semibold text-optimed-tiber">
              Listado
            </h2>
            {!isLoading && filteredRows.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                Sin resultados.
              </div>
            ) : (
              filteredRows.map((s: Sale) => {
                const sN = normalizeStatus(s.status);
                return (
                  <div
                    key={s.id}
                    className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          #{s.id} • {statusLabel[sN]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(s.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 h-fit rounded-full ${
                          sN === "paid"
                            ? "bg-green-100 text-green-700"
                            : sN === "partial"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {statusLabel[sN]}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-700">
                      <div>
                        Cliente:{" "}
                        {s.clientName ||
                          `${s.client?.firstName ?? ""} ${
                            s.client?.lastName ?? ""
                          }`}
                      </div>
                      <div>Total: {formatTotal(s.total, s.currency)}</div>
                    </div>
                    {s.items?.length ? (
                      <div className="mt-2 border-t pt-2">
                        <p className="text-xs font-semibold mb-1">Detalle</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {s.items.map((it: any, i: number) => (
                            <li
                              key={it.id || i}
                              className="flex justify-between"
                            >
                              <span className="truncate">
                                {it.name} × {it.quantity}
                              </span>
                              <span>
                                {formatTotal(
                                  it.subtotal ?? it.quantity * it.unitPrice
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          type="button"
                          color="secondary"
                          onClick={() => openModal(s)}
                          className="text-xs mt-2"
                        >
                          Ver detalles
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}

            {/* Paginación */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Página {data?.page ?? page} de {data?.totalPages ?? 1}
              </p>
              <div className="flex gap-2">
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
          </section>

          {/* Desktop table */}
          <section className="hidden md:block">
            <DynamicTable
              data={filteredRows}
              columns={columns}
              loading={isLoading}
              emptyMessage="Sin resultados."
              actionIconButton="Ver detalles"
              onClickActionButton={openModal}
            />
          </section>
        </section>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedSale && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                Detalle de Venta #{selectedSale.id}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Cliente:</p>
                  <p>
                    {selectedSale.clientName ||
                      `${selectedSale.client?.firstName ?? ""} ${
                        selectedSale.client?.lastName ?? ""
                      }`}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Fecha:</p>
                  <p>{new Date(selectedSale.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Estado:</p>
                  <p>{statusLabel[normalizeStatus(selectedSale.status)]}</p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p>
                    {formatTotal(selectedSale.total, selectedSale.currency)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold">Items:</p>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  {selectedSale.items?.map((item, index) => (
                    <li key={item.id || index} className="flex justify-between">
                      <span>
                        <strong>{item.name}</strong> x {item.quantity}
                      </span>
                      <span>
                        {formatTotal(
                          item.price ?? (item?.price || 0) * item.quantity
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </FormProvider>
  );
}
