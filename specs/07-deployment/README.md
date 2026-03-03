# 07 — Deployment

## Local Development (Quickstart)

```bash
# 1. Clone and install
git clone https://github.com/<org>/uberskillsz.git
cd uberskillsz
bun install

# 2. Start development server
bun dev

# App is now running at http://localhost:3000
# SQLite database is auto-created at data/uberskillz.db
```

No additional setup required. On first launch, the app will:
1. Create the `data/` directory if it doesn't exist.
2. Run Drizzle migrations to initialize the SQLite schema.
3. Generate an encryption secret at `data/.secret` (if not present).
4. Open the Settings page prompting for an OpenRouter API key.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | No | `file:data/uberskillz.db` | SQLite database file path |
| `ENCRYPTION_SECRET` | No | Auto-generated | AES-256 key for encrypting settings. If not set, generated on first run and stored at `data/.secret` |
| `PORT` | No | `3000` | Development server port |
| `NODE_ENV` | No | `development` | Environment mode |

All environment variables are set in `apps/web/.env.local` (not committed to version control).

## Docker

### Dockerfile

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/db/package.json ./packages/db/
COPY packages/skill-engine/package.json ./packages/skill-engine/
COPY packages/types/package.json ./packages/types/
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/uberskillz.db

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  uberskillsz:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - uberskillsz-data:/app/data
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/uberskillz.db
    restart: unless-stopped

volumes:
  uberskillsz-data:
```

### Docker Commands

```bash
# Build and run
docker compose up -d

# View logs
docker compose logs -f uberskillsz

# Stop
docker compose down

# Rebuild after code changes
docker compose up -d --build
```

## Vercel Deployment

For cloud deployment, SQLite is replaced with [Turso](https://turso.tech) (libSQL, SQLite-compatible).

### Setup

1. Create a Turso database:
   ```bash
   turso db create uberskillsz
   turso db tokens create uberskillsz
   ```

2. Set environment variables in Vercel:
   ```
   DATABASE_URL=libsql://<db-name>-<org>.turso.io
   DATABASE_AUTH_TOKEN=<turso-token>
   ENCRYPTION_SECRET=<random-32-byte-hex>
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Vercel Configuration

```json
// vercel.json (if needed)
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

### Turso Integration Notes

- Drizzle ORM supports both `better-sqlite3` (local) and `@libsql/client` (Turso) drivers.
- The `db` package detects the `DATABASE_URL` scheme (`file:` vs `libsql://`) and selects the appropriate driver.
- Schema and queries remain identical — only the connection layer changes.

## Self-Hosting Guide

### With Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name uberskillz.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # SSE support for streaming
        proxy_buffering off;
        proxy_cache off;
    }
}
```

### With systemd

```ini
# /etc/systemd/system/uberskillsz.service
[Unit]
Description=UberSkillz
After=network.target

[Service]
Type=simple
User=uberskillsz
WorkingDirectory=/opt/uberskillsz
ExecStart=/usr/local/bin/node apps/web/server.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL=file:/opt/uberskillsz/data/uberskillz.db

[Install]
WantedBy=multi-user.target
```

## CI/CD — GitHub Actions

### Main Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run test

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build

  e2e:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bunx playwright install --with-deps
      - run: bun run test:e2e
```

### Release Pipeline

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags: ["v*"]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.ref_name }}
```

## Implementation Sequencing

Recommended order for building UberSkillz after the spec is complete:

| Phase | Scope | Dependencies |
|---|---|---|
| 1 | Monorepo scaffolding (Turborepo, Bun, TypeScript, Biome) | None |
| 2 | `@uberskillz/types` — shared TypeScript interfaces | Phase 1 |
| 3 | `@uberskillz/db` — Drizzle schema, migrations, client, queries | Phase 2 |
| 4 | `@uberskillz/skill-engine` — parser, validator, generator | Phase 2 |
| 5 | `@uberskillz/ui` — shadcn/ui component library setup | Phase 1 |
| 6 | `apps/web` — Next.js app shell (layout, navigation, theme) | Phase 5 |
| 7 | FR7: Settings page (API key, preferences) | Phase 3, 6 |
| 8 | FR1: Skills Library page | Phase 3, 6 |
| 9 | FR3: Skill Editor (metadata, instructions, files, preview) | Phase 3, 4, 6 |
| 10 | FR2: AI-Assisted Skill Creation (chat + preview) | Phase 4, 7 |
| 11 | FR4: Skill Testing (model selector, streaming, metrics) | Phase 3, 4, 7 |
| 12 | FR5: Export & Deploy | Phase 4, 9 |
| 13 | FR6: Import | Phase 4, 8 |

## Cross-References

- Tech stack and rationale → [01-overview](../01-overview/README.md)
- Full directory structure → [02-architecture](../02-architecture/README.md)
- Database setup → [03-data-models](../03-data-models/README.md)
- Features to implement → [04-functional-requirements](../04-functional-requirements/README.md)
- Performance and security requirements → [05-non-functional-requirements](../05-non-functional-requirements/README.md)
- Integration configurations → [06-integrations](../06-integrations/README.md)
