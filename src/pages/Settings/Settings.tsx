import { useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import BusinessSettingsForm from "../../components/forms/BusinessSettingsForm";
import OpeningHoursForm from "../../components/forms/OpeningHoursForm";
import NotificationsForm from "../../components/forms/NotificationsForm";
import AccountSettingsForm from "../../components/forms/AccountSettingsForm";

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
          {activeSection === "notifications" && <NotificationsForm />}
          {activeSection === "account" && <AccountSettingsForm />}
        </div>
      </div>
    </div>
  );
}

export default Settings;
