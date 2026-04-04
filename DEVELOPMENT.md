# Development Guide

Complete guide to setting up and running the Subscription Tracker project locally.

## Prerequisites

- **Node.js** >= 20
- **PNPM** 10.28.0+ ([download](https://pnpm.io/installation))
- **Docker** and **Docker Compose** ([download](https://www.docker.com/products/docker-desktop))

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Docker Services

PostgreSQL and Redis will start automatically when you run development servers:

```bash
# This starts both PostgreSQL and Redis in the background
pnpm dev
```

Or start them manually:

```bash
pnpm docker:up
```

### 3. Setup Database

On first run, create the database schema:

```bash
# From the API directory
cd apps/api
pnpm prisma:migrate
```

Or from root:

```bash
pnpm prisma:dev
```

### 4. Generate GraphQL Types

Ensure web app has up-to-date GraphQL types:

```bash
pnpm graphql:sync
```

### 5. Verify Setup

- **Web App**: http://localhost:4000
- **API GraphQL Playground**: http://localhost:3000/graphql
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Environment Variables

### API (`apps/api/.env`)

```env
# Required
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subscription_tracker"
JWT_ACCESS_SECRET="your-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-secret-key-min-32-chars"

# Optional
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV="development"
```

### Web (`apps/web/.env`)

```env
# API GraphQL endpoint
NEXT_PUBLIC_API_URL="http://localhost:3000/graphql"

# For development
JWT_ACCESS_SECRET="your-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-secret-key-min-32-chars"
```

See `.env.example` files in each app for more details.

## Development Commands

### Running Services

```bash
# Start everything (Docker + all dev servers)
pnpm dev

# Start only API
pnpm api:dev

# Start only Web
pnpm web:dev

# Start Docker services
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

### Working with Code

```bash
# Format code (Biome)
pnpm lint

# Run tests
pnpm test

# Sync GraphQL schema (after API changes)
pnpm graphql:sync

# Build all apps
pnpm build
```

### Database Operations

```bash
# Run migrations
pnpm prisma:dev

# Open Prisma Studio (visual database explorer)
cd apps/api && pnpm prisma:studio

# Seed database
cd apps/api && pnpm prisma:seed
```

### Storybook (UI Components)

```bash
# Run Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

## Docker Services

### PostgreSQL

- **Container**: subscription-tracker-postgres
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres
- **Database**: subscription_tracker
- **Data**: Persisted in `pgdata` volume

### Redis

- **Container**: subscription-tracker-redis
- **Port**: 6379
- **Data**: Persisted in `redisdata` volume

### Reset Data

```bash
# Remove all containers and volumes
pnpm docker:reset

# This deletes all database and cache data
# Useful for starting fresh or debugging
```

## Troubleshooting

### Docker Issues

```bash
# Check service status
docker ps
docker-compose logs

# Restart services
pnpm docker:down
pnpm docker:up

# Full reset
pnpm docker:reset
```

### Port Already in Use

If port 3000 (API) or 4000 (Web) is in use:

```bash
# For API, update apps/api/.env
PORT=3001

# For Web, update apps/web/next.config.ts
# Currently hardcoded to 4000 - needs manual change
```

### GraphQL Types Out of Sync

Always run after modifying API resolvers or Prisma schema:

```bash
pnpm graphql:sync
```

### Database Connection Issues

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check logs
docker-compose logs postgres

# Verify DATABASE_URL in apps/api/.env
# Format: postgresql://user:password@host:port/database
```

### Dependencies Not Installing

```bash
# Clear PNPM cache
pnpm store prune

# Reinstall
pnpm install
```

## Project Structure

- `apps/api` - NestJS GraphQL API
- `apps/web` - Next.js web client
- `apps/storybook` - UI component library
- `packages/graphql-schema` - Shared GraphQL schema
- `packages/ui` - Shared React components
- `packages/typescript-config` - Shared TypeScript configs

## Common Workflows

### Adding a New Feature

1. Create feature module in API (`apps/api/src/features/feature-name`)
2. Add GraphQL resolvers
3. Run `pnpm graphql:sync` to generate web types
4. Create feature in web (`apps/web/src/features/feature-name`)
5. Use generated hook from `@shared/api/graphql`

### Updating Database Schema

1. Modify `apps/api/prisma/schema.prisma`
2. Run `pnpm prisma:dev` to create migration
3. Run `pnpm graphql:sync` to update types

### Code Quality

Project uses:
- **Biome** (web) - formatting and linting
- **ESLint** (api) - linting
- **TypeScript** - type safety
- **Jest** - testing

Format and check before committing:

```bash
pnpm lint
pnpm test
```

## Performance Tips

- Use `pnpm dev` for fastest startup (parallelizes all services)
- Use `pnpm api:dev` if developing API-only (faster hot reload)
- Use `docker-compose up -d` to avoid blocking terminal
- Redis is optional until caching is implemented

## Need Help?

- Check API logs: `docker-compose logs api` or terminal where it's running
- Check Web logs: Terminal where `pnpm web:dev` is running
- Check services: `docker ps`
- Read individual app READMEs: `apps/api/README.md`, `apps/web/README.md`
