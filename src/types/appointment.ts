export interface Appointment {
  id: number;
  customer: string;
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
  status: string;
}