import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings } from "../../hooks/useSettings";

const businessSettingsSchema = z.object({
  name: z.string().min(2, "Bedrijfsnaam is verplicht"),
  email: z.email(),
  phone: z.string().min(1, "Telefoonnummer is verplicht"),
  address: z.string().min(1, "Adres is verplicht"),
  website: z.string(),
});

type BusinessSettingsFormFields = z.infer<typeof businessSettingsSchema>;

function BusinessSettingsForm() {
  const { businessSettings, updateBusinessSettings } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BusinessSettingsFormFields>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: businessSettings,
  });

  useEffect(() => {
    reset(businessSettings);
  }, [businessSettings, reset]);

  const onSubmit: SubmitHandler<BusinessSettingsFormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateBusinessSettings(data);
    } catch (error) {
      setError("root", {
        message: "Er is een fout opgetreden" + error,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 border-b border-gray-100 pb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Bedrijfsgegevens
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Beheer de algemene informatie van je bedrijf.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bedrijfsnaam
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Bijv. Barber Studio"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="h-2">
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            E-mailadres
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="info@bedrijf.be"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="h-2">
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Telefoonnummer
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+32 4XX XX XX XX"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="h-2">
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Adres
          </label>
          <input
            {...register("address")}
            type="text"
            placeholder="Straat en huisnummer"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="h-2">
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Website{" "}
            <span className="font-normal text-gray-400">(optioneel)</span>
          </label>
          <input
            {...register("website")}
            type="url"
            placeholder="https://www.bedrijf.be"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Opslaan..." : "Wijzigingen opslaan"}
        </button>
      </div>
    </form>
  );
}

export default BusinessSettingsForm;
