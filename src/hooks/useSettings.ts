import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings moet binnen een SettingsProvider gebruikt worden."
    );
  }

  return context;
}