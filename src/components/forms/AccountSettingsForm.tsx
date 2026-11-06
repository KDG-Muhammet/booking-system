import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const accountSchema = z
  .object({
    username: z.string().min(1, "Gebruikersnaam is verplicht"),
    email: z
      .string()
      .min(1, "E-mailadres is verplicht")
      .email("Ongeldig e-mailadres"),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (!data.newPassword && !data.confirmPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Wachtwoorden komen niet overeen",
      path: ["confirmPassword"],
    },
  );

type AccountFormData = z.infer<typeof accountSchema>;

function AccountSettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: AccountFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 border-b border-gray-100 pb-5">
        <h2 className="text-lg font-semibold text-gray-900">Account</h2>
        <p className="mt-1 text-sm text-gray-500">
          Beheer je accountgegevens en wachtwoord.
        </p>
      </div>

      <div className="space-y-6">
        {/* Accountgegevens */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-800">
            Accountgegevens
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Gebruikersnaam
              </label>
              <input
                type="text"
                {...register("username")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                E-mailadres
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Wachtwoord wijzigen */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">
            Wachtwoord wijzigen
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Huidig wachtwoord
              </label>
              <input
                type="password"
                {...register("currentPassword")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Nieuw wachtwoord
              </label>
              <input
                type="password"
                {...register("newPassword")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Bevestig nieuw wachtwoord
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>
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

export default AccountSettingsForm;
