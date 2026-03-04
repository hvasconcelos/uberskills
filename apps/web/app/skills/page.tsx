import { listSkills } from "@uberskillz/db";
import type { SkillStatus } from "@uberskillz/types";
import { Button } from "@uberskillz/ui";
import { Library, Plus, SearchX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SkillsLibraryView } from "@/components/skills-library-view";

// Skills library reads live data -- disable static generation.
export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set<SkillStatus>(["draft", "ready", "deployed"]);

interface SkillsPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

/**
 * Skills Library page -- browsable, searchable grid/list of all skills.
 * Reads `q` and `status` from URL search params to filter results.
 * View mode (grid/list) is managed client-side via SkillsLibraryView.
 */
export default async function SkillsLibraryPage({ searchParams }: SkillsPageProps) {
  const params = await searchParams;

  const search = params.q?.trim() || undefined;
  const status =
    params.status && VALID_STATUSES.has(params.status as SkillStatus)
      ? (params.status as SkillStatus)
      : undefined;

  const { data: skills, total } = listSkills({ search, status, limit: 12 });
  const hasFilters = !!search || !!status;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills Library"
        actions={
          <Button asChild>
            <Link href="/skills/new">
              <Plus className="size-4" />
              New Skill
            </Link>
          </Button>
        }
      />

      {/* Controls toolbar (search, filter, view toggle) + skills grid/list */}
      <Suspense>
        <SkillsLibraryView skills={skills} />
      </Suspense>

      {hasFilters && skills.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "skill" : "skills"} found
        </p>
      )}

      {skills.length === 0 && !hasFilters && (
        <EmptyState
          icon={Library}
          title="No skills yet"
          description="Create your first skill to get started."
          action={
            <Button asChild>
              <Link href="/skills/new">
                <Plus className="size-4" />
                Create your first skill
              </Link>
            </Button>
          }
        />
      )}

      {skills.length === 0 && hasFilters && (
        <EmptyState
          icon={SearchX}
          title={search ? `No skills matching "${search}"` : "No matching skills"}
          description="Try adjusting your search or filters."
        />
      )}
    </div>
  );
}
