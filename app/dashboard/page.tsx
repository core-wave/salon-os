import { salonCore } from "@/lib/core";
import { buttonVariants, cn } from "@heroui/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const organizations = await salonCore.listAvailableOrganizations();

  if (organizations.length === 0) {
    redirect(`/dashboard/new-organization`);
  }

  if (organizations.length === 1) {
    redirect(`/dashboard/${organizations[0].slug}`);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      {organizations.map((org) => (
        <Link
          key={org.id}
          href={`/dashboard/${org.slug}`}
          className={cn(buttonVariants({ variant: "primary" }))}
        >
          {org.name}
        </Link>
      ))}
    </div>
  );
}
