import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard"); // or "/auth/login"
  }

  return (
    <div className="w-full flex justify-center items-center p-4">
      {children}
    </div>
  );
}
