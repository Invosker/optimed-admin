import React, { useState, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import type { InventoryItem } from "@/Views/Transport/types/inventory";
import { useCartCalculations, stockOf, categoryOf } from "../useCartCalculations";
import CartSummary from "../CartSummary";
import ProductCard from "../ProductCard";

export default function StepProducts({ data, onChange, onNext, onBack, allProducts, isLoadingInventory }: any) {
    type Cart = Record<number, number>;

    const methods = useForm();
    const [cart, setCart] = useState<Cart>(data.cart || {});
    console.log("🚀 ~ StepProducts ~ cart:", cart);
    const [showCartMobile, setShowCartMobile] = useState(false);

    const { subtotal } = useCartCalculations(cart, allProducts);

    const watchSearch = methods.watch("search");
    const PRODUCTS = allProducts;

    const filteredProducts = useMemo(() => {
        if (watchSearch === "" || watchSearch === undefined) {
            return PRODUCTS;
        }
        return allProducts.filter(
            (p) =>
                p.name.toLowerCase()?.indexOf(watchSearch?.toLowerCase()) > -1 ||
                categoryOf(p).toLowerCase()?.indexOf(watchSearch?.toLowerCase()) > -1
        );
    }, [allProducts, watchSearch]);

    const inc = (id: number) =>
        setCart((c) => {
            const prod = PRODUCTS.find((p) => p.id === id);
            const next = (c[id] || 0) + 1;
            return prod && next <= stockOf(prod) ? { ...c, [id]: next } : c;
        });

    const dec = (id: number) =>
        setCart((c) => {
            const next = Math.max((c[id] || 0) - 1, 0);
            const { [id]: _, ...rest } = c;
            return next === 0 ? rest : { ...c, [id]: next };
        });

    const removeLine = (id: number) =>
        setCart((c) => {
            const { [id]: _, ...rest } = c;
            return rest;
        });

    const clear = () => setCart({});

    useEffect(() => {
        onChange({
            ...data,
            cart,
            subtotal,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart, subtotal]);

    return (
        <FormProvider {...methods}>
            {/* Grid principal del paso, sin tarjeta interna (la tarjeta ya la pone el contenedor del stepper) */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
                {/* Columna izquierda: productos */}
                <div>
                    {/* Botón de carrito para móvil (no es filtro) */}
                    <div className="mb-3 md:hidden">
                        <Button className="w-full" onClick={() => setShowCartMobile(true)}>
                            <div className="flex items-center gap-2">
                                <FaShoppingCart />
                                <span>Ver carrito</span>
                            </div>
                        </Button>
                    </div>

                    {/* Grid de productos */}
                    {isLoadingInventory ? (
                        <div className="py-10 text-center text-sm text-gray-500">Cargando inventario...</div>
                    ) : (
                        <>
                            <div className="py-2">
                                <TextField name="search" type="search" label="" placeholder="Buscar producto" />
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 h-[25rem] lg:h-[32rem] overflow-y-auto">
                                {filteredProducts.map((p) => {
                                    const qty = cart[p.id] || 0;
                                    return (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            qty={qty}
                                            onAdd={() => inc(p.id)}
                                            onRemove={() => dec(p.id)}
                                            onAddOne={() => inc(p.id)}
                                        />
                                    );
                                })}
                                {!isLoadingInventory && PRODUCTS.length === 0 && (
                                    <div className="col-span-full text-center text-gray-400 py-8">No hay productos para mostrar.</div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar md+ */}
                {/* <aside className="hidden md:block sticky top-6 h-max"> */}
                {/* Sidebar para el carrito */}
                <aside className="sticky top-6 h-max hidden md:block">
                    <CartSummary
                        products={PRODUCTS}
                        cart={cart}
                        onInc={inc}
                        onDec={dec}
                        onRemove={removeLine}
                        onClear={clear}
                        onContinue={() => onNext()}
                    />
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
                    <CartSummary
                        products={PRODUCTS}
                        cart={cart}
                        onInc={inc}
                        onDec={dec}
                        onRemove={removeLine}
                        onClear={clear}
                        onContinue={() => {
                            setShowCartMobile(false);
                            onNext();
                        }}
                    />
                </div>
            </div>

            {/* Barra fija inferior móvil con total */}
            <div className="fixed bottom-3 inset-x-3 md:hidden">
                <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                        Total: <span className="font-bold text-optimed-tiber">Bs. {subtotal.toFixed(2)}</span>
                    </span>
                    <Button onClick={() => setShowCartMobile(true)}>
                        <div className="flex items-center gap-2">
                            <FaShoppingCart />
                            Ver carrito
                        </div>
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
}