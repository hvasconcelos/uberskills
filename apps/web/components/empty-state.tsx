import { cn } from "@uberskills/ui";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  /** Lucide icon component displayed above the title. */
  icon: LucideIcon;
  /** Heading text describing the empty state. */
  title: string;
  /** Explanatory description shown below the title. */
  description: string;
  /** Optional call-to-action rendered below the description (e.g. a Button). */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Empty state placeholder for pages or sections with no data.
 * Renders a centered icon, title, description, and optional CTA.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <Icon className="mb-3 size-10 text-muted-foreground" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
