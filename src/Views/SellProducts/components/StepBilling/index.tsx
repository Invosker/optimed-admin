
import React from "react";
import type { InventoryItem } from "@/Views/Transport/types/inventory";
import StepWithCartSummary from "../StepWithCartSummary";
import { FaMoneyBillWave, FaCreditCard, FaMobileAlt } from "react-icons/fa";

const paymentMethodsOptions = [
    { id: "cash", label: "Efectivo", icon: <FaMoneyBillWave /> },
    { id: "debit", label: "Tarjeta de Débito", icon: <FaCreditCard /> },
    { id: "zelle", label: "Zelle", icon: <span className="font-bold text-lg">Z</span> },
    { id: "mobile", label: "Pago Móvil", icon: <FaMobileAlt /> },
];

export default function StepBilling({
    data,
    allProducts,
    isLoadingInventory,
}: {
    data: any;
    onChange: (d: any) => void;
    allProducts: InventoryItem[];
    isLoadingInventory: boolean;
}) {
    const client = data;
    const payments = data.payments || [];
    const getPaymentMethodLabel = (id: string) => paymentMethodsOptions.find((p) => p.id === id)?.label || id;
    return (
        <StepWithCartSummary data={data} allProducts={allProducts} isLoadingInventory={isLoadingInventory}>
            <div className="space-y-6">
                {/* Client Information Summary */}
                <div>
                    <h3 className="text-lg font-semibold text-optimed-tiber border-b pb-2 mb-3">Información del Cliente</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="font-medium text-gray-500">Nombre:</div>
                        <div className="text-gray-800">{`${client.firstName || ""} ${client.lastName || ""}`}</div>

                        <div className="font-medium text-gray-500">Identificación:</div>
                        <div className="text-gray-800">{`${client.identificationType || ""}-${client.identification || ""}`}</div>

                        <div className="font-medium text-gray-500">Email:</div>
                        <div className="text-gray-800">{client.email || "-"}</div>

                        <div className="font-medium text-gray-500">Teléfono:</div>
                        <div className="text-gray-800">{client.phone || "-"}</div>
                    </div>
                </div>

                {/* Payment Methods Summary */}
                <div>
                    <h3 className="text-lg font-semibold text-optimed-tiber border-b pb-2 mb-3">Métodos de Pago</h3>
                    <div className="space-y-2 text-sm">
                        {payments.map((payment: any, index: number) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-600">{getPaymentMethodLabel(payment.method)}:</span>
                                <span className="font-semibold text-gray-800">Bs. {Number(payment.amount || 0).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StepWithCartSummary>
    );
}
