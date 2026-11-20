import { useState } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { useServices } from "../../hooks/useServices";
import { useCustomers } from "../../hooks/useCustomers";
import { CalendarDays, Clock } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { appointments } = useAppointments();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { customers } = useCustomers();
  const { services } = useServices();
  const { openingHours } = useSettings();
  const today = new Date();

  const selectedDayOpeningHours = selectedDate
    ? openingHours.days.find((day) => day.day === selectedDate.getDay())
    : undefined;

  const getAppointmentCount = (date: Date) => {
    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return appointments.filter((appointment) => appointment.date === dateString)
      .length;
  };

  const selectedAppointments = appointments.filter((appointment) => {
    if (!selectedDate) return false;

    const appointmentDate = [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, "0"),
      String(selectedDate.getDate()).padStart(2, "0"),
    ].join("-");

    return appointment.date === appointmentDate;
  });

  const months = Array.from({ length: 3 }, (_, index) => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + index,
      1,
    );
  });

  const goToPreviousMonths = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1),
    );
  };

  const goToNextMonths = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 1),
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <CalendarDays size={22} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Afsprakenkalender
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonths}
            className="rounded-lg border border-gray-200 px-2 text-gray-600 transition hover:bg-gray-100"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={goToNextMonths}
            className="rounded-lg border border-gray-200 px-2 text-gray-600 transition hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>
      {/* Three months */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {months.map((month, index) => (
          <div
            key={month.toISOString()}
            className={`rounded-xl border p-3 ${
              index === 0
                ? "border-blue-200 bg-blue-50/70"
                : index === 1
                  ? "border-violet-200 bg-violet-50/70"
                  : "border-emerald-200 bg-emerald-50/70"
            }`}
          >
            <h3 className="mb-3 rounded-lg bg-white/80 px-2 py-2 text-center text-sm font-bold capitalize text-gray-800 shadow-sm">
              {month.toLocaleDateString("nl-BE", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            {/* Weekdays */}
            <div className="mb-2 grid grid-cols-7 text-center">
              {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                <span key={day} className="text-xs font-medium text-gray-400">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {Array.from(
                {
                  length:
                    (new Date(
                      month.getFullYear(),
                      month.getMonth(),
                      1,
                    ).getDay() +
                      6) %
                    7,
                },
                (_, index) => (
                  <div key={`empty-${index}`} />
                ),
              )}

              {Array.from(
                {
                  length: new Date(
                    month.getFullYear(),
                    month.getMonth() + 1,
                    0,
                  ).getDate(),
                },
                (_, index) => {
                  const day = index + 1;

                  const date = new Date(
                    month.getFullYear(),
                    month.getMonth(),
                    day,
                  );

                  // Openingstijden van deze specifieke dag
                  const dayOpeningHours = openingHours.days.find(
                    (openingDay) => openingDay.day === date.getDay(),
                  );

                  const isClosed = dayOpeningHours?.enabled === false;

                  const isSelected =
                    selectedDate?.getFullYear() === date.getFullYear() &&
                    selectedDate?.getMonth() === date.getMonth() &&
                    selectedDate?.getDate() === date.getDate();

                  const isToday =
                    today.getFullYear() === date.getFullYear() &&
                    today.getMonth() === date.getMonth() &&
                    today.getDate() === date.getDate();

                  const appointmentCount = getAppointmentCount(date);
                  const hasAppointments = appointmentCount > 0;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`relative mx-auto flex h-8 w-full items-center justify-center rounded-lg text-xs transition ${
                        isSelected
                          ? "bg-blue-600 font-semibold text-white"
                          : isToday
                            ? "border border-blue-600 bg-emerald-50 font-semibold text-blue-700"
                            : hasAppointments
                              ? "bg-blue-100 font-semibold text-blue-700 hover:bg-blue-200"
                              : isClosed
                                ? "bg-gray-200 font-medium text-gray-500 hover:bg-gray-300"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      <span>{day}</span>

                      {hasAppointments && (
                        <span
                          className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold ${
                            isSelected
                              ? "bg-white text-blue-600"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {appointmentCount}
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Selected day appointments */}
      <div className="pt-3">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          {selectedDate
            ? selectedDate.toLocaleDateString("nl-BE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Selecteer een dag"}
        </h3>
        {selectedDate && selectedDayOpeningHours && (
          <div
            className={`mb-4 flex items-center justify-between rounded-lg border p-3 ${
              selectedDayOpeningHours.enabled
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  selectedDayOpeningHours.enabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <Clock size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Openingstijden
                </p>

                <p className="text-sm text-gray-600">
                  {selectedDayOpeningHours.enabled
                    ? `${selectedDayOpeningHours.openTime} - ${selectedDayOpeningHours.closeTime}`
                    : "Gesloten"}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedDayOpeningHours.enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {selectedDayOpeningHours.enabled ? "Geopend" : "Gesloten"}
            </span>
          </div>
        )}
        {!selectedDate ? (
          <p className="text-sm text-gray-500">
            Klik op een dag in de kalender om de afspraken te bekijken.
          </p>
        ) : selectedAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">
            Er zijn geen afspraken gepland op deze dag.
          </p>
        ) : (
          <div className="space-y-3">
            {selectedAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment) => {
                const customer = customers.find(
                  (customer) => customer.id === appointment.customerId,
                );

                const service = services.find(
                  (service) => service.id === appointment.serviceId,
                );

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 p-3"
                  >
                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                      {appointment.time}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {customer?.name ?? "Onbekende klant"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {service?.name ?? "Onbekende dienst"}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentCalendar;
