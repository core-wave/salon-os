"use client";

import { SelectOpeningHour } from "@/lib/db/types";
import { updateOpeningHours } from "@/lib/opening-hours/functions";
import {
  Button,
  Label,
  Modal,
  Spinner,
  Input,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useEffect, useState } from "react";

type Slot = {
  opensAt: string;
  closesAt: string;
};

export default function UpdateOpeningHoursForm({
  locationId,
  dayOfWeek,
  slots,
}: {
  locationId: string;
  dayOfWeek: number;
  slots: SelectOpeningHour[];
}) {
  const formAction = updateOpeningHours.bind(null, locationId, dayOfWeek);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
    fieldValues: { slots },
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  // 👇 UI state for slots
  const [slotsState, setSlotsState] = useState<Slot[]>(slots);

  // Reset UI slots when opening modal or when props change
  useEffect(() => {
    if (isOpen) {
      setSlotsState(slots);
    }
  }, [isOpen, slots]);

  // Close on success
  useEffect(() => {
    if (state.status === "success") {
      close();
    }
  }, [state.status]);

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
              <Modal.Body className="flex flex-col gap-4">
                {slotsState.length > 0 ? (
                  slotsState.map((slot, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div>
                        <Label>Opens</Label>
                        <Input
                          type="time"
                          name={`slots.${idx}.opensAt`}
                          defaultValue={slot.opensAt}
                        />
                      </div>

                      <div>
                        <Label>Closes</Label>
                        <Input
                          type="time"
                          name={`slots.${idx}.closesAt`}
                          defaultValue={slot.closesAt}
                        />
                      </div>

                      <Button
                        variant="danger"
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

                <Button type="button" variant="ghost" onPress={addSlot}>
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
                <Button variant="secondary" onPress={close}>
                  Cancel
                </Button>
                <Button type="submit">
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
