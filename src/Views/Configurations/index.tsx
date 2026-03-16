import { useState } from "react";
import ConfigProduct from "./forms/configProduct";
import ConfigCategory from "./forms/configCategory";
import ConfigSubcategory from "./forms/configSubcategory";
import ConfigDoctor from "./forms/configDoctor";
import ConfigUser from "./forms/configUser";
import ConfigRoles from "./Roles";
import usePermissions, { Action, Permission } from "@/hooks/usePermissions";

export default function Configurations() {
  const [view, setView] = useState("product");

  const { permissions } = usePermissions();

  const configViews = [
    {
      key: "product",
      label: "Productos",
      active:
        permissions.length === 0 ||
        permissions
          .find((x: Permission) => x.moduleKey === "configuration")
          ?.actions.find((a: Action) => a.actionKey === "products")?.selected,
    },
    {
      key: "category",
      label: "Categorías",
      active:
        permissions.length === 0 ||
        permissions
          .find((x: Permission) => x.moduleKey === "configuration")
          ?.actions.find((a: Action) => a.actionKey === "categories")?.selected,
    },
    {
      key: "subcategory",
      label: "Subcategorías",
      active:
        permissions.length === 0 ||
        permissions
          .find((x: Permission) => x.moduleKey === "configuration")
          ?.actions.find((a: Action) => a.actionKey === "subcategories")
          ?.selected,
    },
    {
      key: "doctor",
      label: "Médicos",
      active:
        permissions.length === 0 ||
        permissions
          .find((x: Permission) => x.moduleKey === "configuration")
          ?.actions.find((a: Action) => a.actionKey === "doctors")?.selected,
    },
    {
      key: "user",
      label: "Usuarios",
      active:
        permissions.length === 0 ||
        permissions
          .find((x: Permission) => x.moduleKey === "configuration")
          ?.actions.find((a: Action) => a.actionKey === "users")?.selected,
    },
    {
      key: "roles",
      label: "Roles",
      active:
        permissions.length === 0 ||
        permissions
          .find((x: Permission) => x.moduleKey === "configuration")
          ?.actions.find((a: Action) => a.actionKey === "roles")?.selected,
    },
  ].filter((v) => v.active === true);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-optimed-tiber/60 rounded-lg shadow-xl p-8 pt-4 pb-4 w-full overflow-y-auto mx-auto h-full">
      <header className="bg-optimed-tiber text-white lg:px-8 py-3 items-center shadow-lg rounded-lg mb-6">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-wide drop-shadow text-white px-3">
          Configuraciones
        </h2>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto w-[36dvh] md:w-auto">
        {configViews.map((v) => (
          <button
            key={v.key}
            className={`px-4 py-3 rounded font-semibold border transition ${
              view === v.key
                ? "bg-optimed-tiber text-white border-optimed-tiber"
                : "bg-white text-optimed-tiber border-gray-200"
            }`}
            onClick={() => setView(v.key)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {view === "product" && <ConfigProduct />}
        {view === "category" && <ConfigCategory />}
        {view === "subcategory" && <ConfigSubcategory />}
        {view === "doctor" && <ConfigDoctor />}
        {view === "user" && <ConfigUser />}
        {view === "roles" && <ConfigRoles />}
      </div>
    </div>
  );
}
