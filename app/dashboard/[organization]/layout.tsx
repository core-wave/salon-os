import Sidebar from "@/components/layout/sidebar";
import { ScrollShadow } from "@heroui/react";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organization: string }>;
}) {
  const { organization } = await params;

  return (
    <div className="max-h-dvh flex w-full">
      <Sidebar organization={organization} />
      <ScrollShadow hideScrollBar className="w-full overflow-y-auto p-6">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
          {children}
        </div>
      </ScrollShadow>
    </div>
  );
}
