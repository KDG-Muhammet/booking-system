import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSettings } from "../../hooks/useSettings";

const openingHoursSchema = z
  .object({
    days: z.array(
      z.object({
        day: z.string(),
        enabled: z.boolean(),
        openTime: z.string(),
        closeTime: z.string(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    data.days.forEach((day, index) => {
      if (!day.enabled) return;

      if (!day.openTime) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "openTime"],
          message: "Openingsuur is verplicht",
        });
      }

      if (!day.closeTime) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "closeTime"],
          message: "Sluitingsuur is verplicht",
        });
      }

      if (day.openTime && day.closeTime && day.openTime >= day.closeTime) {
        ctx.addIssue({
          code: "custom",
          path: ["days", index, "closeTime"],
          message: "Sluitingsuur moet na het openingsuur liggen",
        });
      }
    });
  });

type OpeningHoursFormFields = z.infer<typeof openingHoursSchema>;

function OpeningHoursForm() {
  const { openingHours, updateOpeningHours } = useSettings();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OpeningHoursFormFields>({
    resolver: zodResolver(openingHoursSchema),
    defaultValues: openingHours,
  });

  const { fields } = useFieldArray({
    control,
    name: "days",
  });

  useEffect(() => {
    reset(openingHours);
  }, [openingHours, reset]);

  const onSubmit = (data: OpeningHoursFormFields) => {
    updateOpeningHours(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 border-b border-gray-100 pb-5">
        <h2 className="text-lg font-semibold text-gray-900">Openingstijden</h2>
        <p className="mt-1 text-sm text-gray-500">
          Stel in wanneer klanten afspraken kunnen boeken.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-100 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:w-36">
                <input
                  type="checkbox"
                  {...register(`days.${index}.enabled`)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm font-medium text-gray-700">
                  {field.day}
                </span>
              </div>

              <div className="flex flex-1 items-start gap-3">
                <div className="flex-1">
                  <input
                    type="time"
                    {...register(`days.${index}.openTime`)}
                    disabled={!control._getWatch(`days.${index}.enabled`)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  {errors.days?.[index]?.openTime && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.days[index]?.openTime?.message}
                    </p>
                  )}
                </div>

                <span className="pt-2 text-sm text-gray-400">tot</span>

                <div className="flex-1">
                  <input
                    type="time"
                    {...register(`days.${index}.closeTime`)}
                    disabled={!control._getWatch(`days.${index}.enabled`)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  {errors.days?.[index]?.closeTime && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.days[index]?.closeTime?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
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

export default OpeningHoursForm;
