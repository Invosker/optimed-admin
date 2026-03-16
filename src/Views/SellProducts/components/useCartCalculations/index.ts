import { useMemo } from "react";
import type { InventoryItem } from "@/Views/Transport/types/inventory";

// Hook to centralize cart calculations
export const useCartCalculations = (cart: Record<number, number>, allProducts: InventoryItem[]) => {
    const cartList = useMemo(() => allProducts.filter((p) => cart[p.id]), [allProducts, cart]);

    const { subtotal, iva, total, subtotalUSD, ivaUSD, totalUSD } = useMemo(() => {
        const sub = cartList.reduce((acc, p) => acc + priceOfBs(p) * (cart[p.id] || 0), 0);
        const subUSD = cartList.reduce((acc, p) => acc + priceOf(p) * (cart[p.id] || 0), 0);
        const tax = sub * 0.16;
        const taxUSD = subUSD * 0.16;

        return {
            subtotal: sub,
            iva: tax,
            total: sub + tax,
            subtotalUSD: subUSD,
            ivaUSD: taxUSD,
            totalUSD: subUSD + taxUSD,
        };
    }, [cartList, cart]);

    return {
        cartList,
        subtotal,
        iva,
        total,
        subtotalUSD,
        ivaUSD,
        totalUSD,
    };
};

// Common utilities and components for products
export const priceOf = (p: InventoryItem) => Number((p as any)?.salePrice ?? 0);
export const priceOfBs = (p: InventoryItem) => Number((p as any)?.salePriceBs ?? 0);
export const stockOf = (p: InventoryItem) => Number(p?.stock ?? 0);
export const categoryOf = (p: InventoryItem) => {
    const cat = p?.category;
    if (!cat) return "-";
    if (typeof cat === "string") return cat;
    return "-";
};