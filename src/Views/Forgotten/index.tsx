import React from 'react'
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import TextField from "@/Components/Input/Input";

interface ForgottenFormValues {
  usernameOrEmail: string;
}

export default function ForgottenPassword() {
  const methods = useForm<ForgottenFormValues>({
    defaultValues: { usernameOrEmail: "" },
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log("Solicitud de reseteo enviada:", data);
    // Aquí podrías llamar a tu API y luego mostrar un estado de éxito
    alert(
      "Si el usuario / correo existe recibirás un email con instrucciones para restablecer tu contraseña."
    );
  });

  return (
    <main>
      <div className="relative min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-optimed-tiber">
        <div className="absolute inset-0 bg-[#0a3042]/70 backdrop-blur-[2px]" />
        <div className="relative z-10 w-full max-w-md mx-auto px-6 py-10 rounded-2xl bg-white shadow-2xl border border-white/60">
          <div className="flex flex-col items-center">
            <h1 className="text-optimed-tiber text-3xl font-extrabold tracking-wide drop-shadow">
              Recuperar
            </h1>
            <img
              src="/images/Optimed_Logo.jpg"
              alt="Optimed Logo"
              className="h-40 w-40 mb-2"
            />
          </div>

          <p className="text-center text-xs text-gray-600 mt-2 mb-6">
            Introduce tu usuario o correo electrónico y te enviaremos un enlace
            para restablecer la contraseña.
          </p>

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="space-y-6">
              <TextField
                name="usernameOrEmail"
                label="Usuario o correo electrónico"
                placeholder="ejemplo@dominio.com"
                required
              />

              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-optimed-tiber px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#0a3042]/90 transition-colors"
              >
                Enviar
              </button>

              <div className="text-center">
                <Link
                  to={`${import.meta.env.VITE_BASE_URL}`}
                  className="text-sm font-medium text-[#004AAD] hover:opacity-70"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </main>
  );
}