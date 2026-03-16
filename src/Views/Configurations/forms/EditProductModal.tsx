import { FormProvider, useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import SwitchLS from "@/Components/Input/Switch";
import useGetCategories from "../hooks/useGetCategory";
import useGetSubCategories from "../hooks/useGetSubCategories";
import { useEffect } from "react";
import { useUpdateInventoryItem } from "@/Views/Transport/hooks/useUpdateInventoryItem";

type EditProductForm = {
  id: number | string;
  sku: string;
  barcode: string;
  name: string;
  photoUrl?: string;
  category: string; // string requerido por backend
  categoryId?: number | string;
  subcategory?: string;
  use?: string;
  unitOfMeasure?: string;
  batchNumber?: string;
  supplier?: string;
  manufacturer?: string;
  presentation?: string;
  composition?: string;
  purchasePrice?: string; // string según backend
  salePrice?: string; // string según backend
  tax?: string; // string como "IVA 19%"
  discountPercentage?: number | string;
  mainSupplier?: string;
  minimumStock?: number | string;
  stock?: number | string;
  isActive: boolean;
};

interface Props {
  product: any;
  onClose: () => void;
}

export default function EditProductModal({ product, onClose }: Props) {
  const methods = useForm<EditProductForm>({
    defaultValues: {
      id: product?.id,
      sku: product?.sku ?? "",
      barcode: product?.barcode ?? "",
      name: product?.name ?? "",
      photoUrl: product?.photoUrl ?? product?.photo ?? "",
      category: product?.category ?? "",
      categoryId: product?.categoryId ?? "",
      subcategory: product?.subcategory ?? "",
      use: product?.use ?? "",
      unitOfMeasure: product?.unitOfMeasure ?? product?.unit ?? "",
      batchNumber: product?.batchNumber ?? product?.lotNumber ?? "",
      supplier: product?.supplier ?? product?.provider ?? "",
      manufacturer: product?.manufacturer ?? "",
      presentation: product?.presentation ?? "",
      composition: product?.composition ?? "",
      purchasePrice:
        product?.purchasePrice !== undefined && product?.purchasePrice !== null
          ? String(product.purchasePrice)
          : "",
      salePrice:
        product?.salePrice !== undefined && product?.salePrice !== null
          ? String(product.salePrice)
          : "",
      tax:
        product?.tax !== undefined && product?.tax !== null
          ? String(product.tax)
          : "",
      discountPercentage:
        product?.discountPercentage ?? product?.discount ?? "",
      mainSupplier: product?.mainSupplier ?? product?.mainProvider ?? "",
      minimumStock: product?.minimumStock ?? product?.minStock ?? "",
      stock: product?.stock ?? "",
      isActive: Boolean(product?.isActive),
    },
  });

  const { optionsCategories, categories } = useGetCategories();
  const categoryIdWatch = methods.watch("categoryId");

  const { optionsSubcategories, loadingSubcategories } = useGetSubCategories(
    categoryIdWatch ? Number(categoryIdWatch) : undefined
  );

  // Mantener category (string) sincronizado con categoryId
  useEffect(() => {
    if (categoryIdWatch && categories?.length) {
      const match = categories.find(
        (c: any) => c.id === Number(categoryIdWatch)
      );
      if (match?.name) {
        methods.setValue("category", match.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdWatch, categories]);

  const { mutate: updateItem, isPending } = useUpdateInventoryItem();

  const onSubmit = (vals: EditProductForm) => {
    const payload = {
      id: Number(vals.id),
      sku: vals.sku?.toString().trim(),
      barcode: vals.barcode?.toString().trim(),
      name: vals.name?.toString().trim(),
      photoUrl: vals.photoUrl?.toString().trim() || "",
      category: vals.category?.toString().trim() || "",
      subcategory: vals.subcategory?.toString().trim() || "",
      use: vals.use?.toString().trim() || "",
      unitOfMeasure: vals.unitOfMeasure?.toString().trim() || "",
      batchNumber: vals.batchNumber?.toString().trim() || "",
      supplier: vals.supplier?.toString().trim() || "",
      manufacturer: vals.manufacturer?.toString().trim() || "",
      presentation: vals.presentation?.toString().trim() || "",
      composition: vals.composition?.toString().trim() || "",
      purchasePrice: (vals.purchasePrice ?? "").toString(), // string
      salePrice: (vals.salePrice ?? "").toString(), // string
      tax: (vals.tax ?? "").toString(), // string
      discountPercentage:
        vals.discountPercentage === "" || vals.discountPercentage === undefined
          ? undefined
          : Number(vals.discountPercentage),
      mainSupplier: vals.mainSupplier?.toString().trim() || "",
      minimumStock:
        vals.minimumStock === "" || vals.minimumStock === undefined
          ? undefined
          : Number(vals.minimumStock),
      stock:
        vals.stock === "" || vals.stock === undefined
          ? undefined
          : Number(vals.stock),
      isActive: Boolean(vals.isActive),
      categoryId: vals.categoryId ? Number(vals.categoryId) : undefined,
    };

    updateItem(
      { id: payload.id, data: payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-auto pt-[100dvh] md:pt-10">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl p-6">
        <h2 className="text-xl font-bold text-optimed-tiber mb-4">
          Editar producto
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <TextField name="sku" label="SKU" />
            <TextField name="barcode" label="Código de barra" />
            <TextField name="name" label="Nombre" />
            <TextField name="photoUrl" label="Foto (URL)" />

            <SelectN
              name="categoryId"
              label="Categoría"
              options={optionsCategories}
            />
            <SelectN
              name="subcategory"
              label="Subcategoría"
              options={optionsSubcategories}
              loading={loadingSubcategories}
              disabled={!categoryIdWatch}
              placeholder={
                categoryIdWatch ? "Seleccione" : "Seleccione categoría primero"
              }
            />

            <TextField name="use" label="Uso" />
            <TextField name="unitOfMeasure" label="Unidad de medida" />
            <TextField name="batchNumber" label="Nro de lote" />
            <TextField name="supplier" label="Proveedor" />
            <TextField name="manufacturer" label="Fabricante" />
            <SelectN
              name="presentation"
              label="Presentación"
              options={[
                { label: "Tabletas", value: "Tabletas" },
                { label: "Jarabe", value: "Jarabe" },
                { label: "Crema", value: "Crema" },
                { label: "Unidad", value: "Unidad" },
              ]}
            />
            <TextField name="composition" label="Composición" />
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
            <TextField name="tax" label="Impuesto (ej: IVA 19%)" />
            <TextField
              name="discountPercentage"
              label="Descuento (%)"
              type="number"
            />
            <TextField name="mainSupplier" label="Proveedor principal" />
            <TextField name="minimumStock" label="Stock mínimo" type="number" />
            <TextField name="stock" label="Stock" type="number" />

            <div className="col-span-1">
              <SwitchLS
                name="isActive"
                labels={["Activo", "Inactivo"]}
                pLabel="Activo"
                control={methods.control}
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-3 mt-2">
              <Button type="button" color="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" color="primary" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>,
    document.body
  );
}
