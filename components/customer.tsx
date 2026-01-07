import { Customer } from "@/lib/mockdata/appointments";
import { Avatar, Label } from "@heroui/react";

export default function CustomerCard({ email, fullName, imageSrc }: Customer) {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <Avatar.Image
          alt={fullName}
          src={`https://tapback.co/api/avatar/${fullName}.webp`}
        />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar>
      <div className="flex flex-col">
        <Label>{fullName}</Label>
        <Label className="font-normal text-sm text-muted">{email}</Label>
      </div>
    </div>
  );
}
