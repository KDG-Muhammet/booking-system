import { AppointmentStatus, type Appointment } from "../types/appointment";
import type { Service } from "../types/service";

const STEP = 15; // minuten tussen tijdsloten

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export function getAvailableTimeSlots({
  date,
  openTime,
  closeTime,
  duration,
  services,
  appointments,
  ignoreId,
}: {
  date: string;
  openTime: string;
  closeTime: string;
  duration: number;
  services: Service[];
  appointments: Appointment[];
  ignoreId?: number;
}): string[] {
  const durations = new Map(services.map((s) => [s.id, s.duration]));

  // Bezette blokken als [start, einde] in minuten
  const busy = appointments
    .filter(
      (a) =>
        a.id !== ignoreId &&
        a.date === date &&
        a.status !== AppointmentStatus.Cancelled &&
        durations.has(a.serviceId),
    )
    .map((a) => {
      const start = toMinutes(a.time);
      return [start, start + durations.get(a.serviceId)!];
    });

  const slots: string[] = [];
  const close = toMinutes(closeTime);

  for (
    let start = toMinutes(openTime);
    start + duration <= close;
    start += STEP
  ) {
    const isFree = !busy.some(([s, e]) => start < e && start + duration > s);
    if (isFree) slots.push(toTime(start));
  }

  return slots;
}
