import { useForm, FormProvider } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import Button from "@/Components/Button";
import useCreateCategory from "../hooks/useCreateCategory";
import type { CategoryFormValues } from "../types/categories";
import useGetCategories from "../hooks/useGetCategory";
import { useState } from "react";
import EditCategoryModal from "./EditCategoryModal";
import { useQueryClient } from "@tanstack/react-query";
import { FiRefreshCcw } from "react-icons/fi";

export default function ConfigCategory() {
  const methods = useForm<CategoryFormValues>({
    defaultValues: { name: "", code: "", description: "" },
  });
  const { createCategory, creating } = useCreateCategory();
  const { categories, loadingCategories, error } = useGetCategories();
  const [editing, setEditing] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = (data: CategoryFormValues) => {
    createCategory(data, {
      onSuccess: () => methods.reset(),
    });
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.refetchQueries({ queryKey: ["categories"] });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
          Configuración de Categoría
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField name="name" label="Nombre" />
          <TextField name="code" label="Código de categoría" />
          <TextField name="description" label="Descripción" />
        </div>
        <Button
          type="submit"
          color="primary"
          disabled={creating}
          className="w-full"
        >
          {creating ? "Guardando..." : "Guardar categoría"}
        </Button>
      </form>

      <div className="mt-8">
        {/* NUEVO: encabezado con botón de refrescar */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">Categorías registradas</h3>
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

        {loadingCategories && (
          <p className="text-sm text-gray-500">Cargando...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Error al cargar categorías</p>
        )}
        {!loadingCategories && !error && categories.length === 0 && (
          <p className="text-sm text-gray-500">Sin categorías.</p>
        )}

        {/* Móvil */}
        <div className="space-y-3 md:hidden">
          {categories.map((c) => (
            <div
              key={c.id}
              className="rounded border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{c.code}</p>
                </div>
                <Button
                  className="h-10 w-20"
                  color="secondary"
                  onClick={() => setEditing(c)}
                >
                  Editar
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div>
                  <p className="text-gray-500">Descripción</p>
                  <p className="font-medium line-clamp-3">
                    {c.description || "-"}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      c.isActive === true
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {c.isActive === true ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        {categories.length > 0 && (
          <div className="hidden md:block">
            <div className="overflow-hidden rounded border border-gray-200 bg-white">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <div className="col-span-3">Nombre</div>
                <div className="col-span-2">Código</div>
                <div className="col-span-5">Descripción</div>
                <div className="col-span-1 text-center">Activa</div>
                <div className="col-span-1 text-right">Acciones</div>{" "}
                {/* NUEVO */}
              </div>
              <div className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-12 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="col-span-3 font-medium">{c.name}</div>
                    <div className="col-span-2">{c.code}</div>
                    <div className="col-span-5">{c.description || "-"}</div>
                    <div className="col-span-1 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          c.isActive === true
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {c.isActive === true ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="col-span-1 text-right">
                      <Button
                        className="h-10 w-20"
                        color="secondary"
                        onClick={() => setEditing(c)}
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

      {editing && (
        <EditCategoryModal
          category={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </FormProvider>
  );
}
