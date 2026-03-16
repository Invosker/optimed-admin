import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import type { InventoryItem } from "@/Views/Transport/types/inventory";
import { useCartCalculations } from "../useCartCalculations";
import StepWithCartSummary from "../StepWithCartSummary";
import { FaMoneyBillWave, FaCreditCard, FaMobileAlt } from "react-icons/fa";
import useFactor from "@/hooks/useFactor";

const paymentMethodsOptions = [
  { id: "cash", label: "Efectivo", icon: <FaMoneyBillWave /> },
  { id: "debit", label: "Tarjeta de Débito", icon: <FaCreditCard /> },
  { id: "zelle", label: "Zelle", icon: <span className="font-bold text-lg">Z</span> },
  { id: "mobile", label: "Pago Móvil", icon: <FaMobileAlt /> },
];

export default function StepPayment({
  data,
  onChange,
  allProducts,
  isLoadingInventory,
}: {
  data: any;
  onChange: (d: any) => void;
  allProducts: InventoryItem[];
  isLoadingInventory: boolean;
}) {
  const { factorData } = useFactor();
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      payments: data.payments || [],
    },
  });

  const { watch, setValue } = methods;
  const selectedPayments = watch("payments");
  const { total } = useCartCalculations(data.cart || {}, allProducts);

  useEffect(() => {
    // This will notify the parent component of changes in this step's form
    const subscription = watch((value) => {
      const currentPayments = value.payments || [];
      const sumOfPayments = currentPayments.reduce((acc: number, p: any) => {
        const amount = Number(p.amount || 0);
        if (p.method === "cash" || p.method === "zelle") {
          return parseFloat((acc + amount * (factorData?.dolarBCV || 1)).toFixed(2));
        }
        return parseFloat((acc + amount).toFixed(2));
      }, 0);

      const amountsMatch = sumOfPayments.toFixed(2) === total.toFixed(2);
      const allReferencesProvided = currentPayments.every((p: any) => {
        if (p.method === "cash") {
          return true;
        }
        return p.reference && p.reference.trim() !== "";
      });

      const isValidPayment = amountsMatch && allReferencesProvided;

      onChange({
        payments: currentPayments,
        isValidPayment: isValidPayment,
        sumOfPayments: sumOfPayments, // Optionally pass sum for display
        paymentError:
          !amountsMatch
            ? "El total pagado no coincide con el total del carrito."
            : !allReferencesProvided
            ? "Falta la referencia de uno o más métodos de pago."
            : "",
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange, total, factorData]);

  const togglePaymentMethod = (id: string) => {
    const isSelected = selectedPayments.some((p: any) => p.method === id);
    if (isSelected) {
      setValue(
        "payments",
        selectedPayments.filter((p: any) => p.method !== id),
        { shouldValidate: true }
      );
    } else {
      setValue("payments", [...selectedPayments, { method: id, amount: "", reference: "" }], { shouldValidate: true });
    }
  };

  const handlePaymentChange = (id: string, field: "amount" | "reference", value: string) => {
    const isAmount = field === "amount";
    const parsedValue = isAmount ? (value === "" ? "" : parseFloat(value)) : value;

    setValue(
      "payments",
      selectedPayments.map((p: any) =>
        p.method === id ? { ...p, [field]: isAmount ? (isNaN(parsedValue as number) ? "" : parsedValue) : value } : p
      ),
      { shouldValidate: true }
    );
  };

  return (
    <StepWithCartSummary data={data} allProducts={allProducts} isLoadingInventory={isLoadingInventory}>
      <FormProvider {...methods}>
        <form>
          <div className="flex flex-col gap-3">
            {paymentMethodsOptions.map((option) => {
              const payment = selectedPayments.find((p: any) => p.method === option.id);
              const isSelected = !!payment;
              const isTotalReached = Number(Number(data.sumOfPayments || 0).toFixed(2)) >= Number(total.toFixed(2));
              return (
                <div
                  key={option.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isSelected ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
                  } ${isTotalReached && !isSelected ? "opacity-50" : ""}`}
                >
                  {/* className={`rounded-xl border p-4 transition-all ${
                     isSelected ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
                   }`}
                 > */}
                  <div
                    className={`flex items-center justify-between ${
                      isTotalReached && !isSelected ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    //  className={`flex items-center justify-between`}
                    onClick={() => {
                      if (isTotalReached && !isSelected) {
                        return;
                      }
                      togglePaymentMethod(option.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-optimed-tiber w-6 text-center">{option.icon}</div>
                      <span className="font-semibold text-gray-800">{option.label}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-optimed-tiber bg-optimed-tiber" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 grid gap-3">
                      <TextField
                        name={`amount_${option.id}`}
                        label={`Monto en ${option.id === "cash" || option.id === "zelle" ? "USD" : "Bs."}`}
                        type="number"
                        placeholder="0.00"
                        value={payment.amount}
                        onChange={(e) => handlePaymentChange(option.id, "amount", e.target.value)}
                        rules={{
                          required: "El monto es requerido",
                          min: { value: 0.01, message: "Debe ser mayor a 0" },
                        }}
                      />
                      {option.id !== "cash" && (
                        <TextField
                          name={`reference_${option.id}`}
                          label="Referencia"
                          type="text"
                          placeholder="Ingrese la referencia"
                          value={payment.reference || ""}
                          onChange={(e) => handlePaymentChange(option.id, "reference", e.target.value)}
                          rules={{
                            required: "La referencia es requerida",
                          }}
                        />
                      )}
                      {payment.amount === "" && (
                        <button
                          type="button"
                          className="text-xs text-optimed-tiber hover:underline mt-1"
                          onClick={() => {
                            const sumOfOthers = selectedPayments.reduce((acc: number, p: any) => {
                              if (p.method !== option.id) {
                                const amount = Number(p.amount || 0);
                                if (p.method === "cash" || p.method === "zelle") {
                                  return acc + amount * (factorData?.dolarBCV || 1);
                                }
                                return acc + amount;
                              }
                              return acc;
                            }, 0);
                            const remaining = total - sumOfOthers;

                            if (option.id === "cash" || option.id === "zelle") {
                              handlePaymentChange(
                                option.id,
                                "amount",
                                (remaining / (factorData?.dolarBCV || 1)).toFixed(2)
                              );
                            } else {
                              handlePaymentChange(option.id, "amount", remaining.toFixed(2));
                            }
                          }}
                        >
                          Llenar con el restante
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between text-base font-semibold text-gray-700 mb-2">
              <span>Total del Carrito:</span>
              <span>Bs. {total.toFixed(2)}</span>
            </div>
            <div
              className={`flex justify-between text-base font-bold ${
                data.isValidPayment ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>Total Pagado:</span>
              <span>Bs. {Number(data.sumOfPayments || 0).toFixed(2)}</span>
            </div>
            {!data.isValidPayment && data.paymentError && (
              <p className="text-red-500 text-sm mt-2">{data.paymentError}</p>
            )}
          </div>
        </form>
      </FormProvider>
    </StepWithCartSummary>
  );
}
