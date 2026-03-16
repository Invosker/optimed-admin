import { useState, useMemo, useEffect, useCallback } from "react";
import { FaBoxOpen, FaPlus, FaMinus, FaTrash, FaSearch, FaBoxes } from "react-icons/fa";
import TextField from "@/Components/Input/Input";
import Button from "@/Components/Button";
import DynamicTable from "@/Components/DynamicTable";
import { useGetInventory } from "@/Views/Transport/hooks/useGetInvetory"; // Corrected path
import { useRepositionProducts } from "./hooks/useReposition";
import type { InventoryItem } from "@/Views/Transport/types/inventory";
import { FormProvider, useForm } from "react-hook-form";
import usePermissions, { Action, Permission } from "@/hooks/usePermissions";

interface SelectedProduct extends InventoryItem {
  quantity: number;
  note?: string;
}

export default function ProductReplacement() {
  const [debouncedSearch, setDebouncedSearch] = useState(undefined);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const methods = useForm({
    defaultValues: {
      search: undefined,
    },
  });

  const watchedSearch = methods.watch("search");

  const { permissions } = usePermissions();
  console.log("🚀 ~ ProductReplacement ~ permissions:", permissions);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(watchedSearch === "" ? undefined : watchedSearch);
    }, 400); // Debounce for 400ms

    return () => clearTimeout(handler);
  }, [watchedSearch]);

  const { data: inventoryPage, isLoading: isLoadingInventory } = useGetInventory({
    page: 1,
    limit: 10,
    search: debouncedSearch,
  });
  console.log("🚀 ~ ProductReplacement ~ data:", inventoryPage);

  const { repositionProducts, isLoading: isSaving } = useRepositionProducts();

  const addProduct = useCallback((product: InventoryItem) => {
    setSelectedProducts((prevSelected) => {
      if (!prevSelected.find((p) => p.id === product.id)) {
        return [...prevSelected, { ...product, quantity: 1 }];
      }
      return prevSelected;
    });
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setSelectedProducts((prevSelected) => prevSelected.filter((p) => p.id !== productId));
  }, []);

  const handleQuantityChange = useCallback((productId: number, quantity: number) => {
    setSelectedProducts((prevSelected) => prevSelected.map((p) => (p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p)));
  }, []);

  const handleSave = () => {
    const items = selectedProducts.map((product) => ({
      id: product.id,
      category: product.category,
      quantity: product.quantity,
      unitAmount: product.purchasePrice.toFixed(2), // Assuming purchasePrice is a number and needs to be formatted to 2 decimal places as a string
      note: product.note || undefined, // Include note if it exists
    }));

    repositionProducts(
      { items },
      {
        onSuccess: () => {
          setSelectedProducts([]);
          // methods.setValue("search", ""); // Reset search input after successful reposition
        },
      }
    );
  };

  const inventoryColumns = useMemo(
    () => [
      { name: "Nombre", key: "name" },
      { name: "Categoría", key: "category" },
      { name: "SKU", key: "sku" },
      { name: "Stock", key: "stock" },
      {
        name: "",
        key: "actions",
        cell: (row: InventoryItem) => (
          <Button onClick={() => addProduct(row)} size="sm">
            Agregar
          </Button>
        ),
      },
    ],
    [addProduct]
  );

  const selectedProductsColumns = useMemo(
    () => [
      { name: "Nombre", key: "name" },
      {
        name: "Cantidad",
        key: "quantity",
        cell: (row: SelectedProduct) => (
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleQuantityChange(row.id, row.quantity - 1)}>
              <FaMinus size={12} />
            </Button>
            <input
              type="number"
              className="font-semibold w-14 text-center bg-transparent border border-gray-300 rounded-md h-8 focus:outline-none focus:ring-2 focus:ring-optimed-tiber/50"
              value={row.quantity}
              onChange={(e) => handleQuantityChange(row.id, parseInt(e.target.value, 10) || 1)}
              min="1"
            />
            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleQuantityChange(row.id, row.quantity + 1)}>
              <FaPlus size={12} />
            </Button>
          </div>
        ),
      },
      {
        name: "",
        key: "remove",
        cell: (row: SelectedProduct) => (
          <Button onClick={() => removeProduct(row.id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
            <FaTrash />
          </Button>
        ),
      },
    ],
    [handleQuantityChange, removeProduct]
  );

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 px-4 md:px-10 py-8">
      <div className="max-w-7xl mx-auto w-full grid gap-6">
        <header className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-optimed-tiber/10 text-optimed-tiber p-3 rounded-full">
            <FaBoxes size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-optimed-tiber tracking-wide">Reposición de Productos</h1>
            <p className="text-gray-500">Busque productos del inventario y agréguelos a la lista para reponer su stock.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Columna Izquierda: Búsqueda y listado de inventario */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-optimed-tiber flex items-center gap-2">
              <FaSearch />
              Inventario
            </h2>
            <FormProvider {...methods}>
              <TextField
                name="search"
                label="Buscar producto"
                placeholder="Buscar por nombre, categoría..."
                // onChange={(e) => setSearch(e.target.value)}
              />
            </FormProvider>
            <div className="mt-4 min-h-[300px]">
              <DynamicTable columns={inventoryColumns} data={inventoryPage?.docs ?? []} loading={isLoadingInventory} emptyMessage="No se encontraron productos con ese criterio." />
            </div>
          </div>

          {/* Columna Derecha: Productos a reponer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4 sticky top-8">
            <h2 className="text-xl font-bold text-optimed-tiber">Productos a Reponer</h2>
            <div className="mt-4 min-h-[300px]">
              {selectedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full min-h-[200px] bg-gray-50 rounded-lg p-4">
                  <FaBoxOpen size={40} className="mb-4 text-gray-400" />
                  <p className="font-semibold">No hay productos seleccionados</p>
                  <p className="text-sm">Agregue productos desde la lista de inventario.</p>
                </div>
              ) : (
                <DynamicTable columns={selectedProductsColumns} data={selectedProducts} />
              )}
            </div>
            {selectedProducts.length > 0 &&
              (permissions?.find((p: Permission) => p.moduleKey === "productReplenishment")?.actions?.find((a: Action) => a.actionKey === "create") || permissions.length === 0) && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving} loading={isSaving} className="min-w-[180px]">
                    {isSaving ? "Guardando..." : "Guardar Reposición"}
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
