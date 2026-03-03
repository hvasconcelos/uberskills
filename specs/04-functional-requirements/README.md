# 04 — Functional Requirements

## FR1 — Skills Library

**Page:** `/skills`

**Description:** A browsable, searchable library of all skills stored in the local database. Users can view skills in a grid or list layout, search by name/description/tags, filter by status, and paginate through results.

### Wireframe Description

```
┌──────────────────────────────────────────────────────────────────┐
│  UberSkillz           Skills    Import    Settings               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Skills Library                            [+ New Skill]         │
│                                                                  │
│  ┌──────────────────────────────┐  [Grid|List]  Filter: [All ▾] │
│  │  🔍 Search skills...         │                                │
│  └──────────────────────────────┘                                │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Skill A  │  │ Skill B  │  │ Skill C  │  │ Skill D  │        │
│  │          │  │          │  │          │  │          │        │
│  │ desc...  │  │ desc...  │  │ desc...  │  │ desc...  │        │
│  │          │  │          │  │          │  │          │        │
│  │ [draft]  │  │ [ready]  │  │[deployed]│  │ [draft]  │        │
│  │ 3 tags   │  │ 1 tag    │  │ 2 tags   │  │ 0 tags   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ◄ 1 2 3 ... ►                              Showing 1-12 of 47  │
└──────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- **FR1.1:** Page displays all skills from the `skills` table in a responsive card grid (default) or list view.
- **FR1.2:** Search input filters skills by `name`, `description`, and `tags` with debounced input (<200ms perceived latency).
- **FR1.3:** Status filter dropdown allows filtering by `draft`, `ready`, `deployed`, or `all`.
- **FR1.4:** Each skill card displays: name, truncated description (120 chars), status badge, tag chips, and last updated date.
- **FR1.5:** Clicking a skill card navigates to `/skills/[id]` (editor).
- **FR1.6:** "New Skill" button navigates to `/skills/new`.
- **FR1.7:** Pagination: 12 skills per page, with prev/next and page number controls.
- **FR1.8:** Empty state shows illustration and "Create your first skill" CTA when no skills exist.
- **FR1.9:** Skills are sorted by `updated_at` descending by default; sortable by name or created date.

---

## FR2 — AI-Assisted Skill Creation

**Page:** `/skills/new`

**Description:** A chat-driven interface where users describe the skill they want in natural language, and an AI model generates a complete SKILL.md draft. The user can iterate through conversation, preview the generated skill, and save it to the library.

### Wireframe Description

```
┌──────────────────────────────────────────────────────────────────┐
│  UberSkillz           Skills    Import    Settings               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Create New Skill                        Model: [claude-sonnet▾] │
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐ │
│  │  Chat                    │  │  Skill Preview               │ │
│  │                          │  │                              │ │
│  │  User: I need a skill    │  │  ---                         │ │
│  │  that reviews PRs...     │  │  name: PR Reviewer           │ │
│  │                          │  │  description: Reviews PRs    │ │
│  │  AI: Here's a skill      │  │  trigger: When user asks     │ │
│  │  that will review PRs    │  │    to review a PR            │ │
│  │  and provide feedback... │  │  ---                         │ │
│  │                          │  │                              │ │
│  │                          │  │  ## Instructions             │ │
│  │                          │  │  When reviewing a PR...      │ │
│  │                          │  │                              │ │
│  ├──────────────────────────┤  │                              │ │
│  │  [Describe your skill..] │  │                              │ │
│  │                   [Send] │  │  [Edit & Save]  [Regenerate] │ │
│  └──────────────────────────┘  └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- **FR2.1:** Chat panel uses `useChat()` hook connected to `/api/chat` for streaming AI responses.
- **FR2.2:** Model selector dropdown lists available models from OpenRouter (fetched from `/models` endpoint).
- **FR2.3:** System prompt instructs the AI to generate a valid SKILL.md with YAML frontmatter (`name`, `description`, `trigger`) and markdown instructions.
- **FR2.4:** Preview panel parses the AI response in real-time using `skill-engine.parser` and renders structured SKILL.md preview.
- **FR2.5:** "Regenerate" button re-sends the conversation to produce a new draft.
- **FR2.6:** "Edit & Save" button creates a new skill record (`status: draft`) and navigates to `/skills/[id]`.
- **FR2.7:** Conversation history is maintained during the session but not persisted to the database.
- **FR2.8:** Error states: missing API key (link to Settings), network error, rate limit exceeded.
- **FR2.9:** If no API key is configured, the page shows a prompt to configure one in Settings before proceeding.

