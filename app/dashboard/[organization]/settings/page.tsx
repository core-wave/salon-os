import DashboardPageHeader from "@/components/layout/dashboard-page-header";
import {
  Button,
  Card,
  Description,
  ErrorMessage,
  Form,
  Input,
  Label,
  Separator,
  TextField,
} from "@heroui/react";

export default function SettingsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Settings"
        description="Manage your preferences and configuration"
      />

      <Card>
        <h2 className="font-semibold text-lg">Salon Information</h2>
        <Form>
          <Card.Content className="gap-4">
            <Separator />

            <TextField
              fullWidth
              className={`grid sm:grid-cols-2 gap-2 sm:gap-4 items-center`}
            >
              <div className="flex flex-col">
                <Label>Salon Name</Label>
                <Description>Displayed on your booking page</Description>
              </div>
              <Input />
            </TextField>

            <Separator />

            <TextField
              fullWidth
              className={`grid sm:grid-cols-2 gap-2 sm:gap-4 items-center`}
            >
              <div className="flex flex-col">
                <Label>Slug</Label>
                <Description>
                  Used to generate your website and booking URL
                </Description>
              </div>
              <Input />
            </TextField>

            <Separator />

            <TextField
              fullWidth
              className={`grid sm:grid-cols-2 gap-2 sm:gap-4 items-center`}
            >
              <div className="flex flex-col">
                <Label>Address</Label>
                <Description>Your salon's address</Description>
              </div>
              <Input />
            </TextField>

            <Separator />

            <TextField
              fullWidth
              className={`grid sm:grid-cols-2 gap-2 sm:gap-4 items-center`}
            >
              <div className="flex flex-col">
                <Label>Phone</Label>
                <Description>Your salon's phone number</Description>
              </div>
              <Input />
            </TextField>

            <Separator />

            <TextField
              fullWidth
              className={`grid sm:grid-cols-2 gap-2 sm:gap-4 items-center`}
            >
              <div className="flex flex-col">
                <Label>Email</Label>
                <Description>Your salon's email address</Description>
              </div>
              <Input />
            </TextField>

            <Separator />

            <Button className={"self-end"}>Save Changes</Button>
          </Card.Content>
        </Form>
      </Card>
    </>
  );
}
