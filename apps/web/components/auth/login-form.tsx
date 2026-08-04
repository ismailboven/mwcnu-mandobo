"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Label } from "@mwcnu/ui";
import { LoginSchema, type LoginInput } from "@mwcnu/validations";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string | undefined }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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
      const { error: authError } = await supabase.auth.signInWithPassword(values);

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push(next ?? "/admin");
      router.refresh();
    } catch {
      setError("Supabase belum dikonfigurasi. Periksa file .env.local terlebih dahulu.");
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
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
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
        {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
      </div>

      {error ? (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Masuk..." : "Masuk"}
      </Button>
    </form>
  );
}
