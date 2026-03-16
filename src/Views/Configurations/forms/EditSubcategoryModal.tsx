import { FormProvider, useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import SwitchLS from "@/Components/Input/Switch";
import useGetCategories from "../hooks/useGetCategory";
import { useUpdateSubcategory, SubcategoryUpdateRequest } from "../hooks/useUpdateSubcategory";

interface Props {
  subcategory: {
    id: number;
    name: string;
    description?: string;
    code: string;
    isActive: boolean;
    categoryId: number;
  };
  onClose: () => void;
}

export default function EditSubcategoryModal({ subcategory, onClose }: Props) {
  const methods = useForm<SubcategoryUpdateRequest>({
    defaultValues: {
      id: subcategory.id,
      name: subcategory.name ?? "",
      description: subcategory.description ?? "",
      code: subcategory.code ?? "",
      isActive: Boolean(subcategory.isActive),
      categoryId: Number(subcategory.categoryId),
    },
  });

  const { optionsCategories } = useGetCategories();
  const { mutate, isPending } = useUpdateSubcategory();

  const onSubmit = (vals: SubcategoryUpdateRequest) => {
    const payload: SubcategoryUpdateRequest = {
      id: Number(vals.id),
      name: vals.name?.toString().trim(),
      description: vals.description?.toString().trim() || "",
      code: vals.code?.toString().trim(),
      isActive: Boolean(vals.isActive),
      categoryId: Number(vals.categoryId),
    };
    mutate(
      { data: payload },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
        <h2 className="text-xl font-bold text-optimed-tiber mb-4">
          Editar subcategoría
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <TextField name="name" label="Nombre" />
            <TextField name="code" label="Código" />
            <SelectN
              name="categoryId"
              label="Categoría"
              options={optionsCategories}
            />
            <TextField
              name="description"
              label="Descripción"
              className="md:col-span-2"
            />
            <div className="md:col-span-2">
              <SwitchLS
                name="isActive"
                labels={["Activa", "Inactiva"]}
                pLabel="Activa"
                control={methods.control}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
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