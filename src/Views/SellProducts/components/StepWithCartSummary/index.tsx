
import React, { useState } from "react";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import Button from "@/Components/Button";
import type { InventoryItem } from "@/Views/Transport/types/inventory";
import { useCartCalculations } from "../useCartCalculations";
import CartSummary from "../CartSummary";

export default function StepWithCartSummary({
    data,
    children,
    allProducts,
    isLoadingInventory,
}: {
    data: any;
    children: React.ReactNode;
    allProducts: InventoryItem[];
    isLoadingInventory: boolean;
}) {
    const [showCartMobile, setShowCartMobile] = useState(false);
    const { total } = useCartCalculations(data.cart || {}, allProducts);
    if (isLoadingInventory) {
        return <div className="text-center text-gray-500">Cargando datos del carrito...</div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>{children}</div>
                <aside className="hidden md:block">
                    <CartSummary products={allProducts} cart={data.cart || {}} readOnly />
                </aside>
            </div>

            {/* Bottom sheet carrito (mobile) */}
            <div
                className={`fixed inset-x-0 bottom-0 z-50 md:hidden transition-transform duration-300 ${
                    showCartMobile ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
                    }`}
            >
                <div className="bg-white rounded-t-2xl shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-optimed-tiber">Tu orden</h4>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setShowCartMobile(false)}
                            aria-label="Cerrar"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                    <CartSummary products={allProducts} cart={data.cart || {}} readOnly />
                </div>
            </div>

            {/* Barra fija inferior móvil con total */}
            <div className="fixed bottom-3 inset-x-3 md:hidden">
                <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                        Total: <span className="font-bold text-optimed-tiber">Bs. {total.toFixed(2)}</span>
                    </span>
                    <Button onClick={() => setShowCartMobile(true)}>
                        <div className="flex items-center gap-2">
                            <FaShoppingCart />
                            Ver carrito
                        </div>
                    </Button>
                </div>
            </div>
        </>
    );
}
