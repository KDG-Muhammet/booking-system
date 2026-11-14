import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { AppointmentStatus, type Appointment } from "../../types/appointment";
import { useServices } from "../../hooks/useServices";
import { useAppointments } from "../../hooks/useAppointments";
import { useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";
import Modal from "./Modal";
import NewCustomerForm from "./NewCustomerForm";

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

function NewAppointmentForm({
  onClose,
  appointmentToEdit,
  onAppointmentUpdated,
}: NewAppointmentFormProps) {
  const { services } = useServices();
  const { addAppointment } = useAppointments();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const { customers } = useCustomers();

  // destructure useForm hook to get the register and connect input fields to react hook form
  const {
    register,
    handleSubmit,
    setError,
    setValue,
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

        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Klant
        </label>

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
            <select
              {...register("customerId")}
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setValue("customerId", e.target.value);
              }}
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

            <div className="h-2">
              {errors.customerId && (
                <p className="text-sm text-red-500">
                  {errors.customerId.message}
                </p>
              )}
            </div>

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
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Dienst
          </label>

          <select
            {...register("service")}
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
          <div className="h-2">
            {errors.service && (
              <p className="text-sm text-red-500">{errors.service.message}</p>
            )}
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Datum
            </label>

            <input
              {...register("date")}
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <div className="h-2">
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tijd
            </label>

            <input
              {...register("time")}
              type="time"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <div className="h-2">
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Status
          </label>

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

          <div className="h-2">
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Notities
          </label>

          <textarea
            rows={3}
            placeholder="Optionele notities..."
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register("notes")}
          />
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
              setSelectedCustomerId(customer.id.toString());
              setValue("customerId", customer.id.toString());
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default NewAppointmentForm;
