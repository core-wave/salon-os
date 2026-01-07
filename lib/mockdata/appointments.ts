export type Customer = {
  fullName: string;
  email: string;
  imageSrc: string;
};

export type Appointment = {
  customer: {
    fullName: string;
    email: string;
    imageSrc: string;
  };
  date: string;
  time: string;
  duration: number; // minutes
  appointmentType: string;
  status: "Planned" | "Completed" | "Cancelled" | "No Show";
};

export const mockAppointments: Appointment[] = [
  {
    customer: {
      fullName: "Liam Johnson",
      email: "liam.johnson@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "09:00",
    duration: 30,
    appointmentType: "Men’s Haircut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Noah Williams",
      email: "noah.williams@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "09:30",
    duration: 45,
    appointmentType: "Skin Fade",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Emma Brown",
      email: "emma.brown@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "10:00",
    duration: 45,
    appointmentType: "Wash & Cut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Olivia Jones",
      email: "olivia.jones@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "10:30",
    duration: 30,
    appointmentType: "Blow Dry",
    status: "Cancelled",
  },
  {
    customer: {
      fullName: "James Garcia",
      email: "james.garcia@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "11:00",
    duration: 15,
    appointmentType: "Beard Trim",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Benjamin Miller",
      email: "benjamin.miller@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "11:30",
    duration: 30,
    appointmentType: "Men’s Haircut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Sophia Davis",
      email: "sophia.davis@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "12:00",
    duration: 60,
    appointmentType: "Cut & Style",
    status: "No Show",
  },
  {
    customer: {
      fullName: "Lucas Martinez",
      email: "lucas.martinez@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "12:30",
    duration: 45,
    appointmentType: "Skin Fade",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Mason Rodriguez",
      email: "mason.rodriguez@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "13:00",
    duration: 30,
    appointmentType: "Men’s Haircut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Isabella Hernandez",
      email: "isabella.hernandez@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "13:30",
    duration: 45,
    appointmentType: "Wash & Cut",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Ethan Lopez",
      email: "ethan.lopez@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "14:00",
    duration: 15,
    appointmentType: "Beard Trim",
    status: "Completed",
  },
  {
    customer: {
      fullName: "Ava Gonzalez",
      email: "ava.gonzalez@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "14:30",
    duration: 60,
    appointmentType: "Cut & Style",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Alexander Wilson",
      email: "alexander.wilson@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "15:00",
    duration: 30,
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Mia Anderson",
      email: "mia.anderson@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "15:30",
    duration: 30,
    appointmentType: "Blow Dry",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Daniel Thomas",
      email: "daniel.thomas@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "16:00",
    duration: 45,
    appointmentType: "Skin Fade",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Charlotte Taylor",
      email: "charlotte.taylor@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "16:30",
    duration: 45,
    appointmentType: "Wash & Cut",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Henry Moore",
      email: "henry.moore@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "17:00",
    duration: 30,
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Amelia Jackson",
      email: "amelia.jackson@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "17:30",
    duration: 60,
    appointmentType: "Cut & Style",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Sebastian Martin",
      email: "sebastian.martin@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "18:00",
    duration: 15,
    appointmentType: "Beard Trim",
    status: "Planned",
  },
  {
    customer: {
      fullName: "Harper Lee",
      email: "harper.lee@example.com",
      imageSrc: "https://avatar.iran.liara.run/public",
    },
    date: "2026-01-06",
    time: "18:30",
    duration: 30,
    appointmentType: "Men’s Haircut",
    status: "Planned",
  },
];
