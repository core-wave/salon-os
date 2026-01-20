"use client";

import { Button } from "@heroui/react";
import { ComponentProps } from "react";

interface CancelButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "onPress"
> {
  onCancel: () => void;
  label?: string;
}

export default function CancelButton({
  onCancel,
  label = "Cancel",
  variant = "ghost",
  ...props
}: CancelButtonProps) {
  return (
    <Button variant={variant} onPress={onCancel} {...props}>
      {label}
    </Button>
  );
}
