function Dashboard() {
  const appointments = [
    {
      time: "09:00",
      customer: "Jan Janssens",
      service: "Knipbeurt",
      status: "Bevestigd",
    },
    {
      time: "10:30",
      customer: "Sarah Peeters",
      service: "Consultatie",
      status: "Bevestigd",
    },
    {
      time: "13:00",
      customer: "Mohamed Ali",
      service: "Baard + Knipbeurt",
      status: "In afwachting",
    },
    {
      time: "15:30",
      customer: "Emma De Smet",
      service: "Knipbeurt",
      status: "Bevestigd",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goedemorgen 👋</h1>

          <p className="mt-1 text-sm text-gray-500">
            Hier is een overzicht van je afspraken.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          + Nieuwe afspraak
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Afspraken vandaag</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">8</p>

          <p className="mt-2 text-xs text-green-600">
            ↑ 12% tegenover vorige week
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Klanten</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">124</p>

          <p className="mt-2 text-xs text-green-600">+8 deze maand</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Diensten</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">6</p>

          <p className="mt-2 text-xs text-gray-500">Actieve diensten</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Omzet deze maand</p>

          <p className="mt-2 text-3xl font-bold text-gray-900">€2.840</p>

          <p className="mt-2 text-xs text-green-600">
            ↑ 8% tegenover vorige maand
          </p>
        </div>
      </div>

      {/* Appointments */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">Afspraken vandaag</h2>

            <p className="mt-1 text-xs text-gray-500">
              Maandag 27 september 2026
            </p>
          </div>

          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Alle afspraken →
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {appointments.map((appointment) => (
            <div
              key={`${appointment.time}-${appointment.customer}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-5">
                <div className="w-16">
                  <p className="font-semibold text-gray-900">
                    {appointment.time}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.customer}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {appointment.service}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  appointment.status === "Bevestigd"
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between px-6 pb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Afspraken vandaag</h2>

            <p className="mt-1 text-xs text-gray-500">
              Maandag 27 september 2026
            </p>
          </div>

          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Alle afspraken →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {appointments.map((appointment) => (
            <div
              key={`${appointment.time}-${appointment.customer}`}
              className="items-center justify-between px-6 py-4 hover:bg-gray-100 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.customer}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {appointment.service}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    appointment.status === "Bevestigd"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="bg-gray-300 rounded-lg px-6 py-4 ">
                <p className="font-semibold text-gray-900">
                  {appointment.time}
                </p>
              </div>
              <button className="mt-4 w-full rounded-lg bg-blue-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
