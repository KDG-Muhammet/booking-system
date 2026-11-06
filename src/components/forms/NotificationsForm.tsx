import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings } from "../../hooks/useSettings";

const notificationSchema = z.object({
  newAppointment: z.boolean(),
  updatedAppointment: z.boolean(),
  cancelledAppointment: z.boolean(),
  appointmentReminder: z.boolean(),
  emailNotifications: z.boolean(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

function NotificationsForm() {
  const { notifications, updateNotifications } = useSettings();

  const { register, handleSubmit, reset } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: notifications,
  });

  useEffect(() => {
    reset(notifications);
  }, [notifications, reset]);

  const onSubmit = (data: NotificationFormData) => {
    updateNotifications(data);
  };

  const notificationOptions = [
    {
      name: "newAppointment" as const,
      label: "Nieuwe afspraak",
      description:
        "Ontvang een melding wanneer een nieuwe afspraak wordt aangemaakt.",
    },
    {
      name: "updatedAppointment" as const,
      label: "Gewijzigde afspraak",
      description: "Ontvang een melding wanneer een afspraak wordt gewijzigd.",
    },
    {
      name: "cancelledAppointment" as const,
      label: "Geannuleerde afspraak",
      description:
        "Ontvang een melding wanneer een afspraak wordt geannuleerd.",
    },
    {
      name: "appointmentReminder" as const,
      label: "Afspraakherinnering",
      description: "Ontvang een herinnering wanneer een afspraak nadert.",
    },
    {
      name: "emailNotifications" as const,
      label: "E-mailmeldingen",
      description: "Ontvang meldingen via e-mail.",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 border-b border-gray-100 pb-5">
        <h2 className="text-lg font-semibold text-gray-900">Meldingen</h2>
        <p className="mt-1 text-sm text-gray-500">
          Beheer welke meldingen je wilt ontvangen.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {notificationOptions.map((option) => (
          <div
            key={option.name}
            className="flex items-center justify-between gap-4 py-5"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                {option.label}
              </p>
              <p className="mt-1 text-sm text-gray-500">{option.description}</p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                {...register(option.name)}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Wijzigingen opslaan
        </button>
      </div>
    </form>
  );
}

export default NotificationsForm;
