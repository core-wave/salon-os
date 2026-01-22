"use client";

import { SelectAppointmentType } from "@/lib/db/types";
import { getAvailableSlots } from "@/lib/availability/functions";
import { createPublicBooking } from "@/lib/booking/functions";
import { TimeSlot } from "@/lib/availability/types";
import {
  Button,
  Card,
  ErrorMessage,
  Input,
  Label,
  Spinner,
  TextArea,
  TextField,
} from "@heroui/react";
import SubmitButton from "@/components/form-fields/submit-button";
import { Icon } from "@iconify/react";
import { useActionState, useEffect, useState } from "react";

type Step = "service" | "datetime" | "details" | "confirmed";

export function BookingForm({
  orgSlug,
  locationSlug,
  appointmentTypes,
}: {
  orgSlug: string;
  locationSlug: string;
  appointmentTypes: SelectAppointmentType[];
}) {
  const [step, setStep] = useState<Step>("service");
  const [selectedType, setSelectedType] = useState<SelectAppointmentType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const formAction = createPublicBooking.bind(null, orgSlug, locationSlug);
  const [state, action, isSubmitting] = useActionState(formAction, {
    status: "default",
  });

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate || !selectedType) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    setSelectedSlot(null);

    getAvailableSlots(locationSlug, selectedDate, selectedType.id)
      .then(setAvailableSlots)
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedType, locationSlug]);

  // Handle success
  useEffect(() => {
    if (state.status === "success") {
      setStep("confirmed");
    }
  }, [state]);

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const goBack = () => {
    if (step === "datetime") {
      setStep("service");
      setSelectedDate("");
      setSelectedSlot(null);
    } else if (step === "details") {
      setStep("datetime");
    }
  };

  // Step 1: Service Selection
  if (step === "service") {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="font-medium text-foreground-600">Select a service</h2>
        {appointmentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type);
              setStep("datetime");
            }}
            className="w-full text-left p-4 rounded-xl border border-divider hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{type.name}</p>
                {type.description && (
                  <p className="text-sm text-foreground-500 mt-1">
                    {type.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatPrice(type.price, type.currency)}
                </p>
                <p className="text-sm text-foreground-500">
                  {formatDuration(type.durationMinutes)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Step 2: Date & Time Selection
  if (step === "datetime" && selectedType) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-foreground-500 hover:text-foreground w-fit"
        >
          <Icon icon="tabler:arrow-left" className="w-4 h-4" />
          Back
        </button>

        <div className="p-3 rounded-lg bg-content2">
          <p className="font-medium">{selectedType.name}</p>
          <p className="text-sm text-foreground-500">
            {formatDuration(selectedType.durationMinutes)} &middot;{" "}
            {formatPrice(selectedType.price, selectedType.currency)}
          </p>
        </div>

        <div>
          <Label className="mb-2 block">Select a date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full"
          />
        </div>

        {selectedDate && (
          <div>
            <Label className="mb-2 block">Select a time</Label>
            {loadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="text-center py-8 text-foreground-500">
                No available times on this date
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.startsAt}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSlot?.startsAt === slot.startsAt
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-divider hover:border-primary"
                    }`}
                  >
                    {slot.display.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSlot && (
          <Button
            variant="primary"
            className="mt-2"
            onPress={() => setStep("details")}
          >
            Continue
          </Button>
        )}
      </div>
    );
  }

  // Step 3: Customer Details
  if (step === "details" && selectedType && selectedSlot) {
    const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-foreground-500 hover:text-foreground w-fit"
        >
          <Icon icon="tabler:arrow-left" className="w-4 h-4" />
          Back
        </button>

        <div className="p-3 rounded-lg bg-content2">
          <p className="font-medium">{selectedType.name}</p>
          <p className="text-sm text-foreground-500">
            {formattedDate} at {selectedSlot.display.startTime}
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="appointmentTypeId" value={selectedType.id} />
          <input type="hidden" name="startsAt" value={selectedSlot.startsAt} />

          <TextField
            variant="secondary"
            name="customerName"
            isRequired
            autoComplete="name"
          >
            <Label>Name</Label>
            <Input placeholder="Your name" />
            {state.status === "error" && state.fieldErrors?.customerName && (
              <ErrorMessage>
                {state.fieldErrors.customerName.errors[0]}
              </ErrorMessage>
            )}
          </TextField>

          <TextField
            variant="secondary"
            name="customerEmail"
            isRequired
            autoComplete="email"
          >
            <Label>Email</Label>
            <Input type="email" placeholder="your@email.com" />
            {state.status === "error" && state.fieldErrors?.customerEmail && (
              <ErrorMessage>
                {state.fieldErrors.customerEmail.errors[0]}
              </ErrorMessage>
            )}
          </TextField>

          <TextField
            variant="secondary"
            name="customerPhone"
            autoComplete="tel"
          >
            <Label>Phone (optional)</Label>
            <Input type="tel" placeholder="Your phone number" />
          </TextField>

          <TextField variant="secondary" name="notes">
            <Label>Notes (optional)</Label>
            <TextArea placeholder="Anything we should know?" />
          </TextField>

          {state.status === "error" && state.message && (
            <p className="text-danger text-sm">{state.message}</p>
          )}

          <SubmitButton
            variant="primary"
            isLoading={isSubmitting}
            label="Confirm Booking"
            loadingLabel="Booking"
          />
        </form>
      </div>
    );
  }

  // Step 4: Confirmation
  if (step === "confirmed" && selectedType && selectedSlot) {
    const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <Icon icon="tabler:check" className="w-8 h-8 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Booking Confirmed</h2>
          <p className="text-foreground-500 mt-1">
            We&apos;ve sent a confirmation to your email
          </p>
        </div>
        <Card className="w-full p-4 text-left">
          <p className="font-medium">{selectedType.name}</p>
          <p className="text-sm text-foreground-500 mt-1">
            {formattedDate} at {selectedSlot.display.startTime}
          </p>
          <p className="text-sm text-foreground-500">
            {formatDuration(selectedType.durationMinutes)}
          </p>
        </Card>
        <Button
          variant="secondary"
          onPress={() => {
            setStep("service");
            setSelectedType(null);
            setSelectedDate("");
            setSelectedSlot(null);
          }}
        >
          Book another appointment
        </Button>
      </div>
    );
  }

  return null;
}
