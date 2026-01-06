import { buttonVariants, cn } from "@heroui/react";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Link
        href={`/dashboard/my-salon`}
        className={cn(buttonVariants({ variant: "primary" }))}
      >
        Dashboard
      </Link>
    </div>
  );
}
