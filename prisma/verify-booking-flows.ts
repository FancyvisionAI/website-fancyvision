import "dotenv/config";

import { ContentStatus, PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const appointmentEmail = "codex.verify.appointment@fancyvision.test";
const registrationEmail = "codex.verify.event@fancyvision.test";

async function main() {
  const event = await db.event.findFirst({
    where: { status: ContentStatus.PUBLISHED, startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
  });
  if (!event)
    throw new Error("No upcoming event is available for verification.");

  const preferredDate = new Date(Date.now() + 2 * 86_400_000);
  preferredDate.setHours(14, 0, 0, 0);

  const appointmentResponse = await fetch(
    "http://127.0.0.1:3000/api/appointments",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Codex Appointment Check",
        email: appointmentEmail,
        phone: "+33 6 00 00 00 00",
        topic: "Appel découverte",
        preferredDate: preferredDate.toISOString(),
        website: "",
      }),
    },
  );

  const registrationResponse = await fetch(
    `http://127.0.0.1:3000/api/events/${event.id}/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Codex Event Check",
        email: registrationEmail,
        phone: "+33 6 11 11 11 11",
        website: "",
      }),
    },
  );

  const [appointmentStored, registrationStored] = await Promise.all([
    db.appointment.count({ where: { email: appointmentEmail } }),
    db.eventRegistration.count({
      where: { eventId: event.id, email: registrationEmail },
    }),
  ]);

  console.info(
    JSON.stringify({
      eventCount: await db.event.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      appointmentStatus: appointmentResponse.status,
      registrationStatus: registrationResponse.status,
      appointmentStored,
      registrationStored,
    }),
  );

  if (
    appointmentResponse.status !== 201 ||
    registrationResponse.status !== 201 ||
    appointmentStored !== 1 ||
    registrationStored !== 1
  ) {
    throw new Error("One or more booking flow checks failed.");
  }
}

main().finally(async () => {
  await Promise.all([
    db.appointment.deleteMany({ where: { email: appointmentEmail } }),
    db.eventRegistration.deleteMany({ where: { email: registrationEmail } }),
  ]);
  await db.$disconnect();
});
