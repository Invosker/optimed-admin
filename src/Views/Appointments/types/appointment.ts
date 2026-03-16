export type Appointment = {
  id: number;
  date: string;
  time: string;
  appointmentType: string;
  status: string;
  notes?: string;
  results?: string;
  reason: string;
  clientId: number;
  client?: {
    firstName: string;
    lastName: string;
  };
  doctorId: number;
  doctor?: {
    name: string;
    lastName: string;
  };
};

export type PaginatedAppointments = {
  docs: Appointment[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  prevPage: number;
};

export type UseGetAppointmentsParams = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
};

export type AppointmentUpdateRequest = {
  id: number;
  date: string;
  time: string; // HH:mm
  appointmentType: string;
  status: string;
  notes?: string;
  results?: string;
};

export const APPOINTMENT_TYPE_OPTIONS = [
  { label: "Oftalmología", value: "Oftalmología" },
  { label: "Otorrinolaringología", value: "Otorrinolaringología" },
  { label: "Estudios especiales", value: "Estudios especiales" },
] as const;
