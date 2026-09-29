import { useForm, SubmitHandler } from "react-hook-form";

type FormFields = {
  Klant: string;
  Dienst: string;
  Datum: string;
  Tijd: string;
  Notities: string;
};

function NewAppointmentForm() {
  // destructure useForm hook to get the register and connect input fields to react hook form
  const { register, handleSubmit } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Customer */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Klant
        </label>

        <input
          {...register("Klant")}
          type="text"
          placeholder="Naam van de klant"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Service */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Dienst
        </label>

        <select
          {...register("Dienst")}
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
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Datum
          </label>

          <input
            {...register("Datum")}
            type="date"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Tijd
          </label>

          <input
            {...register("Tijd")}
            type="time"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
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
          {...register("Notities")}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuleren
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Afspraak opslaan
        </button>
      </div>
    </form>
  );
}

export default NewAppointmentForm;
