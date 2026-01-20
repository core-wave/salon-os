"use client";

import CancelButton from "@/components/form-fields/cancel-button";
import SubmitButton from "@/components/form-fields/submit-button";
import { deleteAppointmentType } from "@/lib/appointment-types/functions";
import { clientEnv } from "@/lib/env/client";
import { AlertDialog, Button, toast, useOverlayState } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function DeleteAppointmentTypeForm({
  locationSlug,
  id,
}: {
  locationSlug: string;
  id: string;
}) {
  const formAction = deleteAppointmentType.bind(null, locationSlug, id);

  const [state, action, isLoading] = useActionState(formAction, "default");

  const { open, close, isOpen, setOpen } = useOverlayState();

  const router = useRouter();

  useEffect(() => {
    if (state === "success") {
      toast("Appointment type deleted", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
        indicator: <Icon icon="tabler:check" />,
      });

      close();
      router.refresh();
    }

    if (state === "error") {
      toast.danger("Error deleting appointment type", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
      });
    }
  }, [state, close, router]);

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
              <AlertDialog.Heading>
                Delete appointment type?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <CancelButton onCancel={close} />
              <form action={action}>
                <SubmitButton
                  isLoading={isLoading}
                  label="Delete"
                  loadingLabel="Deleting"
                  icon="tabler:trash"
                  variant="danger"
                />
              </form>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}
