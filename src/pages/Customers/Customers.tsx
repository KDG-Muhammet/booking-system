import { useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";
import Modal from "../../components/ui/Modal";
import NewCustomerForm from "../../components/ui/NewCustomerForm";
import type { Customer } from "../../types/customer";

function Customers() {
  const { customers, deleteCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

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
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="font-semibold text-gray-900">Alle klanten</h2>
          <p className="mt-1 text-sm text-gray-500">
            Een overzicht van alle geregistreerde klanten.
          </p>
        </div>

        {customers.length === 0 ? (
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
              Nog geen klanten
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Je klanten verschijnen hier zodra je ze aan je klantenlijst
              toevoegt.
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
                  <th className="px-6 py-4 font-semibold">Acties</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
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
                        <span className=" font-semibold text-gray-900">
                          {customer.name}
                        </span>
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
    </div>
  );
}

export default Customers;
