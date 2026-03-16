import {
  FaChartBar,
  FaTruck,
  FaCalendarAlt,
  FaPercent,
  FaFileExcel,
  FaFilter,
  FaUserCog,
  FaGlasses,
} from "react-icons/fa";
import Button from "@/Components/Button";
import { useState } from "react";

export default function Reports() {
  const [tab, setTab] = useState<"general" | "transportes" | "reservas">(
    "general"
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 md:px-10 py-8 overflow-auto">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 grid gap-8 mb-10">
        <header className="bg-optimed-tiber text-white px-8 py-6 grid grid-cols-2 items-center shadow-lg rounded-lg mb-6">
          <h1 className="text-3xl font-extrabold tracking-wide drop-shadow">
            Reportes
          </h1>
        </header>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <Button
              color={tab === "general" ? "primary" : "secondary"}
              className="px-4 py-2 shadow-sm"
              onClick={() => setTab("general")}
            >
              General
            </Button>
            <Button
              color={tab === "transportes" ? "primary" : "secondary"}
              className="px-4 py-2 shadow-sm"
              onClick={() => setTab("transportes")}
            >
              Transacciones
            </Button>
            <Button
              color={tab === "reservas" ? "primary" : "secondary"}
              className="px-4 py-2 shadow-sm"
              onClick={() => setTab("reservas")}
            >
              Reservas
            </Button>
          </div>
          <Button
            color="secondary"
            className="ml-auto flex items-center gap-2 shadow-sm"
          >
            <FaUserCog /> Personalizado
          </Button>
        </div>
        <hr className="border-t border-gray-200 my-2" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <span className="text-gray-500 text-sm flex items-center gap-2">
            <FaCalendarAlt className="inline" />
            08 mayo 2025 &rarr; 15 junio 2025
          </span>
          <button className="flex items-center gap-2 px-3 py-1 text-xs rounded shadow-sm bg-white border border-gray-300 text-blue-900">
            <FaFilter /> Filtrar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 mb-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center">
                <FaGlasses className="text-blue-500 mb-2" size={28} />
                <span className="text-2xl font-bold text-blue-900">0</span>
                <span className="text-xs text-gray-500 mt-1">
                  Transacciones en línea
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaGlasses className="text-green-500 mb-2" size={28} />
                <span className="text-2xl font-bold text-blue-900">0</span>
                <span className="text-xs text-gray-500 mt-1">
                  Lentes reservados
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaGlasses className="text-orange-500 mb-2" size={28} />
                <span className="text-2xl font-bold text-blue-900">0</span>
                <span className="text-xs text-gray-500 mt-1">
                  Lentes caducados
                </span>
              </div>
              <div className="flex flex-col items-center">
                <FaChartBar className="text-indigo-500 mb-2" size={28} />
                <span className="text-2xl font-bold text-blue-900">0</span>
                <span className="text-xs text-gray-500 mt-1">Total</span>
              </div>
              <div className="flex flex-col items-center">
                <FaPercent className="text-blue-500 mb-2" size={28} />
                <span className="text-2xl font-bold text-blue-900">0%</span>
                <span className="text-xs text-gray-500 mt-1">Conversión</span>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200 my-2" />

          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[180px] mb-2">
            <FaChartBar className="text-gray-300 mb-4" size={48} />
            <span className="text-gray-400 text-xl">Sin datos</span>
          </div>

          <hr className="border-t border-gray-200 my-2" />

          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Ventas{" "}
              <span className="text-gray-400 font-normal">por semana</span>
            </h3>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <FaChartBar className="text-gray-300 mb-2" size={32} />
              <span className="text-gray-400">Sin datos</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Ventas{" "}
              <span className="text-gray-400 font-normal">por delivery</span>
            </h3>
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <FaChartBar className="text-gray-300 mb-2" size={32} />
              <span className="text-gray-400">Sin datos</span>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-8">
          <Button
            color="primary"
            className="px-8 py-3 text-lg font-bold flex items-center gap-2 shadow-md"
          >
            <FaFileExcel /> Descargar el informe Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
