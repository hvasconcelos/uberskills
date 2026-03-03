# 01 — Project Overview

## Vision

**UberSkillz** is an open-source web application that empowers developers to design, test, and deploy [Claude Code Agent Skills](https://docs.anthropic.com/en/docs/claude-code/skills) through a visual, AI-assisted workflow. It replaces manual SKILL.md authoring with a structured editor, multi-model testing sandbox, and one-click deployment to `~/.claude/skills/`.

## Problem Statement

Creating Claude Code skills today is entirely manual:

- Authors must hand-write YAML frontmatter and markdown instructions in a `SKILL.md` file.
- There is no built-in way to preview, validate, or test a skill before deploying it.
- Iterating on prompt quality requires repeatedly editing files, restarting Claude Code, and invoking the skill.
- No tooling exists for managing a library of skills, versioning changes, or sharing skills across machines.

UberSkillz solves these problems by providing an integrated authoring environment purpose-built for the Claude Code skill format.

## Key Differentiators

| Differentiator | Description |
|---|---|
| **Open Source** | MIT-licensed, community-driven, self-hostable |
| **Local-First** | SQLite database, no external services required (except AI provider) |
| **AI-Assisted** | Chat-driven skill bootstrapping via multi-model AI |
| **Multi-Model Testing** | Test skills against any model available on OpenRouter |
| **Full Spec Compliance** | Generates valid `SKILL.md` files per the Claude Code Agent Skills specification |
| **Zero Config** | `bun install && bun dev` — no Docker, no Postgres, no signup |

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Monorepo | Turborepo + Bun | Fast builds, native workspaces, single lockfile |
| Framework | Next.js 15 (App Router) | RSC, streaming, file-based routing |
| UI | shadcn/ui + Tailwind CSS v4 | Accessible components, rapid styling |
| Database | SQLite + Drizzle ORM | Local-first, zero-config, type-safe queries |
| AI SDK | Vercel AI SDK + `@openrouter/ai-sdk-provider` | Streaming, multi-model, unified API |
| AI Provider | OpenRouter | Access to Claude, GPT, Gemini, Llama, etc. |
| Language | TypeScript (strict) | End-to-end type safety |
| Testing | Vitest + Playwright | Unit + E2E coverage |
| Linting | Biome | Fast, unified linter + formatter |

## User Personas

### 1. Solo Developer — "Alex"

- Builds personal Claude Code skills to automate repetitive coding tasks.
- Wants a GUI to iterate on prompt wording and test against different models.
- Values zero-config local setup and fast feedback loops.

### 2. Team Lead — "Jordan"

- Manages a library of shared skills for the engineering team.
- Needs version history, import/export, and a way to standardize skill quality.
- Values validation, consistency checks, and bulk operations.

### 3. AI Enthusiast — "Sam"

- Experiments with prompt engineering across multiple AI models.
- Wants to compare model responses side-by-side for the same skill.
- Values multi-model support and streaming response visibility.

## Design Principles

1. **Convention over Configuration** — sensible defaults, minimal setup.
2. **Progressive Disclosure** — simple for beginners, powerful for experts.
3. **Offline Capable** — core editing and management works without network (AI features require connectivity).
4. **Non-Destructive** — version history and undo; never silently overwrite user data.
5. **Spec-Compliant** — output is always a valid Claude Code skill directory.

## Visual Design — "Vercel Light" Theme

The UI follows a **clean, minimal, Vercel-inspired aesthetic** — predominantly white with black text, generous whitespace, and subtle gray borders. The goal is a developer tool that feels calm, professional, and highly readable.

### Design Reference

The visual language is modeled after Vercel's templates/marketplace pages: white backgrounds, thin gray card borders, crisp typography, and almost no color outside of semantic indicators (status badges, error states).

### Color System

#### Light Mode (Default)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#0A0A0A` | Primary text |
| `--muted` | `#F5F5F5` | Subtle backgrounds (hover states, code blocks) |
| `--muted-foreground` | `#737373` | Secondary text, placeholders, descriptions |
| `--border` | `#E5E5E5` | Card borders, dividers, input outlines |
| `--input` | `#E5E5E5` | Input field borders |
| `--ring` | `#0A0A0A` | Focus rings |
| `--primary` | `#0A0A0A` | Primary buttons, active nav items |
| `--primary-foreground` | `#FAFAFA` | Text on primary buttons |
| `--secondary` | `#F5F5F5` | Secondary buttons |
| `--secondary-foreground` | `#0A0A0A` | Text on secondary buttons |
| `--accent` | `#F5F5F5` | Hover backgrounds, selected rows |
| `--accent-foreground` | `#0A0A0A` | Text on accent backgrounds |
| `--destructive` | `#EF4444` | Delete actions, error states |
| `--card` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `#0A0A0A` | Card text |
| `--popover` | `#FFFFFF` | Dropdown/popover backgrounds |

#### Dark Mode

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0A0A0A` | Page background |
| `--foreground` | `#FAFAFA` | Primary text |
| `--muted` | `#171717` | Subtle backgrounds |
| `--muted-foreground` | `#A3A3A3` | Secondary text |
| `--border` | `#262626` | Card borders, dividers |
| `--input` | `#262626` | Input field borders |
| `--ring` | `#D4D4D4` | Focus rings |
| `--primary` | `#FAFAFA` | Primary buttons |
| `--primary-foreground` | `#0A0A0A` | Text on primary buttons |
| `--secondary` | `#171717` | Secondary buttons |
| `--secondary-foreground` | `#FAFAFA` | Text on secondary buttons |
| `--accent` | `#171717` | Hover backgrounds |
| `--accent-foreground` | `#FAFAFA` | Text on accent backgrounds |
| `--destructive` | `#DC2626` | Delete actions, error states |
| `--card` | `#0A0A0A` | Card backgrounds |
| `--card-foreground` | `#FAFAFA` | Card text |
| `--popover` | `#171717` | Dropdown/popover backgrounds |

### Semantic Status Colors

| Status | Light | Dark | Usage |
|---|---|---|---|
| Draft | `#F5F5F5` bg / `#737373` text | `#262626` bg / `#A3A3A3` text | Skill status badge |
| Ready | `#DCFCE7` bg / `#166534` text | `#14532D` bg / `#86EFAC` text | Skill status badge |
| Deployed | `#DBEAFE` bg / `#1E40AF` text | `#1E3A5F` bg / `#93C5FD` text | Skill status badge |
| Error | `#FEE2E2` bg / `#991B1B` text | `#450A0A` bg / `#FCA5A5` text | Test run failures |
| Success | `#DCFCE7` bg / `#166534` text | `#14532D` bg / `#86EFAC` text | Toasts, test pass |

### Typography

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page title | Geist Sans | 24px / `text-2xl` | 700 (bold) | `--foreground` |
| Section heading | Geist Sans | 18px / `text-lg` | 600 (semibold) | `--foreground` |
| Body text | Geist Sans | 14px / `text-sm` | 400 (regular) | `--foreground` |
| Secondary text | Geist Sans | 14px / `text-sm` | 400 (regular) | `--muted-foreground` |
| Code / editor | Geist Mono | 13px | 400 (regular) | `--foreground` |
| Nav items | Geist Sans | 14px / `text-sm` | 500 (medium) | `--foreground` |
| Badge text | Geist Sans | 12px / `text-xs` | 500 (medium) | Varies by status |

**Font stack:** `font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
**Mono stack:** `font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace`

### Spacing & Layout

| Property | Value | Notes |
|---|---|---|
| Page max-width | `1280px` (`max-w-6xl`) | Centered with auto margins |
| Page padding | `24px` horizontal | `px-6` on all pages |
| Card padding | `20px` (`p-5`) | Interior padding |
| Card border-radius | `8px` (`rounded-lg`) | Consistent rounded corners |
| Card border | `1px solid var(--border)` | Thin, subtle border — no shadows |
| Section gap | `32px` (`gap-8`) | Vertical spacing between sections |
| Grid gap | `16px` (`gap-4`) | Between skill cards |
| Input height | `40px` (`h-10`) | Standard input/button height |
| Nav height | `64px` (`h-16`) | Top navigation bar |

### Component Styling

#### Navigation Bar
- White background with a `1px` bottom border (`border-b`)
- Logo (text mark "UberSkillz") on the left in bold
- Nav links: regular weight, `--muted-foreground` color, `--foreground` on hover/active
- Full-width, content centered with `max-w-6xl`

#### Cards (Skill Cards, Settings Sections)
- White background, `1px` solid `--border`, `rounded-lg`
- **No box-shadow** — borders only (consistent with Vercel aesthetic)
- Subtle `--accent` background on hover
- Content: title in semibold, description in `--muted-foreground`

#### Buttons
- **Primary:** Black background (`--primary`), white text, `rounded-md`, `h-10`, `px-4`
- **Secondary/Outline:** White background, `1px` border, black text, `rounded-md`
- **Ghost:** No background, no border, `--muted-foreground` text, visible on hover
- **Destructive:** Red background (`--destructive`), white text

#### Inputs & Search
- `1px` border `--border`, `rounded-md`, `h-10`
- Placeholder text in `--muted-foreground`
- Focus: `2px` ring in `--ring` color (black/white depending on mode)
- Search input styled larger on hero sections (like Vercel templates page)

#### Status Badges
- Pill shape (`rounded-full`, `px-2.5 py-0.5`)
- Colored backgrounds per status (see Semantic Status Colors above)
- Small text (`text-xs`, medium weight)

#### Tables (Test History)
- No outer border
- Header row with `--muted` background
- Row dividers with `1px` bottom border
- Hover row highlight with `--accent` background

### Icons

- **Library:** [Lucide React](https://lucide.dev) (same icon set used by shadcn/ui)
- **Size:** 16px (`w-4 h-4`) inline, 20px (`w-5 h-5`) for standalone actions
- **Color:** `currentColor` — inherits from text color
- **Stroke width:** 1.5px (Lucide default)

### Motion & Transitions

- **Default transition:** `transition-colors duration-150` on interactive elements
- **Skeleton loading:** Pulse animation on `--muted` backgrounds for loading states
- **Toast notifications:** Slide in from bottom-right, auto-dismiss after 5s
- **Streaming text:** No animation — text appears as it streams (cursor blink on final line)
- **Respect `prefers-reduced-motion`:** All animations disabled when preference is set

### Dark Mode Implementation

- Toggled via Settings (FR7.5), stored in `settings` table as `theme: "light" | "dark" | "system"`
- Applied using Tailwind CSS `class` strategy: `<html class="dark">`
- System preference detected via `matchMedia('(prefers-color-scheme: dark)')`
- Theme provider wraps the root layout, reads from settings on mount
- SSR: default to light to avoid flash; hydrate with stored preference

## No Authentication

UberSkillz is designed as a **single-user local development tool**. There is no login, signup, or user management. The OpenRouter API key is entered in the Settings page and stored encrypted in the local SQLite database. This keeps the architecture simple and aligns with the local-first philosophy.

## Cross-References

- Architecture details → [02-architecture](../02-architecture/README.md)
- Data model definitions → [03-data-models](../03-data-models/README.md)
- Feature specifications → [04-functional-requirements](../04-functional-requirements/README.md)
- Quality attributes → [05-non-functional-requirements](../05-non-functional-requirements/README.md)
- External integrations → [06-integrations](../06-integrations/README.md)
- Deployment & ops → [07-deployment](../07-deployment/README.md)
