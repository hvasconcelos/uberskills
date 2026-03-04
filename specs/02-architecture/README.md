# 02 — Architecture

## Monorepo Structure

```
uberskills/
├── apps/
│   └── web/                          # Next.js 15 application
│       ├── app/                      # App Router pages & routes
│       │   ├── layout.tsx            # Root layout (providers, nav shell)
│       │   ├── page.tsx              # Dashboard / home
│       │   ├── skills/
│       │   │   ├── page.tsx          # Skills library (FR1)
│       │   │   ├── new/
│       │   │   │   └── page.tsx      # AI-assisted creation (FR2)
│       │   │   └── [id]/
│       │   │       ├── page.tsx      # Skill editor (FR3)
│       │   │       └── test/
│       │   │           └── page.tsx  # Skill testing (FR4)
│       │   ├── import/
│       │   │   └── page.tsx          # Import skills (FR6)
│       │   ├── settings/
│       │   │   └── page.tsx          # Settings (FR7)
│       │   └── api/
│       │       ├── skills/
│       │       │   └── route.ts      # CRUD operations
│       │       ├── chat/
│       │       │   └── route.ts      # AI chat streaming endpoint
│       │       ├── test/
│       │       │   └── route.ts      # Skill testing endpoint
│       │       ├── export/
│       │       │   └── route.ts      # Export / deploy (FR5)
│       │       ├── import/
│       │       │   └── route.ts      # Import processing (FR6)
│       │       └── settings/
│       │           └── route.ts      # Settings CRUD
│       ├── components/               # App-specific React components
│       ├── hooks/                    # Custom React hooks
│       ├── lib/                      # App utilities
│       └── styles/                   # Global CSS
├── packages/
│   ├── ui/                           # Shared shadcn/ui components
│   │   ├── src/
│   │   │   └── components/           # Button, Dialog, Input, etc.
│   │   └── package.json
│   ├── db/                           # Database layer
│   │   ├── src/
│   │   │   ├── schema.ts             # Drizzle table definitions
│   │   │   ├── client.ts             # SQLite connection
│   │   │   ├── migrations/           # Generated migration files
│   │   │   └── queries/              # Typed query functions
│   │   └── package.json
│   ├── skill-engine/                 # Skill parsing, validation, generation
│   │   ├── src/
│   │   │   ├── parser.ts             # SKILL.md → structured data
│   │   │   ├── validator.ts          # Schema & content validation
│   │   │   ├── generator.ts          # Structured data → SKILL.md
│   │   │   ├── exporter.ts           # Create zip / deploy to filesystem
│   │   │   ├── importer.ts           # Read from zip / directory
│   │   │   └── substitutions.ts      # Argument placeholder handling
│   │   └── package.json
│   └── types/                        # Shared TypeScript types
│       ├── src/
│       │   ├── skill.ts              # Skill, SkillFrontmatter, SkillFile
│       │   ├── test-run.ts           # TestRun, TestResult
│       │   └── settings.ts           # AppSettings
│       └── package.json
├── turbo.json                        # Turborepo pipeline config
├── package.json                      # Root workspace config
├── biome.json                        # Linter/formatter config
├── tsconfig.json                     # Base TypeScript config
└── bun.lock                          # Lockfile
```

## Turborepo Pipeline

```jsonc
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "db:migrate": {
      "cache": false
    }
  }
}
```

## Package Dependency Graph

```
apps/web
  ├── @uberskills/ui
  ├── @uberskills/db
  ├── @uberskills/skill-engine
  └── @uberskills/types

@uberskills/ui
  └── @uberskills/types

@uberskills/db
  └── @uberskills/types

@uberskills/skill-engine
  ├── @uberskills/types
  └── @uberskills/db
```

## Next.js App Router Structure

| Route | Page | FR | Description |
|---|---|---|---|
| `/` | Dashboard | — | Overview: recent skills, quick stats, shortcuts |
| `/skills` | Skills Library | FR1 | Browse, search, filter skills |
| `/skills/new` | Create Skill | FR2 | AI-assisted skill bootstrapping |
| `/skills/[id]` | Skill Editor | FR3 | Edit metadata, content, files |
| `/skills/[id]/test` | Skill Testing | FR4 | Run skill against AI models |
| `/import` | Import | FR6 | Import from directory or zip |
| `/settings` | Settings | FR7 | API key, preferences |

