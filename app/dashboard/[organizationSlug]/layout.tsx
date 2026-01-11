import { salonCore } from "@/lib/core";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  const org = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!org) notFound();

  return children;
}
