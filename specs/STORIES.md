# Implementation Stories -- UberSkills

> Generated from specifications in `specs/`
> Last updated: 2026-03-03

## Summary

| Metric | Value |
|---|---|
| **Total Stories** | 62 |
| **Total Sprints** | 8 (Sprint 0 through Sprint 7) |
| **Estimated Duration** | 16 weeks |
| **Total Estimated Days** | 63 days |

### Story Size Breakdown

| Size | Count | Days Each | Total Days |
|---|---|---|---|
| XS | 6 | 0.25 | 1.5 |
| S | 20 | 0.5 | 10 |
| M | 24 | 1 | 24 |
| L | 10 | 2 | 20 |
| XL | 2 | 3.5 | 7 |

### Sprint Capacity Overview

| Sprint | Focus | Stories | Planned Days | Buffer |
|---|---|---|---|---|
| Sprint 0 | Project Setup & Scaffolding | 8 | 6.5 | 35% |
| Sprint 1 | Types, Database & Skill Engine | 8 | 8.5 | 15% |
| Sprint 2 | UI Package & App Shell | 8 | 8.0 | 20% |
| Sprint 3 | Settings & Skills Library | 8 | 8.0 | 20% |
| Sprint 4 | Skill Editor | 9 | 9.0 | 10% |
| Sprint 5 | AI-Assisted Creation & Testing | 8 | 8.5 | 15% |
| Sprint 6 | Export, Deploy & Import | 7 | 8.0 | 20% |
| Sprint 7 | Polish, Testing & Deployment | 6 | 6.5 | 35% |

---

## Sprint 0 (Weeks 1-2) -- Project Setup & Scaffolding

**Focus**: Monorepo scaffolding, tooling configuration, documentation, and developer onboarding. Everything needed before any feature code can be written.

**Planned Capacity**: 6.5 days (out of 10 available)

---

### S0-1: Initialize Turborepo monorepo with Bun

**Size**: M (1 day)

**Description**:
Create the root monorepo structure using Turborepo with Bun as the package manager. This establishes the foundational project layout that all other work depends on.

**Acceptance Criteria**:
- [ ] Root `package.json` with `workspaces` pointing to `apps/*` and `packages/*`
- [ ] `turbo.json` with pipeline for `build`, `dev`, `lint`, `typecheck`, `test`, and `db:migrate` tasks as specified in the architecture spec
- [ ] Root `tsconfig.json` with strict TypeScript configuration and path aliases
- [ ] `bun.lock` generated via `bun install`
- [ ] `.gitignore` covering `node_modules`, `.next`, `dist`, `data/`, `.env*`, `.secret`
- [ ] Empty placeholder directories: `apps/web/`, `packages/ui/`, `packages/db/`, `packages/skill-engine/`, `packages/types/`
- [ ] Each package has a minimal `package.json` with correct `name` field (`@uberskills/<name>`)
- [ ] Running `bun install` from root succeeds without errors

**Dependencies**: None

**Files to Create**:
- `package.json` -- root workspace config
- `turbo.json` -- Turborepo pipeline
- `tsconfig.json` -- base TypeScript config
- `.gitignore` -- version control exclusions
- `apps/web/package.json` -- Next.js app placeholder
- `packages/ui/package.json` -- UI package placeholder
- `packages/db/package.json` -- DB package placeholder
- `packages/skill-engine/package.json` -- skill-engine placeholder
- `packages/types/package.json` -- types package placeholder

---

### S0-2: Configure Biome for linting and formatting

**Size**: S (0.5 day)

**Description**:
Set up Biome as the single linter and formatter for the entire monorepo. Configure rules for TypeScript, define format settings, and add root-level lint/format scripts.

**Acceptance Criteria**:
- [ ] `biome.json` at root with formatting rules (indent: 2 spaces, line width: 100, single quotes disabled)
- [ ] TypeScript-specific lint rules enabled (no unused variables, no explicit any, etc.)
- [ ] Ignore patterns for `node_modules`, `.next`, `dist`, `data/`
- [ ] `bun run lint` works from root and checks all packages
- [ ] `bun run format` works from root and formats all files
- [ ] `bun run lint:fix` auto-fixes lintable issues

**Dependencies**: S0-1

**Files to Create**:
- `biome.json` -- Biome configuration

**Files to Modify**:
- `package.json` -- add `lint`, `format`, `lint:fix` scripts

---

### S0-3: Create root README.md

**Size**: S (0.5 day)

**Description**:
Write the root README.md that serves as the project's public-facing documentation. Covers what UberSkills is, the tech stack, quickstart instructions, project structure, and contribution guidelines.

**Acceptance Criteria**:
- [ ] Project title, tagline, and badges (license, build status placeholder)
- [ ] Clear "What is UberSkills?" section summarizing the tool
- [ ] Tech stack table matching the specification
- [ ] Quickstart section with exact commands: `git clone`, `bun install`, `bun dev`
- [ ] Monorepo structure overview showing packages and their purposes
- [ ] Available scripts section: `bun dev`, `bun build`, `bun lint`, `bun test`, `bun typecheck`
- [ ] Environment variables table with defaults
- [ ] License section (MIT)
- [ ] Links to specs directory for detailed documentation

**Dependencies**: S0-1

**Files to Create**:
- `README.md` -- root project documentation

---

### S0-4: Create CLAUDE.md for AI-assisted development

**Size**: M (1 day)

**Description**:
Write a comprehensive CLAUDE.md file at the project root that provides context and guidelines for Claude Code when working on this codebase. This file ensures consistent AI-assisted development across the project.

**Acceptance Criteria**:
- [ ] Project overview section describing UberSkills purpose and architecture
- [ ] Tech stack and key dependencies listed with versions
- [ ] Monorepo structure with package responsibilities
- [ ] Coding conventions: TypeScript strict, Biome formatting rules, import style
- [ ] Database patterns: Drizzle ORM usage, nanoid for IDs, JSON string storage for arrays
- [ ] API route patterns: Next.js App Router conventions, error response format `{ error, code }`
- [ ] Component patterns: shadcn/ui usage, Tailwind CSS v4, CSS custom properties for theming
- [ ] Testing patterns: Vitest for unit tests, Playwright for E2E
- [ ] Common commands: dev, build, lint, test, typecheck, db:migrate
- [ ] File naming conventions (kebab-case files, PascalCase components)
- [ ] Security reminders: never log API keys, always use parameterized queries

**Dependencies**: S0-1

**Files to Create**:
- `CLAUDE.md` -- AI assistant context file

---

### S0-5: Initialize Next.js 15 app shell

**Size**: M (1 day)

**Description**:
Set up the Next.js 15 application in `apps/web/` with App Router, TypeScript, and Tailwind CSS v4. This creates the empty web application shell that all pages and API routes will be built upon.

**Acceptance Criteria**:
- [ ] Next.js 15 installed with App Router enabled
- [ ] `apps/web/app/layout.tsx` with root layout (html, body, metadata)
- [ ] `apps/web/app/page.tsx` with placeholder home page
- [ ] Tailwind CSS v4 configured with `apps/web/styles/globals.css`
- [ ] `apps/web/next.config.ts` with `transpilePackages` for workspace packages
- [ ] `apps/web/tsconfig.json` extending root config with path aliases (`@/` for `apps/web/`)
- [ ] Geist Sans and Geist Mono fonts loaded via `next/font`
- [ ] `bun dev` starts the Next.js dev server on port 3000
- [ ] `bun build` produces a production build without errors

**Dependencies**: S0-1, S0-2

**Files to Create**:
- `apps/web/app/layout.tsx` -- root layout
- `apps/web/app/page.tsx` -- placeholder home
- `apps/web/styles/globals.css` -- global styles with Tailwind
- `apps/web/next.config.ts` -- Next.js configuration
- `apps/web/tsconfig.json` -- app TypeScript config

**Files to Modify**:
- `apps/web/package.json` -- add Next.js dependencies and scripts

---

### S0-6: Configure Vitest for unit testing

**Size**: S (0.5 day)

**Description**:
Set up Vitest as the test runner across all packages. Configure workspace-level test config and ensure each package can run tests independently or together from the root.

**Acceptance Criteria**:
- [ ] `vitest.config.ts` at root or workspace-level config
- [ ] Each package (`types`, `db`, `skill-engine`) has a `vitest.config.ts` or uses shared config
- [ ] `bun run test` from root runs all package tests via Turborepo
- [ ] A sample test in `packages/types/` passes to verify setup
- [ ] Test coverage reporting configured (optional but recommended)
- [ ] TypeScript path aliases resolve correctly in test files

**Dependencies**: S0-1

**Files to Create**:
- `vitest.config.ts` -- root/workspace Vitest config
- `packages/types/src/__tests__/sample.test.ts` -- verification test

**Files to Modify**:
- `package.json` -- add `test` script
- `packages/types/package.json` -- add `test` script and vitest dependency

---

### S0-7: Configure Playwright for E2E testing

**Size**: S (0.5 day)

**Description**:
Set up Playwright in the web app for end-to-end testing. Configure the test runner to start the dev server automatically and define base test configuration.

**Acceptance Criteria**:
- [ ] `apps/web/playwright.config.ts` with base URL `http://localhost:3000`
- [ ] Web server auto-start configured in Playwright config
- [ ] `apps/web/e2e/` directory with a sample smoke test (page loads, title visible)
- [ ] `bun run test:e2e` from root runs Playwright tests
- [ ] Chrome, Firefox, and WebKit projects configured
- [ ] Screenshot and trace-on-failure configured for debugging

**Dependencies**: S0-5

**Files to Create**:
- `apps/web/playwright.config.ts` -- Playwright configuration
- `apps/web/e2e/smoke.spec.ts` -- sample smoke test

**Files to Modify**:
- `apps/web/package.json` -- add `test:e2e` script
- `package.json` -- add root `test:e2e` script

---

### S0-8: Set up CI/CD with GitHub Actions

**Size**: M (1 day)

**Description**:
Create the GitHub Actions CI workflow that runs lint, typecheck, test, build, and e2e on every push and PR to main. This is the quality gate for all future contributions.

