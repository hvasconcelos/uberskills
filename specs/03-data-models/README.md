# 03 — Data Models

## Overview

UberSkillz uses **SQLite** as its database, accessed via **Drizzle ORM** for type-safe queries. The database file is stored locally at `data/uberskillz.db` (configurable via `DATABASE_URL` env var).

There are **5 tables**: `skills`, `skill_files`, `skill_versions`, `test_runs`, and `settings`.

## Entity-Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│       skills         │       │      settings        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ key (PK)             │
│ name                │       │ value                │
│ slug                │       │ encrypted            │
│ description         │       │ updated_at           │
│ trigger             │       └─────────────────────┘
│ tags                │
│ model_pattern       │
│ content             │
│ status              │
│ created_at          │
│ updated_at          │
└────────┬────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│    skill_files       │
├─────────────────────┤
│ id (PK)             │
│ skill_id (FK)       │──────► skills.id
│ path                │
│ content             │
│ type                │
│ created_at          │
│ updated_at          │
└─────────────────────┘

         │
         │ 1:N
         ▼
┌─────────────────────┐
│   skill_versions     │
├─────────────────────┤
│ id (PK)             │
│ skill_id (FK)       │──────► skills.id
│ version             │
│ content_snapshot     │
│ metadata_snapshot    │
│ change_summary       │
│ created_at          │
└─────────────────────┘

         │
         │ 1:N
         ▼
┌─────────────────────┐
│    test_runs         │
├─────────────────────┤
│ id (PK)             │
│ skill_id (FK)       │──────► skills.id
│ model               │
│ system_prompt        │
│ user_message         │
│ assistant_response   │
│ arguments            │
│ prompt_tokens        │
│ completion_tokens    │
│ total_tokens         │
│ latency_ms           │
│ ttft_ms              │
│ status               │
│ error                │
│ created_at          │
└─────────────────────┘
```

## Drizzle Schema Definitions

### `skills` Table

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),                          // nanoid
  name: text("name").notNull(),                         // Human-readable skill name
  slug: text("slug").notNull().unique(),                // URL-safe identifier
  description: text("description").notNull().default(""),
  trigger: text("trigger").notNull().default(""),       // When the skill should activate
  tags: text("tags").notNull().default("[]"),           // JSON array of tag strings
  modelPattern: text("model_pattern"),                  // Regex for model matching (optional)
  content: text("content").notNull().default(""),       // SKILL.md markdown body (instructions)
  status: text("status", {
    enum: ["draft", "ready", "deployed"],
  }).notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

### `skill_files` Table

```typescript
export const skillFiles = sqliteTable("skill_files", {
  id: text("id").primaryKey(),                          // nanoid
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  path: text("path").notNull(),                         // Relative path: "prompts/setup.md"
  content: text("content").notNull().default(""),
  type: text("type", {
    enum: ["prompt", "resource"],
  }).notNull().default("resource"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

### `skill_versions` Table

```typescript
export const skillVersions = sqliteTable("skill_versions", {
  id: text("id").primaryKey(),                          // nanoid
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),                // Auto-incremented per skill
  contentSnapshot: text("content_snapshot").notNull(),   // Full SKILL.md at this version
  metadataSnapshot: text("metadata_snapshot").notNull(), // JSON of frontmatter at this version
  changeSummary: text("change_summary").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

### `test_runs` Table

```typescript
export const testRuns = sqliteTable("test_runs", {
  id: text("id").primaryKey(),                          // nanoid
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  model: text("model").notNull(),                       // e.g. "anthropic/claude-sonnet-4"
  systemPrompt: text("system_prompt").notNull(),        // Resolved system prompt sent to model
  userMessage: text("user_message").notNull(),
  assistantResponse: text("assistant_response"),        // null while streaming
  arguments: text("arguments").notNull().default("{}"), // JSON of substituted arguments
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  totalTokens: integer("total_tokens"),
  latencyMs: integer("latency_ms"),                     // Total response time
  ttftMs: integer("ttft_ms"),                           // Time to first token
  status: text("status", {
    enum: ["running", "completed", "error"],
  }).notNull().default("running"),
  error: text("error"),                                 // Error message if status = "error"
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

### `settings` Table

```typescript
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),                        // e.g. "openrouter_api_key"
  value: text("value").notNull(),
  encrypted: integer("encrypted", { mode: "boolean" })
    .notNull()
    .default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

## TypeScript Interfaces

These are defined in `packages/types/` and shared across all packages.

### `Skill`

```typescript
export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  trigger: string;
  tags: string[];
  modelPattern: string | null;
  content: string;           // Markdown instructions body
  status: "draft" | "ready" | "deployed";
  createdAt: Date;
  updatedAt: Date;
}
```

### `SkillFrontmatter`

Represents the YAML frontmatter of a `SKILL.md` file, per the Claude Code spec.

```typescript
export interface SkillFrontmatter {
  name: string;
  description: string;
  trigger: string;
  model_pattern?: string;
}
```

### `SkillFile`

```typescript
export interface SkillFile {
  id: string;
  skillId: string;
  path: string;              // e.g. "prompts/setup.md"
  content: string;
  type: "prompt" | "resource";
  createdAt: Date;
  updatedAt: Date;
}
```

### `SkillVersion`

```typescript
export interface SkillVersion {
  id: string;
  skillId: string;
  version: number;
  contentSnapshot: string;
  metadataSnapshot: SkillFrontmatter;
  changeSummary: string;
  createdAt: Date;
}
```

### `TestRun`

```typescript
export interface TestRun {
  id: string;
  skillId: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  assistantResponse: string | null;
  arguments: Record<string, string>;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  latencyMs: number | null;
  ttftMs: number | null;
  status: "running" | "completed" | "error";
  error: string | null;
  createdAt: Date;
}
```

### `AppSettings`

```typescript
export interface AppSettings {
  openrouterApiKey: string | null;
  defaultModel: string;                // e.g. "anthropic/claude-sonnet-4"
  theme: "light" | "dark" | "system";
}
```

## Known Settings Keys

| Key | Type | Encrypted | Description |
|---|---|---|---|
| `openrouter_api_key` | string | Yes | OpenRouter API key |
| `default_model` | string | No | Default model ID for testing |
| `theme` | string | No | UI theme preference |

## Indexes

```typescript
// Recommended indexes for query performance
// (defined alongside schema in schema.ts)

// skills: search by name, filter by status, sort by updated_at
//   - idx_skills_slug (unique)
//   - idx_skills_status
//   - idx_skills_updated_at

// skill_files: lookup by skill
//   - idx_skill_files_skill_id

// skill_versions: lookup by skill, sort by version
//   - idx_skill_versions_skill_id_version

// test_runs: lookup by skill, sort by created_at
//   - idx_test_runs_skill_id
//   - idx_test_runs_created_at
```

## Cross-References

- Table usage in API routes → [02-architecture](../02-architecture/README.md)
- Fields mapped to UI forms → [04-functional-requirements](../04-functional-requirements/README.md)
- Encryption for settings → [05-non-functional-requirements](../05-non-functional-requirements/README.md)
- Skill-engine parsing/generation uses these types → [06-integrations](../06-integrations/README.md)
