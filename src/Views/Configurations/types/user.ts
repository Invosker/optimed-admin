export interface UserApiPayload {
  username: string;
  email: string;
  password: string;
  roleId: number;
  description: string;
  name: string;
  lastName: string;
  phone: string;
  isSuperAdmin: boolean;
  receiveNewsletter: boolean;
  receiveNotifications: boolean;
  idTrainingCenter: number;
  trainingCenterName: string;
}

export interface UserFormValues {
  username: string;
  email: string;
  password: string;
  roleId: string; // desde select (se convierte a number)
  description: string;
  name: string;
  lastName: string;
  phone: string;
  isSuperAdmin: boolean;
  receiveNewsletter: boolean;
  receiveNotifications: boolean;
  idTrainingCenter: string; // input numérico
  trainingCenterName: string;
}

export interface User extends UserApiPayload {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: number;
  isActive?: boolean; // opcional para filtros
}

export const mapUserFormToApi = (f: UserFormValues): UserApiPayload => ({
  username: f.username.trim(),
  email: f.email.trim(),
  password: f.password, // asumir ya validado
  roleId: Number(f.roleId),
  description: f.description.trim(),
  name: f.name.trim(),
  lastName: f.lastName.trim(),
  phone: f.phone.trim(),
  isSuperAdmin: !!f.isSuperAdmin,
  receiveNewsletter: !!f.receiveNewsletter,
  receiveNotifications: !!f.receiveNotifications,
  idTrainingCenter: Number(f.idTrainingCenter),
  trainingCenterName: f.trainingCenterName.trim(),
});

// Permisos (estructura local; todavía no se envía al backend)
export interface PermissionMatrix {
  [moduleKey: string]: {
    [actionKey: string]: boolean;
  };
}

export interface ModulePermissionDefinition {
  moduleKey: string;
  label: string;
  actions: {
    actionKey: string;
    label: string;
    active: boolean;
    selected?: boolean;
  }[];
  noConfig?: boolean;
}

export const MODULE_PERMISSIONS: ModulePermissionDefinition[] = [
  {
    moduleKey: "myAccount",
    label: "Estadísticas",
    actions: [{ actionKey: "view", label: "Consultar", active: true }],
  },
  {
    moduleKey: "audit",
    label: "Auditoría",
    actions: [{ actionKey: "view", label: "Consultar", active: true }],
  },
  {
    moduleKey: "inventory",
    label: "Inventario",
    actions: [
      { actionKey: "view", label: "Consultar", active: true },
      { actionKey: "edit", label: "Editar", active: true },
      { actionKey: "delete", label: "Eliminar", active: true },
      // { actionKey: "createAppointments", label: "Creación de Citas", active: true },
      // { actionKey: "sales", label: "Ventas", active: true },
    ],
  },
  {
    moduleKey: "newService",
    label: "Nuevo Servicio",
    actions: [
      { actionKey: "sales", label: "Venta de Productos", active: true },
      {
        actionKey: "medicalAppointment",
        label: "Agendar Cita Médica",
        active: true,
      },
      // { actionKey: "edit", label: "Editar", active: true },
      // { actionKey: "createAppointments", label: "Creación de Citas", active: true },
      // { actionKey: "sales", label: "Ventas", active: true },
    ],
  },
  {
    moduleKey: "medicalAppointments",
    label: "Citas Médicas",
    actions: [
      { actionKey: "view", label: "Consultar", active: true },
      { actionKey: "edit", label: "Editar", active: true },
    ],
  },
  {
    moduleKey: "doctors",
    label: "Doctores",
    actions: [
      { actionKey: "view", label: "Consultar", active: true },
      { actionKey: "edit", label: "Editar", active: true },
    ],
  },
  {
    moduleKey: "clients",
    label: "Clientes",
    actions: [
      { actionKey: "view", label: "Consultar", active: true },
      { actionKey: "edit", label: "Editar", active: true },
    ],
  },
  {
    moduleKey: "productReplenishment",
    label: "Reposición de Productos",
    actions: [{ actionKey: "create", label: "Creación", active: true }],
  },
  {
    moduleKey: "reports",
    label: "Reportes",
    actions: [
      { actionKey: "view", label: "Consultar", active: true },
      { actionKey: "edit", label: "Edición", active: true },
    ],
  },
  {
    moduleKey: "billing",
    label: "Ventas",
    actions: [{ actionKey: "view", label: "Consulta", active: true }],
  },
  {
    moduleKey: "profile",
    label: "Perfil",
    actions: [],
    noConfig: true,
  },
  {
    moduleKey: "configuration",
    label: "Configuración",
    actions: [
      { actionKey: "products", label: "Productos", active: true },
      { actionKey: "categories", label: "Categorias", active: true },
      { actionKey: "subcategories", label: "Subcategorias", active: true },
      { actionKey: "users", label: "Usuarios", active: true },
      { actionKey: "roles", label: "Roles", active: true },
    ],
  },
];
