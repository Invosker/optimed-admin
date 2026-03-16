import { FormProvider, useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import CheckBox from "@/Components/Input/CheckBox";
import { useUpdateCategory, CategoryUpdateRequest } from "../hooks/useUpdateCategory";
import SwitchLS from "@/Components/Input/Switch";

interface Props {
  category: {
    id: number;
    name: string;
    description?: string;
    code: string;
    isActive?: boolean;
  };
  onClose: () => void;
}

export default function EditCategoryModal({ category, onClose }: Props) {
  const methods = useForm<CategoryUpdateRequest>({
    defaultValues: {
      id: category.id,
      name: category.name ?? "",
      description: category.description ?? "",
      code: category.code ?? "",
      isActive: category.isActive !== false,
    },
  });

  const { mutate, isPending } = useUpdateCategory();

  const onSubmit = (vals: CategoryUpdateRequest) => {
    const payload: CategoryUpdateRequest = {
      id: Number(vals.id),
      name: vals.name?.toString().trim(),
      description: vals.description?.toString().trim() || "",
      code: vals.code?.toString().trim(),
      isActive: Boolean(vals.isActive),
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
          Editar categoría
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <TextField name="name" label="Nombre" />
            <TextField name="code" label="Código" />
            <TextField
              name="description"
              label="Descripción"
              className="md:col-span-2"
            />
            <div className="md:col-span-2">
              <SwitchLS
                name="isActive"
                labels={["Activo", "Inactivo"]}
                pLabel="Activo"
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