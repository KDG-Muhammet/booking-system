import { useContext } from "react";
import { CustomerContext } from "../context/CustomerContext";

export function useCustomers() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error(
      "useCustomers moet binnen een CustomerProvider gebruikt worden"
    );
  }

  return context;
}