"use client";

import PasswordField from "@/components/forms/password-field";
import { signup } from "@/lib/auth/functions";
import {
  Button,
  Description,
  ErrorMessage,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState } from "react";

export function SignupForm() {
  const [state, action, isLoading] = useActionState(signup, {
    status: "default",
  });

  if (state.status === "success") {
    return (
      <div className="w-full max-w-sm flex flex-col gap-2 items-center">
        <Icon icon={`hugeicons:mail-validation-02`} className="size-12" />
        <h1>Check your email</h1>
        <Description>
          We sent you a link to verify your email address
        </Description>
      </div>
    );
  } else
    return (
      <form action={action} className="w-full max-w-sm flex flex-col gap-4">
        <TextField
          defaultValue={state.fieldValues?.name}
          name="name"
          type="text"
        >
          <Label>Full Name</Label>
          <Input placeholder="Enter your full name" />
          {state.status === "error" && state.fieldErrors?.name && (
            <ErrorMessage>{state.fieldErrors.name.errors[0]}</ErrorMessage>
          )}
        </TextField>
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
        <PasswordField
          defaultValue={state.fieldValues?.confirmPassword}
          name="confirmPassword"
          label="Confirm Password"
          errorMessage={
            state.status === "error" && state.fieldErrors?.confirmPassword
              ? state.fieldErrors.confirmPassword.errors[0]
              : undefined
          }
          placeholder="Confirm your password"
        />
        {state.status === "error" && state.formErrors && (
          <ErrorMessage>{state.formErrors[0]}</ErrorMessage>
        )}
        <Button type="submit">Submit</Button>
      </form>
    );
}
