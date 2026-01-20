"use client";

import CancelButton from "@/components/form-fields/cancel-button";
import SubmitButton from "@/components/form-fields/submit-button";
import { updateCustomer } from "@/lib/customers/functions";
import { SelectCustomer } from "@/lib/db/types";
import { clientEnv } from "@/lib/env/client";
import {
  Button,
  ErrorMessage,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function UpdateCustomerForm({
  organizationSlug,
  customer,
}: {
  organizationSlug: string;
  customer: SelectCustomer;
}) {
  const formAction = updateCustomer.bind(null, organizationSlug, customer.id);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
    fieldValues: {
      ...customer,
      phone: customer.phone ?? "",
      notes: customer.notes ?? "",
    },
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      toast("Customer updated", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
        indicator: <Icon icon="tabler:check" />,
      });

      close();
      router.refresh();
    }

    if (state.status === "error") {
      toast.danger("Error updating customer", {
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
              <Modal.Heading>Update Customer</Modal.Heading>
              <p className="text-sm leading-5 text-muted">
                Enter the details to update this customer
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
                  <Input placeholder="Alex Johnson" />
                  {state.status === "error" && state.fieldErrors?.name && (
                    <ErrorMessage>
                      {state.fieldErrors.name.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField
                  variant="secondary"
                  name="email"
                  defaultValue={state.fieldValues?.email}
                >
                  <Label>Email</Label>
                  <Input placeholder="alex@example.com" />
                  {state.status === "error" && state.fieldErrors?.email && (
                    <ErrorMessage>
                      {state.fieldErrors.email.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField
                  variant="secondary"
                  name="phone"
                  defaultValue={state.fieldValues?.phone}
                >
                  <Label>Phone</Label>
                  <Input placeholder="+1 555 123 4567" />
                  {state.status === "error" && state.fieldErrors?.phone && (
                    <ErrorMessage>
                      {state.fieldErrors.phone.errors[0]}
                    </ErrorMessage>
                  )}
                </TextField>

                <TextField
                  variant="secondary"
                  name="notes"
                  defaultValue={state.fieldValues?.notes}
                >
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
