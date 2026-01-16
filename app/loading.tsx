import { Spinner } from "@heroui/react";

export default function WebsiteLoading() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Spinner className="m-auto size-10" />
      <p className="text-sm text-muted">Application loading...</p>
    </div>
  );
}
