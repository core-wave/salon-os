"use client";

import { buttonVariants, cn, Label, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
  title: string;
  slug: string;
  icon: string;
};

type SidebarCategory = {
  title?: string;
  items: SidebarItem[];
};

const sidebarCategories: SidebarCategory[] = [
  {
    items: [
      {
        title: "Overview",
        slug: "overview",
        icon: "tabler:layout-dashboard",
      },
    ],
  },
  {
    title: "Operational",
    items: [
      {
        title: "Appointments",
        slug: "appointments",
        icon: "tabler:calendar",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        title: "Customers",
        slug: "customers",
        icon: "tabler:user",
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Appointment Types",
        slug: "appointment-types",
        icon: "tabler:template",
      },
      {
        title: "Opening Hours",
        slug: "opening-hours",
        icon: "tabler:clock",
      },
      {
        title: "Settings",
        slug: "settings",
        icon: "tabler:settings",
      },
    ],
  },
];

export default function Sidebar({ organization }: { organization: string }) {
  const pathname = usePathname();
  const selectedPath = pathname.split("/")[3] || "overview";

  return (
    <aside className="bg-surface w-70 shrink-0 p-4 py-6 flex-col gap-6 border-r border-separator hidden md:flex">
      <p className="text-center text-xl">
        salon<b>OS</b>
      </p>
      {sidebarCategories.map((cat, idx) => (
        <div key={idx} className="flex flex-col">
          {idx != 0 && <Separator className="mb-6" isOnSurface />}
          {cat.title && (
            <Label className="text-xs text-muted mb-2 ml-2">
              {cat.title.toUpperCase()}
            </Label>
          )}
          {cat.items.map((item) => {
            const isActive = selectedPath === item.slug;

            return (
              <Link
                prefetch
                href={
                  item.slug === "overview"
                    ? `/dashboard/${organization}`
                    : `/dashboard/${organization}/${item.slug}`
                }
                key={item.slug}
                aria-current={isActive ? "page" : undefined}
                tabIndex={isActive ? -1 : 0}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "primary" : "ghost",
                    fullWidth: true,
                  }),
                  "justify-start",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive && "pointer-events-none"
                )}
              >
                <Icon icon={isActive ? `${item.icon}-filled` : item.icon} />
                {item.title}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
