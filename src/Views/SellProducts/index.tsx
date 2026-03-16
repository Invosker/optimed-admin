import React, { useState, useMemo } from "react";
import { FaUser, FaBoxOpen, FaCreditCard, FaFileInvoice, FaMoneyBillWave } from "react-icons/fa";
import Button from "@/Components/Button";
import { useGetInventory } from "@/Views/Transport/hooks/useGetInvetory";
import type { DocPage } from "@/Views/Transport/types/inventory";
import useFactor from "@/hooks/useFactor";
import { useCartCalculations } from "./components/useCartCalculations";
import { useCreateSale } from "./hooks/useCreateSale";
import StepClient from "./components/StepClient";
import StepProducts from "./components/StepProducts";
import StepPayment from "./components/StepPayment";
import StepBilling from "./components/StepBilling";
import StepPaymentOption from "./components/StepPaymentOption";

const steps = [
  { label: "Datos del Cliente", icon: <FaUser /> },
  { label: "Selección de Productos", icon: <FaBoxOpen /> },
  { label: "Opción de Pago", icon: <FaMoneyBillWave /> },
  { label: "Métodos de Pago", icon: <FaCreditCard /> },
  { label: "Facturación", icon: <FaFileInvoice /> },
];

export default function NewClientForm({ onSubmit }: any) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({});
  const [paymentOption, setPaymentOption] = useState<"now" | "later">("now"); // Default to 'now'
  const { factorData } = useFactor();
  const { data: inventoryPage, isLoading: isLoadingInventory } = useGetInventory({
    page: 1,
    limit: 1000, // Fetch all products for calculations
  });
  const { saleMutation } = useCreateSale();

  const allProducts = useMemo(() => {
    return (
      (inventoryPage as DocPage)?.docs?.map((x) => ({
        ...x,
        salePriceBs: parseFloat((x.salePrice * (factorData?.dolarBCV ?? 1)).toFixed(2)),
      })) ?? []
    );
  }, [inventoryPage, factorData]);

  const cartCalculations = useCartCalculations(data.cart || {}, allProducts);
  console.log("🚀 ~ NewClientForm ~ cartCalculations:", cartCalculations);

  const next = () => {
    setStep((s) => {
      if (s === 2 && paymentOption === "later") {
        return Math.min(s + 2, steps.length - 1); // Skip StepPayment
      }
      return Math.min(s + 1, steps.length - 1);
    });
  };
  const back = () => {
    setStep((s) => {
      if (s === 4 && paymentOption === "later") {
        return Math.max(s - 2, 0); // Go back to StepPaymentOption
      }
      return Math.max(s - 1, 0);
    });
  };

  const handleChange = (newData: any) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleResetClient = () => {
    const baseClient = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      identification: "",
      identificationType: "V",
      address: "",
      description: "",
      dateOfBirth: "",
    };
    setData((prev) => ({ ...prev, ...baseClient }));
  };

  const handleSubmit = async () => {
    try {
      console.log("🚀 ~ handleSubmit ~ factorData:", factorData);

      saleMutation.mutate(
        { data, cart: cartCalculations, allProducts, paymentOption, factorData },
        {
          onSuccess: () => {
            setStep(0); // Reset stepper on success
            setData({}); // Reset data on success
            setPaymentOption("now"); // Reset payment option on success
            // Handle success (e.g., show a success message, redirect, etc.)
            console.log("Sale created successfully!");
            if (onSubmit) {
              onSubmit(data);
            }
          },
        }
      );
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Failed to create sale:", error);
    }
  };

  // IMPORTANTE: evitar form contenedor para no disparar submits y navegar fuera
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-optimed-tiber flex items-center gap-2">
            {steps[step].icon} {steps[step].label}
          </h2>
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === step ? "bg-optimed-tiber" : "bg-gray-300 scale-75"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="h-px bg-gray-200 my-2" />
      </div>

      {/* Contenido de cada step */}
      {step === 0 && (
        <StepClient data={data} onChange={handleChange} handleResetClient={handleResetClient} onNext={next} />
      )}
      {step === 1 && (
        <StepProducts
          data={data}
          onChange={handleChange}
          onNext={next}
          onBack={back}
          allProducts={allProducts}
          isLoadingInventory={isLoadingInventory}
        />
      )}
      {step === 2 && (
        <StepPaymentOption
          paymentOption={paymentOption}
          setPaymentOption={setPaymentOption}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 3 && paymentOption === "now" && (
        <StepPayment
          data={data}
          onChange={handleChange}
          allProducts={allProducts}
          isLoadingInventory={isLoadingInventory}
        />
      )}
      {step === 4 && (
        <StepBilling
          data={data}
          onChange={handleChange}
          allProducts={allProducts}
          isLoadingInventory={isLoadingInventory}
        />
      )}

      {/* Navegación inferior del stepper (no mostrar en step 0 para no duplicar botones) */}
      <div className="flex justify-end gap-2 mt-4">
        {step > 0 && (
          <Button onClick={back} color="secondary" type="button">
            Atrás
          </Button>
        )}
        {step > 0 && step < (paymentOption === "now" ? steps.length - 1 : steps.length - 2) && (
          <Button onClick={next} color="primary" type="button" disabled={step === 3 && !data.isValidPayment}>
            Siguiente
          </Button>
        )}
        {step === 4 && (
          // && data.isValidPayment
          <Button onClick={handleSubmit} color="primary" type="button">
            Confirmar
          </Button>
        )}
      </div>
    </div>
  );
}
