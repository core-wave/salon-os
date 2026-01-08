import { auth } from "@/lib/auth";
import { getPlaceDetails } from "@/lib/google/functions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login"); // or "/auth/login"
  }

  await getPlaceDetails("ChIJdz1T-pqEyEcRD_7fayoCREA");

  return children;
}
