import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomers } from "../../hooks/useCustomers";
import type { Customer } from "../../types/customer";

interface NewCustomerFormProps {
  onClose: () => void;
}

const schema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht"),
  email: z.email(),
  phone: z.string().trim().min(1, "Telefoonnummer is verplicht"),
  notes: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

function NewCustomerForm({ onClose }: NewCustomerFormProps) {
  const { addCustomer } = useCustomers();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const customer: Customer = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };
      addCustomer(customer);
      onClose();
    } catch (error) {
      setError("root", {
        message: "Er is een fout opgetreden" + error,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Naam */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Naam
        </label>
        <input
          {...register("name")}
          placeholder="Naam van de klant"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="h-2">
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
      </div>

      {/* E-mailadres */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          E-mailadres
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="klant@voorbeeld.be"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <div className="h-2">
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Telefoonnummer */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Telefoonnummer
        </label>
        <input
          type="tel"
          {...register("phone")}
          placeholder="+32 ..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <div className="h-2">
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Notities */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Notities (optioneel)
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Extra informatie over de klant..."
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Acties */}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Annuleren
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Bezig met opslaan..." : "Klant toevoegen"}
        </button>
      </div>
    </form>
  );
}

export default NewCustomerForm;
