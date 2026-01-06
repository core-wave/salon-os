import { buttonVariants } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Link className={buttonVariants({ variant: "primary" })} href="/booking">
        Booking Page
      </Link>
      <Link
        className={buttonVariants({ variant: "primary" })}
        href="/dashboard/my-salon"
      >
        Dashboard Page
      </Link>
      <Link
        className={buttonVariants({ variant: "primary" })}
        href="/auth/signup"
      >
        Signup Page
      </Link>
      <Link
        className={buttonVariants({ variant: "primary" })}
        href="/auth/login"
      >
        Login Page
      </Link>
    </div>
  );
}
