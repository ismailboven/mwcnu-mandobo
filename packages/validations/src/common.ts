import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().email("Masukkan alamat email yang valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus kebab-case");

export const IdSchema = z.string().uuid("ID tidak valid");

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
