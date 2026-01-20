"use client";

import { SelectOpeningHourSlot } from "@/lib/db/types";
import { updateOpeningHours } from "@/lib/opening-hours/functions";
import { timeStringToTime } from "@/lib/utils";
import {
  Button,
  Label,
  Modal,
  Spinner,
  useOverlayState,
  TimeField,
  DateInputGroup,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useEffect, useMemo, useState } from "react";

type Slot = {
  opensAt: string;
  closesAt: string;
};

export default function UpdateOpeningHoursForm({
  locationSlug,
  dayOfWeek,
  slots,
}: {
  locationSlug: string;
  dayOfWeek: number;
  slots: SelectOpeningHourSlot[];
}) {
  const formAction = updateOpeningHours.bind(null, locationSlug, dayOfWeek);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
    fieldValues: { slots },
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  // 👇 UI state for slots
  const defaultSlots = useMemo(() => slots, [slots]);
  const [slotsState, setSlotsState] = useState<Slot[]>(defaultSlots);

  // Reset UI slots when opening modal or when props change
  useEffect(() => {
    if (isOpen) {
      setSlotsState((state.fieldValues?.slots as Slot[]) ?? defaultSlots);
    }
  }, [isOpen, state.fieldValues?.slots, defaultSlots]);

  // Close on success
  useEffect(() => {
    if (state.status === "success") {
      close();
    }
  }, [state]);

  const addSlot = () => {
    setSlotsState((prev) => [...prev, { opensAt: "09:00", closesAt: "17:00" }]);
  };

  const removeSlot = (index: number) => {
    setSlotsState((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Button isIconOnly variant="ghost" onPress={open}>
        <Icon icon="tabler:pencil" />
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Edit opening hours</Modal.Heading>
            </Modal.Header>

            <form action={action}>
              <Modal.Body className="flex flex-col gap-4 overflow-visible">
                <p className="text-sm text-muted">
                  Add one or more time ranges for this day. Leaving it empty
                  will mark the day as closed.
                </p>

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
                        <DateInputGroup>
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
                        <DateInputGroup>
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

                <Button
                  type="button"
                  variant="ghost"
                  onPress={addSlot}
                  isDisabled={isLoading}
                >
                  <Icon icon="tabler:plus" />
                  Add slot
                </Button>

                {/* Used by the server to know how many slots to read */}
                <input
                  type="hidden"
                  name="slotCount"
                  value={slotsState.length}
                />
              </Modal.Body>

              <Modal.Footer>
                <Button type="button" variant="secondary" onPress={close}>
                  Cancel
                </Button>
                <Button type="submit" isDisabled={isLoading}>
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Icon icon={`tabler:save`} />
                  )}
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
