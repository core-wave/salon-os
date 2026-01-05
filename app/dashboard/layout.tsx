import Sidebar from "@/components/layout/sidebar";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="relative flex flex-col flex-1 p-4 gap-6">{children}</div>
    </div>
  );
}
