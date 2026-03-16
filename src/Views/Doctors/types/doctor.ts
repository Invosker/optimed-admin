export interface Doctor {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  active: boolean;
  _raw?: any; // Original raw data from API
}
