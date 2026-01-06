import Sidebar from "@/components/layout/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organization: string }>;
}) {
  const { organization } = await params;
  const h = await headers();

  const organizations = await auth.api.listOrganizations({ headers: h });

  if (organizations.length === 0) {
    redirect("/dashboard/new-organization");
  }

  const selectedOrganization = organizations.find(
    (org) => org.slug === organization
  );

  if (!selectedOrganization) {
    redirect("/dashboard");
  }

  const res = await auth.api.setActiveOrganization({
    body: {
      organizationId: selectedOrganization.id,
      organizationSlug: selectedOrganization.slug,
    },
    headers: h,
  });

  console.log(res);

  return (
    <div className="flex w-full">
      <Sidebar organization={organization} />
      <div className="relative flex flex-col flex-1 p-4 gap-6">{children}</div>
    </div>
  );
}
