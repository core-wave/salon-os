import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function SettingsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Settings"
        description="Manage your preferences and configuration"
      >
        {/* <Button size="sm">
          <Icon icon={`tabler:plus`} />
          New Appointment
        </Button> */}
      </DashboardPageHeader>
    </>
  );
}