---

## FR3 — Skill Editor

**Page:** `/skills/[id]`

**Description:** A comprehensive editor for an existing skill. Includes a metadata form (frontmatter fields), a markdown editor for instructions, a file manager for additional prompts/resources, a live preview of the generated SKILL.md, and version history.

### Wireframe Description

```
┌──────────────────────────────────────────────────────────────────┐
│  UberSkillz           Skills    Import    Settings               │
├──────────────────────────────────────────────────────────────────┤
│  ◄ Back to Library                                               │
│                                                                  │
│  Skill: PR Reviewer                  [Test] [Export] [Deploy]    │
│  Status: draft ▾                                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  [Metadata]  [Instructions]  [Files]  [Preview]  [History] │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  Metadata Tab:                                              │ │
│  │  ┌─────────────────────────────────────────┐               │ │
│  │  │ Name:        [PR Reviewer             ] │               │ │
│  │  │ Description: [Reviews pull requests... ] │               │ │
│  │  │ Trigger:     [When user asks to review ] │               │ │
│  │  │ Tags:        [review] [pr] [+]           │               │ │
│  │  │ Model Pattern: [                       ] │               │ │
│  │  └─────────────────────────────────────────┘               │ │
│  │                                                             │ │
│  │  [Save Changes]                        Auto-saved ✓        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- **FR3.1:** **Metadata tab** — Form fields for `name`, `description`, `trigger`, `tags` (tag input with add/remove), and `model_pattern` (optional regex). Maps to `SkillFrontmatter` type.
- **FR3.2:** **Instructions tab** — Markdown editor (textarea or code editor) for the skill body content. Supports syntax highlighting for markdown.
- **FR3.3:** **Files tab** — List of associated `skill_files`. Users can add, edit, rename, and delete files. Each file has a `path` and `type` (prompt or resource).
- **FR3.4:** **Preview tab** — Read-only rendered view of the complete SKILL.md (frontmatter + instructions) as it will be exported. Generated by `skill-engine.generator`.
- **FR3.5:** **History tab** — List of `skill_versions` for this skill, showing version number, change summary, and timestamp. Users can view a past version's content (read-only).
- **FR3.6:** **Save** — Saving creates a new `skill_versions` row (auto-incremented version number) and updates the `skills` row. The `change_summary` is auto-generated (e.g., "Updated instructions") or user-provided.
- **FR3.7:** **Status** — Dropdown to change status between `draft`, `ready`, `deployed`.
- **FR3.8:** **Action buttons** — "Test" navigates to `/skills/[id]/test`, "Export" triggers FR5 zip download, "Deploy" triggers FR5 filesystem deploy.
- **FR3.9:** **Auto-save** — Changes are auto-saved to a local draft after 3 seconds of inactivity (debounced). Visual indicator shows save status.
- **FR3.10:** **Validation** — `name` and `trigger` are required. `slug` is auto-generated from name but editable. Validation errors shown inline.
- **FR3.11:** **Delete** — Accessible from a menu; requires confirmation dialog. Cascades to `skill_files`, `skill_versions`, and `test_runs`.

---

## FR4 — Skill Testing

**Page:** `/skills/[id]/test`

**Description:** A testing sandbox where users can run a skill against a selected AI model, provide test arguments, and see the streaming response. Token usage and latency metrics are displayed after completion.

### Wireframe Description

```
┌──────────────────────────────────────────────────────────────────┐
│  UberSkillz           Skills    Import    Settings               │
├──────────────────────────────────────────────────────────────────┤
│  ◄ Back to Editor                                                │
│                                                                  │
│  Test: PR Reviewer                                               │
│                                                                  │
│  ┌───────────────────────┐  ┌─────────────────────────────────┐ │
│  │  Configuration        │  │  Response                       │ │
│  │                       │  │                                 │ │
│  │  Model: [claude-s.. ▾]│  │  ▍ The PR looks good overall.  │ │
│  │                       │  │  Here are my suggestions:       │ │
│  │  System Prompt:       │  │                                 │ │
│  │  ┌─────────────────┐ │  │  1. Consider adding error       │ │
│  │  │ (read-only      │ │  │     handling in `fetch.ts`      │ │
│  │  │  resolved skill │ │  │  2. The test coverage for...    │ │
│  │  │  content)       │ │  │                                 │ │
│  │  └─────────────────┘ │  │  ─────────────────────────────  │ │
│  │                       │  │  Tokens: 1,247 in / 892 out    │ │
│  │  Arguments:           │  │  Latency: 3.2s  TTFT: 0.8s     │ │
│  │  $ARG1: [value      ]│  │                                 │ │
│  │  $ARG2: [value      ]│  │                                 │ │
│  │                       │  │                                 │ │
│  │  User Message:        │  │                                 │ │
│  │  ┌─────────────────┐ │  │                                 │ │
│  │  │ Review this PR  │ │  │                                 │ │
│  │  └─────────────────┘ │  │                                 │ │
│  │                       │  │                                 │ │
│  │  [Run Test]           │  │                                 │ │
│  └───────────────────────┘  └─────────────────────────────────┘ │
│                                                                  │
│  Test History                                                    │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ #  Model              Tokens    Latency  Status   Date      ││
│  │ 3  claude-sonnet-4    2,139     3.2s     ✓        2 min ago ││
│  │ 2  gpt-4o             1,987     2.8s     ✓        5 min ago ││
│  │ 1  claude-sonnet-4    2,054     4.1s     ✗        8 min ago ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- **FR4.1:** Model selector dropdown lists available models from OpenRouter.
- **FR4.2:** System prompt panel shows the resolved skill content (YAML frontmatter rendered as header, markdown instructions below). Read-only.
- **FR4.3:** Arguments panel detects `$ARGUMENTS` or named placeholders (e.g., `$FILE_PATH`) in the skill content and renders input fields for each. `skill-engine.substitutions` performs the replacement.
- **FR4.4:** User message textarea for the test prompt sent alongside the skill system prompt.
- **FR4.5:** "Run Test" sends the request to `/api/test`. The response streams into the response panel via `useChat()` or a custom streaming hook.
- **FR4.6:** During streaming, a cursor/spinner indicates the response is in progress.
- **FR4.7:** On completion, display: `prompt_tokens`, `completion_tokens`, `total_tokens`, `latency_ms`, `ttft_ms`.
- **FR4.8:** A `test_runs` row is created with status `running` on start, updated to `completed` or `error` on finish.
- **FR4.9:** Test history table shows previous runs for this skill, sorted by `created_at` descending. Clicking a row shows the full response.
- **FR4.10:** Error handling: invalid API key, model unavailable, rate limit, network failure — each with a descriptive message.

