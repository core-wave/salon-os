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
        icon: "hugeicons:dashboard-square-02",
      },
    ],
  },
  {
    title: "Operational",
    items: [
      {
        title: "Appointments",
        slug: "appointments",
        icon: "hugeicons:calendar-02",
      },
      // {
      //   title: "Employee Schedule",
      //   slug: "employee-schedule",
      //   icon: "hugeicons:calendar-add-01",
      // },
      {
        title: "Messages",
        slug: "messages",
        icon: "hugeicons:message-01",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        title: "Customers",
        slug: "customers",
        icon: "hugeicons:user-group",
      },
      // {
      //   title: "Employees",
      //   slug: "employees",
      //   icon: "hugeicons:user-account",
      // },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Appointment Types",
        slug: "appointment-types",
        icon: "hugeicons:calendar-setting-01",
      },
      {
        title: "Opening Hours",
        slug: "opening-hours",
        icon: "hugeicons:clock-02",
      },
      {
        title: "Settings",
        slug: "settings",
        icon: "hugeicons:settings-01",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const selectedPath = pathname.split("/")[2];

  return (
    <div className="bg-surface w-72 p-4 flex flex-col gap-6 border-r border-separator">
      <p className="text-center text-xl">
        salon<b>OS</b>
      </p>
      {sidebarCategories.map((cat, idx) => (
        <div key={idx} className="flex flex-col">
          {idx != 0 && <Separator className="mb-6" />}
          {cat.title && (
            <Label className="text-xs text-muted mb-2 ml-2">
              {cat.title.toUpperCase()}
            </Label>
          )}
          {cat.items.map((item) => (
            <Link
              href={`/dashboard/${item.slug}`}
              key={item.slug}
              className={cn(
                buttonVariants({
                  variant: selectedPath === item.slug ? "primary" : "ghost",
                  fullWidth: true,
                }),
                "justify-start"
              )}
            >
              <Icon icon={item.icon} />
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
