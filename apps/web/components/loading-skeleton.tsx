import { cn, Skeleton } from "@uberskillz/ui";

interface LoadingSkeletonProps {
  /** Skeleton layout variant: card-grid, form, or table. */
  variant: "card-grid" | "form" | "table";
  /** Number of skeleton items to render (cards or table rows). Default: 6. */
  count?: number;
  className?: string;
}

/** Renders a single skeleton card matching the skill card layout. */
function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-6">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-1 h-3 w-24" />
    </div>
  );
}

/** Renders a skeleton form with label + input pairs. */
function SkeletonForm({ count }: { count: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

/** Renders a skeleton table with header and rows. */
function SkeletonTable({ count }: { count: number }) {
  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex gap-4 border-b pb-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Data rows */}
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder
        <div key={i} className="flex gap-4 py-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * Configurable loading skeleton for common page layouts.
 * Supports card-grid (skills library), form (editor/settings), and table patterns.
 */
export function LoadingSkeleton({ variant, count = 6, className }: LoadingSkeletonProps) {
  if (variant === "form") {
    return (
      <div className={cn(className)}>
        <SkeletonForm count={count} />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn(className)}>
        <SkeletonTable count={count} />
      </div>
    );
  }

  // card-grid variant
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
