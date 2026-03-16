import { useForm, FormProvider } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import SwitchLS from "@/Components/Input/Switch";
import Button from "@/Components/Button";
import useCreateProduct from "../hooks/useCreateProduct";
import useGetCategories from "../hooks/useGetCategory";
import useGetProducts from "../hooks/useGetProducts";
import useGetSubCategories from "../hooks/useGetSubCategories";
import { useEffect, useState } from "react";
import type { ProductFormValues } from "../types/product";
import EditProductModal from "./EditProductModal"; // NUEVO
import { useQueryClient } from "@tanstack/react-query"; // NUEVO
import { FiRefreshCcw } from "react-icons/fi"; // NUEVO

export default function ConfigProduct() {
  const methods = useForm<ProductFormValues>({
    defaultValues: {
      purchasePrice: undefined as unknown as number,
      salePrice: undefined as unknown as number,
      discount: 0,
      minStock: 0,
      stock: 0,
      isActive: true,
    },
  });

  const { createProduct, creating } = useCreateProduct();
  const { optionsCategories, categories, loadingCategories, error } = useGetCategories();
  const { products, loadingProducts } = useGetProducts();
  const [editingProduct, setEditingProduct] = useState<any | null>(null); 
  const [refreshing, setRefreshing] = useState(false); 
  const queryClient = useQueryClient(); 

  const categoryIdWatch = methods.watch("categoryId") as number | undefined;

  const {
    optionsSubcategories,
    loadingSubcategories,
  } = useGetSubCategories(categoryIdWatch ? Number(categoryIdWatch) : undefined);

  useEffect(() => {
    methods.setValue("subcategory", "");
  }, [categoryIdWatch, methods]);

  const onSubmit = (data: ProductFormValues) => {
    const parsed: ProductFormValues = {
      ...data,
      purchasePrice: Number(data.purchasePrice),
      salePrice: Number(data.salePrice),
      discount: data.discount !== undefined ? Number(data.discount) : undefined,
      minStock: data.minStock !== undefined ? Number(data.minStock) : undefined,
      stock: data.stock !== undefined ? Number(data.stock) : 0,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      category: categories.find(c => c.id === Number(data.categoryId))?.name ?? "",
      tax: data.tax !== undefined ? Number(data.tax as unknown as string) : undefined,
    };
    createProduct(parsed, {
      onSuccess: () =>
        methods.reset({
          discount: 0,
          minStock: 0,
          stock: 0,
          isActive: true,
        }),
    });
  };

  const categoryName = (cat: any) =>
    (typeof cat === "string" ? cat : cat?.name) || "-";

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.refetchQueries({ queryKey: ["products"] });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
          Configuración de Producto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <TextField name="sku" label="SKU" />
          <TextField name="barcode" label="Código de barra" />
          <TextField name="name" label="Nombre" />
          <TextField name="photo" label="Foto (URL)" />
          <SelectN
            name="categoryId"
            label="Categoría"
            options={optionsCategories}
            loading={loadingCategories}
          />
          <SelectN
            name="subcategory"
            label="Subcategoría"
            options={optionsSubcategories}
            disabled={!categoryIdWatch}
            placeholder={
              categoryIdWatch ? "Seleccione" : "Seleccione categoría primero"
            }
          />
          <TextField name="use" label="Uso" />
          <TextField name="unit" label="Unidad de medida" />
          <TextField name="lotNumber" label="Nro de lote" />
          <TextField name="provider" label="Proveedor" />
          <TextField name="manufacturer" label="Fabricante" />
          <SelectN
            name="presentation"
            label="Presentación"
            options={[
              { label: "Tabletas", value: "tabletas" },
              { label: "Jarabe", value: "jarabe" },
              { label: "Crema", value: "crema" },
              { label: "Unidad", value: "unidad" },
            ]}
          />
          <TextField name="composition" label="Composición (opcional)" />
          <TextField
            name="purchasePrice"
            label="Precio de compra"
            type="number"
            step="0.01"
          />
          <TextField
            name="salePrice"
            label="Precio de venta"
            type="number"
            step="0.01"
          />
          <TextField name="tax" label="Impuesto (%)" type="number" />
          <TextField name="discount" label="Descuento (%)" type="number" />
          <TextField name="mainProvider" label="Proveedor principal" />
          <TextField name="minStock" label="Stock mínimo" type="number" />
          <TextField name="stock" label="Stock inicial" type="number" />
          <div className="col-span-1">
            <SwitchLS
              name="isActive"
              labels={["Activo", "Inactivo"]}
              pLabel="Activo"
              control={methods.control}
            />
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-2">Error cargando categorías</p>
        )}
        <Button
          type="submit"
          color="primary"
          disabled={creating}
          className="w-full"
        >
          {creating ? "Guardando..." : "Guardar producto"}
        </Button>
      </form>

      {/* Tabla */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">Productos registrados</h3>
          <Button
            type="button"
            color="secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refrescar"
            className="rounded-md px-4 w-24 h-10"
          >
            <span className="flex items-center gap-2">
              <FiRefreshCcw className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refrescar</span>
            </span>
          </Button>
        </div>

        {loadingProducts && (
          <p className="text-sm text-gray-500">Cargando productos...</p>
        )}
        {!loadingProducts && products.length === 0 && (
          <p className="text-sm text-gray-500">Sin productos.</p>
        )}

        {/* Móvil */}
        <div className="space-y-3 md:hidden">
          {products.map((p) => (
            <div
              key={p.id}
              className="rounded border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-500 mb-1">{p.sku}</p>
                </div>
                <Button
                  color="secondary"
                  className="w-20 h-10"
                  onClick={() => setEditingProduct(p)}
                >
                  Editar
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div>
                  <p className="text-gray-500">Categoría</p>
                  <p className="font-medium truncate">
                    {categoryName(p.category)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Precio</p>
                  <p className="font-medium">
                    {Number(p.salePrice).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Stock mín.</p>
                  <p className="font-medium">{p.minimumStock ?? "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stock</p>
                  <p className="font-medium">{p.stock ?? "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        {products.length > 0 && (
          <div className="hidden md:block">
            <div className="overflow-hidden rounded border border-gray-200 bg-white">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <div className="col-span-2">SKU</div>
                <div className="col-span-3">Nombre</div>
                <div className="col-span-1">Categoría</div>
                <div className="col-span-2 text-right">Precio Venta</div>
                <div className="col-span-2 text-right">Stock Mínimo</div>
                <div className="col-span-2 text-right">Acciones</div>
              </div>
              <div className="divide-y divide-gray-100">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-12 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="col-span-2 font-mono">{p.sku}</div>
                    <div className="col-span-3 font-medium truncate">
                      {p.name}
                    </div>
                    <div className="col-span-1 truncate">
                      {categoryName(p.category)}
                    </div>
                    <div className="col-span-2 text-right">
                      {Number(p.salePrice).toFixed(2)}
                    </div>
                    <div className="col-span-2 text-right">
                      {p.minimumStock ?? "-"}
                    </div>
                    <div className="col-start-12 text-right">
                      <Button
                        color="secondary"
                        onClick={() => setEditingProduct(p)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </FormProvider>
  );
}