---

## FR5 — Export & Deploy

**Description:** Users can export a skill as a `.zip` file for download or deploy it directly to the local `~/.claude/skills/` directory.

### Acceptance Criteria

- **FR5.1:** **Zip Export** — Generates a `.zip` containing:
  ```
  <skill-slug>/
  ├── SKILL.md          # Generated by skill-engine.generator
  ├── prompts/          # Files from skill_files where type = "prompt"
  └── resources/        # Files from skill_files where type = "resource"
  ```
  Triggered from the Skill Editor (FR3.8) or Skills Library context menu.

- **FR5.2:** **Deploy** — Copies the generated skill directory to `~/.claude/skills/<skill-slug>/`. Overwrites if the directory exists (with confirmation dialog).

- **FR5.3:** `skill-engine.generator` produces the SKILL.md:
  ```markdown
  ---
  name: <name>
  description: <description>
  trigger: <trigger>
  model_pattern: <model_pattern>    # only if set
  ---

  <content (markdown instructions)>
  ```

- **FR5.4:** On successful deploy, the skill's `status` is updated to `deployed`.

- **FR5.5:** Deploy checks if `~/.claude/skills/` directory exists; creates it if not.

- **FR5.6:** Export/deploy is available via API endpoints (`/api/export`, `/api/export/deploy`) for potential CLI integration.

---

## FR6 — Import

**Page:** `/import`

