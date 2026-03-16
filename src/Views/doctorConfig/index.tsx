import { useState, useEffect } from "react";
import { FaUser, FaBoxOpen, FaSearch } from "react-icons/fa";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateClient } from "./hooks/useCreateClient";
import { useCreateAppointment } from "./hooks/useCreateAppointment";
import { CreateClientInput } from "./types/client";
import { AppointmentCreateInput } from "./types/appointment";
import { useGetDoctors } from "@/Views/Configurations/hooks/useGetDoctor";
import useSearchClient from "./hooks/useSearchClient";
import { Doctor } from "../Configurations/types/doctor";

const steps = [
  { label: "Datos del Cliente", icon: <FaUser /> },
  { label: "Selección de Fecha", icon: <FaBoxOpen /> },
];

function StepClient({ data, onChange, onNext }: any) {
  const clientMethods = useForm<CreateClientInput>({
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      identification: data.identification || "",
      identificationType: data.identificationType || "V",
      address: data.address || "",
      description: data.description || "",
      dateOfBirth: data.dateOfBirth || "",
    },
  });

  const searchMethods = useForm({
    defaultValues: {
      identification: "",
    },
  });

  const { mutate: createClient, isPending } = useCreateClient();

  const [identification, setIdentification] = useState<string>("");

  const { clientData, deleteSearch } = useSearchClient({
    identification:
      identification !== "" ? identification : data?.identification,
  });

  // búsqueda con debounce

  const onSubmitSearchIdentification = (values: { identification: string }) => {
    setIdentification(values.identification);
  };

  const submitClientForm = (values: CreateClientInput) => {
    if (clientData) {
      // existing client selected -> just continue
      onChange({ ...values, clientId: clientData.id });
      onNext();
      return;
    }

    createClient(values, {
      onSuccess: (created) => {
        onChange({ ...values, clientId: created.id });
        onNext();
      },
    });
  };

  const clearSelection = () => {
    deleteSearch();
    onChange({});
    setIdentification("");
    clientMethods.reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      identification: "",
      identificationType: "V",
      address: "",
      description: "",
      dateOfBirth: "",
    });
  };

  useEffect(() => {
    if (clientData !== undefined) {
      clientMethods.reset({
        firstName: clientData.firstName || "",
        lastName: clientData.lastName || "",
        email: clientData.email || "",
        phone: clientData.phone || "",
        identification: clientData.identification || "",
        identificationType: clientData.identificationType || "V",
        address: clientData.address || "",
        description: clientData.description || "",
        dateOfBirth: clientData.dateOfBirth || "",
      });
    }
  }, [clientData, clientMethods]);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl text-center font-bold mb-6 text-optimed-tiber">
        Datos del Cliente
      </h2>
      {/* Search Form */}
      <FormProvider {...searchMethods}>
        <form
          onSubmit={searchMethods.handleSubmit(onSubmitSearchIdentification)} // Prevent default since search is live
          className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2 items-end"
        >
          <div className="md:col-span-2">
            <TextField
              name="identification"
              label="Buscar cliente por Cédula"
              placeholder="Ingrese la cédula del cliente"
            />
          </div>
          <div className="flex gap-2 items-center">
            {/* <SelectN
              name="clientStatusFilter"
              label="Estado"
              options={[
                { label: "Activos", value: "active" },
                { label: "Inactivos", value: "inactive" },
                { label: "Todos", value: "all" },
              ]}
              rules={{
                onChange: () => setClientPage(1),
              }}
            /> */}
            <Button type="submit" color="primary" className="h-10 px-3">
              <FaSearch />
            </Button>
          </div>
        </form>
      </FormProvider>
      {/* Client Data Form */}
      <FormProvider {...clientMethods}>
        <form
          onSubmit={clientMethods.handleSubmit(submitClientForm)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
        >
          <TextField
            name="identification"
            label="Cédula"
            disabled={!!clientData}
          />
          <TextField name="firstName" label="Nombre" disabled={!!clientData} />
          <TextField name="lastName" label="Apellido" disabled={!!clientData} />
          <TextField
            name="email"
            label="Correo"
            type="email"
            disabled={!!clientData}
          />
          <TextField name="phone" label="Teléfono" disabled={!!clientData} />
          <TextField
            name="address"
            label="Dirección"
            className="md:col-span-2"
            disabled={!!clientData}
          />
          <TextField
            name="description"
            label="Descripción"
            className="md:col-span-2"
            disabled={!!clientData}
          />
          <TextField
            name="dateOfBirth"
            label="Fecha de nacimiento"
            type="date"
            disabled={!!clientData}
          />

          <div className="md:col-span-2 flex justify-between pt-2">
            {!isPending ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  color="secondary"
                  onClick={clearSelection}
                >
                  Cambiar cliente
                </Button>
                <Button color="primary" type="submit" disabled={isPending}>
                  Guardar y continuar
                </Button>
              </div>
            ) : (
              <Button
                color="primary"
                type="submit"
                disabled={isPending}
                className="min-w-40"
              >
                {isPending ? "Guardando..." : "Guardar y continuar"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

//Selección de Fecha y Hora
function StepDateSelection({ data, onChange, reset, onBack }: any) {
  const methods = useForm<AppointmentCreateInput>({
    defaultValues: {
      clientId: Number(data.clientId) || 0,
      doctorId: Number(data.doctorId) || 0,
      date: data.date || "",
      time: data.time || "",
      appointmentType: data.appointmentType || "odontologia",
      reason: data.reason || "",
      status: data.status || "scheduled",
      notes: data.notes || "",
    },
  });

  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const {
    data: doctorsPage,
    isLoading: loadingDoctors,
    isFetching: fetchingDoctors,
  } = useGetDoctors({
    page: 1,
    limit: 100,
    search: "",
    status: "active",
  });

  const doctorOptions =
    (doctorsPage?.docs || []).map((d: Doctor) => ({
      label:
        [d.name, d.lastName].filter(Boolean).join(" ").trim() ||
        d.name ||
        `Dr. #${d.id}`,
      value: Number(d.id),
    })) ?? [];

  const typeOptions = [
    { label: "Odontología", value: "odontologia" },
    { label: "General", value: "general" },
    { label: "Control", value: "control" },
  ];

  const statusOptions = [
    { label: "Programada", value: "scheduled" },
    { label: "Completada", value: "completed" },
    { label: "Cancelada", value: "cancelled" },
  ];

  const submit = (values: AppointmentCreateInput) => {
    const payload: AppointmentCreateInput = {
      ...values,
      clientId: Number(data.clientId),
      doctorId: Number(values.doctorId),
    };
    createAppointment(payload, {
      onSuccess: (created) => {
        onChange({
          ...data,
          ...values,
          clientId: payload.clientId,
          appointmentId: created.id,
        });
        reset();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl text-center font-bold mb-6 text-optimed-tiber">
          Creación de Cita Médica
        </h2>
        <form
          onSubmit={methods.handleSubmit(submit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="hidden"
            {...methods.register("clientId", { valueAsNumber: true })}
          />

          <SelectN
            name="doctorId"
            label="Médico"
            options={doctorOptions}
            loading={loadingDoctors || fetchingDoctors}
            disabled={loadingDoctors && !doctorOptions.length}
          />

          <TextField name="date" label="Fecha de la cita" type="date" />
          <TextField name="time" label="Hora de la cita" type="time" />
          <SelectN
            name="appointmentType"
            label="Tipo de cita"
            options={typeOptions}
          />
          <SelectN name="status" label="Estado" options={statusOptions} />
          <TextField name="reason" label="Motivo" className="md:col-span-2" />
          <TextField name="notes" label="Notas" className="md:col-span-2" />

          <div className="md:col-span-2 flex justify-between mt-2 gap-4">
            <Button type="button" onClick={onBack}>
              Atrás
            </Button>
            <Button color="primary" type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar y continuar"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

// Componente principal Stepper
export default function SaleStepper(props: {
  setShowForm: (value: boolean) => void;
  setShowNewService: (value: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>({});
  console.log("🚀 ~ SaleStepper ~ form:", form);

  const handleReset = () => {
    props.setShowForm(false);
    props.setShowNewService(true);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 flex flex-col">
      {/* Stepper visual */}
      <div className="w-full">
        <div className="flex justify-center gap-4 md:gap-8 py-8 px-2 min-w-[340px] md:min-w-0">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div
                className={`flex flex-col items-center transition-all duration-200
            ${i === step ? "scale-110" : "opacity-60"}
          `}
              >
                <div
                  className={`rounded-full flex items-center justify-center mb-2 border-2
              ${
                i === step
                  ? "bg-optimed-tiber text-white border-optimed-tiber shadow-lg"
                  : "bg-gray-200 text-gray-500 border-gray-300"
              }
            `}
                  style={{
                    width: window.innerWidth < 640 ? 38 : 48,
                    height: window.innerWidth < 640 ? 38 : 48,
                    fontSize: window.innerWidth < 640 ? 18 : 24,
                  }}
                >
                  {s.icon}
                </div>
                <span
                  className={`text-xs font-semibold text-center w-20 md:w-auto truncate
              ${i === step ? "text-optimed-tiber" : "text-gray-400"}
            `}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block w-12 h-1 bg-gray-300 mx-2 rounded" />
              )}
              {i < steps.length - 1 && (
                <div className="block md:hidden w-6 h-1 bg-gray-200 mx-1 rounded" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Step content */}
      <div className="my-20 items-center justify-center">
        {step === 0 && (
          <StepClient
            data={form}
            onChange={setForm}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <StepDateSelection
            data={form}
            onChange={setForm}
            onNext={() => setStep(2)}
            reset={handleReset}
            onBack={() => setStep(0)}
          />
        )}
      </div>
    </div>
  );
}
