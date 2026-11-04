import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { BusinessSettings, OpeningHoursSettings } from "../types/settings";

interface SettingsContextType {
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: BusinessSettings) => void;
  openingHours: OpeningHoursSettings;
  updateOpeningHours: (settings: OpeningHoursSettings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const defaultOpeningHours: OpeningHoursSettings = {
  days: [
    { day: "Maandag", enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Dinsdag", enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Woensdag", enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Donderdag", enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Vrijdag", enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Zaterdag", enabled: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Zondag", enabled: false, openTime: "09:00", closeTime: "18:00" },
  ],
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

  return (
    <SettingsContext.Provider
      value={{
        businessSettings,
        updateBusinessSettings,
        openingHours,
        updateOpeningHours,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
