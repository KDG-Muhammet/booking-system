export interface Appointment {
  id: number;
  customerId: number;
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
  status: string;
}