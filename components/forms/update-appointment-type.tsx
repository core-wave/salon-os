"use client";

import CancelButton from "@/components/form-fields/cancel-button";
import SubmitButton from "@/components/form-fields/submit-button";
import { updateAppointmentType } from "@/lib/appointment-types/functions";
import { SelectAppointmentType } from "@/lib/db/types";
import { clientEnv } from "@/lib/env/client";
import {
  Button,
  ErrorMessage,
  Input,
  Label,
  Modal,
  Switch,
  TextArea,
  TextField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function UpdateAppointmentTypeForm({
  locationSlug,
  appointmentType,
}: {
  locationSlug: string;
  appointmentType: SelectAppointmentType;
}) {
  const formAction = updateAppointmentType.bind(
    null,
    locationSlug,
    appointmentType.id,
  );

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
    fieldValues: {
      ...appointmentType,
      description: appointmentType.description || "",
    },
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      toast("Appointment type updated", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
        indicator: <Icon icon="tabler:check" />,
      });

      close();
      router.refresh();
    }

    if (state.status === "error") {
      toast.danger("Error updating appointment type", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
      });
    }
  }, [state, close, router]);

  return (
    <>
      <Button onPress={open} isIconOnly variant="ghost">
        <Icon icon={`tabler:pencil`} />
      </Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Update Appointment Type</Modal.Heading>
              <p className="text-sm leading-5 text-muted">
                Enter the details to update your appointment type
              </p>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="mt-4 flex flex-col gap-4 overflow-visible">
                <TextField
                  variant="secondary"
                  name="name"
                  defaultValue={state.fieldValues?.name}
                >
                  <Label>Name</Label>
                  <Input placeholder="Men's Haircut" />
                  {state.status === "error" && state.fieldErrors?.name && (
                    <ErrorMessage>
                      {state.fieldErrors.name.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField
                  variant="secondary"
                  name="description"
                  defaultValue={state.fieldValues?.description}
                >
                  <Label>Description</Label>
                  <TextArea placeholder="Men's Haircut" />
                  {state.status === "error" &&
                    state.fieldErrors?.description && (
                      <ErrorMessage>
                        {state.fieldErrors.description.errors[0]}
                      </ErrorMessage>
                    )}
                </TextField>

                <div className="flex gap-4">
                  <TextField
                    variant="secondary"
                    name="durationMinutes"
                    defaultValue={state.fieldValues?.durationMinutes?.toString()}
                    fullWidth
                  >
                    <Label>Duration</Label>
                    <Input placeholder="30" />
                    {state.status === "error" &&
                      state.fieldErrors?.durationMinutes && (
                        <ErrorMessage>
                          {state.fieldErrors.durationMinutes.errors[0]}
                        </ErrorMessage>
                      )}
                  </TextField>

                  <TextField
                    variant="secondary"
                    name="price"
                    defaultValue={state.fieldValues?.price?.toString()}
                    fullWidth
                  >
                    <Label>Price</Label>
                    <Input placeholder="30" />
                    {state.status === "error" && state.fieldErrors?.price && (
                      <ErrorMessage>
                        {state.fieldErrors.price.errors[0]}
                      </ErrorMessage>
                    )}
                  </TextField>
                </div>

                <Switch
                  name="isActive"
                  defaultSelected={state.fieldValues?.isActive}
                >
                  {({ isSelected }) => (
                    <>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Label className="text-sm">
                        {isSelected
                          ? "Available for bookings"
                          : "Not available for bookings"}
                      </Label>
                    </>
                  )}
                </Switch>

                <Input
                  hidden
                  name="currency"
                  defaultValue={state.fieldValues?.currency}
                />
              </Modal.Body>
              <Modal.Footer>
                <CancelButton onCancel={close} />
                <SubmitButton
                  isLoading={isLoading}
                  label="Save"
                  loadingLabel="Saving"
                />
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
