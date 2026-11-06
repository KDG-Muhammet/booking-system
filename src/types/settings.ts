export interface BusinessSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

export interface OpeningDay {
  day: string;
  enabled: boolean;
  openTime: string;
  closeTime: string;
}

export interface OpeningHoursSettings {
  days: OpeningDay[];
}

export interface NotificationSettings {
  newAppointment: boolean;
  updatedAppointment: boolean;
  cancelledAppointment: boolean;
  appointmentReminder: boolean;
  emailNotifications: boolean;
}