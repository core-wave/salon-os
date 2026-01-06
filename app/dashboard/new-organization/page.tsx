import CreateOrganizationForm from "./form";

export default async function NewOrganizationPage() {
  return (
    <div className="w-full flex justify-center items-center p-4">
      <CreateOrganizationForm />
    </div>
  );
}
