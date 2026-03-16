import { useState } from "react";
import { EllipsisVertical, Info } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form";
import SelectN from "../Input/Select";

const Table = ({ data = [], columns = [], onRowClick, actions = [] }) => {

    const hasActions = columns.some(column => column.key === 'action');

    const methods = useForm()

    const [isOpen, setIsOpen] = useState(-1);

    const toggleDropdown = (index) => {
        setIsOpen(value => value === index ? -1 : index);
    };

    return (
        <>
            <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="text-left">
                    <tr className="bg-sigeBlue text-white">
                        {columns.map((column, index) => (
                            <th className="py-4 px-6 text-left" key={index}>
                                {column.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="transition">
                    {data.map((row, index) => (
                        <tr
                            className="border-b hover:bg-gray-100 transition"
                            key={index}
                            onClick={() => onRowClick(row)}
                        >
                            {/* <Fragment key={index}> */}
                            {/* <tr className="border-b hover:bg-gray-100 transition"> */}
                            <td className="py-3 px-6">{row.code}</td>
                            <td className="py-3 px-6">{row.name}</td>
                            <td className="py-3 px-6">{row.state}</td>
                            <td className="py-3 px-6">{row.status}</td>
                            <td className="py-3 px-6">
                                <button
                                    className="bg-sigeBlue text-white rounded-lg px-4 py-2 shadow-md hover:bg-sigeBlue transition"
                                // onClick={() => setSelectedId(value => value === urb.id ? null : urb.id)}
                                >
                                    <Info size={16} strokeWidth={2} aria-hidden="true" />
                                </button>
                            </td>
                            {
                                hasActions &&
                                <td className="py-3 px-6 relative">
                                    <button
                                        className="bg-sigeBlue text-white rounded-lg px-4 py-2 shadow-md hover:bg-sigeBlue transition"
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        <EllipsisVertical size={16} strokeWidth={2} aria-hidden="true" />
                                    </button>
                                    {isOpen === index && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                {
                                                    actions.map((action, index) => (
                                                        <a href={action.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" key={index}>{action.name}</a>
                                                    ))
                                                }
                                                {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Registrar persona</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seleccionar Terreno</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Agregar edificación </a> */}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            }

                            {/* </tr> */}
                            {/* </Fragment> */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-6 flex justify-between items-center">
                <FormProvider {...methods}>
                    <div className="relative">
                        <SelectN label="Registros por página" name="listQty" options={[{ value: '5', label: '5' }, { value: '10', label: '10' }, { value: '15', label: '15' }]} />
                    </div>
                </FormProvider>
                <span className="text-gray-600">1 - 5 de 45</span>
                <div className="flex space-x-2">
                    <button className="bg-sigeBlue text-white rounded-lg px-4 py-2 shadow-md hover:bg-sigeBlue transition">Anterior</button>
                    <button className="bg-sigeBlue text-white rounded-lg px-4 py-2 shadow-md hover:bg-sigeBlue transition">Siguiente</button>
                </div>
            </div>
        </>

    );
};

export default Table;