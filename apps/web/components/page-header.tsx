import { cn } from "@uberskillz/ui";

interface PageHeaderProps {
  /** Page title displayed as an h1. */
  title: string;
  /** Optional description shown below the title in muted text. */
  description?: string;
  /** Optional action buttons rendered on the right side of the header. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable page header with title, optional description, and optional action area.
 * Used at the top of pages like Skills Library, Settings, Import, etc.
 */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-page-title tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
