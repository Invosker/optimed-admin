import { useState, useEffect } from "react";
import { FaDollarSign, FaBox, FaEdit } from "react-icons/fa";
import Button from "@/Components/Button";
import SellProducts from "@/Views/SellProducts";
import DoctorConfig from "@/Views/doctorConfig";
import TextField from "@/Components/Input/Input";
import { FormProvider, useForm } from "react-hook-form";
import { useGetInventory } from "./hooks/useGetInvetory";
import EditInventoryItemModal from "./Components/EditInventoryItemModal";
import { InventoryItem } from "./types/inventory";
import { useLocation, useNavigate } from "react-router-dom";
import usePermissions, { Action, Permission } from "@/hooks/usePermissions";
import DynamicTable from "@/Components/DynamicTable";

export default function Transport() {
  const [showNewService, setShowNewService] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<number>(1);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const methods = useForm();

  const { permissions } = usePermissions();

  const { search } = useLocation();
  const navigate = useNavigate();

  const { data: inventoryPage, isLoading: loadingInventory } = useGetInventory({
    page: 1,
    limit: 1000,
    search: searchValue || undefined,
  });

  const formMap: Record<number, React.ReactNode> = {
    2: <SellProducts />,
    3: (
      <DoctorConfig
        setShowForm={setShowForm}
        setShowNewService={setShowNewService}
      />
    ),
  };

  const inventoryServices = [
    {
      id: 2,
      title: "Venta de productos",
      description: "Venta de productos.",
      icon: <FaDollarSign size={28} className="text-optimed-tiber" />,
      active:
        permissions
          .find((x: Permission) => x.moduleKey === "newService")
          ?.actions?.find((a: Action) => a.actionKey === "sales")?.selected ||
        permissions.length === 0,
    },
    {
      id: 3,
      title: "Agendar cita médica",
      description: "Agendar una cita médica.",
      icon: <FaBox size={24} className="text-optimed-tiber" />,
      active:
        permissions
          .find((x: Permission) => x.moduleKey === "newService")
          ?.actions?.find((a: Action) => a.actionKey === "medicalAppointment")
          ?.selected || permissions.length === 0,
    },
  ].filter((x) => x.active);

  const watchedSearch = methods.watch("search");
  useEffect(() => {
    const h = setTimeout(() => {
      setSearchValue((prev) => (prev !== watchedSearch ? watchedSearch : prev));
    }, 400);
    return () => clearTimeout(h);
  }, [watchedSearch]);

  useEffect(() => {
    const qs = new URLSearchParams(search);
    const ns = qs.get("newService");
    const type = qs.get("serviceType");
    const openForm = qs.get("openForm");
    if (ns === "1" || ns === "true") {
      setShowNewService(true);
      if (type && !Number.isNaN(Number(type))) {
        setSelectedType(Number(type));
      }
      if (openForm === "1" || openForm === "true") {
        setShowForm(true);
      } else {
        setShowForm(false);
      }
    }
  }, [search]);

  const closeNewService = () => {
    setShowForm(false);
    setShowNewService(false);
    navigate("/Home/Inventory", { replace: true });
  };

  const moduleLabel = showForm
    ? selectedType === 2
      ? " - Venta de Productos"
      : selectedType === 3
      ? " - Agendar Cita Médica"
      : ""
    : "";

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 rounded-lg shadow-xl p-8 pt-4 pb-4 w-full overflow-y-auto mx-auto h-full relative">
      <header className="bg-optimed-tiber text-white lg:px-8 py-3 grid grid-cols-2 items-center shadow-lg mt-4 lg:mt-0 rounded-lg mb-6">
        <h1 className="text-3xl px-4 font-extrabold tracking-wide drop-shadow text-white">
          Inventario
        </h1>
      </header>

      {showNewService ? (
        showForm ? (
          <div className="fixed inset-0 z-50 bg-white grid grid-rows-[auto_1fr] w-screen h-screen">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center px-8 py-6 bg-optimed-tiber shadow-lg">
              <h1 className="text-3xl font-extrabold text-white">{`Optimed${moduleLabel}`}</h1>
              <div />
              <Button
                color="primary"
                className="ml-2"
                onClick={() => setShowForm(false)}
              >
                <span className="text-xl">Atrás</span>
              </Button>
            </div>
            <div className="grid w-full h-full sm:place-items-center overflow-y-auto">
              {formMap[selectedType] ?? (
                <div className="text-gray-500">Formulario no disponible.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 z-50 bg-white grid grid-rows-[auto_1fr] w-screen h-screen">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center px-4 md:px-8 py-6 bg-optimed-tiber shadow-lg">
              <h1 className="text-3xl font-extrabold text-white">{`Optimed${moduleLabel}`}</h1>
              <div />
              <Button
                color="primary"
                className="ml-2"
                onClick={closeNewService}
              >
                <span className="text-xl">Atrás</span>
              </Button>
            </div>
            <div className="grid w-full h-full place-items-center">
              <div className="bg-white rounded-xl shadow-2xl p-8 w/full max-w-lg grid gap-6 relative">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-xl"
                  onClick={closeNewService}
                  title="Cerrar"
                >
                  &times;
                </button>
                <p className="text-center font-bold text-2xl text-optimed-tiber my-4">
                  ¿Qué tipo de servicio necesita?
                </p>
                <div className="grid gap-3">
                  {inventoryServices.map((s) => (
                    <button
                      key={s.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 rounded-lg border transition-all shadow-sm bg-white border-gray-200 hover:bg-blue-100"
                      onClick={() => {
                        setSelectedType(s.id);
                        setShowForm(true);
                      }}
                      type="button"
                    >
                      <div>{s.icon}</div>
                      <div>
                        <div className="font-semibold text-[#0a3042]">
                          {s.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {s.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(() => {
              const docs = inventoryPage?.docs || [];
              const total = inventoryPage?.totalDocs || 0;
              const lowStock = docs.filter(
                (i) => i.stock <= (i.minimumStock ?? i.lowStockThreshold ?? 5)
              ).length;
              const categories = new Set(docs.map((d) => d.category)).size;
              return (
                <>
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-gray-100">
                    <span className="text-3xl font-bold text-optimed-tiber">
                      {total}
                    </span>
                    <span className="text-gray-500 mt-1">
                      Productos en stock
                    </span>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-gray-100">
                    <span className="text-3xl font-bold text-red-500">
                      {lowStock}
                    </span>
                    <span className="text-gray-500 mt-1">Stock bajo</span>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-gray-100">
                    <span className="text-3xl font-bold text-green-500">
                      {categories}
                    </span>
                    <span className="text-gray-500 mt-1">Categorías</span>
                  </div>
                </>
              );
            })()}
          </section>
          <FormProvider {...methods}>
            <div className=" grid grid-cols-1 md:grid-cols-2 md:col-span-2 mb-6 gap-10">
              <div className="">
                <TextField
                  name="search"
                  type="text"
                  label="Buscar producto"
                  placeholder="Buscar producto..."
                  className="px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <DynamicTable<InventoryItem>
                data={inventoryPage?.docs || []}
                columns={[
                  {
                    key: "name",
                    header: "Producto",
                  },
                  {
                    key: "category",
                    header: "Categoría",
                  },
                  {
                    key: "subcategory",
                    header: "Subcategoría",
                    cell: (row) => (
                      <span>
                        {row.subcategory
                          ? row.subcategory === "" || null
                            ? ""
                            : row.subcategory
                          : "No posee"}
                      </span>
                    ),
                  },
                  {
                    key: "stock",
                    header: "Stock",
                    cell: (row) => (
                      <span>
                        {row.stock}
                        <span className="text-xs text-gray-400 ml-1">
                          / min {row.minimumStock}
                        </span>
                      </span>
                    ),
                  },
                  {
                    key: "salePrice",
                    header: "Precio",
                    cell: (row) => <span>${row.salePrice.toFixed(2)}</span>,
                  },
                  {
                    key: "createdAt",
                    header: "Fecha ingreso",
                    cell: (row) => {
                      const fecha = row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString("es-VE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "-";
                      return <span>{fecha}</span>;
                    },
                  },
                  {
                    key: "isActive",
                    header: "Activo",
                    cell: (row) =>
                      row.isActive ? (
                        <span className="inline-block px-2 py-1 text-[11px] rounded bg-green-100 text-green-700 font-medium">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-[11px] rounded bg-red-100 text-red-600 font-medium">
                          Inactivo
                        </span>
                      ),
                  },
                ]}
                actions={
                  permissions
                    ?.find((p: Permission) => p.moduleKey === "inventory")
                    ?.actions.find((a: Action) => a.actionKey === "edit")
                    ?.selected || permissions?.length === 0
                    ? [
                        {
                          label: "Editar",
                          icon: <FaEdit className="text-sm" />,
                          onClick: (row) => setEditingItem(row),
                        },
                        // {
                        //   label: "Eliminar",
                        //   icon: <FaTrash className="text-sm text-red-500" />,
                        //   onClick: (row) => alert(`Eliminar ${row.name}`),
                        // },
                      ]
                    : undefined
                }
                loading={loadingInventory}
                emptyMessage="No hay productos en inventario."
              />
            </div>
          </FormProvider>
        </>
      )}
      {editingItem && (
        <EditInventoryItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
