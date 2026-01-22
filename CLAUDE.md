# SalonOS

Appointment scheduling platform for solo professionals and small businesses. Mobile-first, simple, no-frills.

## Working Together

- Be honest and direct. Call out bad ideas and mistakes - no sycophancy, no "you're absolutely right" - just honest technical judgment.
- Ask for clarification rather than making assumptions.
- Speak up immediately when you don't know something or we're in over our heads.
- When you disagree with an approach, push back with specific technical reasons. If it's just a gut feeling, say so.
- Be skeptical of comments claiming "not supported" - verify with actual evidence before accepting.
- Investigate context and requirements BEFORE attempting fixes.
- If you're having trouble, stop and ask for help.

## Design Principles

- **YAGNI wins.** The best code is no code. Don't add features we don't need right now. When YAGNI conflicts with extensibility, YAGNI wins.
- **Simplicity over cleverness.** Strongly prefer simple, clean, maintainable solutions over clever or complex ones. Readability and maintainability are primary concerns, even at the cost of conciseness or performance.
- **Good naming matters.** Name functions, variables, classes so that their full utility is obvious. Reusable, generic things should have reusable generic names.
- **Fix at the source.** Always apply the proper fix at the source rather than workarounds in multiple places.
- **Search before writing.** Before writing new code, search for existing patterns, verify types/interfaces by examining similar code, and check actual usage.

### Naming and Comments

Names must tell what code does, not how it's implemented or its history:
- NEVER use implementation details in names (e.g., "ZodValidator", "JSONParser")
- NEVER use temporal/historical context (e.g., "NewAPI", "LegacyHandler")
- NEVER use pattern names unless they add clarity (prefer "Tool" over "ToolFactory")

Good names tell a story about the domain:
- `Tool` not `AbstractToolInterface`
- `Registry` not `ToolRegistryManager`
- `execute()` not `executeToolWithValidation()`

Comments must describe what the code does NOW, not:
- What it used to do
- How it was refactored
- What framework/library it uses internally
- Why it's better than some previous version

If you catch yourself writing "new", "old", "legacy", "wrapper", or implementation details in names or comments, stop and find a better name.

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

### Code Quality

- Make the SMALLEST reasonable changes to achieve the desired outcome.
- NEVER make code changes unrelated to your current task.
- Work hard to reduce code duplication, even if refactoring takes extra effort.
- Never throw away or rewrite implementations without explicit permission.
- Match the style and formatting of surrounding code. Consistency within a file trumps external standards.
- Never remove code comments unless you can prove they are actively false.
- Ask about specific use cases and context BEFORE implementing features.
- When converting or replacing code, clarify whether old code should be removed or kept.

### Testing

- When fixing a bug, start by writing a test that proves the issue exists and is reproducible.
- Write unit tests for complex, self-contained logic with minimal external dependencies.
- Write integration tests to prove bug fixes work or new functionality behaves correctly.

### Error Handling

- Synchronous code (user waiting): fail fast. Retries don't help when someone is waiting.
- Async/background jobs: retries are acceptable, exponential backoff where reasonable.

### Version Control

- Read-only git commands are allowed without permission (`git blame`, `git log`, `git diff`, `git status`, `git show`).
- All write operations (commit, push, checkout, reset, etc.) require explicit approval.

### Task Tracking

- Use TodoWrite to track multi-step tasks and give visibility into progress.
- Mark tasks as in_progress BEFORE starting work, and completed IMMEDIATELY after finishing.
- When you notice unrelated issues, document them rather than fixing immediately.
- When you have independent exploration tasks, spawn multiple sub-agents in parallel rather than running sequentially.

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
