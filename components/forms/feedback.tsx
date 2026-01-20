"use client";

import SubmitButton from "@/components/form-fields/submit-button";
import { SelectOrganization } from "@/lib/db/types";
import { discordSendFeedback } from "@/lib/discord/functions";
import { clientEnv } from "@/lib/env/client";
import {
  Modal,
  Button,
  TextArea,
  useOverlayState,
  ErrorMessage,
  toast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import CancelButton from "../form-fields/cancel-button";

export default function FeedbackForm({
  organization,
  user,
}: {
  organization: SelectOrganization;
  user: User;
}) {
  const formAction = discordSendFeedback.bind(null, organization, user);

  const [state, action, isLoading] = useActionState(formAction, {
    status: "default",
  });

  const { open, close, isOpen, setOpen } = useOverlayState();

  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      toast("Thank you for your feedback!", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
        indicator: <Icon icon="tabler:check" />,
      });

      close();
      router.refresh();
    }

    if (state.status === "error") {
      toast.danger("Error submitting feedback", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
      });
    }
  }, [state, close, router]);

  return (
    <Modal>
      <Button variant="ghost" onPress={open} isIconOnly>
        <Icon icon={`tabler:flag`} />
      </Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Help us improve SalonOS</Modal.Heading>
            </Modal.Header>
            <form action={action}>
              <Modal.Body className="overflow-visible flex flex-col gap-4">
                <p>
                  We value your feedback. If you have any ideas or suggestions
                  to improve our product, let us know.
                </p>
                <div className="flex flex-col gap-2">
                  <TextArea
                    variant="secondary"
                    aria-label="Feedback"
                    placeholder="Ideas or suggestions to improve our product"
                    name="text"
                    className={`h-32`}
                    fullWidth
                  />

                  {state.status === "error" && state.fieldErrors?.text && (
                    <ErrorMessage>
                      {state.fieldErrors.text.errors[0]}
                    </ErrorMessage>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <CancelButton onCancel={close} />
                <SubmitButton
                  isLoading={isLoading}
                  label="Submit Feedback"
                  loadingLabel="Submitting"
                  className="w-full"
                />
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
