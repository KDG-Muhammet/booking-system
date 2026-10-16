import type { Appointment } from "../types/appointment";

 export const appointments: Appointment[] = [
    {
      id: 1,
      time: "09:00",
      customer: "Jan Janssens",
      serviceId: 2,
      date: "2026-10-16",
      status: "Bevestigd",
    },
    {
      id: 2,
      time: "10:30",
      customer: "Sarah Peeters",
      serviceId: 1,
      date: "2026-10-03",
      status: "Bevestigd",
    },
    {
      id: 3,
      time: "13:00",
      customer: "Mohamed Ali",
      serviceId: 3,
      date: "2026-10-03",
      status: "In afwachting",
    },
    {
      id: 4,
      time: "15:30",
      customer: "Emma De Smet",
      serviceId: 1,
      date: "2026-10-03",
      status: "Bevestigd",
    },
  ];