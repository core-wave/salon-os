import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function DashboardPageHeader({
  children,
  description,
  title,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}
