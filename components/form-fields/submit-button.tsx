"use client";

import { Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentProps } from "react";

interface SubmitButtonProps
  extends Omit<ComponentProps<typeof Button>, "type" | "children"> {
  isLoading: boolean;
  label: string;
  loadingLabel?: string;
  icon?: string;
}

export default function SubmitButton({
  isLoading,
  label,
  loadingLabel,
  icon,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" isDisabled={isLoading} {...props}>
      {isLoading && <Spinner size="sm" color="current" />}
      {!isLoading && icon && <Icon icon={icon} />}
      {isLoading ? (loadingLabel ?? `${label}...`) : label}
    </Button>
  );
}
