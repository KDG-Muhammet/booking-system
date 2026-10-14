import { useState } from "react";
import Modal from "../../components/ui/Modal";
import NewServiceForm from "../../components/ui/NewServiceForm";
import { useServices } from "../../hooks/useServices";
import type { Service } from "../../types/service";

function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const openEditServiceForm = (service: Service) => {
    setServiceToEdit(service);
    setIsModalOpen(true);
  };
  const {
    services,
    addService,
    toggleServiceStatus,
    updateService,
    deleteService,
  } = useServices();

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
          onClick={() => {
            setIsModalOpen(true);
            setServiceToEdit(null);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Nieuwe dienst
        </button>
      </div>

      {/* Services */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left table-fixed">
          <thead className="border-b border-gray-200 bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-lg font-semibold text-gray-600">
                Dienst
              </th>

              <th className="px-6 py-4 text-lg font-semibold text-gray-600">
                Duur
              </th>

              <th className="px-6 py-4 text-lg font-semibold text-gray-600">
                Prijs
              </th>

              <th className="px-6 py-4 text-lg font-semibold text-gray-600">
                Status
              </th>

              <th className="px-6 py-4 text-lg font-semibold text-gray-600">
                Actie
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 text-lg font-medium text-gray-900">
                  {service.name}
                </td>

                <td className="px-6 py-4 text-lg text-gray-600">
                  {service.duration} min
                </td>

                <td className="px-6 py-4 text-lg text-gray-600">
                  €{service.price}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-lg font-medium ${
                      service.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.active ? "Actief" : "Inactief"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`w-24 shrink-0 rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
                        service.active
                          ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {service.active ? "Deactiveren" : "Activeren"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditServiceForm(service)}
                      className="w-24 shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      Bewerken
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceToDelete(service)}
                      className="w-24 shrink-0 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                    >
                      Verwijderen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setServiceToEdit(null);
        }}
        title={serviceToEdit ? "Dienst bewerken" : "Nieuwe dienst"}
      >
        <NewServiceForm
          onClose={() => {
            setIsModalOpen(false);
            setServiceToEdit(null);
          }}
          onServiceCreated={addService}
          onServiceUpdated={updateService}
          serviceToEdit={serviceToEdit ?? undefined}
        />
      </Modal>

      <Modal
        isOpen={serviceToDelete !== null}
        onClose={() => setServiceToDelete(null)}
        title="Dienst verwijderen"
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            Weet je zeker dat je de dienst{" "}
            <span className="font-semibold text-gray-900">
              {serviceToDelete?.name}
            </span>{" "}
            wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setServiceToDelete(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Annuleren
            </button>

            <button
              type="button"
              onClick={() => {
                if (serviceToDelete) {
                  deleteService(serviceToDelete.id);
                  setServiceToDelete(null);
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Verwijderen
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Services;
