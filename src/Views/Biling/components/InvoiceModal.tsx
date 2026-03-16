import React from "react";
import Modal from "@/Components/Modal";
import type { Sale } from "../types/sale";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

const normalizeStatus = (
  raw: unknown
): "paid" | "unpaid" | "partial" | "unknown" => {
  const v = String(raw ?? "").toLowerCase();
  if (["paid", "pagada", "payed", "completa"].includes(v)) return "paid";
  if (["partial", "partially_paid", "incompleta", "cuotas"].includes(v))
    return "partial";
  if (["unpaid", "impagada", "pending", "due"].includes(v)) return "unpaid";
  return "unknown";
};

const statusLabel: Record<string, string> = {
  paid: "Pagada",
  unpaid: "Impagada",
  partial: "Pago a cuotas",
  unknown: "—",
};

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

  const status = normalizeStatus(sale.status);
  const clientName =
    sale.clientName ||
    `${sale.client?.firstName ?? ""} ${sale.client?.lastName ?? ""}`.trim() ||
    "—";
  const clientEmail = sale.client?.email || "—";

  const formatCurrency = (value: number | string, currency?: string) => {
    return `${currency ?? ""} ${Number(value ?? 0).toFixed(2)}`;
  };

  const subtotal = sale.items?.reduce((acc, item) => {
    return acc + (item.subtotal ?? item.quantity * (item.price ?? 0));
  }, 0) || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Venta" hideActions>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-optimed-tiber">
                Factura #{sale.id}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(sale.createdAt || sale.date || "").toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                status === "paid"
                  ? "bg-green-100 text-green-700"
                  : status === "partial"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {statusLabel[status]}
            </span>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Información del Cliente
          </h3>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Nombre:</span> {clientName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {clientEmail}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Detalle de Productos
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">
                    Producto
                  </th>
                  <th className="text-center px-4 py-2 font-semibold text-gray-700">
                    Cant.
                  </th>
                  <th className="text-right px-4 py-2 font-semibold text-gray-700">
                    Precio Unit.
                  </th>
                  <th className="text-right px-4 py-2 font-semibold text-gray-700">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sale.items?.map((item, index) => {
                  const itemSubtotal = item.subtotal ?? item.quantity * (item.price ?? 0);
                  return (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(item.price ?? 0, sale.currency)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(itemSubtotal, sale.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                {formatCurrency(subtotal, sale.currency)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span className="text-optimed-tiber">Total:</span>
              <span className="text-optimed-tiber">
                {formatCurrency(sale.total, sale.currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-600">Estado de Pago:</span>
              <span
                className={`font-semibold ${
                  status === "paid"
                    ? "text-green-700"
                    : status === "partial"
                    ? "text-amber-700"
                    : "text-red-600"
                }`}
              >
                {statusLabel[status]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
