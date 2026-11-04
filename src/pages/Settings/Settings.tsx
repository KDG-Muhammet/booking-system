import { useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import BusinessSettingsForm from "../../components/forms/BusinessSettingsForm";
import OpeningHoursForm from "../../components/forms/OpeningHoursForm";

type SettingsSection =
  | "business"
  | "openingHours"
  | "notifications"
  | "account";

function Settings() {
  const { businessSettings, updateBusinessSettings } = useSettings();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("business");

  const sections = [
    { id: "business", label: "Bedrijfsgegevens" },
    { id: "openingHours", label: "Openingstijden" },
    { id: "notifications", label: "Meldingen" },
    { id: "account", label: "Account" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instellingen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Beheer de instellingen van je bedrijf en account.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Linker menu */}
        <div className="h-fit rounded-xl border border-gray-200 bg-white p-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                activeSection === section.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {section.label}
              <span>›</span>
            </button>
          ))}
        </div>

        {/* Rechter inhoud */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          {activeSection === "business" && <BusinessSettingsForm />}
          {activeSection === "openingHours" && <OpeningHoursForm />}
          {activeSection === "notifications" && (
            <div>
              <div className="mb-6 border-b border-gray-100 pb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Meldingen
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Beheer welke meldingen je wilt ontvangen.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    title: "Nieuwe afspraak",
                    description:
                      "Ontvang een melding wanneer een nieuwe afspraak wordt aangemaakt.",
                  },
                  {
                    title: "Gewijzigde afspraak",
                    description:
                      "Ontvang een melding wanneer een afspraak wordt aangepast.",
                  },
                  {
                    title: "Geannuleerde afspraak",
                    description:
                      "Ontvang een melding wanneer een afspraak wordt geannuleerd.",
                  },
                  {
                    title: "Afspraakherinnering",
                    description:
                      "Ontvang een herinnering voordat een afspraak begint.",
                  },
                  {
                    title: "E-mailmeldingen",
                    description: "Ontvang meldingen via je e-mailadres.",
                  },
                ].map((notification, index) => (
                  <div
                    key={notification.title}
                    className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.description}
                      </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        defaultChecked={index !== 4}
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-blue-600 after:absolute after:left-[3px] after:top-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Wijzigingen opslaan
                </button>
              </div>
            </div>
          )}
          {activeSection === "account" && (
            <div>
              <div className="mb-6 border-b border-gray-100 pb-5">
                <h2 className="text-lg font-semibold text-gray-900">Account</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Beheer je persoonlijke gegevens en wachtwoord.
                </p>
              </div>

              {/* Persoonlijke gegevens */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-gray-800">
                  Persoonlijke gegevens
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Gebruikersnaam
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@bedrijf.be"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Wachtwoord wijzigen */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="mb-5 text-sm font-semibold text-gray-800">
                  Wachtwoord wijzigen
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Huidig wachtwoord
                    </label>
                    <input
                      type="password"
                      placeholder="Huidig wachtwoord"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Nieuw wachtwoord
                    </label>
                    <input
                      type="password"
                      placeholder="Nieuw wachtwoord"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Bevestig nieuw wachtwoord
                    </label>
                    <input
                      type="password"
                      placeholder="Bevestig nieuw wachtwoord"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Wijzigingen opslaan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
