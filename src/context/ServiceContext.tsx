import { createContext, useState, type ReactNode } from "react";

import { services as initialServices } from "../services/serviceData";
import type { Service } from "../types/service";

interface ServiceContextType {
  services: Service[];
  addService: (service: Service) => void;
  toggleServiceStatus: (id: number) => void;
  updateService: (updatedService: Service) => void;
}

export const ServiceContext = createContext<ServiceContextType | undefined>(
  undefined,
);

interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const [services, setServices] = useState<Service[]>(initialServices);

  const addService = (service: Service) => {
    setServices((currentServices) => [...currentServices, service]);
  };

  const toggleServiceStatus = (id: number) => {
    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service,
      ),
    );
  };

  const updateService = (updatedService: Service) => {
    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === updatedService.id ? updatedService : service,
      ),
    );
  };

  return (
    <ServiceContext.Provider
      value={{ services, addService, toggleServiceStatus, updateService }}
    >
      {children}
    </ServiceContext.Provider>
  );
}
