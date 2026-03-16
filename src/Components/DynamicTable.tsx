import React, { useRef, useState } from "react";
import { LoaderCircle, EllipsisVertical } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import Button from "./Button";
import SelectN from "./Input/Select";
import useOutsideClick from "@/hooks/useOutsideClick";

type ColumnType<T> = {
  key: string;
  header?: string;
  name?: string;
  cell?: (row: T) => React.ReactNode;
};

type ActionType<T> = {
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
};

type DynamicTableProps<T> = {
  data?: T[];
  columns: ColumnType<T>[];
  onRowClick?: (row: T) => void;
  actions?: ActionType<T>[];
  onClikcAction?: (row: T, action: ActionType<T>) => void;
  selectedId?: string | number;
  setSelectedId?: (id: string | number) => void;
  loading?: boolean;
  emptyMessage?: string;
  actionIconButton?: React.ReactNode;
  onClickActionButton?: (row: T) => void;
};

const DynamicTable = <T extends { id: string | number; active?: boolean }>({
  data = [],
  columns = [],
  onRowClick,
  actions = [],
  onClikcAction,
  selectedId,
  setSelectedId,
  loading = false,
  emptyMessage,
  actionIconButton,
  onClickActionButton,
}: DynamicTableProps<T>) => {
  const ref = useRef(null);

  useOutsideClick(ref, () => setIsOpen(-1));

  const hasActions = columns.some((column) => column.key === "action") || actions.length > 0;
  const hasActionsButton = columns.some((column) => column.key === "actionButton");
  const hasActive = columns.some((column) => column.key === "active");
  const currentColumns = columns.filter((column) => column.key !== "action" && column.key !== "active" && column.key !== "actionButton");
  const methods = useForm<{ listQty: number }>({
    defaultValues: { listQty: 10 },
  });

  const [isOpen, setIsOpen] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = methods.watch("listQty");

  const toggleDropdown = (index: number) => {
    setIsOpen((value) => (value === index ? -1 : index));
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prevPage) => {
      if (direction === "next") {
        return Math.min(prevPage + 1, totalPages);
      } else {
        return Math.max(prevPage - 1, 1);
      }
    });
  };

  const handleAction = (row: T, action: ActionType<T>) => {
    if (onClikcAction) {
      onClikcAction(row, action);
    }
    setIsOpen(-1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="bg-background rounded-md border-input w-full" ref={ref}>
        <Table className="">
          <TableHeader className="text-left">
            {loading && (
              <TableRow className="bg-muted/50">
                <TableHead className="py-4 px-6 text-left" colSpan={currentColumns.length + (setSelectedId ? 1 : 0) + (hasActive ? 1 : 0) + (hasActions ? 1 : 0) + (hasActionsButton ? 1 : 0)}>
                  Cargando...
                </TableHead>
              </TableRow>
            )}
            {!loading && (
              <TableRow className="bg-muted/50">
                {setSelectedId && <TableHead className="h-9 py-2">Seleccionar</TableHead>}
                {currentColumns.map((column, index) => (
                  <TableHead className="h-9 py-2" key={index}>
                    {column.header ?? column.name}
                  </TableHead>
                ))}
                {hasActive && <TableHead className="h-9 py-2">Activo</TableHead>}
                {hasActions && <TableHead className="h-9 py-2">Acción</TableHead>}
                {hasActionsButton && <TableHead className="h-9 py-2">Acción</TableHead>}
              </TableRow>
            )}
          </TableHeader>
          <TableBody className="transition text-left">
            {paginatedData.length === 0 && !loading && (
              <tr>
                <TableCell colSpan={currentColumns.length + (setSelectedId ? 1 : 0) + (hasActive ? 1 : 0) + (hasActions ? 1 : 0) + (hasActionsButton ? 1 : 0)}>
                  <p className="font-medium p-2">{emptyMessage ?? "No existen registros que mostrar o primero debe realizar una busqueda"}</p>
                </TableCell>
              </tr>
            )}
            {loading ? (
              <tr>
                <TableCell colSpan={currentColumns.length + (setSelectedId ? 1 : 0) + (hasActive ? 1 : 0) + (hasActions ? 1 : 0) + (hasActionsButton ? 1 : 0)}>
                  <LoaderCircle className="animate-spin bg-transparent text-center mx-auto" size={65} strokeWidth={2} aria-hidden="true" />
                </TableCell>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {setSelectedId && (
                    <TableCell className="max-w-48 py-2 font-medium">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-autogo-tiber border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-autogo-tiber focus:ring-offset-autogo-tiber"
                        onChange={() => setSelectedId && setSelectedId(row.id)}
                        checked={row.id === selectedId}
                      />
                    </TableCell>
                  )}
                  {currentColumns.map((column, colIndex) => (
                    <TableCell className="text-muted-foreground py-2" onClick={() => onRowClick && onRowClick(row)} key={colIndex}>
                      {column.cell ? column.cell(row) : String(row[column.key as keyof T])}
                    </TableCell>
                  ))}
                  {hasActive && <TableCell className="py-3 px-6">{row.active ? "Si" : "No"}</TableCell>}
                  {hasActions && (
                    <TableCell className="py-2 px-6 relative overflow-visible">
                      <button className="bg-optimed-tiber text-white rounded-lg px-2 py-2 shadow-md hover:bg-autogo-tiber transition" type="button" onClick={() => toggleDropdown(rowIndex)}>
                        <EllipsisVertical size={16} strokeWidth={2} aria-hidden="true" />
                      </button>
                      {isOpen === rowIndex && (
                        <div className="origin-top-right absolute mt-2 w-fit rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]">
                          <div className="py-1">
                            {actions.map((action, actionIndex) => (
                              <div
                                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-slate-200"
                                onClick={() => {
                                  action.onClick(row);
                                  setIsOpen(-1);
                                }}
                                key={`action-${actionIndex}`}
                              >
                                {action.icon}
                                <span>{action.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TableCell>
                  )}
                  {hasActionsButton && (
                    <TableCell className="py-3 px-6 relative">
                      <button
                        className="bg-optimed-tiber text-white rounded-lg px-4 py-2 shadow-md hover:bg-autogo-tiber transition"
                        type="button"
                        onClick={() => onClickActionButton && onClickActionButton(row)}
                      >
                        {actionIconButton}
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6 grid grid-cols-12 justify-between items-center gap-4">
        <FormProvider {...methods}>
          <div className="relative col-span-3 sm:col-span-4">
            <SelectN
              label="Registros por página"
              name="listQty"
              rules={{ valueAsNumber: true }}
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
              ]}
            />
          </div>
        </FormProvider>
        <span className="text-gray-600 col-span-3 sm:col-span-4">
          {startIndex + 1} - {Math.min(startIndex + itemsPerPage, data.length)} de {data.length}
        </span>
        <div className="flex space-x-2 col-span-3 sm:col-span-4">
          <Button type="button" loading={loading} disabled={currentPage === 1} onClick={() => handlePageChange("prev")} label="P. Anterior" />
          <Button type="button" loading={loading} disabled={currentPage === totalPages || totalPages === 0} onClick={() => handlePageChange("next")} label="P. Siguiente" />
        </div>
      </div>
    </>
  );
};

export default DynamicTable;
