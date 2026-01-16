"use client";

import { SelectOrganization } from "@/lib/db/types";
import { discordSendFeedback } from "@/lib/discord/functions";
import {
  Modal,
  Button,
  TextArea,
  Spinner,
  useOverlayState,
  ErrorMessage,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { User } from "better-auth";
import { useActionState, useEffect } from "react";

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

  useEffect(() => {
    if (state.status === "success") {
      close();
    }
  }, [state]);

  return (
    <Modal>
      <Button variant="ghost" onPress={open} isIconOnly>
        <Icon icon={`tabler:inbox`} />
      </Button>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Icon icon={`tabler:inbox`} className="size-5" />
              </Modal.Icon>
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
                <Button type="submit" className={"w-full"}>
                  {isLoading && <Spinner size="sm" color="current" />}
                  {isLoading ? "Submitting..." : "Submit Feedback"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
