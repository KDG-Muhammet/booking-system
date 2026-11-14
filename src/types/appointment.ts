export const AppointmentStatus = {
  Pending: "In afwachting",
  Confirmed: "Bevestigd",
  Completed: "Voltooid",
  Cancelled: "Geannuleerd",
  NoShow: "Niet komen opdagen",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];


export interface Appointment {
  id: number;
  customerId: number;
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
}