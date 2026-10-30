import { useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";
import Modal from "../../components/ui/Modal";
import NewCustomerForm from "../../components/ui/NewCustomerForm";
import type { Customer } from "../../types/customer";
import { useAppointments } from "../../hooks/useAppointments";
import { useServices } from "../../hooks/useServices";

function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const { services } = useServices();
  const { appointments } = useAppointments();
  const { customers, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCustomers = customers
    .filter((customer) => {
      const search = searchTerm.toLowerCase().trim();

      return (
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name, "nl");
      } else {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klanten</h1>
          <p className="mt-1 text-sm text-gray-500">
            Beheer je klanten en bekijk hun gegevens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setCustomerToEdit(null);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Nieuwe klant
          </button>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-600">Totaal aantal klanten</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {customers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Klantenlijst */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200">
          <div className="px-6 py-5">
            <h2 className="font-semibold text-gray-900">Alle klanten</h2>
            <p className="mt-1 text-sm text-gray-500">
              Een overzicht van alle geregistreerde klanten.
            </p>
          </div>
          <div className=" px-6 py-4">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Zoek op naam, e-mail of telefoon..."
                aria-label="Zoek klanten"
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Sorteren op:
              </span>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "name" | "createdAt")
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="name">Naam</option>
                <option value="createdAt">Datum toegevoegd</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() =>
                setSortOrder((current) => (current === "asc" ? "desc" : "asc"))
              }
              className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:self-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                {sortOrder === "asc" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19V5m-7 7 7-7 7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m-7-7 7 7 7-7"
                  />
                )}
              </svg>

              {sortOrder === "asc" ? "Oplopend" : "Aflopend"}
            </button>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              {customers.length === 0
                ? "Nog geen klanten"
                : "Geen klanten gevonden"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {customers.length === 0
                ? "Je klanten verschijnen hier zodra je ze toevoegt."
                : "Probeer een andere naam, e-mailadres of telefoonnummer."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden ">
            <table className="w-full text-left text-sm table-fixed">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Klant</th>
                  <th className="px-6 py-4 font-semibold">E-mailadres</th>
                  <th className="px-6 py-4 font-semibold">Telefoon</th>
                  <th className="px-6 py-4 font-semibold">Toegevoegd op</th>
                  <th className="px-6 py-4 font-semibold">Afspraken</th>
                  <th className="px-6 py-4 font-semibold">Acties</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-blue-50/40"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 font-semibold text-blue-700">
                          {customer.name
                            .trim()
                            .split(/\s+/)
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {customer.name}
                          </span>

                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(customer)}
                            title="Klantgegevens bekijken"
                            aria-label={`Details bekijken van ${customer.name}`}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition hover:border-blue-400 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <circle cx="12" cy="12" r="9" />
                              <path strokeLinecap="round" d="M12 11v5" />
                              <circle
                                cx="12"
                                cy="8"
                                r=".5"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {customer.email || "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {customer.phone || "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {customer.createdAt
                        ? new Date(
                            `${customer.createdAt.slice(0, 10)}T00:00:00`,
                          ).toLocaleDateString("nl-BE")
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        {
                          appointments.filter(
                            (appointment) =>
                              appointment.customer.trim().toLowerCase() ===
                              customer.name.trim().toLowerCase(),
                          ).length
                        }
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerToEdit(customer);
                            setIsModalOpen(true);
                          }}
                          className=" rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          Bewerken
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(customer)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
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
        )}
      </div>
      {/* Create/Update Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCustomerToEdit(null);
        }}
        title={customerToEdit ? "Klant bewerken" : "Nieuwe klant"}
      >
        <NewCustomerForm
          customerToEdit={customerToEdit ?? undefined}
          onClose={() => {
            setIsModalOpen(false);
            setCustomerToEdit(null);
          }}
        />
      </Modal>
      {/* Delete Customer Modal warning */}
      <Modal
        isOpen={customerToDelete !== null}
        onClose={() => setCustomerToDelete(null)}
        title="Klant verwijderen"
      >
        <div className="space-y-5">
          <p className="text-sm text-gray-600">
            Weet je zeker dat je de klant{" "}
            <span className="font-semibold text-gray-900">
              {customerToDelete?.name}
            </span>{" "}
            wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCustomerToDelete(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Annuleren
            </button>

            <button
              type="button"
              onClick={() => {
                if (customerToDelete) {
                  deleteCustomer(customerToDelete.id);
                  setCustomerToDelete(null);
                }
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Verwijderen
            </button>
          </div>
        </div>
      </Modal>
      {/* detail Customer Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCustomer(null)}
          title="Klantgegevens"
        >
          <div className="space-y-6">
            {/* Klantgegevens */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 text-lg font-bold text-blue-700">
                {selectedCustomer.name
                  .trim()
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedCustomer.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Klant sinds{" "}
                  {selectedCustomer.createdAt
                    ? new Date(
                        `${selectedCustomer.createdAt.slice(0, 10)}T00:00:00`,
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
                  {selectedCustomer.email || "Niet ingevuld"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Telefoonnummer
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {selectedCustomer.phone || "Niet ingevuld"}
                </p>
              </div>
            </div>

            {/* Notities */}
            <div>
              <h4 className="font-semibold text-gray-900">Notities</h4>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                {selectedCustomer.notes?.trim() || "Geen notities toegevoegd."}
              </p>
            </div>

            {/* Afspraken */}
            <div>
              <h4 className="font-semibold text-gray-900">
                Afspraken van deze klant
              </h4>

              {appointments.filter(
                (appointment) =>
                  appointment.customer.trim().toLowerCase() ===
                  selectedCustomer.name.trim().toLowerCase(),
              ).length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  Deze klant heeft nog geen afspraken.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {appointments
                    .filter(
                      (appointment) =>
                        appointment.customer.trim().toLowerCase() ===
                        selectedCustomer.name.trim().toLowerCase(),
                    )
                    .sort((a, b) =>
                      `${b.date}T${b.time}`.localeCompare(
                        `${a.date}T${a.time}`,
                      ),
                    )
                    .map((appointment) => {
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
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Sluiten
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Customers;