**Acceptance Criteria**:
- [ ] `.github/workflows/ci.yml` with jobs: lint, typecheck, test, build, e2e
- [ ] Uses `oven-sh/setup-bun@v2` action for Bun runtime
- [ ] `bun install --frozen-lockfile` for reproducible installs
- [ ] Build job depends on lint + typecheck + test passing
- [ ] E2E job depends on build passing
- [ ] Playwright install step with `--with-deps`
- [ ] `.github/workflows/release.yml` for Docker image push on tag (v*)
- [ ] Workflow triggers on push to `main` and pull requests to `main`

**Dependencies**: S0-5, S0-6, S0-7

**Files to Create**:
- `.github/workflows/ci.yml` -- CI pipeline
- `.github/workflows/release.yml` -- release pipeline

---

## Sprint 1 (Weeks 3-4) -- Types, Database & Skill Engine Core

**Focus**: Build the foundational packages that all features depend on: shared types, database schema with migrations and queries, and the core skill engine (parser, validator, generator).

**Planned Capacity**: 8.5 days (out of 10 available)

---

### S1-1: Create @uberskills/types package -- core interfaces

**Size**: M (1 day)

**Description**:
Implement all shared TypeScript interfaces and types in the `packages/types/` package. These types are used by every other package and the web app. Includes Skill, SkillFrontmatter, SkillFile, SkillVersion, TestRun, AppSettings, and supporting types.

**Acceptance Criteria**:
- [ ] `packages/types/src/skill.ts` exports `Skill`, `SkillFrontmatter`, `SkillFile`, `SkillVersion` interfaces exactly as specified in 03-data-models
- [ ] `packages/types/src/test-run.ts` exports `TestRun` interface
- [ ] `packages/types/src/settings.ts` exports `AppSettings` interface
- [ ] `packages/types/src/index.ts` re-exports all types
- [ ] `ValidationError` type with `field`, `message`, `severity` fields
- [ ] Status enum types: `SkillStatus = "draft" | "ready" | "deployed"`, `TestRunStatus = "running" | "completed" | "error"`, `FileType = "prompt" | "resource"`, `Theme = "light" | "dark" | "system"`
- [ ] Package builds successfully with `tsc`
- [ ] Unit tests verify type exports are correctly available
- [ ] `package.json` has correct `main`, `types`, and `exports` fields

**Dependencies**: S0-1

**Files to Create**:
- `packages/types/src/skill.ts`
- `packages/types/src/test-run.ts`
- `packages/types/src/settings.ts`
- `packages/types/src/index.ts`
- `packages/types/tsconfig.json`

---

### S1-2: Create @uberskills/db -- Drizzle schema definitions

**Size**: M (1 day)

**Description**:
Define all 5 database tables using Drizzle ORM's SQLite schema API. Includes the `skills`, `skill_files`, `skill_versions`, `test_runs`, and `settings` tables with all columns, types, defaults, foreign keys, and indexes as specified in the data models spec.

**Acceptance Criteria**:
- [ ] `packages/db/src/schema.ts` defines all 5 tables matching the spec exactly
- [ ] All foreign keys with `onDelete: "cascade"` configured
- [ ] All indexes defined: `idx_skills_slug` (unique), `idx_skills_status`, `idx_skills_updated_at`, `idx_skill_files_skill_id`, `idx_skill_versions_skill_id_version`, `idx_test_runs_skill_id`, `idx_test_runs_created_at`
- [ ] Timestamp columns use `{ mode: "timestamp" }` with `$defaultFn(() => new Date())`
- [ ] Enum columns use `text("column", { enum: [...] })` pattern
- [ ] JSON columns (`tags`, `arguments`, `metadata_snapshot`) stored as `text` with default values
- [ ] `nanoid` used for all `id` primary keys
- [ ] Schema exports all table definitions
- [ ] `drizzle.config.ts` configured for SQLite

**Dependencies**: S1-1

**Files to Create**:
- `packages/db/src/schema.ts` -- table definitions
- `packages/db/drizzle.config.ts` -- Drizzle Kit config
- `packages/db/tsconfig.json`

---

### S1-3: Create @uberskills/db -- client and connection

**Size**: M (1 day)

**Description**:
Implement the database client that supports both local SQLite (via `better-sqlite3`) and remote Turso (via `@libsql/client`). The client auto-detects the connection type based on `DATABASE_URL` scheme (`file:` vs `libsql://`).

**Acceptance Criteria**:
- [ ] `packages/db/src/client.ts` exports a `getDb()` function returning a Drizzle instance
- [ ] Detects `file:` prefix in `DATABASE_URL` for local SQLite via `better-sqlite3`
- [ ] Detects `libsql://` prefix for Turso via `@libsql/client`
- [ ] Default `DATABASE_URL` is `file:data/uberskills.db` when not set
- [ ] Auto-creates `data/` directory if it does not exist
- [ ] Singleton pattern: database connection reused across requests
- [ ] Database file path is resolved relative to the project root
- [ ] Unit tests verify both SQLite and mock libsql initialization paths
- [ ] Exports typed `db` instance for use in queries

**Dependencies**: S1-2

**Files to Create**:
- `packages/db/src/client.ts` -- database client
- `packages/db/src/index.ts` -- package entry point

---

### S1-4: Create @uberskills/db -- migrations and seed

**Size**: S (0.5 day)

**Description**:
Generate the initial Drizzle migration from the schema, implement a migration runner that auto-migrates on first connection, and optionally seed the database with sample data for development.

**Acceptance Criteria**:
- [ ] `bun run db:generate` generates migration SQL in `packages/db/src/migrations/`
- [ ] `bun run db:migrate` applies pending migrations
- [ ] Migrations run automatically on first `getDb()` call (detect uninitialized DB)
- [ ] `packages/db/src/seed.ts` creates 3-5 sample skills for development (optional, behind flag)
- [ ] Migration creates all tables and indexes defined in schema
- [ ] Fresh `bun dev` creates the database and runs migrations without manual steps

**Dependencies**: S1-3

**Files to Create**:
- `packages/db/src/migrations/` -- generated migration files
- `packages/db/src/migrate.ts` -- migration runner
- `packages/db/src/seed.ts` -- development seed data

**Files to Modify**:
- `packages/db/package.json` -- add `db:generate`, `db:migrate`, `db:seed` scripts

---

### S1-5: Create @uberskills/db -- query functions (skills)

**Size**: M (1 day)

**Description**:
Implement typed query functions for the `skills` table: list with search/filter/pagination, get by ID, create, update, delete. These functions encapsulate all database access and are used by API routes.

**Acceptance Criteria**:
- [ ] `packages/db/src/queries/skills.ts` exports all CRUD functions
- [ ] `listSkills({ search?, status?, page?, limit? })` -- filters by name/description/tags, status, paginated (default 12/page), sorted by `updated_at` desc
- [ ] `getSkillById(id)` -- returns single skill or null
- [ ] `getSkillBySlug(slug)` -- returns single skill or null
- [ ] `createSkill(data)` -- generates nanoid, auto-generates slug from name, sets timestamps
- [ ] `updateSkill(id, data)` -- partial update, bumps `updated_at`
- [ ] `deleteSkill(id)` -- cascading delete (handled by FK constraints)
- [ ] Slug generation: lowercase, hyphenated, unique (append suffix if collision)
- [ ] Search uses SQLite `LIKE` operator on name, description, and tags fields
- [ ] Unit tests for each query function using in-memory SQLite

**Dependencies**: S1-4

**Files to Create**:
- `packages/db/src/queries/skills.ts`
- `packages/db/src/queries/__tests__/skills.test.ts`

---

### S1-6: Create @uberskills/db -- query functions (versions, files, test runs, settings)

**Size**: M (1 day)

**Description**:
Implement typed query functions for the remaining 4 tables: `skill_versions`, `skill_files`, `test_runs`, and `settings`. Includes the AES-256-GCM encryption/decryption utilities for the settings API key.

**Acceptance Criteria**:
- [ ] `packages/db/src/queries/versions.ts` -- `listVersions(skillId)`, `createVersion(data)` with auto-increment version number per skill, `getVersion(id)`
- [ ] `packages/db/src/queries/files.ts` -- `listFiles(skillId)`, `createFile(data)`, `updateFile(id, data)`, `deleteFile(id)`
- [ ] `packages/db/src/queries/test-runs.ts` -- `listTestRuns(skillId)`, `createTestRun(data)`, `updateTestRun(id, data)`, `getTestRun(id)`
- [ ] `packages/db/src/queries/settings.ts` -- `getSetting(key)`, `setSetting(key, value, encrypted?)`, `getAllSettings()`, `getDecryptedApiKey()`
- [ ] `packages/db/src/crypto.ts` -- `encrypt(plaintext)` and `decrypt(ciphertext)` using AES-256-GCM
- [ ] Encryption key sourced from `ENCRYPTION_SECRET` env var or auto-generated at `data/.secret`
- [ ] Auto-generates `data/.secret` on first call if `ENCRYPTION_SECRET` not set
- [ ] Version auto-increment: queries max version for skill, increments by 1
- [ ] Unit tests for encryption round-trip and all query functions

**Dependencies**: S1-4

**Files to Create**:
- `packages/db/src/queries/versions.ts`
- `packages/db/src/queries/files.ts`
- `packages/db/src/queries/test-runs.ts`
- `packages/db/src/queries/settings.ts`
- `packages/db/src/crypto.ts`
- `packages/db/src/queries/__tests__/settings.test.ts`
- `packages/db/src/queries/__tests__/crypto.test.ts`

---

### S1-7: Create @uberskills/skill-engine -- parser and validator

**Size**: L (2 days)

**Description**:
Implement the SKILL.md parser (YAML frontmatter extraction + markdown body) and the skill validator (field presence, length, regex validity). These are essential for import, creation, and editing flows.

