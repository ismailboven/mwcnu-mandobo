import { Construction } from "lucide-react";
import { Card } from "@mwcnu/ui";

export function ComingSoon({ description }: { description?: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 p-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-accent text-primary">
        <Construction className="size-6" />
      </span>
      <p className="font-display text-lg font-bold">Segera Hadir</p>
      <p className="max-w-md text-sm text-muted-foreground">
        {description ?? "Modul ini sedang dalam pengembangan dan akan segera diluncurkan."}
      </p>
    </Card>
  );
}
