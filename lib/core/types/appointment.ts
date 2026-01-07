import { CCustomer } from "./customer";

export type CAppointment = {
  customer: CCustomer;
  date: string;
  time: string;
  duration: number; // minutes
  appointmentType: string;
  status: "Planned" | "Completed" | "Cancelled" | "No Show";
}