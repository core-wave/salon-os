"use client";

import { createCustomer } from "@/lib/customers/functions";
import {
  Button,
  ErrorMessage,
  Input,
  Label,
  Modal,
  Spinner,
  TextArea,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useEffect } from "react";

export default function CreateCustomerForm({
  organizationSlug,
}: {
  organizationSlug: string;
}) {
  const formAction = createCustomer.bind(null, organizationSlug);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  useEffect(() => {
    if (state.status === "success") {
      close();
    }
  }, [state]);

  return (
    <>
      <Button onPress={open}>
        <Icon icon={`tabler:plus`} />
        New Customer
      </Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>New Customer</Modal.Heading>
              <p className="text-sm leading-5 text-muted">
                Enter the details to add a new customer
              </p>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="mt-4 flex flex-col gap-4 overflow-visible">
                <TextField name="name" defaultValue={state.fieldValues?.name}>
                  <Label>Name</Label>
                  <Input placeholder="Alex Johnson" />
                  {state.status === "error" && state.fieldErrors?.name && (
                    <ErrorMessage>
                      {state.fieldErrors.name.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField name="email" defaultValue={state.fieldValues?.email}>
                  <Label>Email</Label>
                  <Input placeholder="alex@example.com" />
                  {state.status === "error" && state.fieldErrors?.email && (
                    <ErrorMessage>
                      {state.fieldErrors.email.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField name="phone" defaultValue={state.fieldValues?.phone}>
                  <Label>Phone</Label>
                  <Input placeholder="+1 555 123 4567" />
                  {state.status === "error" && state.fieldErrors?.phone && (
                    <ErrorMessage>
                      {state.fieldErrors.phone.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField name="notes" defaultValue={state.fieldValues?.notes}>
                  <Label>Notes</Label>
                  <TextArea placeholder="Allergic to certain products" />
                  {state.status === "error" && state.fieldErrors?.notes && (
                    <ErrorMessage>
                      {state.fieldErrors.notes.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={close} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">
                  {isLoading && <Spinner size="sm" color="current" />}
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
