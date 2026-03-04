"use client";

import {
  Button,
  cn,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uberskillz/ui";
import { LayoutGrid, List, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "deployed", label: "Deployed" },
] as const;

const DEBOUNCE_MS = 300;

export type ViewMode = "grid" | "list";

const STORAGE_KEY = "uberskillz-view-mode";

/** Reads the persisted view preference from localStorage, defaulting to "grid". */
function getStoredViewMode(): ViewMode {
  if (typeof window === "undefined") return "grid";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "list" ? "list" : "grid";
}

interface SkillsLibraryControlsProps {
  /** Current view mode — controlled by parent. */
  viewMode: ViewMode;
  /** Callback when the user toggles between grid and list view. */
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Client-side search input, status filter, and view toggle for the Skills Library page.
 * Syncs search/status with URL search params so state is shareable and bookmarkable.
 * View mode is persisted in localStorage via the parent component.
 */
export function SkillsLibraryControls({ viewMode, onViewModeChange }: SkillsLibraryControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";

  const [inputValue, setInputValue] = useState(currentQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep input in sync when URL params change externally (e.g. back/forward navigation)
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  /** Replaces URL search params without a full page reload. */
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  /** Debounced search: updates URL params after 300ms of inactivity. */
  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateParams({ q: value });
      }, DEBOUNCE_MS);
    },
    [updateParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search skills..."
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search skills by name, description, or tags"
        />
      </div>

      <Select value={currentStatus} onValueChange={(value) => updateParams({ status: value })}>
        <SelectTrigger className="w-full sm:w-[140px]" aria-label="Filter by status">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Grid / List view toggle */}
      <div className="flex gap-1 rounded-md border p-0.5" role="radiogroup" aria-label="View mode">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          className={cn("size-8", viewMode === "grid" && "shadow-sm")}
          onClick={() => onViewModeChange("grid")}
          aria-label="Grid view"
          aria-checked={viewMode === "grid"}
          role="radio"
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          className={cn("size-8", viewMode === "list" && "shadow-sm")}
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
          aria-checked={viewMode === "list"}
          role="radio"
        >
          <List className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export { getStoredViewMode, STORAGE_KEY };
