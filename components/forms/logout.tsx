"use client";

import { authClient } from "@/lib/auth/client";
import { clientEnv } from "@/lib/env/client";
import { Dropdown, Label, Spinner, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    try {
      setIsLoading(true);

      await authClient.signOut();

      toast("Logged out successfully", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
        indicator: <Icon icon="tabler:check" />,
      });

      router.refresh();
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);

      toast.danger("Failed to log out", {
        timeout: clientEnv.NEXT_PUBLIC_TOASTER_TIMEOUT,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dropdown.Item variant="danger" onPress={handleLogout}>
      <div className="flex w-full items-center justify-start gap-2">
        {isLoading ? (
          <Spinner size="sm" color="danger" />
        ) : (
          <Icon icon="tabler:logout" className="text-danger" />
        )}
        <Label>{isLoading ? "Logging Out..." : "Log Out"}</Label>
      </div>
    </Dropdown.Item>
  );
}
