import { useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";
import Modal from "../../components/ui/Modal";
import NewCustomerForm from "../../components/ui/NewCustomerForm";
import type { Customer } from "../../types/customer";
import { useAppointments } from "../../hooks/useAppointments";
import { useServices } from "../../hooks/useServices";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import CustomerDetailModal from "../../components/ui/CustomerDetailModal";

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
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

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
      const valueA =
        sortBy === "name"
          ? a.name.toLowerCase()
          : new Date(a.createdAt).getTime();

      const valueB =
        sortBy === "name"
          ? b.name.toLowerCase()
          : new Date(b.createdAt).getTime();

      return sortOrder === "asc"
        ? valueA > valueB
          ? 1
          : valueA < valueB
            ? -1
            : 0
        : valueA < valueB
          ? 1
          : valueA > valueB
            ? -1
            : 0;
    });

  const handleSort = (column: "name" | "createdAt") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

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
                  <th className="px-6 py-4 text-left font-semibold">
                    <button
                      type="button"
                      onClick={() => handleSort("name")}
                      className="inline-flex items-center gap-2 hover:text-blue-600"
                    >
                      Klant
                      <span className="text-blue-600 text-base">
                        {sortBy === "name"
                          ? sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>

                  <th className="px-6 py-4 font-semibold">E-mailadres</th>

                  <th className="px-6 py-4 font-semibold">Telefoon</th>

                  <th className="px-6 py-4 text-left font-semibold">
                    <button
                      type="button"
                      onClick={() => handleSort("createdAt")}
                      className="inline-flex items-center gap-2 hover:text-blue-600"
                    >
                      Toegevoegd op
                      <span className="text-blue-600 text-base">
                        {sortBy === "createdAt"
                          ? sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>

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
      <ConfirmDeleteModal
        isOpen={customerToDelete !== null}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          if (customerToDelete) {
            deleteCustomer(customerToDelete.id);
            setCustomerToDelete(null);
          }
        }}
        itemName={customerToDelete?.name ?? "onbekend"}
        itemType="Klant"
      />
      {/* detail Customer Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          appointments={appointments}
          services={services}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

export default Customers;
