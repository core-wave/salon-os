"use client";

import {
  Label,
  TextField,
  ErrorMessage,
  InputGroup,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface PasswordFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  errorMessage?: string;
}

export default function PasswordField({
  label,
  name,
  placeholder,
  defaultValue,
  errorMessage,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      name={name}
      defaultValue={defaultValue}
      type={showPassword ? "text" : "password"}
    >
      <Label>{label}</Label>
      <InputGroup>
        <InputGroup.Input placeholder={placeholder || "●●●●●●●●"} />
        <InputGroup.Suffix className="pr-0">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              icon={
                showPassword ? "hugeicons:view-off-slash" : "hugeicons:view"
              }
            />
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </TextField>
  );
}
