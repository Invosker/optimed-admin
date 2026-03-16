export interface Client {
  createdBy: number
  updatedBy: number
  createdAt: string
  updatedAt: string
  id: number
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  identification: string
  identificationType: string
  address: string
  dateOfBirth: string
  isActive: boolean
  description: string
  status: number
  typeUser: number
  roleId: number
  role: Role
}

export interface Role {
  id: number
  roleName: string
  permissions: string
  active: boolean
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  identification: string;
  identificationType: string;
  address?: string;
  description?: string;
  dateOfBirth?: string;
}
