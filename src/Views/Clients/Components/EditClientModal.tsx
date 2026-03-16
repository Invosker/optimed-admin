import { createPortal } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import TextAreaLS from "@/Components/Input/TextAreaLS";
import useUser from "@/hooks/useUser";
import { useUpdateClient } from "../hooks/useUpdateClient";
import type { Client } from "@/Views/doctorConfig/types/client";
import SwitchLS from "@/Components/Input/Switch";

interface Props {
  client: Client;
  onClose: () => void;
}

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  identificationType: string;
  address: string;
  description: string;
  dateOfBirth: string;
  isActive: boolean;
};

const isoToDateInput = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getClientId = (c: any) =>
  c?.id ?? c?.clientId ?? c?._id ?? c?.uuid ?? c?.identifier;

export default function EditClientModal({ client, onClose }: Props) {
  const userCtx: any = useUser();
  const createdBy = userCtx?.user?.id ?? userCtx?.id ?? userCtx?.userId ?? 1;

  const methods = useForm<FormValues>({
    defaultValues: {
      firstName: client?.firstName ?? "",
      lastName: client?.lastName ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      identification: client?.identification ?? "",
      identificationType: client?.identificationType ?? "V",
      address: client?.address ?? "",
      description: client?.description ?? "",
      dateOfBirth: isoToDateInput(client?.dateOfBirth),
      isActive:
        typeof (client as any)?.isActive === "boolean"
          ? (client as any).isActive
          : true,
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useUpdateClient();

  const submit = (values: FormValues) => {
    const id = getClientId(client);
    if (!id) return onClose();

    mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        identification: values.identification,
        identificationType: values.identificationType,
        address: values.address,
        description: values.description,
        dateOfBirth: values.dateOfBirth || "",
        id,
        isActive: Boolean(values.isActive),
        isAdmin: true,
        createdBy,
      },
      { onSuccess: () => onClose() }
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-auto pt-40 md:pt-10">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
        <h2 className="text-xl font-bold text-optimed-tiber mb-4">
          Editar cliente
        </h2>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <TextField name="firstName" label="Nombre" />
            <TextField name="lastName" label="Apellido" />

            <TextField name="email" label="Correo" type="email" />
            <TextField name="phone" label="Teléfono" />

            <TextField name="identification" label="Identificación" />
            <SelectN
              name="identificationType"
              label="Tipo"
              options={[
                { label: "V", value: "V" },
                { label: "E", value: "E" },
                { label: "J", value: "J" },
                { label: "G", value: "G" },
              ]}
            />
            <TextField
              name="address"
              label="Dirección"
              className="md:col-span-2"
            />
            <TextAreaLS
              name="description"
              label="Descripción"
              className="md:col-span-2"
            />

            <TextField
              name="dateOfBirth"
              label="Fecha de nacimiento"
              type="date"
            />

            <div className="md:col-span-2">
              <SwitchLS
                name="isActive"
                labels={["Activo", "Inactivo"]}
                pLabel="Activo"
                control={methods.control}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <Button type="button" color="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" color="primary" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>,
    document.body
  );
}
