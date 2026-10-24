import { useState } from "react";
import Modal from "../../components/ui/Modal";
import NewAppointmentForm from "../../components/ui/NewAppointmentForm";
import { useServices } from "../../hooks/useServices";
import { useAppointments } from "../../hooks/useAppointments";
import type { Appointment } from "../../types/appointment";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const { services } = useServices();
  const { appointments, updateAppointment } = useAppointments();

  const now = new Date();
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments
    .filter((appointment) => appointment.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  const todayAppointmentCount = todayAppointments.length;

  const activeServices = services.filter((service) => service.active);
  const activeServiceCount = activeServices.length;

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointmentToEdit, setAppointmentToEdit] =
    useState<Appointment | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goedemorgen 👋</h1>

          <p className="mt-1 text-sm text-gray-500">
            Hier is een overzicht van je afspraken.
          </p>
        </div>

        <button
          onClick={() => {
            setAppointmentToEdit(null);
            setIsModalOpen(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Nieuwe afspraak
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Afspraken vandaag</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {todayAppointmentCount}
          </p>

          <p className="mt-2 text-xs text-green-600">
            ↑ 12% tegenover vorige week
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Klanten</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">124</p>

          <p className="mt-2 text-xs text-green-600">+8 deze maand</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Diensten</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {activeServiceCount}
          </p>

          <p className="mt-2 text-xs text-gray-500">Actieve diensten</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Omzet deze maand</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">€2.840</p>

          <p className="mt-2 text-xs text-green-600">
            ↑ 8% tegenover vorige maand
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between px-6 pb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Afspraken vandaag</h2>

            <p className="mt-1 text-xs text-gray-500">
              {now.toLocaleDateString("nl-BE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Lijst
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Kaarten
            </button>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Alle afspraken →
          </button>
        </div>

        {viewMode === "list" && (
          <div className="rounded-xl border border-gray-200">
            <div className="divide-y divide-gray-100">
              {todayAppointments.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-gray-500">
                  Er zijn vandaag geen afspraken gepland.
                </p>
              ) : (
                todayAppointments.map((appointment) => (
                  <div
                    key={`${appointment.time}-${appointment.customer}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16">
                        <p className="font-semibold text-gray-900">
                          {appointment.time}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.customer}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {
                            services.find((s) => s.id === appointment.serviceId)
                              ?.name
                          }
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        appointment.status === "Bevestigd"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {viewMode === "grid" && (
          <div className="">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {appointments.map((appointment) => (
                <div
                  key={`${appointment.time}-${appointment.customer}`}
                  className="group rounded-xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/70 to-violet-50/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-blue-100/70"
                >
                  {/* Klant, dienst en status */}
                  <div className="flex items-start justify-between gap-3 pb-5">
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-slate-800">
                        {appointment.customer}
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-violet-700">
                        {
                          services.find((s) => s.id === appointment.serviceId)
                            ?.name
                        }
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                        appointment.status === "Bevestigd"
                          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                          : appointment.status === "Geannuleerd"
                            ? "border-rose-200 bg-rose-100 text-rose-800"
                            : "border-amber-200 bg-amber-100 text-amber-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  {/* Uur en duur */}
                  <div className="grid grid-cols-2 divide-x divide-indigo-200 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-100/80 to-sky-100/80 text-center py-4">
                    <div className="">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                        Tijd
                      </p>
                      <p className="mt-1 text-sm font-bold text-indigo-950">
                        {appointment.time}
                      </p>
                    </div>

                    <div className="">
                      <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                        Duur
                      </p>
                      <p className="mt-1 text-sm font-bold text-sky-950">
                        {
                          services.find((s) => s.id === appointment.serviceId)
                            ?.duration
                        }{" "}
                        min
                      </p>
                    </div>
                  </div>

                  {/* Details-knop */}
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(appointment)}
                    className="mt-4 w-full rounded-lg border border-violet-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-blue-300 hover:bg-blue-600 hover:text-white"
                  >
                    Details <span aria-hidden="true">→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Update Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAppointmentToEdit(null);
        }}
        title={appointmentToEdit ? "Afspraak bewerken" : "Nieuwe afspraak"}
      >
        <NewAppointmentForm
          onClose={() => {
            setIsModalOpen(false);
            setAppointmentToEdit(null);
          }}
          appointmentToEdit={appointmentToEdit ?? undefined}
          onAppointmentUpdated={(updatedAppointment) => {
            updateAppointment(updatedAppointment);
            setSelectedAppointment(updatedAppointment);
            setIsModalOpen(false);
            setAppointmentToEdit(null);
          }}
        />
      </Modal>

      {/* details appointment Modal */}
      <Modal
        isOpen={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        title="Afspraakdetails"
      >
        {selectedAppointment && (
          <div className="space-y-5">
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 p-4">
              <p className="text-sm text-gray-500">Klant</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {selectedAppointment.customer}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-sm text-gray-500">Dienst</p>
                <p className="mt-1 font-semibold text-violet-700">
                  {services.find((s) => s.id === selectedAppointment.serviceId)
                    ?.name ?? "Onbekende dienst"}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-sm text-gray-500">Prijs</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {services
                    .find((s) => s.id === selectedAppointment.serviceId)
                    ?.price.toLocaleString("nl-BE", {
                      style: "currency",
                      currency: "EUR",
                    }) ?? "Onbekend"}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-sm text-gray-500">Datum</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(
                    `${selectedAppointment.date}T00:00:00`,
                  ).toLocaleDateString("nl-BE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <p className="text-sm text-gray-500">Uur en duur</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {selectedAppointment.time}
                  {" · "}
                  {services.find((s) => s.id === selectedAppointment.serviceId)
                    ?.duration ?? "?"}{" "}
                  min
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">Status</p>
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-800">
                {selectedAppointment.status}
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-500">Notities</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                {selectedAppointment.notes?.trim() ||
                  "Geen notities toegevoegd."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setAppointmentToEdit(selectedAppointment);
                  setSelectedAppointment(null);
                  setIsModalOpen(true);
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Bewerken
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Sluiten
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Dashboard;
