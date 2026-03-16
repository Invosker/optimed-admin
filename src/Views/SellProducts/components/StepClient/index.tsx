import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/Components/Button";
import TextField from "@/Components/Input/Input";
import { useCreateClient } from "@/Views/doctorConfig/hooks/useCreateClient";
import type { CreateClientInput } from "@/Views/doctorConfig/types/client";
import { FaSearch } from "react-icons/fa";
import useSearchClient from "@/Views/doctorConfig/hooks/useSearchClient";

export default function StepClient({
  data,
  onChange,
  handleResetClient,
  onNext,
}: any) {
  console.log("🚀 ~ StepClient ~ data:", data);
  const methods = useForm<CreateClientInput>({
    mode: "onChange", // validación reactiva para deshabilitar el botón si faltan campos
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

  const [identification, setIdentification] = useState<string>("");

  const { clientData, deleteSearch } = useSearchClient({
    identification:
      identification !== "" ? identification : data?.identification,
  });

  useEffect(() => {
    if (clientData !== undefined) {
      methods.reset({
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
  }, [clientData, methods]);

  const onSubmitSearchIdentification = (values: { identification: string }) => {
    setIdentification(values.identification);
  };

  const clearSelection = () => {
    deleteSearch();
    handleResetClient();
    setIdentification("");
    methods.reset({
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

  const { mutate: createClient, isPending } = useCreateClient();
  const idType = methods.watch("identificationType");

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

  return (
    <>
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
            <Button type="submit" color="primary" className="h-10 px-3">
              <FaSearch />
            </Button>
          </div>
        </form>
      </FormProvider>
      <FormProvider {...methods}>
        <div className="grid gap-4">
          {/* Tipo de identificación */}
          <div className="flex gap-2">
            {["V", "E", "J", "G"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg font-bold border h-10 ${
                  idType === type
                    ? "bg-optimed-tiber text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() =>
                  methods.setValue("identificationType", type, {
                    shouldValidate: true,
                  })
                }
                type="button"
              >
                {type}
              </button>
            ))}
          </div>

          {/* Formulario del cliente */}
          <>
            <form
              id="clientForm"
              onSubmit={methods.handleSubmit(submitClientForm)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[40vh] overflow-auto"
            >
              <TextField name="identification" label="Cédula" />
              <TextField name="firstName" label="Nombre" />
              <TextField name="lastName" label="Apellido" />
              <TextField name="phone" label="Teléfono" />
              <TextField name="email" label="Correo Electrónico" type="email" />
              <TextField
                name="address"
                label="Dirección"
                className="md:col-span-2"
              />
              <TextField
                name="description"
                label="Descripción"
                className="md:col-span-2"
              />
              <TextField
                name="dateOfBirth"
                label="Fecha de nacimiento"
                type="date"
              />
            </form>
            <div className="md:col-span-2 gap-2 flex justify-end mt-2">
              <Button type="button" color="secondary" onClick={clearSelection}>
                Cambiar cliente
              </Button>
              <Button
                form="clientForm"
                color="primary"
                type="submit"
                disabled={isPending || !methods.formState.isValid}
              >
                {isPending ? "Guardando..." : "Guardar y continuar"}
              </Button>
            </div>
          </>
        </div>
      </FormProvider>
    </>
  );
}