**Acceptance Criteria**:
- [ ] `packages/skill-engine/src/parser.ts` -- `parseSkillMd(raw: string): { frontmatter: SkillFrontmatter, content: string }`
- [ ] Parser extracts YAML between `---` delimiters using a YAML parsing library (e.g., `yaml`)
- [ ] Parser handles missing frontmatter gracefully (returns empty frontmatter + full content)
- [ ] Parser handles extra whitespace, trailing newlines, and edge cases
- [ ] `packages/skill-engine/src/validator.ts` -- `validateSkill(frontmatter, content): { valid: boolean, errors: ValidationError[] }`
- [ ] Validates: `name` required + max 100 chars, `description` required + max 500 chars, `trigger` required, `model_pattern` valid regex if present, `content` non-empty
- [ ] Severity levels: "error" for required fields, "warning" for recommendations
- [ ] Unit tests for parser: valid SKILL.md, missing frontmatter, malformed YAML, empty content
- [ ] Unit tests for validator: all rules exercised, edge cases

**Dependencies**: S1-1

**Files to Create**:
- `packages/skill-engine/src/parser.ts`
- `packages/skill-engine/src/validator.ts`
- `packages/skill-engine/src/__tests__/parser.test.ts`
- `packages/skill-engine/src/__tests__/validator.test.ts`
- `packages/skill-engine/tsconfig.json`
- `packages/skill-engine/src/index.ts`

---

### S1-8: Create @uberskills/skill-engine -- generator and substitutions

**Size**: M (1 day)

**Description**:
Implement the SKILL.md generator (structured data to markdown string) and the argument substitution module (detect and replace `$VARIABLE_NAME` placeholders). These complete the core skill-engine functionality needed for editing, preview, and testing.

**Acceptance Criteria**:
- [ ] `packages/skill-engine/src/generator.ts` -- `generateSkillMd(frontmatter, content): string`
- [ ] Generator produces valid YAML frontmatter wrapped in `---` delimiters
- [ ] Generator omits `model_pattern` from frontmatter if null/undefined
- [ ] Generator ensures trailing newline
- [ ] `packages/skill-engine/src/substitutions.ts` -- `detectPlaceholders(content): string[]` and `substitute(content, values): string`
- [ ] Detection regex: `/\$([A-Z_]+)/g` -- returns unique placeholder names
- [ ] Substitution replaces all occurrences of each placeholder
- [ ] Handles `$ARGUMENTS` as a special placeholder
- [ ] Unit tests for generator: round-trip with parser produces identical output
- [ ] Unit tests for substitutions: detection, replacement, missing values, no placeholders

**Dependencies**: S1-1, S1-7

**Files to Create**:
- `packages/skill-engine/src/generator.ts`
- `packages/skill-engine/src/substitutions.ts`
- `packages/skill-engine/src/__tests__/generator.test.ts`
- `packages/skill-engine/src/__tests__/substitutions.test.ts`

---

## Sprint 2 (Weeks 5-6) -- UI Package & App Shell

**Focus**: Set up the shared shadcn/ui component library, implement the design system (colors, typography, themes), and build the Next.js app shell with navigation, layout, and theme switching.

**Planned Capacity**: 8.0 days (out of 10 available)

---

### S2-1: Initialize @uberskills/ui package with shadcn/ui

**Size**: M (1 day)

**Description**:
Set up the shared UI component package using shadcn/ui. Configure the package to export reusable components that the web app and potentially future apps can consume.

**Acceptance Criteria**:
- [ ] `packages/ui/` has a working `package.json` with React, Tailwind, and shadcn/ui dependencies
- [ ] `components.json` configured for shadcn/ui CLI component installation
- [ ] `packages/ui/src/lib/utils.ts` with the `cn()` utility (clsx + tailwind-merge)
- [ ] Package exports components from `packages/ui/src/index.ts`
- [ ] TypeScript configured with path aliases
- [ ] A test import from `@uberskills/ui` works in the web app
- [ ] `tailwind.config.ts` or CSS config supports the design system tokens

**Dependencies**: S0-5

**Files to Create**:
- `packages/ui/src/lib/utils.ts` -- cn utility
- `packages/ui/src/index.ts` -- package exports
- `packages/ui/components.json` -- shadcn config
- `packages/ui/tsconfig.json`
- `packages/ui/tailwind.config.ts` (if needed)

---

### S2-2: Install core shadcn/ui components

**Size**: M (1 day)

**Description**:
Install and configure the essential shadcn/ui components that will be used across all features. Customize their styling to match the "Vercel Light" design system from the spec.

**Acceptance Criteria**:
- [ ] Installed components: Button, Input, Textarea, Select, Dialog, DropdownMenu, Badge, Card, Tabs, Table, Tooltip, Toast (Sonner), Label, Separator, Skeleton, Checkbox
- [ ] All components exported from `@uberskills/ui`
- [ ] Button variants match spec: primary (black bg), secondary (white bg, border), ghost, destructive
- [ ] Card styling: no box-shadow, 1px border, rounded-lg
- [ ] Badge styling: pill shape (rounded-full), status-specific colors (draft/ready/deployed/error)
- [ ] Input styling: 1px border, h-10, rounded-md, focus ring
- [ ] Components render correctly in both light and dark mode

**Dependencies**: S2-1

**Files to Create**:
- `packages/ui/src/components/button.tsx`
- `packages/ui/src/components/input.tsx`
- `packages/ui/src/components/textarea.tsx`
- `packages/ui/src/components/select.tsx`
- `packages/ui/src/components/dialog.tsx`
- `packages/ui/src/components/dropdown-menu.tsx`
- `packages/ui/src/components/badge.tsx`
- `packages/ui/src/components/card.tsx`
- `packages/ui/src/components/tabs.tsx`
- `packages/ui/src/components/table.tsx`
- `packages/ui/src/components/tooltip.tsx`
- `packages/ui/src/components/toast.tsx`
- `packages/ui/src/components/label.tsx`
- `packages/ui/src/components/separator.tsx`
- `packages/ui/src/components/skeleton.tsx`
- `packages/ui/src/components/checkbox.tsx`

---

### S2-3: Implement CSS design system tokens

**Size**: M (1 day)

**Description**:
Implement the complete "Vercel Light" color system using CSS custom properties. Define light and dark mode tokens, semantic status colors, typography scale, and spacing system as specified in the overview document.

**Acceptance Criteria**:
- [ ] CSS custom properties for all light mode tokens (background, foreground, muted, border, primary, etc.) as defined in spec
- [ ] CSS custom properties for all dark mode tokens under `.dark` class
- [ ] Semantic status colors: Draft (gray), Ready (green), Deployed (blue), Error (red), Success (green) for both modes
- [ ] Tailwind CSS v4 configured to use these custom properties
- [ ] Geist Sans and Geist Mono font stacks configured
- [ ] Typography scale: page title (24px bold), section heading (18px semibold), body (14px regular), secondary (14px muted), code (13px mono)
- [ ] Spacing tokens: page max-w-6xl, page px-6, card p-5, nav h-16
- [ ] `transition-colors duration-150` as default transition
- [ ] `prefers-reduced-motion` media query disables animations

**Dependencies**: S2-1

**Files to Modify**:
- `apps/web/styles/globals.css` -- design system tokens and theme variables

---

### S2-4: Build navigation bar component

**Size**: S (0.5 day)

**Description**:
Create the top navigation bar that appears on every page. Includes the UberSkills text logo, navigation links (Skills, Import, Settings), and responsive behavior.

**Acceptance Criteria**:
- [ ] `apps/web/components/nav-bar.tsx` -- responsive navigation component
- [ ] White/dark background with 1px bottom border
- [ ] "UberSkills" text logo on the left in bold
- [ ] Nav links: Skills (`/skills`), Import (`/import`), Settings (`/settings`)
- [ ] Active link highlighted with `--foreground` color, inactive in `--muted-foreground`
- [ ] Full-width bar, content centered with `max-w-6xl`
- [ ] Height: 64px (`h-16`)
- [ ] Mobile: links remain visible (no hamburger needed -- desktop-optimized app)
- [ ] Uses `next/link` for client-side navigation
- [ ] Active route detection via `usePathname()`

**Dependencies**: S2-2, S2-3

**Files to Create**:
- `apps/web/components/nav-bar.tsx`

---

### S2-5: Build root layout with providers

**Size**: M (1 day)

**Description**:
Update the root layout to include the navigation bar, theme provider, toast provider, and global layout structure. Implement the theme provider that reads the theme setting and applies the appropriate class to the HTML element.

**Acceptance Criteria**:
- [ ] `apps/web/app/layout.tsx` includes nav bar, main content area, and footer
- [ ] Content area: max-w-6xl, centered, px-6 padding
- [ ] `apps/web/components/theme-provider.tsx` wraps the app, manages `light`/`dark`/`system` theme
- [ ] Theme provider reads initial theme from cookie or defaults to light (SSR-safe)
- [ ] Theme applies via `<html class="dark">` Tailwind strategy
- [ ] System preference detected via `matchMedia('(prefers-color-scheme: dark)')`
- [ ] Toast provider (Sonner) mounted for global notifications
- [ ] Metadata: title "UberSkills", description, viewport settings
- [ ] No flash of unstyled content (FOUC) on page load

**Dependencies**: S2-4

**Files to Create**:
- `apps/web/components/theme-provider.tsx`

**Files to Modify**:
- `apps/web/app/layout.tsx` -- add providers, nav, layout structure

---

### S2-6: Build dashboard home page

**Size**: S (0.5 day)

**Description**:
Create the dashboard/home page at `/` that provides an overview and quick access to key features. Shows recent skills, quick stats, and action shortcuts.

**Acceptance Criteria**:
- [ ] `apps/web/app/page.tsx` renders the dashboard
- [ ] Welcome section with "UberSkills" heading and brief description
- [ ] Quick actions: "New Skill" button (links to `/skills/new`), "Browse Library" (links to `/skills`), "Import" (links to `/import`)
- [ ] Recent skills section showing last 5 updated skills (empty state if no skills)
- [ ] Quick stats: total skills count, draft/ready/deployed counts
- [ ] Data fetched server-side using `@uberskills/db` queries
- [ ] Responsive layout, clean design matching Vercel aesthetic

**Dependencies**: S2-5, S1-5

**Files to Modify**:
- `apps/web/app/page.tsx` -- dashboard implementation

