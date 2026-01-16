import LogoutForm from "@/components/forms/logout";
import Sidebar from "@/components/layout/sidebar";
import { auth } from "@/lib/auth";
import { logout } from "@/lib/auth/functions";
import { getInitials } from "@/lib/utils";
import { Avatar, Dropdown, Label, ScrollShadow } from "@heroui/react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organizationSlug: string; locationSlug: string }>;
}) {
  const { organizationSlug, locationSlug } = await params;

  const slug = `${organizationSlug}/${locationSlug}`;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) notFound();

  const user = session.user;

  return (
    <div className="max-h-dvh flex w-full overflow-hidden">
      <Sidebar slug={slug} />
      <div className="w-full min-h-full flex flex-col">
        <div className="flex h-14 border-b border-separator bg-surface p-4 items-center">
          <div className="flex-1"></div>
          <Dropdown>
            <Dropdown.Trigger className="rounded-full">
              <Avatar variant="soft">
                <Avatar.Image alt={user.name} src={user.image || ""} />
                <Avatar.Fallback delayMs={600} color="accent">
                  {getInitials(user.name)}
                </Avatar.Fallback>
              </Avatar>
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <div className="px-3 pt-3 pb-1">
                <div className="flex items-center gap-2">
                  <Avatar variant="soft">
                    <Avatar.Image alt={user.name} src={user.image || ""} />
                    <Avatar.Fallback delayMs={600} color="accent">
                      {getInitials(user.name)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col gap-0">
                    <p className="text-sm leading-5 font-medium">{user.name}</p>
                    <p className="text-xs leading-none text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              <Dropdown.Menu>
                <Dropdown.Item id="dashboard" textValue="Dashboard">
                  <Label>Dashboard</Label>
                </Dropdown.Item>
                <Dropdown.Item id="profile" textValue="Profile">
                  <Label>Profile</Label>
                </Dropdown.Item>
                <Dropdown.Item id="settings" textValue="Settings">
                  <div className="flex w-full items-center justify-between gap-2">
                    <Label>Settings</Label>
                    {/* <Gear className="size-3.5 text-muted" /> */}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item id="new-project" textValue="New project">
                  <div className="flex w-full items-center justify-between gap-2">
                    <Label>Create Team</Label>
                    {/* <Persons className="size-3.5 text-muted" /> */}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                  <div className="flex w-full items-center justify-between gap-2">
                    <Label>Log Out</Label>
                    {/* <ArrowRightFromSquare className="size-3.5 text-danger" /> */}
                  </div>
                </Dropdown.Item>
                <LogoutForm />
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
        <ScrollShadow
          hideScrollBar
          className="w-full overflow-x-hidden overflow-y-auto p-4 sm:p-6"
        >
          <main className="min-h-full w-full max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
            {children}
          </main>
        </ScrollShadow>
      </div>
    </div>
  );
}
