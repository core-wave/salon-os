# SalonOS

Appointment scheduling platform for solo professionals and small businesses. Mobile-first, simple, no-frills.

## Quick Reference

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npx drizzle-kit generate   # Generate migration from schema changes
npx drizzle-kit migrate    # Run migrations
npx drizzle-kit studio     # Open Drizzle Studio (DB GUI)
```

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router)             |
| Frontend   | React 19, TypeScript                |
| UI         | HeroUI (beta), TailwindCSS 4        |
| Icons      | Iconify React                       |
| Backend    | Next.js Server Actions & API Routes |
| Database   | PostgreSQL + Drizzle ORM            |
| Auth       | BetterAuth (email/password + orgs)  |
| Email      | Resend + React Email                |
| Validation | Zod                                 |

## Project Structure

```
salon-os/
├── app/                      # Next.js App Router
│   ├── api/auth/[...all]/    # BetterAuth API handler
│   ├── auth/                 # Auth pages (login, signup)
│   ├── booking/              # Public booking page
│   └── dashboard/
│       ├── [organization]/   # Org-scoped dashboard pages
│       │   ├── appointments/
│       │   ├── appointment-types/
│       │   ├── customers/
│       │   ├── opening-hours/
│       │   ├── overview/
│       │   └── settings/
│       └── new-organization/
│
├── lib/                      # Core business logic
│   ├── auth/                 # BetterAuth config & actions
│   │   ├── index.ts          # Server-side auth config
│   │   ├── client.ts         # Client-side auth hooks
│   │   ├── functions.ts      # Server actions (signup, login)
│   │   └── schemas.ts        # Zod validation schemas
│   ├── db/
│   │   ├── index.ts          # Drizzle client
│   │   ├── schema.ts         # Domain tables (exports auth.ts)
│   │   └── auth.ts           # BetterAuth tables
│   ├── email/
│   │   ├── client.ts         # Resend client
│   │   ├── functions.ts      # Email sending functions
│   │   └── templates.tsx     # React Email templates
│   ├── organizations/        # Org management actions
│   ├── types.ts              # Shared TypeScript types
│   └── utils.ts              # Utility functions
│
├── components/               # Reusable UI components
│   ├── forms/
│   └── layout/
│
├── drizzle/                  # Generated migrations
└── PRD.txt                   # Product requirements document
```

## Database

### Schema Location
All tables defined in `lib/db/schema.ts` (domain) and `lib/db/auth.ts` (auth).

### Key Tables
- `user`, `session`, `organization`, `member` - BetterAuth managed
- `locations` - Physical business locations
- `opening_hours` - Weekly schedule (dayOfWeek 0-6, 0=Sunday)
- `opening_hour_exceptions` - Holidays/closures
- `appointment_types` - Services offered (name, duration, price)
- `customers` - Client records (can link to user account)
- `appointments` - Bookings with status tracking

### Multi-Tenant Pattern
All domain tables have `organizationId` foreign key. Always filter by org.

```typescript
// Always scope queries to organization
const appointments = await db.query.appointments.findMany({
  where: eq(appointments.organizationId, orgId),
});
```

### Migrations
```bash
# After changing schema.ts:
npx drizzle-kit generate   # Creates migration in /drizzle
npx drizzle-kit migrate    # Applies to database
```

## Authentication

Using BetterAuth with organization plugin.

### Server-Side
```typescript
import { auth } from "@/lib/auth";

// In server component or action
const session = await auth.api.getSession({ headers: await headers() });
```

### Client-Side
```typescript
import { authClient } from "@/lib/auth/client";

// React hooks
const { data: session } = authClient.useSession();

// Actions
await authClient.signIn.email({ email, password });
await authClient.signOut();
```

### Server Actions Pattern
```typescript
// lib/auth/functions.ts
"use server";

export async function signup(prevState: FormState, formData: FormData) {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  // ... call auth.api.signUpEmail
}
```

## Patterns & Conventions

### Form Handling
Using React 19 `useActionState` with server actions:

```typescript
// page.tsx (server component)
export default function Page() {
  return <Form />;
}

// form.tsx (client component)
"use client";

export function Form() {
  const [state, action, pending] = useActionState(serverAction, initialState);
  return (
    <form action={action}>
      {state.errors?.field && <p>{state.errors.field}</p>}
      <Button type="submit" isLoading={pending}>Submit</Button>
    </form>
  );
}
```

### Validation
Zod schemas in dedicated `schemas.ts` files:

```typescript
// lib/auth/schemas.ts
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
```

### Path Aliases
`@/` maps to project root. Use for all imports:

```typescript
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
```

### Naming Conventions
- Files: kebab-case (`password-field.tsx`)
- Components: PascalCase (`PasswordField`)
- Functions/variables: camelCase (`sendVerificationEmail`)
- Database tables: snake_case (`appointment_types`)
- TypeScript types: PascalCase (`AppointmentType`)

## Environment Variables

Required in `.env.local`:

```
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

## MVP Priorities

See `PRD.txt` for full details. Current focus:

1. **Opening Hours** - Weekly schedule configuration
2. **Appointment Types** - Service management CRUD
3. **Public Booking** - Customer-facing booking flow
4. **Email Notifications** - Booking confirmations & reminders
5. **Invite System** - Email links with invite codes

## UI Guidelines

- Mobile-first (primary target is phone)
- Simple over feature-rich
- HeroUI components for consistency
- Minimal, clean interface
- No unnecessary animations or complexity

## Common Tasks

### Add a New Dashboard Page

1. Create `app/dashboard/[organization]/new-page/page.tsx`
2. Add navigation item in `components/layout/sidebar.tsx`
3. Create server actions in `lib/new-feature/functions.ts`
4. Add Zod schemas in `lib/new-feature/schemas.ts`

### Add a Database Table

1. Define table in `lib/db/schema.ts`
2. Run `npx drizzle-kit generate`
3. Run `npx drizzle-kit migrate`
4. Add types to `lib/types.ts` if needed

### Add an Email Template

1. Create template in `lib/email/templates.tsx`
2. Add send function in `lib/email/functions.ts`
3. Use Resend client from `lib/email/client.ts`

## Current State

- Auth: Working (signup, login, email verification)
- Organizations: Working (create, membership)
- Dashboard: Scaffolding with mock data
- Booking: UI started, needs backend
- Opening Hours: Schema ready, UI placeholder
- Customers: Schema ready, UI placeholder
