# 06 — Integrations

## OpenRouter API

UberSkillz uses [OpenRouter](https://openrouter.ai) as its AI provider, giving users access to multiple models (Claude, GPT, Gemini, Llama, etc.) through a single API.

### Models Endpoint

**Purpose:** Fetch the list of available models for the model selector dropdowns (FR2.2, FR4.1, FR7.4).

```
GET https://openrouter.ai/api/v1/models
Authorization: Bearer <api_key>
```

Response is cached client-side for 5 minutes. The model list is filtered to show only chat-capable models and sorted by provider.

### Chat Completions Endpoint

**Purpose:** Generate AI responses for skill creation (FR2) and skill testing (FR4).

```
POST https://openrouter.ai/api/v1/chat/completions
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "model": "<selected-model-id>",
  "messages": [...],
  "stream": true
}
```

Responses are streamed using Server-Sent Events (SSE). Token usage is returned in the final chunk.

### OpenRouter-Specific Headers

```
HTTP-Referer: http://localhost:3000
X-Title: UberSkillz
```

These headers identify the application to OpenRouter for analytics and are set in the provider configuration.

## Vercel AI SDK

The [Vercel AI SDK](https://sdk.vercel.ai) provides the streaming infrastructure and React hooks.

### Server-Side — `streamText()`

Used in API route handlers (`/api/chat`, `/api/test`) to stream AI responses.

```typescript
// Conceptual pattern — apps/web/app/api/chat/route.ts
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export async function POST(req: Request) {
  const { messages, model } = await req.json();
  const apiKey = await getDecryptedApiKey(); // from settings table

  const openrouter = createOpenRouter({ apiKey });

  const result = streamText({
    model: openrouter(model),
    system: SKILL_CREATION_SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Client-Side — `useChat()`

Used in React components for the chat interface (FR2) and testing interface (FR4).

```typescript
// Conceptual pattern — apps/web/components/chat-panel.tsx
import { useChat } from "ai/react";

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: "/api/chat",
  body: { model: selectedModel },
});
```

### Key Vercel AI SDK Features Used

| Feature | Usage |
|---|---|
| `streamText()` | Server-side streaming in API routes |
| `useChat()` | Client-side chat hook with automatic streaming |
| `toDataStreamResponse()` | Convert stream to Next.js-compatible Response |
| `onFinish` callback | Capture token usage and save to `test_runs` |
| `experimental_transform` | (Future) Post-process streamed content |

## `@openrouter/ai-sdk-provider`

The [OpenRouter AI SDK Provider](https://openrouter.ai/docs/frameworks/vercel-ai-sdk) bridges Vercel AI SDK with OpenRouter's API.

### Configuration

```typescript
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: "<decrypted-api-key>",
  // OpenRouter-specific headers
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "UberSkillz",
  },
});

