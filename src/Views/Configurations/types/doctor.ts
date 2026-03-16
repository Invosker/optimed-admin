export interface DoctorApiPayload {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  identification: string;
  identificationType: string;
  status?: number;
}

export interface DoctorFormValues {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  specialty: string;
  identification: string; 
  identificationType: string;
}

export interface Doctor extends DoctorApiPayload {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: number;
}

export const mapDoctorFormToApi = (
  form: DoctorFormValues
): DoctorApiPayload => ({
  email: form.email.trim(),
  name: form.name.trim(),
  lastName: form.lastName.trim(),
  phone: form.phone.trim(),
  licenseNumber: form.licenseNumber.trim(),
  specialty: form.specialty.trim(),
  identification: form.identification.trim(),
  identificationType: form.identificationType.trim(),
});
