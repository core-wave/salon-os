import { salonCore } from "@/lib/core";
import { notFound } from "next/navigation";
import { BookingForm } from "./booking-form";

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ orgSlug: string; locationSlug: string }>;
}) {
  const { orgSlug, locationSlug } = await params;

  const location = await salonCore.getPublicLocation(orgSlug, locationSlug);

  if (!location) {
    notFound();
  }

  const appointmentTypes = (await location.listAppointmentTypes()).filter(
    (t) => t.isActive,
  );

  if (appointmentTypes.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">No services available</h1>
          <p className="text-foreground-500">
            This location is not accepting online bookings at the moment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">{location.data.name}</h1>
        <p className="text-foreground-500 text-sm">
          {location.data.formattedAddress}
        </p>
      </header>

      <BookingForm
        orgSlug={orgSlug}
        locationSlug={locationSlug}
        appointmentTypes={appointmentTypes}
      />
    </main>
  );
}