**Description:** Users can import skills from a local directory path or a `.zip` file upload. Imported skills are parsed, validated, previewed, and saved to the database.

### Wireframe Description

```
┌──────────────────────────────────────────────────────────────────┐
│  UberSkillz           Skills    Import    Settings               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Import Skills                                                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  [Upload .zip]    or    [Scan Directory]                     ││
│  │                                                              ││
│  │  Directory: [~/.claude/skills/                          ] [Scan]│
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Found 3 skills:                                                 │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ ☑ PR Reviewer       Valid ✓    "Reviews pull requests..."   ││
│  │ ☑ Code Formatter    Valid ✓    "Formats code using..."      ││
│  │ ☐ broken-skill      Invalid ✗  Missing 'trigger' field      ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [Import Selected (2)]                                           │
└──────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- **FR6.1:** **Zip upload** — User uploads a `.zip` file. `skill-engine.importer` extracts and parses each skill directory found.
- **FR6.2:** **Directory scan** — User provides a directory path (e.g., `~/.claude/skills/`). `skill-engine.importer` scans for directories containing `SKILL.md` files.
- **FR6.3:** **Validation** — Each found skill is validated by `skill-engine.validator`. Valid skills are checked; invalid skills show the validation error and are unchecked.
- **FR6.4:** **Preview** — Users can expand a skill row to see the parsed frontmatter and content preview.
- **FR6.5:** **Selective import** — Checkbox selection allows importing only chosen skills.
- **FR6.6:** **Conflict detection** — If a skill with the same `slug` exists, show "Already exists — overwrite?" option.
- **FR6.7:** On import, create `skills` and `skill_files` rows. Initial `skill_versions` row is created (version 1).
- **FR6.8:** Post-import, navigate to the Skills Library with a success toast showing count of imported skills.

---

## FR7 — Settings

**Page:** `/settings`

**Description:** Application settings for API configuration, preferences, and data management.

### Wireframe Description

```
┌──────────────────────────────────────────────────────────────────┐
│  UberSkillz           Skills    Import    Settings               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Settings                                                        │
│                                                                  │
│  API Configuration                                               │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ OpenRouter API Key: [sk-or-••••••••••••••••] [Show] [Test]  ││
│  │ Status: ✓ Connected                                         ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Preferences                                                     │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Default Model:  [anthropic/claude-sonnet-4         ▾]       ││
│  │ Theme:          [System ▾]                                  ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Data Management                                                 │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ [Export All Skills]   [Backup Database]   [Restore Backup]  ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- **FR7.1:** **API Key** — Input field for OpenRouter API key. Stored encrypted in `settings` table (key: `openrouter_api_key`, `encrypted: true`).
- **FR7.2:** **Key masking** — API key is masked by default (show last 4 chars). "Show" button toggles visibility.
- **FR7.3:** **Key test** — "Test" button sends a lightweight request to OpenRouter `/models` endpoint to validate the key. Shows success/error status.
- **FR7.4:** **Default Model** — Dropdown of available models (fetched from OpenRouter when API key is valid). Stored in `settings` table (key: `default_model`).
- **FR7.5:** **Theme** — Toggle between `light`, `dark`, `system`. Stored in `settings` table (key: `theme`). Applied via Tailwind CSS dark mode class strategy.
- **FR7.6:** **Export All Skills** — Downloads a single `.zip` containing all skills (each in its own subdirectory).
- **FR7.7:** **Backup Database** — Downloads the raw SQLite database file.
- **FR7.8:** **Restore Backup** — Upload a SQLite database file to replace the current one (with confirmation dialog and automatic backup of current DB).
- **FR7.9:** Settings are saved immediately on change (no "Save" button needed). Visual feedback confirms each save.

## Cross-References

- Data model fields used in forms → [03-data-models](../03-data-models/README.md)
- UI component library → [01-overview](../01-overview/README.md) (shadcn/ui)
- API routes serving these features → [02-architecture](../02-architecture/README.md)
- AI integration for FR2/FR4 → [06-integrations](../06-integrations/README.md)
- Export/deploy implementation → [06-integrations](../06-integrations/README.md)
- Performance targets for these features → [05-non-functional-requirements](../05-non-functional-requirements/README.md)
