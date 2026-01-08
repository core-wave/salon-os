import { Button, buttonVariants, cn } from "@heroui/react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-background relative flex h-screen min-h-dvh w-full overflow-hidden items-center justify-center gap-2">
      <Link
        href={`/auth/signup`}
        className={cn(buttonVariants({ variant: "secondary" }))}
      >
        Sign up
      </Link>
      <Link
        href={`/auth/login`}
        className={cn(buttonVariants({ variant: "primary" }))}
      >
        Log in
      </Link>
    </main>
  );
}
