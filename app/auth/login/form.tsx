"use client";

import PasswordField from "@/components/form-fields/password-field";
import SubmitButton from "@/components/form-fields/submit-button";
import { login } from "@/lib/auth/functions";
import {
  Description,
  ErrorMessage,
  Fieldset,
  Input,
  Label,
  TextField,
} from "@heroui/react";
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

      <SubmitButton
        isLoading={isLoading}
        label="Log in"
        loadingLabel="Logging in"
        icon="tabler:login-01"
      />
    </form>
  );
}