// Use any OpenRouter model
const model = openrouter("anthropic/claude-sonnet-4");
```

## Skill Engine (`@uberskillz/skill-engine`)

The skill-engine package handles all SKILL.md parsing, validation, generation, and filesystem operations. It is the core business logic package with no UI dependencies.

### Parser — `parser.ts`

Parses a raw SKILL.md string into structured data.

**Input:** Raw SKILL.md content (string)
**Output:** `{ frontmatter: SkillFrontmatter, content: string }`

Parsing steps:
1. Extract YAML frontmatter between `---` delimiters.
2. Parse YAML into `SkillFrontmatter` object.
3. Extract remaining markdown as `content`.
4. Return structured result.

### Validator — `validator.ts`

Validates a parsed skill against the Claude Code skill specification.

**Validation rules:**
- `name` — required, non-empty, max 100 characters
- `description` — required, non-empty, max 500 characters
- `trigger` — required, non-empty, describes when the skill activates
- `model_pattern` — if present, must be a valid regex
- `content` — required, non-empty (markdown instructions)
- No duplicate file paths in associated `skill_files`

**Output:** `{ valid: boolean, errors: ValidationError[] }`

```typescript
interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
}
```

### Generator — `generator.ts`

Generates a SKILL.md string from structured data.

**Input:** `{ frontmatter: SkillFrontmatter, content: string }`
**Output:** Complete SKILL.md string with YAML frontmatter and markdown body.

Generation steps:
1. Serialize `SkillFrontmatter` to YAML.
2. Wrap in `---` delimiters.
3. Append content (markdown instructions) after a blank line.
4. Ensure trailing newline.

### Exporter — `exporter.ts`

Creates a deployable skill package.

**Zip export:**
1. Create directory structure: `<slug>/SKILL.md`, `<slug>/prompts/*`, `<slug>/resources/*`.
2. Generate SKILL.md via `generator`.
3. Include `skill_files` in appropriate subdirectories.
4. Compress to `.zip` and return as buffer.

**Filesystem deploy:**
1. Resolve target: `~/.claude/skills/<slug>/`.
2. Create directory if it doesn't exist.
3. Write SKILL.md via `generator`.
4. Copy `skill_files` to appropriate subdirectories.
5. Return the deployed path.

### Importer — `importer.ts`

Reads skills from external sources.

**Directory scan:**
1. Recursively scan the given path for directories containing `SKILL.md`.
2. Parse each `SKILL.md` via `parser`.
3. Detect additional files in `prompts/` and `resources/` subdirectories.
4. Return array of parsed skills with validation results.

**Zip import:**
1. Extract zip to a temporary directory.
2. Delegate to directory scan logic.
3. Clean up temporary files.

### Substitutions — `substitutions.ts`

Handles argument placeholder replacement for skill testing (FR4.3).

**Placeholder patterns:**
- `$ARGUMENTS` — replaced with the full user-provided arguments string.
- `$VARIABLE_NAME` — named placeholders detected via regex `/\$([A-Z_]+)/g`.

**Functions:**
- `detectPlaceholders(content: string): string[]` — returns list of placeholder names found.
- `substitute(content: string, values: Record<string, string>): string` — replaces placeholders with provided values.

## Filesystem Operations

### Read Operations (Import)

| Operation | Path | Notes |
|---|---|---|
| Scan directory | User-specified | Only reads `.md` and known text extensions |
| Parse SKILL.md | `<dir>/SKILL.md` | Via skill-engine parser |
| Read prompt files | `<dir>/prompts/*.md` | Associated skill files |
| Read resource files | `<dir>/resources/*` | Associated skill files |

### Write Operations (Export/Deploy)

| Operation | Path | Notes |
|---|---|---|
| Deploy skill | `~/.claude/skills/<slug>/` | Creates dir if needed |
| Write SKILL.md | `~/.claude/skills/<slug>/SKILL.md` | Generated content |
| Write prompts | `~/.claude/skills/<slug>/prompts/` | From skill_files |
| Write resources | `~/.claude/skills/<slug>/resources/` | From skill_files |
| Backup database | `data/backups/` | Timestamped copies |

### Path Security

- All paths are resolved to absolute paths and canonicalized before operations.
- Deploy target must be within `~/.claude/skills/` — any path traversal attempt is rejected.
- Import source paths are validated — symlinks are not followed outside the source directory.

## System Prompts

### Skill Creation System Prompt (FR2)

Used when the AI assists in creating a new skill. Instructs the model to generate valid SKILL.md output.

**Key directives:**
- Output must include YAML frontmatter with `name`, `description`, and `trigger` fields.
- Instructions should be clear, actionable, and follow Claude Code skill best practices.
- Include example trigger scenarios.
- Use markdown formatting in the instructions body.

### Skill Testing System Prompt (FR4)

The resolved skill content itself serves as the system prompt. The `$ARGUMENTS` placeholders are substituted before sending.

## Future Integrations

| Integration | Description | Status |
|---|---|---|
| GitHub | Sync skills to a GitHub repository | Planned |
| Claude Code CLI | Invoke `claude` CLI for end-to-end testing | Planned |
| Marketplace | Publish/discover community skills | Planned |
| VS Code Extension | Manage skills from within the IDE | Planned |

## Cross-References

- API routes using these integrations → [02-architecture](../02-architecture/README.md)
- Data types passed to/from skill-engine → [03-data-models](../03-data-models/README.md)
- Features powered by these integrations → [04-functional-requirements](../04-functional-requirements/README.md)
- Security constraints on integrations → [05-non-functional-requirements](../05-non-functional-requirements/README.md)
