// import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import TextField from "@/Components/Input/Input";
import useAuth from "@/hooks/useAuth";
import Button from "@/Components/Button";

export default function Example() {
  const methods = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const { mutationLogin } = useAuth();

  const onSubmit = methods.handleSubmit((data) => {
    mutationLogin.mutate(data, {
      onSuccess: (response) => {
        console.log("Login successful:", response);
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    });
    console.log("🚀 ~ Example ~ onSubmit:", onSubmit, data);
  });

  // useEffect(() => {
  //   const item =
  //     typeof localStorage !== "undefined" ? localStorage.getItem("user") : null;
  //   if (item) methods.setValue("user", item);
  //   methods.setValue("remember-me", item !== null);
  // }, [methods]);

  return (
    <main>
      <div
        className="relative min-h-screen w-screen flex items-center justify-center bg-cover bg-center"
        // style={{ backgroundImage: "url(/images/bgtest.png)" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-optimed-tiber/70 backdrop-blur-[2px]" />
        {/* Card */}
        <div className="relative z-10 w-full max-w-md mx-auto px-6 py-10 rounded-2xl bg-white shadow-2xl border border-white/60">
          <div className="flex flex-col items-center">
            <Link to={`${import.meta.env.VITE_BASE_URL}`}>
              <img
                src="/images/Optimed_Logo.jpg"
                alt="Optimed Logo"
                className="h-40 w-40 mb-2"
              />
            </Link>
          </div>

          <div className="">
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <TextField
                    name="emailOrUsername"
                    required
                    label="Usuario o correo electrónico"
                    id="username"
                    placeholder="Introduzca su usuario"
                  />
                </div>
                <div>
                  <TextField
                    name="password"
                    required
                    label="Contraseña"
                    id="password"
                    type="password"
                    placeholder="Introduzca su contraseña"
                  />
                </div>

                {/* <div className="flex items-center justify-end">
                  <Link
                    to={`${import.meta.env.VITE_BASE_URL}forgotten`}
                    className="text-sm font-medium text-optimed-tiber hover:opacity-70"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div> */}
                <Button type="submit">
                  Ingresar
                  <span aria-hidden="true" className="ml-1">
                    &rarr;
                  </span>
                </Button>

                {/* <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-autogo-tiber px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#0a3042]/90 transition-colors"
                >
                  Ingresar
                  <span aria-hidden="true" className="ml-1">
                    &rarr;
                  </span>
                </button> */}
                {/* <p className="mt-1 text-sm leading-6 text-gray-600 text-center">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to={`${import.meta.env.VITE_BASE_URL}register`}
                    className="font-semibold text-[#004AAD] hover:opacity-70"
                  >
                    Regístrate
                  </Link>
                </p> */}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </main>
  );
}
