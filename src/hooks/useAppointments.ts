import { useContext } from "react";
import { AppointmentContext } from "../context/AppointmentContext";

export function useAppointments() {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error(
      "useAppointments moet binnen AppointmentProvider gebruikt worden"
    );
  }

  return context;
}