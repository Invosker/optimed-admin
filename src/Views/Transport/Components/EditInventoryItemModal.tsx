import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import Button from "@/Components/Button";
import { InventoryItem, InventoryUpdateRequest } from "../types/inventory";
import { useUpdateInventoryItem } from "../hooks/useUpdateInventoryItem";
import { createPortal } from "react-dom";
import SwitchLS from "@/Components/Input/Switch";
import useGetCategories from "../../Configurations/hooks/useGetCategory";
import useGetSubCategories from "../../Configurations/hooks/useGetSubCategories";

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
}

type FormValues = {
  sku: string;
  barcode: string;
  name: string;
  categoryId: number | string | null;
  category: string;
  subcategory: string | null;
  purchasePrice: string;
  salePrice: string;
  tax: string;
  discountPercentage: number;
  minimumStock: number;
  stock: number;
  isActive: boolean;
  supplier: string;
  manufacturer: string;
  presentation: string;
};

export default function EditInventoryItemModal({ item, onClose }: Props) {
  const methods = useForm<FormValues>({
    defaultValues: {
      sku: "",
      barcode: "",
      name: "",
      categoryId: null,
      category: "",
      subcategory: null,
      purchasePrice: "",
      salePrice: "",
      tax: "",
      discountPercentage: 0,
      minimumStock: 0,
      stock: 0,
      isActive: true,
      supplier: "",
      manufacturer: "",
      presentation: "",
    },
  });

  const { handleSubmit, reset, setFocus, watch, setValue } = methods;
  const { mutate: updateItem, isPending } = useUpdateInventoryItem();

  const { optionsCategories, categories, loadingCategories } =
    useGetCategories();

  const watchedCategoryId = watch("categoryId") as number | string | null;

  const { optionsSubcategories, loadingSubcategories } = useGetSubCategories(
    watchedCategoryId ? Number(watchedCategoryId) : undefined
  );

  const prevCategoryIdRef = useRef<number | string | null | undefined>(
    undefined
  );
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) return;
    const prev = prevCategoryIdRef.current;
    if (
      watchedCategoryId !== undefined &&
      watchedCategoryId !== null &&
      prev !== undefined &&
      prev !== null &&
      String(watchedCategoryId) !== String(prev)
    ) {
      setValue("subcategory", null);
    }
    prevCategoryIdRef.current = watchedCategoryId;
  }, [watchedCategoryId, setValue]);

  useEffect(() => {
    if (item) {
      const fallbackCategoryId = item.categoryId ?? null;
      reset({
        sku: item.sku,
        barcode: item.barcode,
        name: item.name,
        categoryId: fallbackCategoryId,
        category: item.category,
        subcategory: item.subcategory,
        purchasePrice: item.purchasePrice.toFixed(2),
        salePrice: item.salePrice.toFixed(2),
        tax: String(item.tax),
        discountPercentage: item.discountPercentage,
        minimumStock: item.minimumStock,
        stock: item.stock,
        isActive: item.isActive,
        supplier: item.supplier,
        manufacturer: item.manufacturer,
        presentation: item.presentation,
      });
      prevCategoryIdRef.current = fallbackCategoryId;
      initializedRef.current = true;
      setTimeout(() => {
        (
          document.querySelector('input[name="name"]') as HTMLInputElement
        )?.focus();
      }, 50);
    }
  }, [item, reset, setFocus]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;

  const onSubmit = (values: FormValues) => {
    const selectedCategory =
      categories.find((c: any) => c.id === Number(values.categoryId)) || null;

    const cleanedSubcategory =
      values.subcategory === "" || values.subcategory === null
        ? null
        : values.subcategory;

    const payload: InventoryUpdateRequest = {
      id: item.id,
      sku: values.sku,
      barcode: values.barcode,
      name: values.name,
      photoUrl: item.photoUrl,
      category: selectedCategory?.name ?? values.category ?? item.category,
      subcategory: cleanedSubcategory === null ? "" : cleanedSubcategory,
      use: item.use,
      unitOfMeasure: item.unitOfMeasure,
      batchNumber: item.batchNumber,
      supplier: values.supplier || item.supplier,
      manufacturer: values.manufacturer || item.manufacturer,
      presentation: values.presentation || item.presentation,
      composition: item.composition,
      purchasePrice: values.purchasePrice || "0.00",
      salePrice: values.salePrice || "0.00",
      tax: values.tax,
      discountPercentage: Number(values.discountPercentage) || 0,
      mainSupplier: item.mainSupplier,
      minimumStock: Number(values.minimumStock) || 0,
      stock: Number(values.stock) || 0,
      isActive: values.isActive,
      categoryId: selectedCategory
        ? Number(selectedCategory.id)
        : item.categoryId,
    };

    updateItem(
      { id: item.id, data: payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const content = (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl leading-none"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-optimed-tiber mb-1">
          Editar producto
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          ID: {item.id} • SKU actual: {item.sku}
        </p>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <TextField name="name" label="Nombre" />
            <TextField name="sku" label="SKU" />
            <TextField name="barcode" label="Código barras" />
            <SelectN
              name="categoryId"
              label="Categoría"
              options={optionsCategories}
              loading={loadingCategories}
              placeholder="Seleccione"
            />
            <SelectN
              name="subcategory"
              label="Subcategoría"
              options={optionsSubcategories}
              loading={loadingSubcategories}
              disabled={!watchedCategoryId}
              placeholder={
                watchedCategoryId ? "Seleccione" : "Elija categoría primero"
              }
            />
            {methods.watch("subcategory") && (
              <div className="flex items-center gap-2 ml-4 mt-4">
                <button
                  type="button"
                  className="text-xs text-red-600 underline"
                  onClick={() => methods.setValue("subcategory", null)}
                >
                  Quitar subcategoría
                </button>
              </div>
            )}
            <TextField
              name="purchasePrice"
              label="Precio compra"
              type="number"
              step="0.01"
            />
            <TextField
              name="salePrice"
              label="Precio venta"
              type="number"
              step="0.01"
            />
            <TextField name="tax" label="Impuesto" />
            <TextField
              name="discountPercentage"
              label="% Descuento"
              type="number"
              step="0.01"
            />
            <TextField
              name="minimumStock"
              label="Stock mínimo"
              type="number"
              rules={{ min: { value: 0, message: ">=0" } }}
            />
            <TextField
              name="stock"
              label="Stock actual"
              type="number"
              rules={{ min: { value: 0, message: ">=0" } }}
            />
            <TextField name="supplier" label="Proveedor" />
            <TextField name="manufacturer" label="Fabricante" />
            <TextField name="presentation" label="Presentación" />

            <div className="flex items-center gap-2 px-1">
              <SwitchLS
                name="isActive"
                labels={["Activo", "Inactivo"]}
                pLabel="Activo"
                control={methods.control}
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 mt-4">
              <Button
                type="button"
                color="secondary"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" color="primary" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
