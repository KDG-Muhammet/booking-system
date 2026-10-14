import { createContext, useState, type ReactNode } from "react";
import type { Appointment } from "../types/appointment";
import { appointments as initialAppointments } from "../services/appointmentData";

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: number) => void;
}

export const AppointmentContext = createContext<
  AppointmentContextType | undefined
>(undefined);

interface AppointmentProviderProps {
  children: ReactNode;
}

export function AppointmentProvider({ children }: AppointmentProviderProps) {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);

  const addAppointment = (appointment: Appointment) => {
    setAppointments((current) => [...current, appointment]);
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? updatedAppointment
          : appointment,
      ),
    );
  };

  const deleteAppointment = (id: number) => {
    setAppointments((current) =>
      current.filter((appointment) => appointment.id !== id),
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}
