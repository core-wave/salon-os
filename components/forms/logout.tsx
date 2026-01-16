"use client";

import { authClient } from "@/lib/auth/client";
import { Dropdown, Label, PressEvent, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout(e?: PressEvent) {
    try {
      setIsLoading(true);

      await authClient.signOut();

      router.refresh();
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dropdown.Item variant="danger" onAction={handleLogout}>
      <div className="flex w-full items-center justify-start gap-2">
        {isLoading ? (
          <Spinner size="sm" color="danger" />
        ) : (
          <Icon icon={`tabler:logout`} className="text-danger" />
        )}
        <Label>{isLoading ? "Logging Out..." : "Log Out"}</Label>
      </div>
    </Dropdown.Item>
  );
}
