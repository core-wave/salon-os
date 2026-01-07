import Sidebar from "@/components/layout/sidebar";
import { ScrollShadow } from "@heroui/react";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;

  return (
    <div className="max-h-dvh flex w-full overflow-hidden">
      <Sidebar organization={organizationSlug} />
      <ScrollShadow
        hideScrollBar
        className="w-full overflow-x-hidden overflow-y-auto p-4 sm:p-6"
      >
        <main className="min-h-full w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
          {children}
        </main>
      </ScrollShadow>
    </div>
  );
}
