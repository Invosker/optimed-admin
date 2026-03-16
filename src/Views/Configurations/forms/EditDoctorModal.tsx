import { FormProvider, useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import SwitchLS from "@/Components/Input/Switch";
import { useUpdateDoctor, DoctorUpdateRequest } from "../hooks/useUpdateDoctor";

interface Props {
  doctor: any;
  onClose: () => void;
}

export default function EditDoctorModal({ doctor, onClose }: Props) {
  const methods = useForm<DoctorUpdateRequest>({
    defaultValues: {
      id: Number(doctor?.id),
      email: doctor?.email ?? "",
      name: doctor?.name ?? "",
      lastName: doctor?.lastName ?? "",
      phone: doctor?.phone ?? "",
      licenseNumber: doctor?.licenseNumber ?? "",
      specialty: doctor?.specialty ?? "",
      identification: doctor?.identification ?? "",
      identificationType: doctor?.identificationType ?? "V",
      isActive: doctor?.status ? Number(doctor.status) === 1 : true,
      createdBy: doctor?.createdBy ?? undefined,
    },
  });

  const { mutate, isPending } = useUpdateDoctor();

  const onSubmit = (vals: DoctorUpdateRequest) => {
    const payload: DoctorUpdateRequest = {
      id: Number(vals.id),
      email: vals.email.trim(),
      name: vals.name.trim(),
      lastName: vals.lastName.trim(),
      phone: vals.phone.trim(),
      licenseNumber: vals.licenseNumber.trim(),
      specialty: vals.specialty.trim(),
      identification: vals.identification.trim(),
      identificationType: vals.identificationType,
      isActive: Boolean(vals.isActive),
      isAdmin: true, // por defecto TRUE
      createdBy: vals.createdBy ? Number(vals.createdBy) : undefined,
    };
    mutate(
      { data: payload },
      { onSuccess: () => onClose() }
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
        <h2 className="text-xl font-bold text-optimed-tiber mb-4">
          Editar médico
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <TextField name="email" label="Email" type="email" />
            <TextField name="name" label="Nombre" />
            <TextField name="lastName" label="Apellido" />

            <TextField name="phone" label="Teléfono" />
            <TextField name="licenseNumber" label="N° Licencia" />
            <TextField name="specialty" label="Especialidad" />

            <TextField name="identification" label="Identificación" />
            <SelectN
              name="identificationType"
              label="Tipo de identificación"
              options={[
                { value: "V", label: "Cédula de identidad" },
                { value: "E", label: "Cédula de extranjería" },
                { value: "J", label: "RIF" },
                { value: "G", label: "Pasaporte" },
              ]}
            />

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <SwitchLS
                name="isActive"
                labels={["Activo", "Inactivo"]}
                pLabel="Activo"
                control={methods.control}
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
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