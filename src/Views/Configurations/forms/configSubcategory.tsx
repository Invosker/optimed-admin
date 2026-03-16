import { useForm, FormProvider } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import Button from "@/Components/Button";
import SwitchLS from "@/Components/Input/Switch";
import useCreateSubCategories from "../hooks/useCreateSubCategories";
import useGetCategories from "../hooks/useGetCategory";
import useGetSubCategories from "../hooks/useGetSubCategories";
import type { SubcategoryFormValues } from "../types/subcategories";
import { useState } from "react";
import EditSubcategoryModal from "./EditSubcategoryModal";
import { useQueryClient } from "@tanstack/react-query";
import { FiRefreshCcw } from "react-icons/fi";

export default function ConfigSubcategory() {
  const methods = useForm<SubcategoryFormValues>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      isActive: true,
      categoryId: undefined,
    },
  });
  const { createSubcategory, creating } = useCreateSubCategories();
  const {
    optionsCategories,
    loadingCategories,
    error: categoriesError,
  } = useGetCategories();
  const {
    subcategories,
    loadingSubcategories,
    error: subcategoriesError,
  } = useGetSubCategories();

  const [editing, setEditing] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = (data: SubcategoryFormValues) => {
    const parsed = {
      ...data,
      code: data.code.toUpperCase(),
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
    };
    createSubcategory(parsed, {
      onSuccess: () => {
        methods.reset({ isActive: true });
      },
    });
  };

  const catLabel = (id?: number) =>
    optionsCategories.find((c) => c.value === id)?.label || "-";

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      await queryClient.refetchQueries({ queryKey: ["subcategories"] });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <h2 className="text-3xl text-center font-bold mb-4 text-optimed-tiber">
          Configuración de Subcategoría
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <TextField name="name" label="Nombre" />
          <TextField name="code" label="Código" />
          <SelectN
            name="categoryId"
            label="Categoría"
            options={optionsCategories}
            loading={loadingCategories}
          />
          <TextField name="description" label="Descripción" />
          <SwitchLS
            name="isActive"
            labels={["Activa", "Inactiva"]}
            pLabel="Activa"
            control={methods.control}
          />
        </div>
        {(categoriesError || subcategoriesError) && (
          <p className="text-red-500 text-sm mb-2">
            Error cargando {categoriesError ? "categorías" : "subcategorías"}
          </p>
        )}
        <Button
          type="submit"
          color="primary"
          disabled={creating}
          className="w-full"
        >
          {creating ? "Guardando..." : "Guardar subcategoría"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">Subcategorías registradas</h3>
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

        {loadingSubcategories && (
          <p className="text-sm text-gray-500">Cargando subcategorías...</p>
        )}

        {!loadingSubcategories && subcategories.length === 0 && (
          <p className="text-sm text-gray-500">Sin subcategorías.</p>
        )}

        {/* Móvil */}
        <div className="space-y-3 md:hidden">
          {subcategories.map((s) => (
            <div
              key={s.id}
              className="rounded border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-gray-500 mb-1">{s.code}</p>
                </div>
                <Button
                  className="h-10 w-20"
                  color="secondary"
                  onClick={() => setEditing(s)}
                >
                  Editar
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div>
                  <p className="text-gray-500">Categoría</p>
                  <p className="font-medium truncate">
                    {catLabel(s.categoryId)}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      s.isActive === true
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {s.isActive === true ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Descripción</p>
                  <p className="font-medium line-clamp-3">
                    {s.description || "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        {subcategories.length > 0 && (
          <div className="hidden md:block">
            <div className="overflow-hidden rounded border border-gray-200 bg-white">
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <div className="col-span-3">Nombre</div>
                <div className="col-span-2">Código</div>
                <div className="col-span-3">Categoría</div>
                <div className="col-span-2">Descripción</div>
                <div className="col-span-1 text-center">Estado</div>
                <div className="col-span-1 text-right">Acciones</div>
              </div>
              <div className="divide-y divide-gray-100">
                {subcategories.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-12 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="col-span-3 font-medium">{s.name}</div>
                    <div className="col-span-2">{s.code}</div>
                    <div className="col-span-3">{catLabel(s.categoryId)}</div>
                    <div className="col-span-2 truncate">
                      {s.description || "-"}
                    </div>
                    <div className="col-span-1 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          s.isActive === true
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {s.isActive === true ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="col-span-1 text-right">
                      <Button color="secondary" onClick={() => setEditing(s)}>
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
        <EditSubcategoryModal
          subcategory={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </FormProvider>
  );
}
