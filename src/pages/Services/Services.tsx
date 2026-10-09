import { useState } from "react";
import { services as initialServices } from "../../services/serviceData";
import type { Service } from "../../types/service";

function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diensten</h1>

          <p className="mt-1 text-sm text-gray-500">
            Beheer de diensten die je aanbiedt.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Nieuwe dienst
        </button>
      </div>

      {/* Services */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Dienst
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Duur
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Prijs
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {service.name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {service.duration} min
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  €{service.price}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      service.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.active ? "Actief" : "Inactief"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Temporary form placeholder */}
      {isFormOpen && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            Hier bouwen we het formulier om een nieuwe dienst toe te voegen.
          </p>

          <button
            onClick={() => setIsFormOpen(false)}
            className="mt-3 text-sm font-medium text-blue-700 hover:underline"
          >
            Sluiten
          </button>
        </div>
      )}
    </div>
  );
}

export default Services;
