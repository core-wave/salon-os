import z from "zod";

export const signupSchema = z
  .object({
    name: z.string("Please enter a valid name"),

    email: z.email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password is too long"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupProps = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),

  password: z.string("Please enter a valid password"),
});

export type LoginProps = z.infer<typeof loginSchema>;
