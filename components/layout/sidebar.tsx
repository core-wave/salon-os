"use client";

import { Button, buttonVariants, cn, Label, ScrollShadow } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import icon from "@/app/icon.svg";

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
    title: "General",
    items: [
      {
        title: "Overview",
        slug: "overview",
        icon: "tabler:layout-dashboard",
      },
      {
        title: "Appointments",
        slug: "appointments",
        icon: "tabler:calendar",
      },
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

export default function Sidebar() {
  const pathname = usePathname();

  console.log(pathname);

  const [, , organizationSlug, locationSlug, selectedPath] =
    pathname.split("/");

  const slug = `${organizationSlug}/${locationSlug}`;

  return (
    <aside className="bg-surface w-70 shrink-0 flex flex-col border-r border-separator">
      <div className="border-b border-separator h-14 flex justify-start p-3 px-4">
        <Image alt="" src={icon} className="size-8" />
      </div>
      <ScrollShadow className="flex-1 flex flex-col">
        {sidebarCategories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col p-4 border-b border-separator"
          >
            {cat.title && (
              <Label className="text-xs text-muted mb-2 ml-2">
                {cat.title.toUpperCase()}
              </Label>
            )}
            {cat.items.map((item) => {
              const isActive = selectedPath
                ? selectedPath === item.slug
                : "overview" === item.slug;

              return (
                <Link
                  prefetch
                  href={
                    item.slug === "overview"
                      ? `/dashboard/${slug}`
                      : `/dashboard/${slug}/${item.slug}`
                  }
                  key={item.slug}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={isActive ? -1 : 0}
                  className={cn(
                    buttonVariants({
                      variant: isActive ? "tertiary" : "ghost",
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
      </ScrollShadow>
      <div className="p-4 border-t border-separator flex flex-col gap-2">
        <Button variant="secondary" className="bg-accent-soft" fullWidth>
          Upgrade Plan <Icon icon={`tabler:rocket`} />
        </Button>
        <p className="text-center text-xs text-muted font-medium">
          Powered by salonOS
        </p>
      </div>
    </aside>
  );
}