---

### S2-7: Create shared page components

**Size**: S (0.5 day)

**Description**:
Build reusable page-level components used across multiple features: page header (title + actions), empty state, loading skeleton, and error boundary.

**Acceptance Criteria**:
- [ ] `apps/web/components/page-header.tsx` -- title, optional description, optional action buttons area
- [ ] `apps/web/components/empty-state.tsx` -- icon, title, description, optional CTA button
- [ ] `apps/web/components/loading-skeleton.tsx` -- configurable skeleton patterns (card grid, form, table)
- [ ] `apps/web/components/error-boundary.tsx` -- React Error Boundary with user-friendly error display and retry button
- [ ] All components use design system tokens
- [ ] Components accept className prop for customization

**Dependencies**: S2-2, S2-3

**Files to Create**:
- `apps/web/components/page-header.tsx`
- `apps/web/components/empty-state.tsx`
- `apps/web/components/loading-skeleton.tsx`
- `apps/web/components/error-boundary.tsx`

---

### S2-8: Build status badge component and skill card component

**Size**: S (0.5 day)

**Description**:
Create the skill status badge component with proper semantic colors and the skill card component used in the library grid view.

**Acceptance Criteria**:
- [ ] `apps/web/components/status-badge.tsx` -- renders pill-shaped badge with status-specific colors
- [ ] Draft: gray bg/text, Ready: green bg/text, Deployed: blue bg/text
- [ ] Colors match both light and dark mode specs exactly
- [ ] Badge uses `text-xs`, `font-medium`, `rounded-full`, `px-2.5 py-0.5`
- [ ] `apps/web/components/skill-card.tsx` -- card displaying skill name, truncated description (120 chars), status badge, tags, updated date
- [ ] Card: white bg, 1px border, rounded-lg, no shadow, accent bg on hover
- [ ] Tags rendered as small chips/badges
- [ ] Card is clickable (wraps in Link to `/skills/[id]`)
- [ ] Handles missing/empty fields gracefully

**Dependencies**: S2-2, S2-3

**Files to Create**:
- `apps/web/components/status-badge.tsx`
- `apps/web/components/skill-card.tsx`

---

## Sprint 3 (Weeks 7-8) -- Settings & Skills Library

**Focus**: Implement the Settings page (FR7) including API key management and theme switching, then build the complete Skills Library page (FR1) with search, filter, pagination, and grid/list views.

**Planned Capacity**: 8.0 days (out of 10 available)

---

### S3-1: Build Settings API route

**Size**: M (1 day)

**Description**:
Create the `/api/settings` route handler that reads and writes application settings. Handles API key encryption/decryption, and returns settings in a safe format (key masked).

**Acceptance Criteria**:
- [ ] `apps/web/app/api/settings/route.ts` -- GET and PUT handlers
- [ ] GET returns `AppSettings` object: `{ openrouterApiKey: string | null (masked), defaultModel, theme }`
- [ ] API key in GET response is masked: last 4 chars visible, rest replaced with dots
- [ ] PUT accepts partial settings updates: `{ openrouterApiKey?, defaultModel?, theme? }`
- [ ] When updating `openrouterApiKey`, encrypts using `@uberskills/db` crypto module
- [ ] Consistent error response format: `{ error: string, code: string }`
- [ ] Returns 200 on success with updated settings
- [ ] Unit tests for route handler logic

**Dependencies**: S1-6

**Files to Create**:
- `apps/web/app/api/settings/route.ts`

---

### S3-2: Build Settings page -- API key management

**Size**: M (1 day)

**Description**:
Implement the API Configuration section of the Settings page. Includes API key input with masking, show/hide toggle, test connectivity button, and connection status display.

**Acceptance Criteria**:
- [ ] `apps/web/app/settings/page.tsx` -- Settings page component
- [ ] API Key input field with password masking by default (shows last 4 chars)
- [ ] "Show"/"Hide" toggle button to reveal/mask the key
- [ ] "Test" button sends GET to OpenRouter `/api/v1/models` to validate the key
- [ ] Connection status indicator: checkmark + "Connected" on success, X + error message on failure
- [ ] Key saves immediately on blur or explicit save (no form submit button)
- [ ] Visual feedback: toast notification on save success/failure
- [ ] If no key set, shows helpful prompt explaining where to get one
- [ ] Loading state while testing connection

**Dependencies**: S3-1, S2-5

**Files to Create**:
- `apps/web/app/settings/page.tsx`

---

### S3-3: Build Settings page -- preferences and data management

**Size**: M (1 day)

**Description**:
Complete the Settings page with Preferences section (default model, theme) and Data Management section (export all, backup, restore). Theme changes apply immediately.

**Acceptance Criteria**:
- [ ] Preferences section with Default Model dropdown and Theme selector
- [ ] Default Model dropdown: fetches available models from OpenRouter when API key is valid, shows placeholder if no key
- [ ] Model list cached for 5 minutes on client side
- [ ] Theme selector: Light, Dark, System options -- applied immediately via theme provider
- [ ] Theme change persists to `settings` table and updates `<html>` class
- [ ] Data Management section with three action buttons
- [ ] "Export All Skills" downloads a zip of all skills (calls `/api/export` with all skill IDs)
- [ ] "Backup Database" downloads the raw SQLite file
- [ ] "Restore Backup" opens file picker, shows confirmation dialog, creates automatic backup before restore
- [ ] All settings save immediately on change with visual feedback

**Dependencies**: S3-2

**Files to Modify**:
- `apps/web/app/settings/page.tsx` -- add preferences and data management sections

---

### S3-4: Build OpenRouter model fetching hook

**Size**: S (0.5 day)

**Description**:
Create a custom React hook that fetches available models from OpenRouter and caches the result. Used by model selector dropdowns in FR2 (creation), FR4 (testing), and FR7 (default model setting).

**Acceptance Criteria**:
- [ ] `apps/web/hooks/use-models.ts` -- `useModels()` hook
- [ ] Fetches models from OpenRouter via a proxy API route (`/api/models` or similar)
- [ ] Server-side proxy route calls OpenRouter `/api/v1/models` with decrypted API key
- [ ] Returns `{ models, isLoading, error }` state
- [ ] Models filtered to chat-capable only, sorted by provider
- [ ] Results cached for 5 minutes (uses SWR or React Query pattern)
- [ ] Returns empty array with appropriate error when API key is not configured
- [ ] Model type: `{ id: string, name: string, provider: string }`

**Dependencies**: S3-1

**Files to Create**:
- `apps/web/hooks/use-models.ts`
- `apps/web/app/api/models/route.ts` -- proxy for OpenRouter models endpoint

---

### S3-5: Build Skills CRUD API routes

**Size**: M (1 day)

**Description**:
Implement all `/api/skills` route handlers for listing, creating, reading, updating, and deleting skills. These routes are the backend for the Skills Library and Skill Editor.

**Acceptance Criteria**:
- [ ] `apps/web/app/api/skills/route.ts` -- GET (list) and POST (create) handlers
- [ ] GET supports query params: `search`, `status`, `page`, `limit` (default 12), `sort`
- [ ] GET returns `{ skills: Skill[], total: number, page: number, totalPages: number }`
- [ ] POST creates a new skill from `{ name, description, trigger, tags, modelPattern, content }`
- [ ] POST auto-generates slug from name, creates initial version (version 1)
- [ ] `apps/web/app/api/skills/[id]/route.ts` -- GET, PUT, DELETE handlers
- [ ] GET returns single skill with its files
- [ ] PUT updates skill fields, creates new version if content changed
- [ ] DELETE removes skill (cascades to files, versions, test runs)
- [ ] All routes use consistent error format `{ error, code }`
- [ ] Input validation on create/update (name required, etc.)

**Dependencies**: S1-5, S1-6

**Files to Create**:
- `apps/web/app/api/skills/route.ts`
- `apps/web/app/api/skills/[id]/route.ts`

---

### S3-6: Build Skills Library page -- grid view and search

**Size**: L (2 days)

**Description**:
Implement the main Skills Library page at `/skills` with the card grid layout, debounced search input, status filter dropdown, and responsive design. This is the primary navigation hub for all skills.

**Acceptance Criteria**:
- [ ] `apps/web/app/skills/page.tsx` -- Skills Library page
- [ ] Page header with "Skills Library" title and "New Skill" button (links to `/skills/new`)
- [ ] Search input with magnifying glass icon, debounced at 300ms, filters by name/description/tags
- [ ] Status filter dropdown: All, Draft, Ready, Deployed
- [ ] Grid layout displaying skill cards (4 columns on desktop, 2 on tablet, 1 on mobile)
- [ ] Each card shows: name, truncated description, status badge, tags, updated date
- [ ] Clicking card navigates to `/skills/[id]`
- [ ] Empty state when no skills: illustration/icon + "Create your first skill" CTA
- [ ] Empty search state: "No skills matching [query]" message
- [ ] Loading state: skeleton card grid while fetching
- [ ] Search latency under 200ms perceived (debounce + fast query)
- [ ] URL search params update with search/filter state for shareability

**Dependencies**: S3-5, S2-7, S2-8

**Files to Create**:
- `apps/web/app/skills/page.tsx`

---

### S3-7: Build Skills Library page -- list view and view toggle

**Size**: S (0.5 day)

**Description**:
Add list view as an alternative to grid view in the Skills Library. Implement a toggle between grid and list layouts. List view shows skills in a compact table format.

**Acceptance Criteria**:
- [ ] View toggle buttons (Grid/List icons) in the toolbar area
- [ ] Grid view: card layout (already implemented in S3-6)
- [ ] List view: table format with columns -- Name, Description (truncated), Status, Tags, Updated
- [ ] View preference persisted in localStorage
- [ ] Smooth transition between views
- [ ] List view rows are clickable, navigate to `/skills/[id]`
- [ ] Responsive: list view still usable on smaller screens

**Dependencies**: S3-6

**Files to Modify**:
- `apps/web/app/skills/page.tsx` -- add list view and toggle

**Files to Create**:
- `apps/web/components/skill-list-view.tsx`

---

### S3-8: Build Skills Library page -- pagination and sorting

