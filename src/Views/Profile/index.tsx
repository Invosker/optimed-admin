import { useForm, FormProvider } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import SelectN from "@/Components/Input/Select";
import Button from "@/Components/Button";
import SwitchLS from "@/Components/Input/Switch";
import { User, useUpdateUser } from "./hooks/useUpdateUser";
import useUser from "@/hooks/useUser";
import { useEffect } from "react";
import { useCurrentUserToUpdate } from "./hooks/useCurrentUserToUpdate";

export default function Profile() {
  // const { mutationUpdateUser } = useUpdateUser();

  // const methods = useForm<User>({
  //   defaultValues: {
  //     username: "",
  //     email: "",
  //     password: "",
  //     roleId: 2,
  //     description: "",
  //     name: "",
  //     lastName: "",
  //     phone: "",
  //     preferenceLanguage: 0,
  //     preference: 0,
  //     notificationsNew: false,
  //     notifications: true,
  //     reporting: 0,
  //   },
  // });

  const methods = useForm();

  const { handleSubmit } = methods;

  // const { user } = useUser();

  // const { currentUserData } = useCurrentUserToUpdate({ currentUser: user?.id });

  const onSubmit = handleSubmit((data) => {
    // mutationUpdateUser.mutate(data);
  });

  const userName = methods.watch("username");

  // useEffect(() => {
  //   if (currentUserData && userName === "") {
  //     const userToSet = {
  //       username: currentUserData.username,
  //       email: currentUserData.email,
  //       password: "",
  //       roleId: 2,
  //       description: currentUserData.description,
  //       name: currentUserData.name,
  //       lastName: currentUserData.lastName,
  //       phone: currentUserData.phone,
  //       preferenceLanguage: currentUserData.preferenceLanguage,
  //       preference: currentUserData.preference,
  //       notificationsNew: currentUserData.notificationsNew,
  //       notifications: currentUserData.notifications,
  //       reporting: currentUserData.reporting,
  //     };
  //     methods.reset(userToSet);
  //   }
  // }, [userName, methods, currentUserData]);

  return (
    <div className="w-full h-full bg-gray-100 grid grid-cols-1 overflow-auto">
      <div className="w-full px-4 md:px-10 py-8">
        <div className="bg-gradient-to-br bg-white rounded-lg shadow-xl p-8 pt-4 pb-4 w-full mx-auto">
          <header className="bg-optimed-tiber text-white px-4 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 items-center shadow-lg rounded-lg mb-6 gap-2">
            <h1 className="text-3xl font-extrabold tracking-wide drop-shadow text-center md:text-left">
              Mi perfil
            </h1>
            <div className="justify-self-center sm:justify-self-end">
              <span className="font-semibold text-lg bg-optimed-tiber px-3 py-1 text-white block">
                {/* {user.name} */}
              </span>
            </div>
          </header>
          <FormProvider {...methods}>
            <form
              className="grid gap-4 md:gap-8 max-w-3xl mx-auto"
              onSubmit={onSubmit}
            >
              {/* Foto y datos personales */}
              <div className="grid grid-cols-1 gap-4 md:gap-8 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-optimed-tiber rounded-lg w-32 h-32 flex items-center justify-center text-5xl font-bold text-white">
                    IV
                  </div>
                  <Button color="secondary" className="w-full md:w-auto">
                    Modificar foto
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2 w-full">
                  <div>
                    <TextField
                      name="name"
                      label="Nombre"
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      name="password"
                      label="Contraseña"
                      type="password"
                      placeholder="••••••••"
                      rules={{
                        minLength: { value: 6, message: "Mínimo 6 caracteres" },
                      }}
                    />
                    <TextField
                      name="confirmPassword"
                      label="Confirmar contraseña"
                      type="password"
                      placeholder="Repite la contraseña"
                      rules={{
                        validate: (v: string) =>
                          v === methods.watch("password") || "No coincide",
                      }}
                    />
                  </div>
                  <div>
                    <TextField
                      name="lastName"
                      label="Apellidos"
                      placeholder="Apellidos"
                    />
                  </div>
                  <div>
                    <TextField
                      name="email"
                      label="Correo electrónico"
                      placeholder="Correo electrónico"
                    />
                  </div>
                  <div>
                    <TextField
                      name="phone"
                      label="Teléfono de contacto"
                      placeholder="Teléfono"
                    />
                  </div>
                </div>
              </div>
              {/* Notificaciones */}
              {/* <div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <SwitchLS
                      control={methods.control}
                      name="notificationsNew"
                      pLabel="¿Recibir boletín de noticias?"
                      labels={["Si", "No"]}
                    />
                  </div>
                  <div>
                    <SwitchLS
                      control={methods.control}
                      name="notifications"
                      pLabel="¿Recibir notificaciones?"
                      labels={["Si", "No"]}
                    />
                  </div>
                  <div>
                    <SelectN
                      name="reporting"
                      label="¿Recibir reportes?"
                      options={[
                        { label: "Semanal", value: 1 },
                        { label: "Mensual", value: 2 },
                        { label: "Nunca", value: 3 },
                      ]}
                      rules={{ valueAsNumber: true }}
                    />
                  </div>
                </div>
              </div> */}

              {/* Acceso rápido */}

              {/* Guardar */}
              <div className="w-full flex justify-end mt-4 mb-20">
                <Button color="primary" className="px-8 py-3 text-lg font-bold">
                  Guardar
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
