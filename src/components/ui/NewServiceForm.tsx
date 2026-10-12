import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Service } from "../../types/service";

interface NewServiceFormProps {
  onClose: () => void;
  onServiceCreated: (service: Service) => void;
  serviceToEdit?: Service;
  onServiceUpdated: (service: Service) => void;
}

const schema = z.object({
  name: z.string().min(1, "Naam is verplicht"),
  duration: z.coerce
    .number<number>()
    .min(1, "Duur moet minstens 1 minuut zijn"),
  price: z.coerce.number<number>().min(0, "Prijs mag niet negatief zijn"),
});

type FormFields = z.infer<typeof schema>;

function NewServiceForm({
  onClose,
  onServiceCreated,
  serviceToEdit,
  onServiceUpdated,
}: NewServiceFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: serviceToEdit?.name ?? "",
      duration: serviceToEdit?.duration ?? 30,
      price: serviceToEdit?.price ?? 25,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const serviceData: Service = {
        id: serviceToEdit?.id ?? Date.now(),
        name: data.name,
        duration: data.duration,
        price: data.price,
        active: serviceToEdit?.active ?? true,
      };

      if (serviceToEdit) {
        onServiceUpdated(serviceData);
      } else {
        onServiceCreated(serviceData);
      }
      onClose();
    } catch {
      setError("root", {
        message: "Er is een fout opgetreden.",
      });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Naam van de dienst
        </label>

        <input
          {...register("name")}
          placeholder="Bijv. Knipbeurt"
          className={inputClass}
        />

        <div className="h-2">
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Duur (minuten)
        </label>

        <input
          {...register("duration")}
          type="number"
          min="1"
          className={inputClass}
        />

        <div className="h-2">
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Prijs (€)
        </label>

        <input
          {...register("price")}
          type="number"
          min="0"
          step="0.01"
          className={inputClass}
        />

        <div className="h-2">
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

      {errors.root && (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      )}

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
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Bezig met opslaan..."
            : serviceToEdit
              ? "Wijzigingen opslaan"
              : "Dienst toevoegen"}
        </button>
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
      </div>
    </form>
  );
}

export default NewServiceForm;
