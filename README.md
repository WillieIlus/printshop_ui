# PrintShop UI

Nuxt 4 frontend for the PrintShop pricing engine & gallery. Built with Nuxt 4 conventions, type safety, and scalability.

## Stack

- **Nuxt 4** – Vue 3, Vite 7
- **@nuxt/ui** – UI components, Tailwind, **light/dark mode**
- **Pinia** – State (auth, shop, quote, claim, profile)
- **VeeValidate + yup** – Form validation
- **TypeScript** – Strict mode, shared types in `shared/types/`

## Setup

```bash
pnpm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Edit `.env` if your API base URL differs:

```
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
NUXT_PUBLIC_MEDIA_BASE=http://localhost:8000/media
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Use the header **sun/moon** icon to toggle light/dark mode.

## Build & type check

```bash
pnpm build
pnpm typecheck   # if added to package.json
pnpm lint
```

## Structure (Nuxt 4)

- **`app/`** – Components, composables, layouts, middleware, pages, plugins, assets
- **`shared/types/`** – Shared TypeScript types (auth, shop, quote, claim, api)
- **`stores/`** – Pinia stores (auth, profile, shop, quote, claim)
- **`server/api/`** – Server routes (e.g. proxy/catch-all)

Design and copy follow the **PrintShop** sample (hero, problem, gallery CTA, pricing models, light/dark).
