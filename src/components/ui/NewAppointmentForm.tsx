import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { AppointmentStatus, type Appointment } from "../../types/appointment";
import { useServices } from "../../hooks/useServices";
import { useAppointments } from "../../hooks/useAppointments";
import { useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";
import Modal from "./Modal";
import NewCustomerForm from "./NewCustomerForm";
import { useSettings } from "../../hooks/useSettings";
import type { Service } from "../../types/service";

interface NewAppointmentFormProps {
  onClose: () => void;
  appointmentToEdit?: Appointment;
  onAppointmentUpdated: (appointment: Appointment) => void;
}

const schema = z.object({
  customerId: z.string().min(1, { message: "Klant is verplicht" }),
  service: z.string().min(1, { message: "Dienst is verplicht" }),
  date: z.string().min(1, { message: "Datum is verplicht" }),
  time: z.string().min(1, { message: "Tijd is verplicht" }),
  notes: z.string().optional(),
  status: z.enum(AppointmentStatus),
});

type FormFields = z.infer<typeof schema>;

const STEP = 15; // minuten tussen tijdsloten

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

function getAvailableTimeSlots({
  date,
  openTime,
  closeTime,
  duration,
  services,
  appointments,
  ignoreId,
}: {
  date: string;
  openTime: string;
  closeTime: string;
  duration: number;
  services: Service[];
  appointments: Appointment[];
  ignoreId?: number;
}): string[] {
  const durations = new Map(services.map((s) => [s.id, s.duration]));

  // Bezette blokken als [start, einde] in minuten
  const busy = appointments
    .filter(
      (a) =>
        a.id !== ignoreId &&
        a.date === date &&
        a.status !== AppointmentStatus.Cancelled &&
        durations.has(a.serviceId),
    )
    .map((a) => {
      const start = toMinutes(a.time);
      return [start, start + durations.get(a.serviceId)!];
    });

  const slots: string[] = [];
  const close = toMinutes(closeTime);

  for (
    let start = toMinutes(openTime);
    start + duration <= close;
    start += STEP
  ) {
    const isFree = !busy.some(([s, e]) => start < e && start + duration > s);
    if (isFree) slots.push(toTime(start));
  }

  return slots;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      <div className="min-h-2">
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

function NewAppointmentForm({
  onClose,
  appointmentToEdit,
  onAppointmentUpdated,
}: NewAppointmentFormProps) {
  const { services } = useServices();
  const { appointments, addAppointment } = useAppointments();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const { customers } = useCustomers();
  const { openingHours } = useSettings();

  // destructure useForm hook to get the register and connect input fields to react hook form
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      customerId: appointmentToEdit?.customerId?.toString() ?? "",
      service: appointmentToEdit?.serviceId?.toString() ?? "",
      date: appointmentToEdit?.date ?? "",
      time: appointmentToEdit?.time ?? "",
      notes: appointmentToEdit?.notes ?? "",
      status: appointmentToEdit?.status ?? AppointmentStatus.Pending,
    },
    resolver: zodResolver(schema),
  });

  const selectedDate = useWatch({
    control,
    name: "date",
  });

  const selectedServiceId = useWatch({
    control,
    name: "service",
  });

  const selectedDayOpeningHours = selectedDate
    ? openingHours.days.find(
        (day) => day.day === new Date(`${selectedDate}T00:00:00`).getDay(),
      )
    : undefined;

  const selectedService = services.find(
    (service) => service.id === Number(selectedServiceId),
  );

  const availableTimeSlots =
    selectedDate && selectedDayOpeningHours?.enabled && selectedService
      ? getAvailableTimeSlots({
          date: selectedDate,
          openTime: selectedDayOpeningHours.openTime,
          closeTime: selectedDayOpeningHours.closeTime,
          duration: selectedService.duration,
          services,
          appointments,
          ignoreId: appointmentToEdit?.id,
        })
      : [];

  let timeHint: { text: string; isError: boolean } | null = null;

  if (!selectedDate) {
    timeHint = { text: "Selecteer eerst een datum.", isError: false };
  } else if (!selectedDayOpeningHours?.enabled) {
    timeHint = {
      text: "De zaak is op deze dag gesloten.",
      isError: true,
    };
  } else if (!selectedService) {
    timeHint = { text: "Selecteer eerst een dienst.", isError: false };
  } else if (availableTimeSlots.length === 0) {
    timeHint = {
      text: "Er zijn geen beschikbare tijdstippen voor deze dag.",
      isError: true,
    };
  }

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const appointment: Appointment = {
        id: appointmentToEdit?.id ?? Date.now(),
        customerId: appointmentToEdit?.customerId ?? Number(data.customerId),
        serviceId: Number(data.service),
        date: data.date,
        time: data.time,
        notes: data.notes,
        status: data.status,
      };
      if (appointmentToEdit) {
        onAppointmentUpdated(appointment);
      } else {
        addAppointment(appointment);
      }

      console.log(data);
      onClose();
    } catch (error) {
      setError("root", {
        message: "Er is een fout opgetreden" + error,
      });
    }
  };

  return (
    <>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        {/* Customer */}
        {appointmentToEdit ? (
          <input
            type="text"
            value={
              customers.find(
                (customer) => customer.id === appointmentToEdit.customerId,
              )?.name ?? "Onbekende klant"
            }
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500"
          />
        ) : (
          <div>
            <Field label="Klant" error={errors.customerId?.message}>
              <select
                {...register("customerId")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Selecteer een klant
                </option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </Field>

            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <span>+</span>
              Nieuwe klant toevoegen
            </button>
          </div>
        )}

        {/* Service */}
        <div>
          <Field label="Dienst" error={errors.service?.message}>
            <select
              {...register("service", { onChange: () => setValue("time", "") })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              defaultValue=""
            >
              <option value="" disabled>
                Selecteer een dienst
              </option>

              {services
                .filter((service) => service.active)
                .map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - €{service.price}
                  </option>
                ))}
            </select>
          </Field>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <Field label="Datum" error={errors.date?.message}>
              <input
                {...register("date", { onChange: () => setValue("time", "") })}
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </Field>
          </div>
          {/* Time */}
          <div>
            <Field label="Tijd" error={errors.time?.message}>
              <select
                {...register("time")}
                disabled={!!timeHint}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="" disabled>
                  Selecteer een tijdstip
                </option>

                {appointmentToEdit?.time &&
                  !availableTimeSlots.includes(appointmentToEdit.time) && (
                    <option value={appointmentToEdit.time} disabled>
                      {appointmentToEdit.time} (niet beschikbaar)
                    </option>
                  )}

                {availableTimeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </Field>
            {timeHint && (
              <p
                className={`mt-1 text-xs ${timeHint.isError ? "text-red-500" : "text-gray-500"}`}
              >
                {timeHint.text}
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <Field label="Status" error={errors.status?.message}>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {Object.values(AppointmentStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Notes */}
        <div>
          <Field label="Notities" error={errors.notes?.message}>
            <textarea
              rows={3}
              placeholder="Optionele notities..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("notes")}
            />
          </Field>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Bezig met opslaan..."
              : appointmentToEdit
                ? "Wijzigingen opslaan"
                : "Afspraken maken"}
          </button>
          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}
        </div>
      </form>

      {isCustomerModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCustomerModalOpen(false)}
          title="Nieuwe klant toevoegen"
        >
          <NewCustomerForm
            onClose={() => setIsCustomerModalOpen(false)}
            onCustomerAdded={(customer) => {
              setValue("customerId", customer.id.toString(), {
                shouldValidate: true,
              });
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default NewAppointmentForm;
