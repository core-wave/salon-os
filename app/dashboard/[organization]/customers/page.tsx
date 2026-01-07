import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function CustomersPage() {
  return (
    <>
      <DashboardPageHeader
        title="Customers"
        description="Manage your customer base"
      >
        {/* <Button size="sm">
          <Icon icon={`tabler:plus`} />
          New Customer
        </Button> */}
      </DashboardPageHeader>
    </>
  );
}
