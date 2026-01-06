"use client";

import { authClient } from "@/lib/auth/client";
import { createOrganization } from "@/lib/organizations/functions";
import { slugify } from "@/lib/utils";
import {
  Fieldset,
  Description,
  TextField,
  Input,
  ErrorMessage,
  Spinner,
  Button,
  Label,
  InputGroup,
  SearchField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useState } from "react";

export default function CreateOrganizationForm() {
  const [state, action, isLoading] = useActionState(createOrganization, {
    status: "default",
  });

  const { data: session } = authClient.useSession();

  const [slug, setSlug] = useState(state?.fieldValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <form action={action} className="w-full max-w-sm flex flex-col gap-4">
      <Fieldset>
        <Fieldset.Legend>Create your SalonOS organization</Fieldset.Legend>
        <Description>What should we name your business?</Description>

        <TextField
          name="name"
          defaultValue={state?.fieldValues?.name}
          onChange={(e) => {
            if (!slugTouched) {
              setSlug(slugify(e));
            }
          }}
        >
          <Label>Business Name</Label>
          <Input placeholder="My Salon" />
          {state?.status === "error" && state.fieldErrors?.name && (
            <ErrorMessage>{state.fieldErrors?.name?.errors[0]}</ErrorMessage>
          )}
        </TextField>

        <TextField
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e);
          }}
        >
          <Label>Slug</Label>
          <InputGroup>
            <InputGroup.Prefix className="pr-0 text-base sm:text-sm">
              https://salonos.io/
            </InputGroup.Prefix>
            <InputGroup.Input placeholder="my-salon" />
          </InputGroup>
          {state?.status === "error" && state.fieldErrors?.slug && (
            <ErrorMessage>{state.fieldErrors?.slug?.errors[0]}</ErrorMessage>
          )}
        </TextField>

        <Input hidden name="userId" defaultValue={session?.user.id} />
      </Fieldset>
      {state?.status === "error" && state.formErrors && (
        <ErrorMessage>{state.formErrors[0]}</ErrorMessage>
      )}
      <div className="flex gap-4">
        <Button type="submit">
          {isLoading ? "Creating..." : "Create"}
          {isLoading ? (
            <Spinner size="sm" color="current" />
          ) : (
            <Icon icon={"hugeicons:store-add-01"} />
          )}
        </Button>
      </div>
    </form>
  );
}
