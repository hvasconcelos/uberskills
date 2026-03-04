import { Skeleton } from "@uberskills/ui";

import { LoadingSkeleton } from "@/components/loading-skeleton";

/** Loading skeleton for the Skills Library page (header, controls, card grid). */
export default function SkillsLibraryLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md sm:w-[140px]" />
      </div>

      <LoadingSkeleton variant="card-grid" count={8} className="lg:grid-cols-3 xl:grid-cols-4" />
    </div>
  );
}
