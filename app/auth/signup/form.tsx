"use client";

import { signup } from "@/lib/auth/functions";
import { Button, ErrorMessage, Input, Label, TextField } from "@heroui/react";
import { useActionState } from "react";

export function SignupForm() {
  const [state, action, isLoading] = useActionState(signup, {
    status: "default",
  });

  return (
    <form action={action} className="w-full max-w-sm flex flex-col gap-4">
      <TextField defaultValue={state.fieldValues?.name} name="name" type="text">
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
      <TextField
        defaultValue={state.fieldValues?.password}
        name="password"
        type="text"
      >
        <Label>Password</Label>
        <Input placeholder="Enter your password" />
        {state.status === "error" && state.fieldErrors?.password && (
          <ErrorMessage>{state.fieldErrors.password.errors[0]}</ErrorMessage>
        )}
      </TextField>
      <TextField
        defaultValue={state.fieldValues?.confirmPassword}
        name="confirmPassword"
        type="text"
      >
        <Label>Confirm Password</Label>
        <Input placeholder="Repeat your password" />
        {state.status === "error" && state.fieldErrors?.confirmPassword && (
          <ErrorMessage>
            {state.fieldErrors.confirmPassword.errors[0]}
          </ErrorMessage>
        )}
      </TextField>
      {state.status === "error" && state.formErrors && (
        <ErrorMessage>{state.formErrors[0]}</ErrorMessage>
      )}
      <Button type="submit">Submit</Button>
    </form>
  );
}
