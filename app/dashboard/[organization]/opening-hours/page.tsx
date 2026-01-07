import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function OpeningHoursPage() {
  return (
    <>
      <DashboardPageHeader
        title="Opening Hours"
        description="Manage your availability"
      >
        <Button>
          <Icon icon={`tabler:plus`} />
          New Appointment
        </Button>
      </DashboardPageHeader>
    </>
  );
}
