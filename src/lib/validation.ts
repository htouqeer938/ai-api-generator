import { z } from "zod";

/* ─── Auth ─── */
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

/* ─── Generation ─── */
export const generationOptionsSchema = z.object({
  database: z.enum(["postgresql", "mysql", "sqlite", "mongodb"]),
  schemaType: z.enum(["sql", "prisma", "mongoose", "english"]),
  framework: z.enum(["express", "nextjs", "nestjs"]),
  language: z.enum(["javascript", "typescript"]),
  auth: z.object({ jwt: z.boolean(), refreshToken: z.boolean() }),
  validation: z.object({ zod: z.boolean(), joi: z.boolean() }),
  documentation: z.object({ swagger: z.boolean(), openapi: z.boolean() }),
});

export const generateRequestSchema = generationOptionsSchema.extend({
  input: z
    .string()
    .min(3, "Please provide a schema or a description")
    .max(20000, "Input is too large (20,000 char limit)"),
});

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
