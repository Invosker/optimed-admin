export interface Appointment {
  id: number;
  clientId: number;
  doctorId: number;
  date: string;             // YYYY-MM-DD
  time: string;             // HH:mm
  appointmentType: string;  // ej: "odontologia"
  reason: string;
  status: string;           
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentCreateInput {
  clientId: number;
  doctorId: number;
  date: string;
  time: string;
  appointmentType: string;
  reason: string;
  status: string;
  notes?: string;
}