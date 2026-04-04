## Subscription Tracker

Monorepo for a subscription tracking app with a Next.js web client and a NestJS GraphQL API. Uses PNPM workspaces and Turborepo for task orchestration.

## Apps

- `apps/web` - Next.js App Router UI
- `apps/api` - NestJS GraphQL API
- `apps/storybook` - UI Library Storybook

## Tech Stack

- Web: Next.js, React, TypeScript, Tailwind CSS, React Query, Redux Toolkit, React Hook Form
- API: NestJS, GraphQL (Apollo), Prisma
- Tooling: PNPM workspaces, Turborepo, Biome

## Structure (feature-based)

- `apps/web/src/app` - routing and layouts
- `apps/web/src/features` - feature UI/logic
- `apps/web/src/shared` - shared hooks, libs, providers
- `apps/web/src/stores` - global state
- `apps/web/src/views` - screen composition

## Getting Started

### Prerequisites
- Node.js >= 20
- PNPM 10.28.0+
- Docker and Docker Compose

### Installation & Running

```bash
# Install dependencies
pnpm install

# Start services (PostgreSQL + Redis in Docker)
pnpm docker:up

# Run all dev servers
pnpm dev
```

Web runs on port 4000 by default. API runs on port 3000.

Alternatively, run services separately:
```bash
pnpm api:dev       # run API only (requires Docker services running)
pnpm web:dev       # run web only (requires API running)
```

### Docker Commands

```bash
pnpm docker:up     # start PostgreSQL & Redis
pnpm docker:down   # stop services
pnpm docker:reset  # reset databases (deletes volumes)
pnpm docker:logs   # view service logs
```

## Scripts

```bash
pnpm dev           # run all dev servers via turbo
pnpm web:dev       # run Next.js app only
pnpm api:dev       # run API only
pnpm graphql:sync  # sync GraphQL types
pnpm test          # run all tests
pnpm ui:test       # run tests for ui library
```

## Environment

Copy the example env files and fill in values as needed:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

## TODO
### All
- CI/CD
- Tests (unit/e2e)
- i18n

### api#NestJS
- Seeds
- Roles
- Fastify