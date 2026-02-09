import { PropsWithChildren } from "react";
import { cn } from "src/lib/utils";

interface SectionProps extends PropsWithChildren {
  id: string;
  className?: string;
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section data-section={id} className={cn("section", className)}>
      {children}
    </section>
  );
}
