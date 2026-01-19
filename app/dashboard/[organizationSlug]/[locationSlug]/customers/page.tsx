import CreateCustomerForm from "@/components/forms/create-customer";
import DeleteCustomerForm from "@/components/forms/delete-customer";
import UpdateCustomerForm from "@/components/forms/update-customer";
import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import { salonCore } from "@/lib/core";
import { Card, Label, Separator } from "@heroui/react";
import { notFound } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ organizationSlug: string; locationSlug: string }>;
}) {
  const { organizationSlug, locationSlug } = await params;

  const organization = await salonCore.getOrganizationBySlug(organizationSlug);
  if (!organization) notFound();

  const location = await organization.getLocationBySlug(locationSlug);
  if (!location) notFound();

  const customers = await organization.listCustomers();

  return (
    <>
      <DashboardPageHeader
        title="Customers"
        description="Manage your customer base"
      >
        <CreateCustomerForm organizationId={organization.data.id} />
      </DashboardPageHeader>

      <Card className="gap-6">
        <div className="grid grid-cols-[auto_auto_auto_1fr_auto] gap-y-3 gap-x-4 items-center">
          <Label className="font-semibold">Name</Label>
          <Label className="font-semibold">Email</Label>
          <Label className="font-semibold">Phone</Label>
          <Label className="font-semibold">Notes</Label>
          <Label className="font-semibold">Actions</Label>
          {customers.map((customer) => (
            <Fragment key={customer.id}>
              <Separator className="col-span-5" />
              <Label className="font-medium">{customer.name}</Label>
              <Label className="font-normal">{customer.email}</Label>
              <Label className="font-normal">{customer.phone ?? "—"}</Label>
              <Label className="font-normal">
                {customer.notes ?? "—"}
              </Label>
              <div className="flex">
                <UpdateCustomerForm customer={customer} />
                <DeleteCustomerForm id={customer.id} />
              </div>
            </Fragment>
          ))}
        </div>
      </Card>
    </>
  );
}
