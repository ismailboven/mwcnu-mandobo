"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Label } from "@mwcnu/ui";
import { LoginSchema, type LoginInput } from "@mwcnu/validations";
import { createBrowserSupabase } from "@/lib/supabase/client";

interface LoginFormProps {
  next: string | undefined;
  initialError?: string | undefined;
}

const ERROR_MESSAGES: Record<string, string> = {
  no_role:
    "Akun Anda berhasil masuk, namun belum memiliki hak akses (role) pengurus di database. Silakan jalankan query penetapan role super_admin di Supabase.",
  unauthorized: "Sesi Anda telah berakhir. Silakan masuk kembali.",
  forbidden: "Anda tidak memiliki izin untuk mengakses halaman ini.",
};

export function LoginForm({ next, initialError }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(
    initialError ? (ERROR_MESSAGES[initialError] ?? "Gagal memverifikasi akses.") : null
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: LoginInput) => {
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createBrowserSupabase();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          setError("Email atau kata sandi salah. Periksa kembali data login Anda.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Email belum dikonfirmasi di Supabase Auth.");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push(next ?? "/admin");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke Supabase. Periksa konfigurasi kredensial environment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="pengurus@mwcnumandobo.or.id"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? <p className="text-destructive text-xs">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        ) : null}
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-xs leading-relaxed">
          {error}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
