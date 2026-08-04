import { Badge, Card, CardContent, CardHeader, CardTitle } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";

const OVERVIEW = [
  { label: "Berita Terbit", value: "—" },
  { label: "Agenda Aktif", value: "—" },
  { label: "Unduhan", value: "—" },
  { label: "Pengurus", value: "—" },
];

export default function AdminDashboardPage() {
  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <Badge variant="success">Live</Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-extrabold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
