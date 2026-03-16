import { FaCarSide, FaArrowRight } from "react-icons/fa";
import Button from "@/Components/Button";
import SelectN from "@/Components/Input/Select";
import TextField from "@/Components/Input/Input";
import { FormProvider, useForm } from "react-hook-form";

export default function Budget() {
  const methods = useForm();

  return (
    <div className="w-full min-h-screen bg-gray-100 grid grid-cols-1">
      <div className="w-full px-4 md:px-10 py-8">
        <div className="bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 rounded-lg shadow-xl p-8 pt-4 pb-4 w-full overflow-y-auto max-h-[90vh] mx-auto">
          {/* Título y imagen */}
          <header className="bg-optimed-tiber text-white px-1 md:px-6 py-6 grid grid-cols-1 md:grid-cols-2 items-center shadow-lg rounded-lg mb-6">
            <h1 className="font-extrabold tracking-wide drop-shadow text-center md:text-left w-full col-span-full">
              Configuración de Productos
            </h1>
          </header>

          <FormProvider {...methods}>
            <form className="grid gap-6">
              {/* Dirección de salida y llegada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex items-center gap-3">
                  <FaCarSide className="text-green-500" size={28} />
                  <div className="w-full">
                    <div className="text-xs text-gray-400 font-semibold mb-1">
                      a
                    </div>
                    <TextField name="departure" label="" placeholder="a" />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex items-center gap-3">
                  <FaCarSide className="text-[#0a3042]" size={28} />
                  <div className="w-full">
                    <div className="text-xs text-gray-400 font-semibold mb-1">
                      b
                    </div>
                    <TextField name="arrival" label="" placeholder="b" />
                  </div>
                </div>
              </div>

              {/* Tipo de transporte */}
              <div className="grid grid-cols-1">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  <FaCarSide className="text-[#0a3042]" size={22} />
                  <SelectN
                    name="transportType"
                    label="c"
                    options={[
                      { label: "1", value: "simple" },
                      { label: "2", value: "entrega" },
                      { label: "3", value: "recogida" },
                    ]}
                    className="min-w-[180px]"
                  />
                </div>
              </div>

              {/* Opciones de transporte seleccionables */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm transition-all ${
                    extras.clean ? "ring-2 ring-blue-500" : "hover:bg-blue-50"
                  }`}
                  onClick={() =>
                    setExtras((prev) => ({ ...prev, clean: !prev.clean }))
                  }
                >
                  <MdCleaningServices className="text-[#0a3042]" size={28} />
                  <div>
                    <span className="text-[#0a3042] font-semibold">
                      Limpieza exterior{" "}
                      <span className="text-[#0a3042]">+15€</span>
                    </span>
                    <div className="text-xs text-gray-500">
                      antes de la entrega
                    </div>
                  </div>
                  {extras.clean && (
                    <FaArrowRight className="text-[#0a3042] ml-auto" />
                  )}
                </button>
                <button
                  type="button"
                  className={`bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm transition-all ${
                    extras.plate ? "ring-2 ring-blue-500" : "hover:bg-blue-50"
                  }`}
                  onClick={() =>
                    setExtras((prev) => ({ ...prev, plate: !prev.plate }))
                  }
                >
                  <FaBarcode className="text-[#0a3042]" size={28} />
                  <div>
                    <span className="text-blue-900 font-semibold">
                      Movimiento con placa Roja provisional{" "}
                      <span className="text-[#0a3042]">+50€</span>
                    </span>
                    <div className="text-xs text-gray-500">
                      necesario para el transporte
                    </div>
                  </div>
                  {extras.plate && (
                    <FaArrowRight className="text-[#0a3042] ml-auto" />
                  )}
                </button>
              </div> */}

              {/* Botón calcular */}
              <div className="w-full flex justify-end mt-2">
                <Button
                  color="primary"
                  className="px-8 py-3 text-lg font-bold flex items-center gap-2"
                  type="submit"
                >
                  Calcular <FaArrowRight />
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