**Size**: M (1 day)

**Description**:
Add pagination controls and sort options to the Skills Library. Pagination at 12 skills per page with prev/next and page numbers. Sort by updated date (default), name, or created date.

**Acceptance Criteria**:
- [ ] Pagination controls at bottom: previous, page numbers, next
- [ ] 12 skills per page (matching spec)
- [ ] "Showing X-Y of Z" label
- [ ] Page number in URL params for direct linking
- [ ] Sort dropdown: "Recently Updated" (default), "Name A-Z", "Name Z-A", "Newest", "Oldest"
- [ ] Sort preference in URL params
- [ ] Disabled prev button on first page, disabled next on last page
- [ ] Keyboard accessible: arrow keys for pagination
- [ ] Data fetching updates when pagination/sort params change

**Dependencies**: S3-6

**Files to Modify**:
- `apps/web/app/skills/page.tsx` -- add pagination and sort controls

**Files to Create**:
- `apps/web/components/pagination.tsx`

---

## Sprint 4 (Weeks 9-10) -- Skill Editor

**Focus**: Build the complete Skill Editor (FR3) with all 5 tabs: Metadata, Instructions, Files, Preview, and History. Includes auto-save, validation, and version management.

**Planned Capacity**: 9.0 days (out of 10 available)

---

### S4-1: Build Skill Editor page shell with tabs

**Size**: M (1 day)

**Description**:
Create the Skill Editor page at `/skills/[id]` with the tabbed interface shell, back navigation, skill title display, status dropdown, and action buttons (Test, Export, Deploy).

**Acceptance Criteria**:
- [ ] `apps/web/app/skills/[id]/page.tsx` -- Editor page with data fetching
- [ ] Server component fetches skill by ID from database
- [ ] 404 page when skill not found
- [ ] "Back to Library" link at top
- [ ] Skill name as page title, editable inline
- [ ] Status dropdown (draft/ready/deployed) -- changes save immediately
- [ ] Action buttons: "Test" (links to `/skills/[id]/test`), "Export", "Deploy"
- [ ] Tab bar with 5 tabs: Metadata, Instructions, Files, Preview, History
- [ ] Tab content area renders the appropriate tab component
- [ ] URL hash or search param preserves active tab on refresh

**Dependencies**: S3-5, S2-5

**Files to Create**:
- `apps/web/app/skills/[id]/page.tsx`
- `apps/web/components/editor/editor-shell.tsx`

---

### S4-2: Build Metadata tab

**Size**: M (1 day)

**Description**:
Implement the Metadata tab with form fields for all skill frontmatter fields: name, description, trigger, tags (with add/remove), model pattern, and slug (auto-generated, editable).

**Acceptance Criteria**:
- [ ] `apps/web/components/editor/metadata-tab.tsx`
- [ ] Form fields: Name (text input, required), Description (textarea), Trigger (textarea, required), Model Pattern (text input, optional with regex hint)
- [ ] Tags input: type tag text + Enter to add, X button to remove, displayed as chips
- [ ] Slug field: auto-generated from name (lowercase, hyphenated), editable, shown below name
- [ ] Slug uniqueness validation (async check against database)
- [ ] Inline validation errors: red border + error text below field
- [ ] Required field indicators (asterisk)
- [ ] All fields bind to the editor's shared state
- [ ] Form is accessible: labels, aria-describedby for errors, tab order

**Dependencies**: S4-1

**Files to Create**:
- `apps/web/components/editor/metadata-tab.tsx`
- `apps/web/components/editor/tag-input.tsx`

---

### S4-3: Build Instructions tab

**Size**: M (1 day)

**Description**:
Implement the Instructions tab with a markdown editor for the skill's instruction content. The editor should provide a good writing experience for markdown with syntax highlighting.

**Acceptance Criteria**:
- [ ] `apps/web/components/editor/instructions-tab.tsx`
- [ ] Large textarea or code editor component for markdown content
- [ ] Syntax highlighting for markdown (optional: use a lightweight code editor like CodeMirror or a styled textarea)
- [ ] Line numbers visible
- [ ] Tab key inserts spaces (not focus change) when editor is focused
- [ ] Character/word count displayed below editor
- [ ] Editor fills available vertical space (resizable)
- [ ] Placeholder text when empty: "Write your skill instructions in Markdown..."
- [ ] Monospace font (Geist Mono)
- [ ] Changes bound to editor's shared state

**Dependencies**: S4-1

**Files to Create**:
- `apps/web/components/editor/instructions-tab.tsx`

---

### S4-4: Build Files tab

**Size**: M (1 day)

**Description**:
Implement the Files tab for managing additional skill files (prompts and resources). Users can add, edit, rename, and delete files associated with a skill.

**Acceptance Criteria**:
- [ ] `apps/web/components/editor/files-tab.tsx`
- [ ] List of existing files showing path, type (prompt/resource), and actions (edit, delete)
- [ ] "Add File" button opens a dialog with: path input, type selector (prompt/resource), content editor
- [ ] File path input with prefix hint: `prompts/` or `resources/` based on type
- [ ] Editing a file opens its content in a textarea/code editor
- [ ] Delete file with confirmation dialog
- [ ] Rename file (change path) via inline edit or dialog
- [ ] Files saved via API route (`/api/skills/[id]` PUT with files data)
- [ ] Empty state: "No additional files" with explanation of prompts vs resources
- [ ] Validation: no duplicate paths, valid relative paths (no `..`, no absolute)

**Dependencies**: S4-1, S1-6

**Files to Create**:
- `apps/web/components/editor/files-tab.tsx`
- `apps/web/components/editor/file-editor-dialog.tsx`

---

### S4-5: Build Preview tab

**Size**: S (0.5 day)

**Description**:
Implement the Preview tab that shows the complete generated SKILL.md exactly as it will be exported. Uses the skill-engine generator to produce the output and renders it as formatted markdown.

**Acceptance Criteria**:
- [ ] `apps/web/components/editor/preview-tab.tsx`
- [ ] Generates SKILL.md from current editor state using `skill-engine.generator`
- [ ] Renders the YAML frontmatter in a code block with syntax highlighting
- [ ] Renders the markdown content body below
- [ ] Read-only view (not editable)
- [ ] "Copy to Clipboard" button copies the raw SKILL.md text
- [ ] Updates in real-time as user edits metadata or instructions
- [ ] Monospace font for frontmatter, proportional for rendered markdown
- [ ] Shows associated files list below the SKILL.md preview

**Dependencies**: S4-1, S1-8

**Files to Create**:
- `apps/web/components/editor/preview-tab.tsx`

---

### S4-6: Build History tab

**Size**: M (1 day)

**Description**:
Implement the History tab showing the version history of a skill. Users can browse past versions, view their content snapshots, and see change summaries.

**Acceptance Criteria**:
- [ ] `apps/web/components/editor/history-tab.tsx`
- [ ] List of versions sorted by version number descending (newest first)
- [ ] Each row shows: version number, change summary, creation timestamp (relative, e.g. "2 hours ago")
- [ ] Clicking a version expands to show the content snapshot (read-only SKILL.md preview)
- [ ] Current version highlighted
- [ ] Empty state: "No version history" (for newly created skills with only version 1)
- [ ] Versions fetched from `skill_versions` table via API
- [ ] API route for listing versions: could be part of skill GET or separate endpoint
- [ ] Pagination if many versions (>20)

**Dependencies**: S4-1, S1-6

**Files to Create**:
- `apps/web/components/editor/history-tab.tsx`

---

### S4-7: Implement auto-save with debounce

**Size**: M (1 day)

**Description**:
Implement auto-save functionality in the Skill Editor. Changes are automatically saved after 3 seconds of inactivity. Visual indicators show save status (saving, saved, error).

**Acceptance Criteria**:
- [ ] `apps/web/hooks/use-auto-save.ts` -- custom hook for auto-save logic
- [ ] Debounce timer: 3 seconds after last change
- [ ] Save status indicator in editor header: "Saving...", "Saved" (with checkmark), "Error saving" (with retry)
- [ ] Auto-save triggers PUT to `/api/skills/[id]`
- [ ] Creates new version only when content or metadata materially changes (not on every keystroke save)
- [ ] Manual "Save" button also available as fallback
- [ ] Unsaved changes warning on navigation away (beforeunload event)
- [ ] Save latency under 500ms (NFR1 requirement)
- [ ] Optimistic UI: indicator shows "Saved" immediately, reverts on error
- [ ] Conflict handling: if save fails with 409 (conflict), prompt user to reload

**Dependencies**: S4-2, S4-3

**Files to Create**:
- `apps/web/hooks/use-auto-save.ts`

**Files to Modify**:
- `apps/web/components/editor/editor-shell.tsx` -- integrate auto-save

---

### S4-8: Implement skill validation in editor

**Size**: S (0.5 day)

**Description**:
Integrate the skill-engine validator into the editor to provide real-time validation feedback. Show validation errors inline on form fields and in a summary panel.

**Acceptance Criteria**:
- [ ] Validation runs on each auto-save cycle (debounced)
- [ ] Inline errors shown on Metadata tab fields (red border + message)
- [ ] Validation summary accessible from editor header (error count badge)
- [ ] Errors: missing name, missing trigger, invalid model_pattern regex
- [ ] Warnings: empty description, very short content
- [ ] Validation state passed to Preview tab (shows warning banner if invalid)
- [ ] "Ready" status cannot be set if there are validation errors
- [ ] Uses `skill-engine.validator.validateSkill()` on client side

**Dependencies**: S4-7, S1-7

**Files to Modify**:
- `apps/web/components/editor/metadata-tab.tsx` -- add validation display
- `apps/web/components/editor/editor-shell.tsx` -- add validation integration

---

### S4-9: Implement skill delete with confirmation

**Size**: S (0.5 day)

**Description**:
Add the ability to delete a skill from the editor page. Requires a confirmation dialog and handles cascading deletion of all related data.

