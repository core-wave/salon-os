"use client";

import { deleteCustomer } from "@/lib/customers/functions";
import { AlertDialog, Button, Spinner, useOverlayState } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useEffect } from "react";

export default function DeleteCustomerForm({
  locationSlug,
  id,
}: {
  locationSlug: string;
  id: string;
}) {
  const formAction = deleteCustomer.bind(null, locationSlug, id);

  const [state, action, isLoading] = useActionState(formAction, "default");

  const { open, close, isOpen, setOpen } = useOverlayState();

  useEffect(() => {
    if (state === "success") {
      close();
    }
  }, [state]);

  return (
    <>
      <Button
        isIconOnly
        variant="ghost"
        onPress={open}
        className={`text-danger hover:bg-danger-soft`}
      >
        <Icon icon={`tabler:trash`} />
      </Button>
      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Delete customer?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <Button variant="tertiary" onPress={close}>
                Cancel
              </Button>
              <form action={action}>
                <Button type="submit" variant="danger" isDisabled={isLoading}>
                  {isLoading ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Icon icon={`tabler:trash`} />
                  )}
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </form>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}
