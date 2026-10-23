import { useState } from "react";
import type { ReactNode } from "react";
import { createContext } from "react";
import type { Customer } from "../types/customer";

export interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: number) => void;
}

export const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined,
);

interface CustomerProviderProps {
  children: ReactNode;
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );
  };

  const deleteCustomer = (id: number) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
