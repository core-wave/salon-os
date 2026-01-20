"use client";

import CancelButton from "@/components/form-fields/cancel-button";
import SubmitButton from "@/components/form-fields/submit-button";
import { clientEnv } from "@/lib/env/client";
import { upsertOpeningHourException } from "@/lib/opening-hours/functions";
import { timeStringToTime } from "@/lib/utils";
import {
  Button,
  DateInputGroup,
  ErrorMessage,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  TimeField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";

type Slot = {
  opensAt: string;
  closesAt: string;
};

type OpeningHourException = {
  date: string;
  remark: string | null;
  slots: Slot[];
};

export default function UpsertOpeningHourExceptionForm({
  locationSlug,
  exception,
}: {
  locationSlug: string;
  exception?: OpeningHourException;
}) {
  const formAction = upsertOpeningHourException.bind(
    null,
    locationSlug,
    exception?.date ?? null,
  );

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
    fieldValues: {
      date: exception?.date ?? "",
      remark: exception?.remark ?? undefined,
      slots: exception?.slots ?? [],
    },
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  const defaultSlots = useMemo(() => exception?.slots ?? [], [exception]);
  const [slotsState, setSlotsState] = useState<Slot[]>(defaultSlots);

  useEffect(() => {
    if (isOpen) {
      setSlotsState((state.fieldValues?.slots as Slot[]) ?? defaultSlots);
    }
  }, [isOpen, state.fieldValues?.slots, defaultSlots]);

  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      toast("Opening hours exception updated", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
        indicator: <Icon icon="tabler:check" />,
      });

      close();
      router.refresh();
    }

    if (state.status === "error") {
      toast.danger("Error updating opening hours exception", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
      });
    }
  }, [state, close, router]);

  const addSlot = () => {
    setSlotsState((prev) => [...prev, { opensAt: "09:00", closesAt: "17:00" }]);
  };

  const removeSlot = (index: number) => {
    setSlotsState((prev) => prev.filter((_, idx) => idx !== index));
  };

  const isEditing = Boolean(exception);
  const dateValue = state.fieldValues?.date ?? exception?.date ?? "";
  const remarkValue = state.fieldValues?.remark ?? exception?.remark ?? "";

  return (
    <>
      {isEditing ? (
        <Button isIconOnly variant="ghost" onPress={open}>
          <Icon icon="tabler:pencil" />
        </Button>
      ) : (
        <Button onPress={open}>
          <Icon icon="tabler:plus" />
          Add exception
        </Button>
      )}

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>
                {isEditing ? "Update exception" : "Add exception"}
              </Modal.Heading>
              <p className="text-sm text-muted">
                Add special opening hours or mark a date as closed.
              </p>
            </Modal.Header>

            <form action={action}>
              <Modal.Body className="flex flex-col gap-4 overflow-visible">
                <TextField name="date" defaultValue={dateValue}>
                  <Label>Date</Label>
                  <Input type="date" />
                  {state.status === "error" && state.fieldErrors?.date && (
                    <ErrorMessage>
                      {state.fieldErrors.date.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField name="remark" defaultValue={remarkValue}>
                  <Label>Note</Label>
                  <TextArea placeholder="Holiday, special event, etc." />
                  {state.status === "error" && state.fieldErrors?.remark && (
                    <ErrorMessage>
                      {state.fieldErrors.remark.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <div className="flex flex-col gap-3">
                  <Label>Opening hours</Label>

                  {slotsState.length > 0 ? (
                    slotsState.map((slot, idx) => (
                      <div
                        key={idx}
                        className="w-full grid grid-cols-[1fr_1fr_auto] gap-2 items-end"
                      >
                        <TimeField
                          className="w-full"
                          name={`slots.${idx}.opensAt`}
                          defaultValue={timeStringToTime(slot.opensAt)}
                        >
                          <Label>Opens</Label>
                          <DateInputGroup variant="secondary">
                            <DateInputGroup.Input>
                              {(segment) => (
                                <DateInputGroup.Segment segment={segment} />
                              )}
                            </DateInputGroup.Input>
                          </DateInputGroup>
                        </TimeField>
                        <TimeField
                          className="w-full"
                          name={`slots.${idx}.closesAt`}
                          defaultValue={timeStringToTime(slot.closesAt)}
                        >
                          <Label>Closes</Label>
                          <DateInputGroup variant="secondary">
                            <DateInputGroup.Input>
                              {(segment) => (
                                <DateInputGroup.Segment segment={segment} />
                              )}
                            </DateInputGroup.Input>
                          </DateInputGroup>
                        </TimeField>
                        <Button
                          type="button"
                          variant="danger-soft"
                          onPress={() => removeSlot(idx)}
                          isIconOnly
                        >
                          <Icon icon="tabler:trash" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <Label className="text-muted">Closed all day</Label>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onPress={addSlot}
                  isDisabled={isLoading}
                >
                  <Icon icon="tabler:plus" />
                  Add slot
                </Button>

                <input
                  type="hidden"
                  name="slotCount"
                  value={slotsState.length}
                />
              </Modal.Body>

              <Modal.Footer>
                <CancelButton onCancel={close} />
                <SubmitButton
                  isLoading={isLoading}
                  label="Save"
                  loadingLabel="Saving"
                  icon="tabler:save"
                />
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
