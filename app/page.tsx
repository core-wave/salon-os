import { Button, buttonVariants, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import screenshot from "@/public/screenshot.png";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-hero-section-centered-navbar flex h-screen min-h-dvh w-full flex-col gap-9 overflow-y-auto p-4 md:gap-12 md:px-10 md:py-8">
      <main className=" flex flex-col items-center rounded-2xl px-3 md:rounded-3xl md:px-0">
        <section className="my-14 mt-16 flex flex-col items-center justify-center gap-6">
          {/* <CenteredNavbar /> */}
          <Button className="bg-surface text-foreground shadow-surface">
            See our plans
            <Icon icon="solar:arrow-right-linear" />
          </Button>
          <h1 className="text-foreground text-center text-[clamp(2.125rem,1.142rem+3.659vw,4rem)] leading-none font-bold">
            Easiest way to <br /> run your salon.
          </h1>
          <p className="text-muted text-center text-base sm:w-117 md:text-lg md:leading-6">
            SalonOS makes running your salon effortless. Customers, bookings,
            stock management and payments, off- and online.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link
              href={`/auth/signup`}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "bg-accent-soft",
              )}
            >
              Get Started
            </Link>
            <Link
              href={`/auth/login`}
              className={cn(buttonVariants({ variant: "primary" }))}
            >
              Sign In
              <Icon icon="solar:arrow-right-linear" />
            </Link>
          </div>
        </section>
        <Image alt="" src={screenshot} />
      </main>
    </div>
  );
}
