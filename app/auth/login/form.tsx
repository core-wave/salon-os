"use client";

import PasswordField from "@/components/forms/password-field";
import { login } from "@/lib/auth/functions";
import {
  Button,
  Description,
  ErrorMessage,
  Fieldset,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState } from "react";

export function LoginForm() {
  const [state, action, isLoading] = useActionState(login, {
    status: "default",
  });

  return (
    <form action={action} className="w-full max-w-sm flex flex-col gap-4">
      <Fieldset>
        <Fieldset.Legend>Log in to SalonOS</Fieldset.Legend>
        <Description>Enter your details to log in</Description>

        <TextField
          defaultValue={state.fieldValues?.email}
          name="email"
          type="email"
        >
          <Label>Email</Label>
          <Input placeholder="Enter your email" />
          {state.status === "error" && state.fieldErrors?.email && (
            <ErrorMessage>{state.fieldErrors.email.errors[0]}</ErrorMessage>
          )}
        </TextField>

        <PasswordField
          defaultValue={state.fieldValues?.password}
          name="password"
          label="Password"
          errorMessage={
            state.status === "error" && state.fieldErrors?.password
              ? state.fieldErrors.password.errors[0]
              : undefined
          }
          placeholder="Enter your password"
        />
      </Fieldset>

      {state.status === "error" && state.formErrors && (
        <ErrorMessage>{state.formErrors[0]}</ErrorMessage>
      )}

      <Button type="submit">
        {isLoading ? "Logging in..." : "Log in"}
        {isLoading ? (
          <Spinner size="sm" color="current" />
        ) : (
          <Icon icon={`tabler:login-01`} />
        )}
      </Button>
    </form>
  );
}
