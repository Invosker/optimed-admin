
import React from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import Button from "@/Components/Button";
import testshampoo from "@/assets/testshampoo.png";
import type { InventoryItem } from "@/Views/Transport/types/inventory";
import { useCartCalculations, priceOf, priceOfBs } from "../useCartCalculations";

// Resumen de carrito
export default function CartSummary({
    products,
    cart,
    onInc,
    onDec,
    onRemove,
    onClear,
    onContinue,
    readOnly = false,
}: {
    products: InventoryItem[];
    cart: Record<number, number>;
    onInc?: (id: number) => void;
    onDec?: (id: number) => void;
    onRemove?: (id: number) => void;
    onClear?: () => void;
    onContinue?: () => void;
    readOnly?: boolean;
}) {
    const { cartList, subtotal, iva, total, subtotalUSD, ivaUSD, totalUSD } = useCartCalculations(
        cart,
        products
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-optimed-tiber">Tu orden</h3>
                {!readOnly && onClear && (
                    <button className="text-sm text-red-500 hover:text-red-600" onClick={onClear}>
                        Limpiar
                    </button>
                )}
            </div>
            <div className="h-72">
                {cartList.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center py-6">Tu carrito está vacío</div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
                        {cartList.map((p) => (
                            <div key={p.id} className="grid grid-cols-[56px_1fr_auto] gap-3 items-center">
                                <img
                                    src={(p as any).photoUrl || (testshampoo as unknown as string)}
                                    alt={p.name}
                                    className="w-14 h-14 rounded-lg object-contain bg-gray-50 p-1"
                                />
                                <div>
                                    <div className="text-sm font-semibold text-optimed-tiber">{p.name}</div>
                                    <div className="text-xs text-gray-500">
                                        Bs. {priceOfBs(p).toFixed(2)} / $ {priceOf(p).toFixed(2)}
                                    </div>
                                    {!readOnly && onInc && onDec && (
                                        <div className="mt-1 flex items-center gap-2">
                                            <button className="px-2 py-1 rounded bg-gray-100" onClick={() => onDec(p.id)}>
                                                <FaMinus />
                                            </button>
                                            <span className="text-sm font-semibold text-optimed-tiber">{cart[p.id]}</span>
                                            <button className="px-2 py-1 rounded bg-gray-100" onClick={() => onInc(p.id)}>
                                                <FaPlus />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-optimed-tiber">
                                        Bs. {(priceOfBs(p) * (cart[p.id] || 0)).toFixed(2)}
                                    </div>
                                    <div className="text-sm font-bold text-optimed-tiber">
                                        $ {(priceOf(p) * (cart[p.id] || 0)).toFixed(2)}
                                    </div>
                                    {!readOnly && onRemove && (
                                        <button
                                            className="mt-2 text-xs text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                                            onClick={() => onRemove(p.id)}
                                        >
                                            <FaTrash /> Quitar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-px bg-gray-200 my-4" />
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-700">
                    Bs. {subtotal.toFixed(2)} / $ {subtotalUSD.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">IVA (16%)</span>
                <span className="font-semibold text-gray-700">
                    Bs. {iva.toFixed(2)} / $ {ivaUSD.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between text-base">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-extrabold text-optimed-tiber">
                    Bs. {total.toFixed(2)} / $ {totalUSD.toFixed(2)}
                </span>
            </div>

            {!readOnly && onContinue && (
                <Button color="primary" className="w-full mt-4" onClick={onContinue}>
                    Continuar
                </Button>
            )}
        </div>
    );
}
