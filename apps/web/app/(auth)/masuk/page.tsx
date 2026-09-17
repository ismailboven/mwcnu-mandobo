import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mwcnu/ui";
import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false },
};

export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <Container className="flex min-h-160 items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>Silakan masuk untuk mengelola konten MWCNU Mandobo.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm next={next} initialError={error} />
        </CardContent>
      </Card>
    </Container>
  );
}
