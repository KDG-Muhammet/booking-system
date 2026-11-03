import { useState } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { useServices } from "../../hooks/useServices";
import type { Appointment } from "../../types/appointment";
import Modal from "../../components/ui/Modal";
import NewAppointmentForm from "../../components/ui/NewAppointmentForm";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import { useCustomers } from "../../hooks/useCustomers";

function Appointments() {
  const { appointments, deleteAppointment, updateAppointment } =
    useAppointments();
  const [appointmentToEdit, setAppointmentToEdit] =
    useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);
  const { services } = useServices();
  const { customers } = useCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Afspraken</h1>
        <p className="mt-1 text-sm text-gray-500">
          Beheer en bekijk alle geplande afspraken.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Klant</th>
              <th className="px-6 py-4 font-semibold">Dienst</th>
              <th className="px-6 py-4 font-semibold">Datum</th>
              <th className="px-6 py-4 font-semibold">Tijd</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actie</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Er zijn nog geen afspraken.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {customers.find(
                      (customer) => customer.id === appointment.customerId,
                    )?.name ?? "Onbekende klant"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {services.find((s) => s.id === appointment.serviceId)?.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {appointment.date}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        appointment.status === "Bevestigd"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setAppointmentToEdit(appointment)}
                      className="mb-2 mr-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      Bewerken
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppointmentToDelete(appointment)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={appointmentToEdit !== null}
        onClose={() => setAppointmentToEdit(null)}
        title="Afspraak bewerken"
      >
        {appointmentToEdit && (
          <NewAppointmentForm
            onClose={() => setAppointmentToEdit(null)}
            appointmentToEdit={appointmentToEdit}
            onAppointmentUpdated={updateAppointment}
          />
        )}
      </Modal>
      {/* Delete Appointment Modal warning */}
      <ConfirmDeleteModal
        isOpen={appointmentToDelete !== null}
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={() => {
          if (appointmentToDelete) {
            deleteAppointment(appointmentToDelete.id);
            setAppointmentToDelete(null);
          }
        }}
        itemName={
          customers.find(
            (customer) => customer.id === appointmentToDelete?.customerId,
          )?.name ?? "onbekend"
        }
        itemType="Afspraak"
      />
    </div>
  );
}

export default Appointments;
