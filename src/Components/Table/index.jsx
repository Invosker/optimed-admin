import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import SelectN from "../Input/Select";
import Button from "../Button";

import { LoaderCircle } from "lucide-react";


const Table = ({ data = [], columns = [], onRowClick, actions = [], onClikcAction, selectedId, setSelectedId, loading, emptyMessage, actionIconButton, onClickActionButton }) => {
    const hasActions = columns.some((column) => column.key === "action");
    const hasActionsButton = columns.some((column) => column.key === "actionButton");

    const hasActive = columns.some((column) => column.key === "active");

    const currentColumns = columns.filter((column) => (column.key !== 'action' && column.key !== 'active' && column.key !== 'actionButton'));
    const methods = useForm({ defaultValues: { listQty: 5 } });

    const [isOpen, setIsOpen] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = methods.watch('listQty')

    const toggleDropdown = (index) => {
        setIsOpen((value) => (value === index ? -1 : index));
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (direction) => {
        setCurrentPage((prevPage) => {
            if (direction === "next") {
                return Math.min(prevPage + 1, totalPages);
            } else {
                return Math.max(prevPage - 1, 1);
            }
        });
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <div className='overflow-x-auto overflow-y-auto max-h-[45dvh] min-h-[20dvh]'>
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="text-left">
                        {
                            loading &&
                            <tr className="text-black">
                                <th className="py-4 px-6 text-left">Cargando...</th>
                            </tr>
                        }
                        {
                            !loading &&
                            <tr className="text-black">
                                {setSelectedId && (
                                    <th className="py-4 px-6 text-left">Seleccionar</th>
                                )}
                                {currentColumns.map((column, index) => (
                                    <th className="py-4 px-6 text-left" key={index}>
                                        {column.name}
                                    </th>
                                ))}
                                {hasActive && (
                                    <th className="py-4 px-6 text-left">Activo</th>
                                )}
                                {hasActions && (
                                    <th className="py-4 px-6 text-left">Acción</th>
                                )}
                                {hasActionsButton && (
                                    <th className="py-4 px-6 text-left">Acción</th>
                                )}
                            </tr>
                        }

                    </thead>
                    <div className="overflow-x-auto overflow-y-auto max-h-[45dvh]">

                    </div>
                    <tbody className="transition text-left">
                        {
                            paginatedData.length === 0 && !loading && <p className="text-lg p-2">{emptyMessage ?? 'No existen registros que mostrar o primero debe realizar una busqueda'}</p>
                        }
                        {
                            loading ?
                                <LoaderCircle
                                    className="animate-spin bg-transparent text-center mx-auto"
                                    size={65}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                                :
                                paginatedData.map((row, rowIndex) => (
                                    <tr
                                        className="border-b hover:bg-gray-100 transition"
                                        key={rowIndex}
                                    >
                                        {setSelectedId && (
                                            <td className="py-3 px-6">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-sigeBlue border-gray-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-sigeBlue focus:ring-offset-sigeBlue"
                                                    onChange={() =>
                                                        setSelectedId && setSelectedId(row.id)
                                                    }
                                                    checked={row.id === selectedId}
                                                />
                                            </td>
                                        )}
                                        {currentColumns.map((column, colIndex) => (
                                            <td
                                                className="py-3 px-6"
                                                onClick={() => onRowClick(row)}
                                                key={colIndex}
                                            >
                                                {row[column.key]}
                                            </td>
                                        ))}
                                        {
                                            hasActive &&
                                            <td className="py-3 px-6">
                                                {row.active ? 'Si' : 'No'}
                                            </td>
                                        }
                                        {hasActions && (
                                            <td className="py-3 px-6 relative">
                                                <button
                                                    className="bg-sigeBlue text-white rounded-lg px-4 py-2 shadow-md hover:bg-sigeBlue transition"
                                                    type="button"
                                                    onClick={() => toggleDropdown(rowIndex)}
                                                >

                                                    <EllipsisVertical
                                                        size={16}
                                                        strokeWidth={2}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                                {isOpen === rowIndex && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]">
                                                        <div className="py-1">
                                                            {actions.map((action, actionIndex) => (
                                                                <div
                                                                    className="cursor-pointer hover:bg-slate-200"
                                                                    onClick={() => onClikcAction(row, action)}
                                                                    key={`action-${actionIndex}`}
                                                                >
                                                                    {action}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                        {hasActionsButton && (
                                            <td className="py-3 px-6 relative">
                                                <button
                                                    className="bg-sigeBlue text-white rounded-lg px-4 py-2 shadow-md hover:bg-sigeBlue transition"
                                                    type="button"
                                                    onClick={() => onClickActionButton(row)}
                                                >
                                                    {actionIconButton}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                    </tbody>
                </table>

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
                        // onChange={(e) => handleItemsPerPageChange(e.target.value)}
                        />
                    </div>
                </FormProvider>
                <span className="text-gray-600 col-span-3 sm:col-span-4">
                    {startIndex + 1} - {Math.min(startIndex + itemsPerPage, data.length)} de {data.length}
                </span>
                <div className="flex space-x-2 col-span-3 sm:col-span-4">
                    <Button type='button' loading={loading} disabled={currentPage === 1} onClick={() => handlePageChange("prev")} label='P. Anterior' />
                    <Button type='button' loading={loading} disabled={(currentPage === totalPages || totalPages === 0)} onClick={() => handlePageChange("next")} label='P. Siguiente' />
                </div>
            </div>
        </>

    );
};

export default Table;