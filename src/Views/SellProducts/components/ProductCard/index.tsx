import React from "react";
import Button from "@/Components/Button";
import { FaMinus, FaPlus } from "react-icons/fa";
import type { InventoryItem } from "@/Views/Transport/types/inventory";
import { priceOf, priceOfBs, stockOf, categoryOf } from "../useCartCalculations";
import testshampoo from "@/assets/testshampoo.png";

export default function ProductCard({
    product,
    qty,
    onAdd,
    onRemove,
    onAddOne,
}: {
    product: InventoryItem;
    qty: number;
    onAdd: () => void;
    onRemove: () => void;
    onAddOne: () => void;
}) {
    const price = priceOf(product);
    const stk = stockOf(product);
    const priceBs = priceOfBs(product);
    return (
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-sm p-4 h-min">
            <img
                src={(product as any).photoUrl || (testshampoo as unknown as string)}
                alt={product.name}
                className="w-24 h-24 object-contain rounded-lg mb-2"
            />
            <div className="font-semibold text-optimed-tiber text-center mb-1">{product.name}</div>
            <div className="text-xs text-gray-500 mb-1">{categoryOf(product)}</div>
            <div className="text-md font-bold text-optimed-tiber mb-2">Ref. {price.toFixed(2)}</div>
            <div className="text-lg font-bold text-optimed-tiber mb-2">Bs. {priceBs.toFixed(2)}</div>
            <div className="flex items-center gap-2 mb-2">
                <Button size="sm" color="secondary" onClick={onRemove} disabled={!qty}>
                    <FaMinus />
                </Button>
                <span className="font-bold text-optimed-tiber">{qty || 0}</span>
                <Button size="sm" color="primary" onClick={onAddOne} disabled={qty >= stk}>
                    <FaPlus />
                </Button>
            </div>
            <div className="text-xs text-gray-400 mb-2">Stock: {stk}</div>
            <Button color="primary" className="w-full" onClick={onAdd} disabled={qty >= stk}>
                Agregar
            </Button>
        </div>
    );
}