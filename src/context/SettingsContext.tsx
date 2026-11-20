import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type {
  BusinessSettings,
  NotificationSettings,
  OpeningHoursSettings,
} from "../types/settings";

interface SettingsContextType {
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: BusinessSettings) => void;
  openingHours: OpeningHoursSettings;
  updateOpeningHours: (settings: OpeningHoursSettings) => void;
  notifications: NotificationSettings;
  updateNotifications: (settings: NotificationSettings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const defaultOpeningHours: OpeningHoursSettings = {
  days: [
    { day: 1, enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: 2, enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: 3, enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: 4, enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: 5, enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: 6, enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: 0, enabled: false, openTime: "09:00", closeTime: "18:00" },
  ],
};

const defaultNotifications: NotificationSettings = {
  newAppointment: true,
  updatedAppointment: true,
  cancelledAppointment: true,
  appointmentReminder: true,
  emailNotifications: true,
};

interface SettingsProviderProps {
  children: ReactNode;
}

const defaultBusinessSettings: BusinessSettings = {
  name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(
    defaultBusinessSettings,
  );

  const updateBusinessSettings = (settings: BusinessSettings) => {
    setBusinessSettings(settings);
  };

  const [openingHours, setOpeningHours] =
    useState<OpeningHoursSettings>(defaultOpeningHours);

  const updateOpeningHours = (settings: OpeningHoursSettings) => {
    setOpeningHours(settings);
  };

  const [notifications, setNotifications] =
    useState<NotificationSettings>(defaultNotifications);

  const updateNotifications = (settings: NotificationSettings) => {
    setNotifications(settings);
  };
  return (
    <SettingsContext.Provider
      value={{
        businessSettings,
        updateBusinessSettings,
        openingHours,
        updateOpeningHours,
        notifications,
        updateNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
