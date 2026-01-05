import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full flex justify-center items-center p-4">
      {children}
    </div>
  );
}
