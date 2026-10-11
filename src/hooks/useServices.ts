import { useContext } from "react";
import { ServiceContext } from "../context/ServiceContext";

export function useServices() {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error("useServices moet binnen ServiceProvider gebruikt worden");
  }

  return context;
}
