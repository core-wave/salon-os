import { salonCore } from "@/lib/core";
import { buttonVariants, cn } from "@heroui/react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  const org = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!org) notFound();

  const locations = await org.listLocations();

  if (locations.length === 0) {
    redirect(`/dashboard/${organizationSlug}/new-location`);
  }

  if (locations.length === 1) {
    redirect(`/dashboard/${organizationSlug}/${locations[0].slug}`);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      {locations.map((loc) => (
        <Link
          key={loc.id}
          href={`/dashboard/${organizationSlug}/${loc.slug}`}
          className={cn(buttonVariants({ variant: "primary" }))}
        >
          {loc.name}
        </Link>
      ))}
    </div>
  );
}
