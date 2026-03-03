# 05 — Non-Functional Requirements

## NFR1 — Performance

| Metric | Target | Context |
|---|---|---|
| AI Streaming TTFT | < 2 seconds | Time to first token for chat/test responses (FR2, FR4). Measured from "Run Test" / "Send" click to first token rendered. Network-dependent. |
| Search Latency | < 200 ms | Skills library search (FR1.2). Measured from last keystroke (after debounce) to results rendered. |
| Page Load (LCP) | < 1.5 seconds | Largest Contentful Paint for all pages on localhost. |
| Editor Save | < 500 ms | Time from save action to confirmation indicator (FR3.9). |
| Export/Deploy | < 3 seconds | Time to generate zip or write skill directory (FR5). |
| Import Scan | < 5 seconds | Scanning a directory with up to 100 skills (FR6.2). |
| Database Query | < 50 ms | p95 for any single Drizzle ORM query. |
| Bundle Size | < 300 KB | Initial JavaScript bundle (gzipped). |

## NFR2 — Security

### API Key Storage

- OpenRouter API key is **encrypted at rest** in the SQLite `settings` table using AES-256-GCM.
- Encryption key is derived from a machine-specific secret (e.g., `ENCRYPTION_SECRET` env var or auto-generated on first run and stored in `data/.secret`).
- API key is **never logged**, **never included in error messages**, and **never sent to the client**. It is only decrypted server-side in API route handlers.

### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
connect-src 'self' https://openrouter.ai;
img-src 'self' data:;
font-src 'self';
```

Note: `unsafe-inline` and `unsafe-eval` are required by Next.js in development. Production builds should tighten these where possible.

### Input Sanitization

- All user-provided text (skill names, descriptions, content) is sanitized before database insertion to prevent SQL injection (handled by Drizzle ORM's parameterized queries).
- Markdown content in skill previews is rendered with a safe markdown renderer that strips dangerous HTML (e.g., `<script>` tags).
- File paths in import/export are validated to prevent path traversal attacks (e.g., `../../etc/passwd`).

### Filesystem Access

- Deploy (FR5.2) only writes to `~/.claude/skills/` — the target directory is validated and canonicalized before any write operation.
- Import (FR6.2) only reads from user-specified directories — reads are restricted to `.md` and known text file extensions.
- No arbitrary filesystem access is exposed via API routes.

### Dependencies

- Dependencies are audited regularly via `bun audit` / `npm audit`.
- Lock file (`bun.lock`) is committed to ensure reproducible builds.
- No native addons required — pure JavaScript/TypeScript stack.

## NFR3 — Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|---|---|
| Keyboard navigation | All interactive elements are focusable and operable via keyboard. Tab order follows logical flow. |
| Screen reader support | Semantic HTML, ARIA labels on icons and interactive elements, live regions for streaming content. |
| Color contrast | Minimum 4.5:1 contrast ratio for text, 3:1 for large text and UI components. Enforced by shadcn/ui defaults. |
| Focus indicators | Visible focus rings on all interactive elements (Tailwind `ring` utilities). |
| Motion | `prefers-reduced-motion` respected for animations and transitions. |
| Form labels | All form inputs have associated `<label>` elements. Error messages are linked via `aria-describedby`. |
| Responsive | Fully usable from 375px to 2560px viewport width. |

## NFR4 — Developer Experience (DX)

### Zero-Config Setup

```bash
git clone <repo>
cd uberskillsz
bun install
bun dev
# → App running at http://localhost:3000
```

No Docker, no Postgres, no external services, no signup. SQLite database is auto-created on first run.

### Code Quality

| Tool | Purpose |
|---|---|
| TypeScript (strict) | Static type checking across all packages |
| Biome | Linting + formatting (single tool, fast) |
| Vitest | Unit tests for packages |
| Playwright | E2E tests for the web app |
| Turborepo | Cached, parallel builds |
| Drizzle Kit | Database migrations |

### Monorepo Conventions

- Package names: `@uberskillz/<package>`
- Import paths: `@uberskillz/ui`, `@uberskillz/db`, etc.
- Shared TypeScript config: `tsconfig.json` at root, extended per package.
- Environment variables: `.env.local` in `apps/web/`, never committed.

### Error Handling

- API routes return consistent JSON error responses: `{ error: string, code: string }`.
- Client-side errors are caught by React Error Boundaries with user-friendly messages.
- Toast notifications for success/warning/error feedback (via shadcn/ui `toast`).

## NFR5 — Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 120+ |
| Firefox | 120+ |
| Safari | 17+ |
| Edge | 120+ |

Mobile browsers are supported but the application is optimized for desktop use (1024px+ viewport).

## NFR6 — Offline Capability

| Feature | Offline Support |
|---|---|
| Skills Library (FR1) | Full — reads from local SQLite |
| Skill Editor (FR3) | Full — reads/writes local SQLite |
| AI Chat (FR2) | None — requires OpenRouter API |
| Skill Testing (FR4) | None — requires OpenRouter API |
| Export (FR5) | Full — local filesystem operation |
| Import (FR6) | Full — local filesystem operation |
| Settings (FR7) | Partial — API key test requires network |

## NFR7 — Extensibility

The architecture is designed for future extension:

- **Plugin system** (future) — skill-engine could support custom validators, generators, and transformers.
- **Additional AI providers** — Vercel AI SDK supports multiple providers; adding a new one requires only a new provider configuration.
- **Marketplace** (future) — skills could be published/shared via a central registry.
- **CLI** (future) — core operations (create, test, export) could be exposed as a CLI tool using the same packages.

## NFR8 — Data Integrity

- All database writes use transactions where multiple tables are affected (e.g., skill save + version creation).
- Cascade deletes are defined in the schema (`onDelete: "cascade"`) to prevent orphan records.
- Backup/restore (FR7.7, FR7.8) creates an automatic backup of the current DB before restore.
- Version history (FR3.5) ensures no content is permanently lost on edit.

## Cross-References

- Encryption details for API key → [03-data-models](../03-data-models/README.md) (`settings` table)
- Performance targets apply to features in → [04-functional-requirements](../04-functional-requirements/README.md)
- CSP `connect-src` for OpenRouter → [06-integrations](../06-integrations/README.md)
- DX setup instructions → [07-deployment](../07-deployment/README.md)