**Acceptance Criteria**:
- [ ] Delete option accessible from a dropdown menu in the editor header
- [ ] Confirmation dialog: "Delete [skill name]? This will permanently delete this skill and all its versions, files, and test runs."
- [ ] Dialog has "Cancel" and "Delete" (destructive) buttons
- [ ] DELETE request to `/api/skills/[id]`
- [ ] On success: toast notification, redirect to `/skills`
- [ ] On error: toast with error message, dialog stays open
- [ ] Cascading delete handled by database FK constraints

**Dependencies**: S4-1, S3-5

**Files to Modify**:
- `apps/web/components/editor/editor-shell.tsx` -- add delete menu item and dialog

---

## Sprint 5 (Weeks 11-12) -- AI-Assisted Creation & Skill Testing

**Focus**: Build the AI-powered skill creation flow (FR2) with chat + preview, and the skill testing sandbox (FR4) with streaming responses and metrics.

**Planned Capacity**: 8.5 days (out of 10 available)

---

### S5-1: Build AI chat API route

**Size**: M (1 day)

**Description**:
Create the `/api/chat` route handler that streams AI responses using Vercel AI SDK and OpenRouter. This route powers both skill creation (FR2) and is the foundation for the test route.

**Acceptance Criteria**:
- [ ] `apps/web/app/api/chat/route.ts` -- POST handler with streaming
- [ ] Receives `{ messages, model }` from request body
- [ ] Retrieves and decrypts OpenRouter API key from settings
- [ ] Creates OpenRouter provider via `createOpenRouter({ apiKey })`
- [ ] Calls `streamText()` with selected model, system prompt, and messages
- [ ] Returns `result.toDataStreamResponse()` for streaming to client
- [ ] System prompt instructs AI to generate valid SKILL.md with YAML frontmatter
- [ ] OpenRouter headers set: `HTTP-Referer`, `X-Title: UberSkills`
- [ ] Error handling: missing API key (401), invalid model (400), rate limit (429), network error (502)
- [ ] Consistent error format: `{ error, code }`

**Dependencies**: S3-1, S3-4

**Files to Create**:
- `apps/web/app/api/chat/route.ts`
- `apps/web/lib/system-prompts.ts` -- system prompt constants

---

### S5-2: Build AI Skill Creation page -- chat panel

**Size**: L (2 days)

**Description**:
Implement the left panel of the `/skills/new` page: the chat interface where users describe their skill in natural language and receive AI-generated SKILL.md drafts. Uses Vercel AI SDK's `useChat()` hook.

**Acceptance Criteria**:
- [ ] `apps/web/app/skills/new/page.tsx` -- two-panel layout (chat left, preview right)
- [ ] Chat panel with message history (user messages + AI responses)
- [ ] Text input at bottom with "Send" button and Enter key support
- [ ] Model selector dropdown at top (uses `useModels()` hook)
- [ ] Streaming AI responses appear character-by-character
- [ ] Loading indicator during streaming
- [ ] Message bubbles: user on right (muted bg), AI on left (white bg)
- [ ] `useChat()` connected to `/api/chat` with selected model in body
- [ ] Conversation maintained in session memory (not persisted to DB)
- [ ] Error states: missing API key (link to Settings), network error, rate limit
- [ ] If no API key configured, shows prompt to set one in Settings before proceeding
- [ ] "Regenerate" button re-sends the last user message for a new response

**Dependencies**: S5-1, S2-5

**Files to Create**:
- `apps/web/app/skills/new/page.tsx`
- `apps/web/components/chat/chat-panel.tsx`
- `apps/web/components/chat/chat-message.tsx`
- `apps/web/components/chat/chat-input.tsx`

---

### S5-3: Build AI Skill Creation page -- preview panel

**Size**: M (1 day)

**Description**:
Implement the right panel of the `/skills/new` page: the real-time preview that parses AI responses into structured SKILL.md format and renders a preview. Includes "Edit & Save" functionality.

**Acceptance Criteria**:
- [ ] Preview panel updates in real-time as AI streams its response
- [ ] Uses `skill-engine.parser` to extract frontmatter and content from AI output
- [ ] Renders structured preview: frontmatter fields displayed as a form-like summary, content as rendered markdown
- [ ] Handles partial/incomplete AI responses gracefully (progressive rendering)
- [ ] "Edit & Save" button creates a new skill record (`status: draft`) via POST `/api/skills`
- [ ] On save, navigates to `/skills/[id]` (editor) for further refinement
- [ ] "Regenerate" button available to get a new draft
- [ ] Error state if AI response cannot be parsed (shows raw text with warning)
- [ ] Preview panel scrolls independently of chat panel

**Dependencies**: S5-2, S1-7, S1-8

**Files to Create**:
- `apps/web/components/chat/skill-preview-panel.tsx`

---

### S5-4: Build Skill Test API route

**Size**: M (1 day)

**Description**:
Create the `/api/test` route handler that executes a skill test run. Resolves argument placeholders, streams the AI response, captures metrics (tokens, latency, TTFT), and saves the test run to the database.

**Acceptance Criteria**:
- [ ] `apps/web/app/api/test/route.ts` -- POST handler with streaming
- [ ] Receives `{ skillId, model, userMessage, arguments }` from request body
- [ ] Fetches skill content from database
- [ ] Resolves `$ARGUMENTS` and named placeholders via `skill-engine.substitutions`
- [ ] Creates `test_runs` row with `status: running` before streaming
- [ ] Streams AI response using `streamText()`
- [ ] Resolved skill content used as system prompt, user message as user prompt
- [ ] On completion: captures `promptTokens`, `completionTokens`, `totalTokens`, `latencyMs`, `ttftMs`
- [ ] Updates `test_runs` row with response, metrics, `status: completed`
- [ ] On error: updates `test_runs` row with error message, `status: error`
- [ ] TTFT measured: timestamp of first token minus request start time

**Dependencies**: S5-1, S1-6, S1-8

**Files to Create**:
- `apps/web/app/api/test/route.ts`

---

### S5-5: Build Skill Testing page -- configuration panel

**Size**: M (1 day)

**Description**:
Implement the left panel of the `/skills/[id]/test` page: the configuration area with model selector, resolved system prompt display, argument inputs, user message input, and "Run Test" button.

