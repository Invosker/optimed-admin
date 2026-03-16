import { createPortal } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import { useUpdateDoctor } from "../hooks/useUpdateDoctor";
import SwitchLS from "@/Components/Input/Switch";
import useUser from "@/hooks/useUser";
import SelectN from "@/Components/Input/Select";
import { APPOINTMENT_TYPE_OPTIONS } from "@/Views/Appointments/types/appointment"; // mismas opciones

interface Props {
  doctor: any;
  onClose: () => void;
}

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  isActive: boolean;
  identification?: string;
  identificationType?: string;
  licenseNumber?: string;
};

const getDoctorId = (d: any): string | number =>
  d?.id || d?.idDoctor || d?.doctorId || d?._id || d?.uuid;

export default function EditDoctorModal({ doctor, onClose }: Props) {
  const methods = useForm<FormValues>({
    defaultValues: {
      firstName: doctor?.firstName ?? doctor?.name ?? "",
      lastName: doctor?.lastName ?? "",
      email: doctor?.email ?? "",
      phone: doctor?.phone ?? doctor?.telephone ?? "",
      specialty:
        doctor?.specialty ??
        doctor?.specialization ??
        (APPOINTMENT_TYPE_OPTIONS[0]?.value as string),
      isActive:
        typeof doctor?.isActive === "boolean"
          ? doctor.isActive
          : doctor?.status === "active" || doctor?.status === 1,
      identification: doctor?.identification ?? "",
      identificationType: doctor?.identificationType ?? "",
      licenseNumber: doctor?.licenseNumber ?? "",
    },
  });

  const { mutate, isPending } = useUpdateDoctor();
  const userCtx: any = useUser();

  const submit = (values: FormValues) => {
    const id = getDoctorId(doctor);
    if (!id) return onClose();

    mutate(
      {
        email: values.email ?? "",
        name: values.firstName ?? doctor?.name ?? "",
        identification: values.identification ?? doctor?.identification ?? "",
        identificationType:
          values.identificationType ?? doctor?.identificationType ?? "",
        lastName: values.lastName ?? "",
        phone: values.phone ?? "",
        licenseNumber: values.licenseNumber ?? doctor?.licenseNumber ?? "",
        specialty: values.specialty ?? "",
        id: id as number | string,
        isActive: Boolean(values.isActive),
        isAdmin: true,
        createdBy:
          (userCtx as any)?.user?.id ??
          (userCtx as any)?.id ??
          doctor?.createdBy ??
          1,
      },
      { onSuccess: () => onClose() }
    );
  };

  const identificationTypes = [
    { label: "V", value: "V" },
    { label: "E", value: "E" },
    { label: "J", value: "J" },
    { label: "G", value: "G" },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-auto pt-36 md:pt-10">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold text-optimed-tiber mb-4">
          Editar doctor
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

            <SelectN
              name="specialty"
              label="Especialidad"
              options={APPOINTMENT_TYPE_OPTIONS as any}
              className="md:col-span-2"
            />

            <TextField name="identification" label="Identificación" />
            <SelectN
              name="identificationType"
              label="Tipo de identificación"
              options={identificationTypes}
            />
            <TextField name="licenseNumber" label="N° de licencia" />

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