## API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/skills` | List skills (with search, filter, pagination) |
| `POST` | `/api/skills` | Create a new skill |
| `GET` | `/api/skills/[id]` | Get skill by ID |
| `PUT` | `/api/skills/[id]` | Update skill |
| `DELETE` | `/api/skills/[id]` | Delete skill |
| `POST` | `/api/chat` | AI chat completion (streaming) |
| `POST` | `/api/test` | Execute skill test run |
| `POST` | `/api/export` | Export skill as zip |
| `POST` | `/api/export/deploy` | Deploy skill to `~/.claude/skills/` |
| `POST` | `/api/import` | Import skill from upload/directory |
| `GET` | `/api/settings` | Get app settings |
| `PUT` | `/api/settings` | Update settings |

## AI Integration Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│                                                                  │
│  ┌──────────────┐    useChat()     ┌──────────────────────────┐ │
│  │  Chat Panel   │ ──────────────► │  /api/chat (Route)       │ │
│  │  (FR2 / FR4)  │ ◄────stream──── │                          │ │
│  └──────────────┘                  └──────────┬───────────────┘ │
│                                               │                  │
└───────────────────────────────────────────────┼──────────────────┘
                                                │
                                    Vercel AI SDK streamText()
                                                │
                                    ┌───────────▼───────────────┐
                                    │    @openrouter/ai-sdk-     │
                                    │    provider                │
                                    │                            │
                                    │  ┌─────────────────────┐  │
                                    │  │  OpenRouter API      │  │
                                    │  │  /chat/completions   │  │
                                    │  └─────────┬───────────┘  │
                                    └────────────┼──────────────┘
                                                 │
                                    ┌────────────▼──────────────┐
                                    │   AI Model (selected)      │
                                    │   Claude / GPT / Gemini    │
                                    └────────────────────────────┘
```

### AI Chat Route Handler (Conceptual)

1. Receive messages + selected model from client via `useChat()`.
2. Retrieve OpenRouter API key from `settings` table (decrypted).
3. Configure `@openrouter/ai-sdk-provider` with the API key.
4. Call `streamText()` with the selected model, system prompt, and messages.
5. Return the streaming response to the client.

## Data Flow — Skill Lifecycle

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Create  │────►│  Edit    │────►│  Test    │────►│  Export  │────►│  Deploy  │
│  (FR2)   │     │  (FR3)   │     │  (FR4)   │     │  (FR5)   │     │  (FR5)   │
└─────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
     │               │                │                │                │
     ▼               ▼                ▼                ▼                ▼
  skills DB      skills DB +      test_runs DB    .zip file      ~/.claude/
  row created    skill_versions    row created     generated      skills/<name>/
                 row created                                      SKILL.md
```

### Skill Creation Flow (FR2)

1. User opens `/skills/new`, enters a natural language description.
2. Client sends description to `/api/chat` via `useChat()`.
3. AI generates a SKILL.md draft (YAML frontmatter + instructions).
4. `skill-engine.parser` parses the AI output into structured data.
5. User reviews and edits the parsed skill in a preview panel.
6. On save, `/api/skills` (POST) stores the skill in SQLite via `@uberskills/db`.

### Skill Testing Flow (FR4)

1. User selects a model and optional arguments on `/skills/[id]/test`.
2. `skill-engine.substitutions` replaces `$ARGUMENTS` placeholders.
3. Client sends the resolved system prompt + user message to `/api/test`.
4. API route streams the AI response back.
5. On completion, token usage and timing are saved to `test_runs`.

## Filesystem Storage Architecture

Skills are stored in SQLite as the source of truth. On export/deploy, the skill-engine generates the standard Claude Code directory layout:

```
~/.claude/skills/<skill-name>/
├── SKILL.md          # YAML frontmatter + markdown instructions
├── prompts/          # (optional) additional prompt files
└── resources/        # (optional) reference files
```

The `skill_files` table tracks additional files (prompts, resources) associated with each skill.

## Cross-References

- Tech stack rationale → [01-overview](../01-overview/README.md)
- Table schemas → [03-data-models](../03-data-models/README.md)
- Feature details → [04-functional-requirements](../04-functional-requirements/README.md)
- AI integration details → [06-integrations](../06-integrations/README.md)
- Deployment config → [07-deployment](../07-deployment/README.md)
