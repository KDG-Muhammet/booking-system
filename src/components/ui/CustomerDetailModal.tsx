import Modal from "./Modal";
import type { Customer } from "../../types/customer";
import type { Appointment } from "../../types/appointment";
import type { Service } from "../../types/service";

interface CustomerDetailModalProps {
  customer: Customer;
  appointments: Appointment[];
  services: Service[];
  onClose: () => void;
}

function CustomerDetailModal({
  customer,
  appointments,
  services,
  onClose,
}: CustomerDetailModalProps) {
  const customerAppointments = appointments
    .filter(
      (appointment) =>
        appointment.customer.trim().toLowerCase() ===
        customer.name.trim().toLowerCase(),
    )
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  const initials = customer.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Modal isOpen={true} onClose={onClose} title="Klantgegevens">
      <div className="space-y-6">
        {/* Klantgegevens */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 text-lg font-bold text-blue-700">
            {initials}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">
              Klant sinds{" "}
              {customer.createdAt
                ? new Date(
                    `${customer.createdAt.slice(0, 10)}T00:00:00`,
                  ).toLocaleDateString("nl-BE")
                : "onbekend"}
            </p>
          </div>
        </div>

        {/* Contactgegevens */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              E-mailadres
            </p>
            <p className="mt-2 break-words text-sm font-semibold text-gray-900">
              {customer.email || "Niet ingevuld"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Telefoonnummer
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {customer.phone || "Niet ingevuld"}
            </p>
          </div>
        </div>

        {/* Notities */}
        <div>
          <h4 className="font-semibold text-gray-900">Notities</h4>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
            {customer.notes?.trim() || "Geen notities toegevoegd."}
          </p>
        </div>

        {/* Afspraken */}
        <div>
          <h4 className="font-semibold text-gray-900">
            Afspraken van deze klant
          </h4>

          {customerAppointments.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              Deze klant heeft nog geen afspraken.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {customerAppointments.map((appointment) => {
                const service = services.find(
                  (item) => item.id === appointment.serviceId,
                );

                return (
                  <div
                    key={appointment.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {service?.name ?? "Onbekende dienst"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(
                            `${appointment.date}T00:00:00`,
                          ).toLocaleDateString("nl-BE")}{" "}
                          om {appointment.time}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Sluiten
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CustomerDetailModal;
