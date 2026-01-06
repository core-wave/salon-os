import { auth } from "@/lib/auth";
import { buttonVariants } from "@heroui/react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const h = await headers();

  const [session, organizations] = await Promise.all([
    auth.api.getSession({ headers: h }),
    auth.api.listOrganizations({ headers: h }),
  ]);

  console.log(session, organizations);

  if (!session) {
    redirect("/auth/login");
  }

  if (organizations.length === 0) {
    redirect("/dashboard/new-organization");
  }

  if (organizations.length === 1) {
    redirect(`/dashboard/${organizations[0].slug}`);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      {organizations.map((org) => (
        <Link
          key={org.id}
          className={buttonVariants({ variant: "primary" })}
          href={`/dashboard/${org.slug}`}
        >
          {org.name}
        </Link>
      ))}
    </div>
  );
}