**Acceptance Criteria**:
- [ ] `apps/web/app/skills/[id]/test/page.tsx` -- two-panel layout (config left, response right)
- [ ] Model selector dropdown (uses `useModels()` hook, defaults to setting's default model)
- [ ] System prompt panel: read-only display of the resolved skill content
- [ ] Arguments panel: auto-detects `$VARIABLE_NAME` placeholders in skill content
- [ ] Renders an input field for each detected placeholder
- [ ] User message textarea: the test prompt to send alongside the system prompt
- [ ] "Run Test" button initiates the test via POST to `/api/test`
- [ ] Button disabled while a test is running
- [ ] "Back to Editor" link at top
- [ ] Skill name displayed as page title

**Dependencies**: S5-4, S4-1, S1-8

**Files to Create**:
- `apps/web/app/skills/[id]/test/page.tsx`
- `apps/web/components/test/test-config-panel.tsx`
- `apps/web/components/test/argument-inputs.tsx`

---

### S5-6: Build Skill Testing page -- response panel and metrics

**Size**: M (1 day)

**Description**:
Implement the right panel of the testing page: the streaming response display and token/latency metrics that appear after completion.

**Acceptance Criteria**:
- [ ] `apps/web/components/test/test-response-panel.tsx`
- [ ] Streaming response area: text appears character-by-character as AI responds
- [ ] Cursor/spinner indicator during streaming
- [ ] Markdown rendering of the completed response
- [ ] Metrics bar displayed after completion: prompt tokens, completion tokens, total tokens, latency (seconds), TTFT (seconds)
- [ ] Metrics formatted with thousand separators for token counts
- [ ] Error state: if test fails, display error message in red
- [ ] Empty state before first test: "Run a test to see results"
- [ ] Scroll-to-bottom during streaming, scrollable after completion
- [ ] `prefers-reduced-motion`: no streaming animation, text appears in chunks

**Dependencies**: S5-5

**Files to Create**:
- `apps/web/components/test/test-response-panel.tsx`
- `apps/web/components/test/test-metrics.tsx`

---

### S5-7: Build Skill Testing page -- test history table

**Size**: M (1 day)

**Description**:
Add the test history table below the main testing panels. Shows previous test runs for the current skill with model, tokens, latency, status, and timestamp.

**Acceptance Criteria**:
- [ ] `apps/web/components/test/test-history.tsx`
- [ ] Table columns: # (run number), Model, Tokens (total), Latency, Status (checkmark/X), Date (relative)
- [ ] Sorted by `created_at` descending (newest first)
- [ ] Clicking a row loads that test run's response into the response panel
- [ ] Status icons: green checkmark for completed, red X for error
- [ ] Table uses muted header background, row hover highlight, 1px row dividers
- [ ] Empty state: "No test runs yet"
- [ ] Paginated if many test runs (>10 shown, load more button)
- [ ] Auto-refreshes when a new test completes

**Dependencies**: S5-6

**Files to Create**:
- `apps/web/components/test/test-history.tsx`

---

### S5-8: Build model selector component

**Size**: S (0.5 day)

**Description**:
Create a reusable model selector dropdown component used across FR2, FR4, and FR7. Shows available models grouped by provider with search/filter capability.

**Acceptance Criteria**:
- [ ] `apps/web/components/model-selector.tsx` -- reusable dropdown component
- [ ] Lists models from `useModels()` hook
- [ ] Models grouped by provider (Anthropic, OpenAI, Google, Meta, etc.)
- [ ] Search/filter input within the dropdown to find models
- [ ] Shows model name and ID
- [ ] Controlled component: accepts `value` and `onChange` props
- [ ] Loading state: skeleton while models are fetching
- [ ] Error state: "Failed to load models" with retry
- [ ] Disabled state when no API key is configured

**Dependencies**: S3-4

**Files to Create**:
- `apps/web/components/model-selector.tsx`

---

## Sprint 6 (Weeks 13-14) -- Export, Deploy & Import

**Focus**: Build the Export & Deploy functionality (FR5) with zip generation and filesystem deployment, then implement the Import system (FR6) with zip upload, directory scanning, validation, and selective import.

**Planned Capacity**: 8.0 days (out of 10 available)

---

### S6-1: Build skill-engine exporter module

**Size**: M (1 day)

**Description**:
Implement the exporter module in skill-engine that generates zip archives and deploys skills to the filesystem. This is the core logic used by the export and deploy API routes.

**Acceptance Criteria**:
- [ ] `packages/skill-engine/src/exporter.ts` -- `exportToZip()` and `deployToFilesystem()` functions
- [ ] `exportToZip(skill, files): Buffer` -- generates a zip containing `<slug>/SKILL.md`, `<slug>/prompts/*`, `<slug>/resources/*`
- [ ] Uses `skill-engine.generator` to produce the SKILL.md content
- [ ] `skill_files` placed in correct subdirectories based on type (prompt/resource)
- [ ] `deployToFilesystem(skill, files, targetDir?)` -- writes to `~/.claude/skills/<slug>/`
- [ ] Creates target directory if it doesn't exist
- [ ] Overwrites existing files if directory already exists
- [ ] Returns the deployed path
- [ ] Path validation: target must be within `~/.claude/skills/` (no path traversal)
- [ ] Unit tests for zip generation (verify structure) and deploy (use temp directories)

**Dependencies**: S1-8

**Files to Create**:
- `packages/skill-engine/src/exporter.ts`
- `packages/skill-engine/src/__tests__/exporter.test.ts`

---

### S6-2: Build export and deploy API routes

**Size**: M (1 day)

**Description**:
Create the `/api/export` and `/api/export/deploy` route handlers. Export generates a zip download, deploy writes to the local filesystem and updates skill status.

**Acceptance Criteria**:
- [ ] `apps/web/app/api/export/route.ts` -- POST handler for zip export
- [ ] Receives `{ skillId }` or `{ skillIds: string[] }` for batch export
- [ ] Returns zip file as downloadable response with `Content-Disposition` header
- [ ] Filename: `<slug>.zip` for single, `uberskills-export.zip` for batch
- [ ] `apps/web/app/api/export/deploy/route.ts` -- POST handler for filesystem deploy
- [ ] Receives `{ skillId }`
- [ ] Deploys to `~/.claude/skills/<slug>/`
- [ ] Creates `~/.claude/skills/` directory if it doesn't exist
- [ ] On success: updates skill status to `deployed`, returns deployed path
- [ ] Error handling: filesystem permission errors, disk full, path issues
- [ ] Both routes validate skill exists before proceeding

**Dependencies**: S6-1, S3-5

**Files to Create**:
- `apps/web/app/api/export/route.ts`
- `apps/web/app/api/export/deploy/route.ts`

---

### S6-3: Wire export and deploy buttons in editor

**Size**: S (0.5 day)

**Description**:
Connect the "Export" and "Deploy" action buttons in the Skill Editor to the export/deploy API routes. Add confirmation dialogs and feedback toasts.

**Acceptance Criteria**:
- [ ] "Export" button in editor header triggers zip download via `/api/export`
- [ ] Browser downloads the zip file automatically
- [ ] "Deploy" button triggers deployment via `/api/export/deploy`
- [ ] Deploy confirmation dialog: "Deploy [skill name] to ~/.claude/skills/[slug]/? This will overwrite any existing files."
- [ ] On deploy success: toast "Deployed to ~/.claude/skills/[slug]/", status badge updates to "deployed"
- [ ] On deploy error: toast with error message
- [ ] Loading states on both buttons during API calls
- [ ] Both buttons disabled if skill has validation errors

**Dependencies**: S6-2, S4-1

**Files to Modify**:
- `apps/web/components/editor/editor-shell.tsx` -- wire export/deploy buttons

---

### S6-4: Build skill-engine importer module

**Size**: L (2 days)

**Description**:
Implement the importer module in skill-engine that reads skills from zip files and directories. Parses SKILL.md files, detects additional prompt/resource files, and validates each skill.

**Acceptance Criteria**:
- [ ] `packages/skill-engine/src/importer.ts` -- `importFromZip()` and `importFromDirectory()` functions
- [ ] `importFromDirectory(path): ImportResult[]` -- recursively scans for directories containing SKILL.md
- [ ] Parses each SKILL.md via `skill-engine.parser`
- [ ] Detects files in `prompts/` and `resources/` subdirectories
- [ ] Validates each skill via `skill-engine.validator`
- [ ] `importFromZip(buffer): ImportResult[]` -- extracts zip to temp dir, delegates to directory scanner
- [ ] Cleans up temp directory after processing
- [ ] `ImportResult` type: `{ skill: ParsedSkill, files: SkillFile[], valid: boolean, errors: ValidationError[], source: string }`
- [ ] Handles edge cases: no SKILL.md, empty directories, nested structures
- [ ] File path security: no symlink following outside source, no path traversal
- [ ] Read only `.md` and known text extensions
- [ ] Unit tests with fixture directories and test zips

**Dependencies**: S1-7, S1-8

**Files to Create**:
- `packages/skill-engine/src/importer.ts`
- `packages/skill-engine/src/__tests__/importer.test.ts`
- `packages/skill-engine/src/__tests__/fixtures/` -- test SKILL.md files

---

### S6-5: Build import API route

**Size**: M (1 day)

**Description**:
Create the `/api/import` route handler that processes zip uploads and directory scans. Returns parsed and validated skills for user review, then accepts selected skills for database insertion.

**Acceptance Criteria**:
- [ ] `apps/web/app/api/import/route.ts` -- POST handler
- [ ] Supports two modes: zip upload (multipart form data) and directory scan (JSON body with path)
- [ ] Scan mode: `{ type: "directory", path: string }` -- scans the path for skills
- [ ] Upload mode: multipart form with zip file
- [ ] Returns `{ skills: ImportResult[] }` with validation results for each skill
- [ ] Second POST with `{ type: "confirm", skills: SelectedSkill[] }` saves selected skills to database
- [ ] Creates `skills`, `skill_files`, and initial `skill_versions` (version 1) rows
- [ ] Conflict detection: if slug already exists, includes `conflict: true` in result
- [ ] Overwrite option: if `overwrite: true` for a conflicting skill, updates instead of creating
- [ ] Error handling: invalid zip, unreadable directory, permission denied

**Dependencies**: S6-4, S3-5

**Files to Create**:
- `apps/web/app/api/import/route.ts`

---

### S6-6: Build Import page

**Size**: L (2 days)

**Description**:
Implement the full Import page at `/import` with zip upload area, directory scan input, validation results table, selective import, and conflict handling.

**Acceptance Criteria**:
- [ ] `apps/web/app/import/page.tsx` -- Import page
- [ ] Two import methods: "Upload .zip" button (file picker) and "Scan Directory" input with path + scan button
- [ ] Default directory path: `~/.claude/skills/`
- [ ] After scan/upload, shows results table with columns: checkbox, name, status (Valid/Invalid), description
- [ ] Valid skills are checked by default, invalid skills unchecked with error message
- [ ] Expandable rows to see parsed frontmatter and content preview
- [ ] Conflict detection: if skill slug exists, shows "Already exists -- overwrite?" option
- [ ] "Import Selected (N)" button at bottom, disabled if none selected
- [ ] Loading state during scan/upload processing
- [ ] On successful import: toast "Imported N skills", redirect to `/skills`
- [ ] Empty state: explanation of what can be imported and from where
- [ ] Error handling: invalid zip, unreadable path, partial failures

**Dependencies**: S6-5, S2-7

**Files to Create**:
- `apps/web/app/import/page.tsx`
- `apps/web/components/import/import-results-table.tsx`
- `apps/web/components/import/import-preview.tsx`

---

### S6-7: Build database backup and restore functionality

**Size**: S (0.5 day)

**Description**:
Implement the backup and restore functions used by the Settings page Data Management section. Backup downloads the SQLite file, restore uploads a replacement with automatic backup.

**Acceptance Criteria**:
- [ ] Backup API: GET `/api/settings/backup` returns the SQLite database file as a download
- [ ] Filename: `uberskills-backup-YYYY-MM-DD.db`
- [ ] Restore API: POST `/api/settings/restore` accepts uploaded SQLite file
- [ ] Before restore: creates automatic backup at `data/backups/uberskills-TIMESTAMP.db`
- [ ] Creates `data/backups/` directory if it doesn't exist
- [ ] After restore: validates the uploaded file is a valid SQLite database
- [ ] Returns error if uploaded file is not a valid SQLite database
- [ ] Restarts database connection after restore

**Dependencies**: S3-1, S1-3

**Files to Create**:
- `apps/web/app/api/settings/backup/route.ts`
- `apps/web/app/api/settings/restore/route.ts`

---

## Sprint 7 (Weeks 15-16) -- Polish, Testing & Deployment

**Focus**: End-to-end testing, accessibility audit, performance optimization, Docker support, documentation finalization, and launch preparation.

**Planned Capacity**: 6.5 days (out of 10 available -- extra buffer for bug fixes and adjustments)

---

### S7-1: Write E2E tests for core user flows

**Size**: XL (3.5 days)

**Description**:
Write comprehensive Playwright E2E tests covering the critical user journeys: settings configuration, skill creation (manual and AI-assisted), editing, testing, export, import, and library browsing.

**Acceptance Criteria**:
- [ ] E2E test: Settings flow -- enter API key, test connection, set default model, change theme
- [ ] E2E test: Manual skill creation -- navigate to `/skills/new`, fill out form, save, verify in library
- [ ] E2E test: Skill editing -- open skill, edit metadata, edit instructions, add file, save, verify version created
- [ ] E2E test: Skills Library -- search, filter by status, paginate, switch grid/list view
- [ ] E2E test: Skill deletion -- delete from editor, confirm dialog, verify removed from library
- [ ] E2E test: Export flow -- export skill as zip, verify download (mock filesystem for deploy)
- [ ] E2E test: Import flow -- upload zip, verify skills appear in scan results, import selected
- [ ] E2E test: Navigation -- all links work, back buttons work, active states correct
- [ ] E2E test: Dark mode -- toggle theme, verify visual changes
- [ ] All tests pass on Chrome, Firefox, and WebKit
- [ ] Tests use test database (not production data)
- [ ] AI-dependent tests use mocked API responses

**Dependencies**: All previous sprints

**Files to Create**:
- `apps/web/e2e/settings.spec.ts`
- `apps/web/e2e/skill-creation.spec.ts`
- `apps/web/e2e/skill-editor.spec.ts`
- `apps/web/e2e/skills-library.spec.ts`
- `apps/web/e2e/export-deploy.spec.ts`
- `apps/web/e2e/import.spec.ts`
- `apps/web/e2e/navigation.spec.ts`
- `apps/web/e2e/fixtures/` -- test data and mocks

---

### S7-2: Accessibility audit and fixes

**Size**: M (1 day)

**Description**:
Conduct a WCAG 2.1 AA accessibility audit across all pages and fix any issues. Verify keyboard navigation, screen reader support, color contrast, and focus management.

**Acceptance Criteria**:
- [ ] All interactive elements keyboard-navigable with visible focus indicators
- [ ] Tab order follows logical flow on all pages
- [ ] ARIA labels on all icon-only buttons and interactive elements
- [ ] ARIA live regions for: streaming content, save status, toast notifications
- [ ] Color contrast ratio 4.5:1 for text, 3:1 for large text and UI components (verified)
- [ ] All form inputs have associated `<label>` elements
- [ ] Error messages linked via `aria-describedby`
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Semantic HTML: headings hierarchy, nav, main, article elements used correctly
- [ ] Test with VoiceOver (macOS) or NVDA (Windows) for screen reader compatibility

**Dependencies**: All UI stories

**Files to Modify**:
- Various component files across `apps/web/components/`

---

### S7-3: Performance optimization

**Size**: S (0.5 day)

**Description**:
Verify and optimize performance against the NFR1 targets. Measure LCP, search latency, save times, and bundle size. Apply optimizations where needed.

**Acceptance Criteria**:
- [ ] LCP < 1.5s on all pages (measured with Lighthouse)
- [ ] Search latency < 200ms (measured from keystroke to results)
- [ ] Editor save < 500ms (measured from save trigger to confirmation)
- [ ] Initial JS bundle < 300KB gzipped
- [ ] Dynamic imports for heavy components (code editor, markdown renderer)
- [ ] Image optimization if any images are used
- [ ] Database queries < 50ms p95 (verified with logging)
- [ ] React Server Components used where possible to reduce client JS

**Dependencies**: All feature stories

---

### S7-4: Create Docker deployment files

**Size**: S (0.5 day)

**Description**:
Create the Dockerfile and docker-compose.yml for containerized deployment. Multi-stage build using `oven/bun:1` base image as specified in the deployment spec.

**Acceptance Criteria**:
- [ ] `Dockerfile` with multi-stage build: deps, builder, runner stages
- [ ] Uses `oven/bun:1` base image
- [ ] Production stage runs as non-root user (`nextjs:nodejs`)
- [ ] Data directory mounted as volume for persistence
- [ ] `docker-compose.yml` with service definition and volume
- [ ] `docker compose up -d` builds and runs the app successfully
- [ ] Environment variables configurable via docker-compose
- [ ] `.dockerignore` excludes `node_modules`, `.git`, `data/`, `.env*`
- [ ] Container exposes port 3000

**Dependencies**: S0-5

**Files to Create**:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

---

### S7-5: Write unit tests for remaining modules

**Size**: XL (3.5 days)

**Description**:
Fill in unit test coverage for all packages and API routes that were not covered during their implementation stories. Target 80%+ coverage across all packages.

**Acceptance Criteria**:
- [ ] `packages/types/` -- type guard functions tested (if any)
- [ ] `packages/db/` -- all query functions tested with in-memory SQLite
- [ ] `packages/db/` -- crypto module encryption/decryption round-trip tested
- [ ] `packages/db/` -- client initialization tested (SQLite and libsql paths)
- [ ] `packages/skill-engine/` -- parser edge cases: malformed YAML, no frontmatter, unicode content
- [ ] `packages/skill-engine/` -- validator all rules tested including boundary cases
- [ ] `packages/skill-engine/` -- generator round-trip with parser produces identical output
- [ ] `packages/skill-engine/` -- exporter zip structure verified
- [ ] `packages/skill-engine/` -- importer with fixture files
- [ ] `packages/skill-engine/` -- substitutions with missing/extra/no placeholders
- [ ] API routes: mock database, test request/response cycle for all endpoints
- [ ] `bun run test` passes with all tests green
- [ ] Coverage report generated showing 80%+ across packages

**Dependencies**: All feature stories

---

### S7-6: Final documentation and launch preparation

**Size**: S (0.5 day)

**Description**:
Final pass on all documentation. Update README with any changes from implementation, add CONTRIBUTING.md, verify CLAUDE.md is current, and prepare for open-source launch.

**Acceptance Criteria**:
- [ ] README.md updated with final screenshots/GIFs (if available)
- [ ] README quickstart verified: `git clone && bun install && bun dev` works on a clean machine
- [ ] CONTRIBUTING.md with contribution guidelines: fork, branch, PR process, coding standards
- [ ] CLAUDE.md updated to reflect final codebase structure and patterns
- [ ] LICENSE file (MIT) present at root
- [ ] `.env.example` file in `apps/web/` with all environment variables documented
- [ ] All spec files in `specs/` are consistent with final implementation
- [ ] `package.json` has correct repository, homepage, and license fields

**Dependencies**: All previous stories

**Files to Create**:
- `CONTRIBUTING.md`
- `LICENSE`
- `apps/web/.env.example`

**Files to Modify**:
- `README.md` -- final updates
- `CLAUDE.md` -- final updates
- `package.json` -- metadata fields

---

## Risk Assessment

### High Risk Stories

- **S5-1 / S5-2 (AI Chat route and creation page)**: OpenRouter API integration with streaming is the most complex integration. Mitigation: implement with mock responses first, add real API calls second. Test with multiple models.
- **S1-3 (Database client dual-driver)**: Supporting both `better-sqlite3` and `@libsql/client` from a single codebase adds complexity. Mitigation: abstract behind a common interface, test both paths, default to SQLite for local dev.
- **S6-4 (Importer module)**: Filesystem operations with security constraints (path traversal prevention, symlink handling) are error-prone. Mitigation: extensive unit tests with adversarial inputs, use `path.resolve()` and canonical path checking.
- **S4-7 (Auto-save)**: Debounced auto-save with version creation can lead to race conditions or excessive version spam. Mitigation: skip version creation for trivial changes, use optimistic locking, thorough testing.

### Technical Blockers

- **OpenRouter API access**: All AI features (FR2, FR4) require a valid OpenRouter API key. Testing these features requires either a real key or comprehensive mocking.
- **SQLite in Next.js**: `better-sqlite3` is a native module that requires special handling in Next.js (externalize in webpack config). This needs verification early.
- **Filesystem access in Vercel**: Deploy (FR5.2) and directory import (FR6.2) require filesystem access that is not available on Vercel. These features are local-only.

### Open Questions

1. Should the AI system prompt for skill creation be hardcoded or configurable by the user?
2. What is the maximum file size for zip import? Should there be a limit?
3. Should the editor support collaborative editing in the future (affects state management choice)?
4. Should skill slugs be immutable after creation, or allow renaming (affects deployed directory names)?
5. How should the app handle the case where `~/.claude/` directory does not exist at all (not just `~/.claude/skills/`)?

---

## Recommended Review Points

- **End of Sprint 0**: Verify monorepo scaffolding works (`bun install`, `bun dev`, `bun lint`, `bun build` all succeed). Confirm CLAUDE.md and README.md meet standards.
- **End of Sprint 1**: Verify all packages build and test independently. Run parser/generator round-trip test. Verify database creates and migrates correctly.
- **End of Sprint 2**: Design review of the UI shell. Verify theme switching, navigation, and layout match the "Vercel Light" spec. Component library complete.
- **End of Sprint 3**: Demo Skills Library with search, filter, pagination. Demo Settings page with API key flow. Verify end-to-end from Settings to Library.
- **End of Sprint 4**: Demo complete Skill Editor with all 5 tabs. Verify auto-save, validation, and version history. Test edge cases (empty fields, long content).
- **End of Sprint 5**: Demo AI-assisted skill creation flow end-to-end. Demo skill testing with streaming and metrics. Verify with at least 2 different AI models.
- **End of Sprint 6**: Demo full lifecycle: create skill (AI or manual), edit, test, export as zip, deploy to filesystem, import from zip/directory. Verify backup/restore.
- **End of Sprint 7**: Full E2E test suite green. Accessibility audit clean. Performance targets met. Docker deployment works. Documentation complete and accurate.

---

## Dependency Graph (Simplified)

```
Sprint 0: S0-1 --> S0-2, S0-3, S0-4, S0-5, S0-6
          S0-5 --> S0-7, S0-8

Sprint 1: S0-1 --> S1-1 --> S1-2 --> S1-3 --> S1-4 --> S1-5, S1-6
          S1-1 --> S1-7 --> S1-8

Sprint 2: S0-5 --> S2-1 --> S2-2, S2-3 --> S2-4 --> S2-5 --> S2-6
          S2-2 --> S2-7, S2-8

Sprint 3: S1-6 --> S3-1 --> S3-2 --> S3-3, S3-4
          S1-5 --> S3-5 --> S3-6 --> S3-7, S3-8

Sprint 4: S3-5 --> S4-1 --> S4-2, S4-3, S4-4, S4-5, S4-6
          S4-2, S4-3 --> S4-7 --> S4-8
          S4-1 --> S4-9

Sprint 5: S3-1 --> S5-1 --> S5-2 --> S5-3
          S5-1 --> S5-4 --> S5-5 --> S5-6 --> S5-7
          S3-4 --> S5-8

Sprint 6: S1-8 --> S6-1 --> S6-2 --> S6-3
          S1-7 --> S6-4 --> S6-5 --> S6-6
          S1-3 --> S6-7

Sprint 7: All --> S7-1, S7-2, S7-3, S7-4, S7-5, S7-6
```
