"use client";

import { AlertDialog, Button, useOverlayState } from "@heroui/react";
import { Icon } from "@iconify/react";

interface DeleteAppointmentTypeProps {
  type: string;
  description: string;
}

export default function DeleteAppointmentType({
  type,
  description,
}: DeleteAppointmentTypeProps) {
  const { open, close, isOpen, setOpen } = useOverlayState();

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
              <AlertDialog.Heading>Delete {type}?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>{description}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="tertiary" onPress={close}>
                Cancel
              </Button>
              <Button slot="close" variant="danger">
                Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}
