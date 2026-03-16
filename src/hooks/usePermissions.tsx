import {
  FaBoxes,
  FaRedo,
  FaChartBar,
  FaFileInvoiceDollar,
  FaUserEdit,
  FaSignOutAlt,
  FaCog,
  FaPlus,
  FaUserFriends,
  FaSearch,
} from "react-icons/fa";

import useUser from "./useUser";

export type Permission = {
  moduleKey: string;
  actions: Action[];
  label: string;
};

export type Action = {
  actionKey: string;
  selected: boolean;
  label: string;
};

const usePermissions = () => {
  const { user } = useUser();

  const rolePermissions = user?.role?.permissions || "[]";

  const permissions = JSON.parse(rolePermissions);
  console.log("🚀 ~ usePermissions ~ permissions:", permissions);

  // Placeholder for permission logic
  const asideOptions = [
    {
      id: 1,
      name: "Estadísticas",
      path: "/Home/Account",
      icon: <FaChartBar className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "myAccount")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 12,
      name: "Auditoría",
      path: "/Home/Audit",
      icon: <FaSearch className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "audit")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 2,
      name: "Inventario",
      path: "/Home/Inventory",
      icon: <FaBoxes className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "inventory")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 10,
      name: "Nuevo servicio",
      path: "/Home/Inventory?newService=1",
      icon: <FaPlus className="text-fundasalud-tiber" />,
      // active:
      //   rolePermissions === "" ||
      //   permissions
      //     .find((x: Permission) => x.moduleKey === "myAccount")
      //     ?.actions.filter((a: Action) => a.selected === true).length > 0,
      active: true,
    },
    {
      id: 3,
      name: "Citas Médicas",
      path: "/Home/AppointmentsMedical",
      icon: <FaSearch className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "medicalAppointments")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 13,
      name: "Doctores",
      path: "/Home/Doctors",
      icon: <FaUserFriends className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "doctors")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 10,
      name: "Clientes",
      path: "/Home/Clients",
      icon: <FaUserFriends className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "clients")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 4,
      name: "Reposición de Productos",
      path: "/Home/ProductReplacement",
      icon: <FaRedo className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "productReplenishment")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 5,
      name: "Reportes",
      path: "/Home/Reporting",
      icon: <FaChartBar className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "myAccount")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 6,
      name: "Facturación",
      path: "/Home/Biling",
      icon: <FaFileInvoiceDollar className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "billing")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },

    {
      id: 9,
      name: "Configuraciones",
      path: "/Home/Configurations",
      icon: <FaCog className="text-fundasalud-tiber" />,
      active:
        rolePermissions === "[]" ||
        permissions
          .find((x: Permission) => x.moduleKey === "configuration")
          ?.actions.filter((a: Action) => a.selected === true).length > 0,
    },
    {
      id: 8,
      name: "Salir",
      path: "/",
      icon: <FaSignOutAlt className="text-red-500" />,
      active: true,
    },
  ].filter((x) => x.active === true);

  console.log("🚀 ~ usePermissions ~ permissions:", permissions);
  console.log("🚀 ~ usePermissions ~ asideOptions:", asideOptions);

  return { asideOptions, permissions };
};

export default usePermissions;
