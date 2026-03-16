import { useApiClient } from "@/hooks/useApiClient";
import { priceOf } from "../components/useCartCalculations";
import { ApiResponse } from "@/types/ApiResponse";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import fnParseGetMessage from "@/Api/utils/fnParseGetMessage";
import { AxiosError } from "axios";
import { InventoryItem } from "@/Views/Transport/types/inventory";

interface CreateSaleArgs {
  data: any;
  cart: any;
  allProducts: any[];
  factorData?: any;
  paymentOption: "now" | "later";
}

const createSaleWithPayments = async (
  apiClient: ReturnType<typeof useApiClient>,
  { data, cart, allProducts, factorData }: Omit<CreateSaleArgs, "paymentOption">
) => {
  const { cart: cartData, clientId, payments } = data;
  console.log("🚀 ~ createSaleWithPayments ~ factorData:", factorData);
  const cartList = allProducts.filter((p) => cartData[p.id]);

  const salePayload = {
    clientId: clientId,
    items: cartList.map((p: InventoryItem) => ({
      sku: p.sku,
      name: p.name,
      price: priceOf(p).toFixed(2),
      quantity: cartData[p.id],
      type: "product",
      appointmentId: null,
    })),
    payment: {
      saleId: 0,
      amount: cart.totalUSD.toFixed(2),
      status: "pending",
      methods:
        payments?.map((p: any) => ({
          method: p.method,
          reference: p.reference,
          // amount:
          //   p.method === "cash" || p.method === "zelle"
          //     ? p.amount
          //     : parseFloat((p.amount / factorData?.dolarBCV).toFixed(2)),
          paidAt: new Date().toISOString(),
        })) ?? [],
    },
  };
  console.log("🚀 ~ createSaleWithPayments ~ salePayload:", salePayload);

  const response = await apiClient.post<ApiResponse>("/sales/payment", salePayload);
  return response;
};

const createSaleWithoutPayments = async (
  apiClient: ReturnType<typeof useApiClient>,
  { data, allProducts }: Omit<CreateSaleArgs, "paymentOption" | "cart">
) => {
  const { cart: cartData, clientId } = data;
  const cartList = allProducts.filter((p) => cartData[p.id]);
  const salePayload = {
    clientId: clientId,
    items: cartList.map((p: InventoryItem) => ({
      sku: p.sku,
      name: p.name,
      price: priceOf(p).toFixed(2),
      quantity: cartData[p.id],
      type: "product",
      appointmentId: null,
    })),
  };
  console.log("🚀 ~ createSaleWithoutPayments ~ salePayload:", salePayload);

  const response = await apiClient.post<ApiResponse>("/sales", salePayload);
  return response;
};

export const useCreateSale = () => {
  const apiClient = useApiClient();

  const saleMutation = useMutation({
    mutationFn: async ({ data, cart, allProducts, paymentOption, factorData }: CreateSaleArgs) => {
      if (paymentOption === "now") {
        return createSaleWithPayments(apiClient, { data, cart, allProducts, factorData });
      } else {
        return createSaleWithoutPayments(apiClient, { data, allProducts });
      }
    },
    onError: (e: unknown) => {
      console.log("🚀 ~ useCreateSale ~ e:", e);
      const msg = fnParseGetMessage(e as AxiosError);
      toast.error(msg || "Error al generar venta");
    },
    onSuccess: (data) => {
      console.log("🚀 ~ useCreateSale ~ data:", data);
      toast.success("Venta generada");
    },
  });

  return { saleMutation };
};
