import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import { UserData, useUsers } from "./hooks/useUsers";
import Button from "@/Components/Button";

export default function Register() {
  const methods = useForm<UserData>({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accept: false,
    },
  });

  const { mutationUsers } = useUsers();

  const { handleSubmit, watch } = methods;

  const onSubmit = handleSubmit((data) => {
    mutationUsers.mutate(data);
  });

  // Enfocar primer campo
  useEffect(() => {
    const first = document.getElementById("name");
    first?.focus();
  }, []);

  return (
    <main>
      <div
        className="relative min-h-screen w-screen flex items-center justify-center bg-cover bg-center"
        // style={{ backgroundImage: "url(/images/bgtest.png)" }}
      >
        <div className="absolute inset-0 bg-optimed-tiber/70 backdrop-blur-[2px]" />
        <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-10 rounded-2xl bg-white shadow-2xl border border-white/60">
          <div className="flex flex-col items-center">
            <h1 className="text-optimed-tiber text-3xl font-extrabold tracking-wide drop-shadow">
              Crear cuenta
            </h1>
          </div>

          <div className="mt-8">
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="space-y-5">
                <TextField
                  name="username"
                  id="username"
                  label="Usuario"
                  placeholder="Usuario"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="name"
                    id="name"
                    label="Nombre"
                    placeholder="Nombre"
                  />
                  <TextField
                    name="lastName"
                    label="Apellido"
                    placeholder="Apellidos"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    placeholder="tucorreo@dominio.com"
                  />
                  <TextField
                    name="phone"
                    label="Teléfono"
                    placeholder="Teléfono"
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
                        v === watch("password") || "No coincide",
                    }}
                  />
                </div>
                <TextField
                  name="description"
                  id="description"
                  label="Descripción del usuario"
                  placeholder="Usuario"
                />

                {/* <label className="flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    {...register("accept", {
                      required: "Requerido",
                    })}
                    className="mt-1"
                  />
                  <span>
                    Acepto los{" "}
                    <a href="#" className="text-[#004AAD] font-medium hover:opacity-70">
                      Términos y Condiciones
                    </a>{" "}
                    y la Política de Privacidad.
                  </span>
                </label>
                {errors.accept && <p className="text-xs text-red-600 -mt-2">{errors.accept.message}</p>} */}

                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-lg  transition-colors"
                >
                  Registrarse
                </Button>

                <p className="text-sm leading-6 text-gray-600 text-center">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to={`${import.meta.env.VITE_BASE_URL}`}
                    className="font-semibold text-[#004AAD] hover:opacity-70"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </main>
  );
}
