import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

interface NewAppointmentFormProps {
  onClose: () => void;
}

const schema = z.object({
  customerName: z.string().min(1, { message: "Klant is verplicht" }),
  service: z.string().min(1, { message: "Dienst is verplicht" }),
  date: z.string().min(1, { message: "Datum is verplicht" }),
  time: z.string().min(1, { message: "Tijd is verplicht" }),
  notes: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

function NewAppointmentForm({ onClose }: NewAppointmentFormProps) {
  // destructure useForm hook to get the register and connect input fields to react hook form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      customerName: "",
      service: "",
      date: "",
      time: "",
      notes: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      onClose();
    } catch (error) {
      setError("root", {
        message: "Er is een fout opgetreden" + error,
      });
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      {/* Customer */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Klant
        </label>

        <input
          {...register("customerName")}
          type="text"
          placeholder="Naam van de klant"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <div className="h-2">
          {errors.customerName && (
            <p className="text-sm text-red-500">
              {errors.customerName.message}
            </p>
          )}
        </div>
      </div>

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

          <option value="1">Knipbeurt - €25</option>
          <option value="2">Consultatie - €40</option>
          <option value="3">Baard + Knipbeurt - €35</option>
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
          {isSubmitting ? "Bezig met opslaan..." : "Afspraken maken"}
        </button>
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
      </div>
    </form>
  );
}

export default NewAppointmentForm;
