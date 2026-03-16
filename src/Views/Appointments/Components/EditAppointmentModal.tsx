import { createPortal } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import {
  Appointment,
  AppointmentUpdateRequest,
  APPOINTMENT_TYPE_OPTIONS,
} from "../types/appointment";
import { useUpdateAppointments } from "../hooks/useUpdateAppointments";
import usePermissions, { Action, Permission } from "@/hooks/usePermissions";
interface Props {
  item: Appointment | null;
  onClose: () => void;
}

type FormValues = {
  date: string;
  time: string;
  appointmentType: string;
  status: string;
  notes?: string;
  results?: string;
};

export default function EditAppointmentModal({ item, onClose }: Props) {
  const methods = useForm<FormValues>({
    defaultValues: {
      date: "",
      time: "",
      appointmentType: APPOINTMENT_TYPE_OPTIONS[0].value,
      status: "Programado",
      notes: "",
      results: "",
    },
  });

  const { handleSubmit, reset } = methods;
  const { mutate: updateAppointment, isPending } = useUpdateAppointments();

  const { permissions } = usePermissions();

  useEffect(() => {
    if (!item) return;
    const time = (item.time || "").slice(0, 5);
    reset({
      date: item.date ?? "",
      time,
      appointmentType:
        item.appointmentType ?? APPOINTMENT_TYPE_OPTIONS[0].value,
      status: item.status ?? "scheduled",
      notes: item.notes ?? "",
      results: (item as any).results ?? "",
    });
  }, [item, reset]);

  if (!item) return null;

  const onSubmit = (v: FormValues) => {
    const timeNormalized = (v.time || "").slice(0, 5);
    const payload: AppointmentUpdateRequest = {
      id: item.id as number,
      date: v.date,
      time: timeNormalized,
      appointmentType: v.appointmentType,
      status: v.status,
      notes: v.notes || "",
      results: v.results || "",
    };

    updateAppointment(
      { id: item.id as number, data: payload },
      { onSuccess: () => onClose() }
    );
  };

  const content = (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl leading-none"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold text-optimed-tiber mb-1">
          Editar Cita
        </h2>
        <p className="text-sm text-gray-500 mb-4">ID: {item.id}</p>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <TextField name="date" label="Fecha" type="date" />
            <TextField name="time" label="Hora" type="time" step={60} />
            <SelectN
              name="appointmentType"
              label="Tipo de cita"
              options={APPOINTMENT_TYPE_OPTIONS as any}
            />
            <SelectN
              name="status"
              label="Estatus"
              options={[
                { label: "Programado", value: "scheduled" },
                { label: "Completado", value: "completed" },
                { label: "Cancelado", value: "cancelled" },
              ]}
            />
            <TextField name="notes" label="Notas" />
            <TextField name="results" label="Resultados" />
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <Button
                type="button"
                color="secondary"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              {(permissions
                .find((p: Permission) => p.moduleKey === "medicalAppointments")
                .actions.find((a: Action) => a.actionKey === "update")
                .selected ||
                permissions.length === 0) && (
                <Button type="submit" color="primary" disabled={isPending}>
                  {isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
