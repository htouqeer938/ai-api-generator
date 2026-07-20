# AI API Generator

> Turn a **SQL / Prisma / Mongoose** schema — or a plain-English description — into a complete, production-ready backend: models, CRUD APIs, JWT auth, validation, Swagger docs, tests and a downloadable project.

A full-stack **Next.js 15** SaaS application built with TypeScript, Tailwind CSS, shadcn-style UI, Monaco editor, TanStack Query and the OpenAI Responses API. It ships with a **mock generator**, so the entire product works end-to-end with **no API key**.

<p align="center">
  <em>Landing page · Auth · Dashboard · AI generator · File explorer · Swagger preview · ZIP export</em>
</p>

---

## ✨ Features

- **Multi-format input** — SQL DDL, Prisma, Mongoose, or plain English.
- **Full backend generation** — models, controllers, services, routes, middleware, JWT auth (+ refresh tokens), bcrypt hashing, Zod/Joi validation, pagination/filtering/sorting/search, centralized error handling, rate limiting, seed data and tests.
- **Schema analysis** — extracts entities, fields, relationships, primary/foreign keys, enums and indexes.
- **File explorer + Monaco editor** — browse the generated tree, edit any file, copy or download individual files, copy-all, or export the whole project as a **ZIP**.
- **Swagger / OpenAPI preview** — see every generated endpoint grouped by resource.
- **Templates** — 11 starter blueprints (E-commerce, Blog, CRM, ERP, Hospital, School, Inventory, Restaurant, Finance, Task Manager, HRMS).
- **Auth** — signup, login, forgot-password UI, JWT httpOnly cookie sessions with automatic refresh.
- **Local history & projects** — every generation is saved in your browser and reopenable.
- **Polished UX** — dark mode, glassmorphism, gradients, animations (Framer Motion), skeleton loaders, toasts, empty/error states, responsive layout.
- **Security** — input validation, prompt-injection hardening, sanitization, rate limiting, authenticated generation.

## 🧱 Tech stack

| Layer     | Tech |
|-----------|------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling   | Tailwind CSS, shadcn-style components, Framer Motion, Lucide icons |
| Forms     | React Hook Form + Zod |
| Data      | TanStack Query, Axios |
| Editor    | Monaco (`@monaco-editor/react`) |
| Database  | MongoDB + Mongoose (users, sessions, generation history) |
| Auth      | `jose` (JWT), `bcryptjs`, httpOnly cookies |
| AI        | OpenAI Responses API (with deterministic mock fallback) |
| Export    | JSZip + FileSaver |

## 🚀 Getting started

**Requirements:** Node.js 18.18+ (Node 20/22/24 recommended) and a **MongoDB** instance (local `mongod` or a free MongoDB Atlas cluster).

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# set MONGODB_URI (e.g. mongodb://localhost:27017/ai-api-generator)
# set a strong JWT_SECRET (openssl rand -base64 48)
# (optional) add OPENAI_API_KEY for live AI generation — otherwise mock mode is used.

# 3. (if running locally) start MongoDB
mongod --dbpath /path/to/data

# 4. Run the dev server
npm run dev
```

The demo account is **seeded automatically** in MongoDB on first connection.

Open [http://localhost:3000](http://localhost:3000).

### Demo account

The app seeds a demo user on first run:

```
Email:    demo@aigen.dev
Password: demo1234
```

Or click **“Use demo account”** on the login page. You can also sign up for a new account.

## 🔑 Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string. Stores users, sessions and generation history. |
| `OPENAI_API_KEY` | No | Enables live generation via the OpenAI Responses API. Empty → **mock mode**. |
| `OPENAI_MODEL` | No | Model id (default `gpt-4o-mini`). |
| `JWT_SECRET` | Yes* | Secret used to sign JWTs. *(A dev fallback is used if unset — set your own for production.)* |
| `JWT_ACCESS_TTL` | No | Access-token lifetime in seconds (default `900`). |
| `JWT_REFRESH_TTL` | No | Refresh-token lifetime in seconds (default `1209600`). |
| `NEXT_PUBLIC_APP_URL` | No | Public site URL. |

## 🗂️ Project structure

```
src/
  app/
    (auth)/               login · signup · forgot-password (grouped layout)
    dashboard/            authenticated app shell + pages
      generate/           the AI generator
      projects/  history/  templates/  settings/  profile/
    api/
      auth/               signup · login · logout · me
      generate/           protected generation endpoint
      improve-prompt/     prompt-improvement endpoint
    page.tsx              marketing landing page
  components/
    ui/                   shadcn-style primitives (button, card, tabs, …)
    site/                 landing/marketing chrome (navbar, hero, footer, faq)
    dashboard/            sidebar, topbar
    generator/            editor, file-tree, options, result view, swagger, markdown
  lib/
    ai/                   prompts · openai client · mock generator · analyzer · sanitize
    auth/                 jwt · session · Mongo-backed user store
    db/                   mongoose connection · User & Generation models · seed
    validation.ts         Zod schemas
    templates.ts          starter templates & prompt examples
    download.ts  history.ts  rate-limit.ts  utils.ts  api.ts
  hooks/                  use-auth · use-generate · use-settings
  types/                  shared domain types
```

## 🧠 How generation works

1. **Analyze** — the input is parsed to extract entities, fields, relationships, enums and indexes.
2. **Architect** — a layered structure is designed (routes → controllers → services → models).
3. **Generate** — every file is produced with complete, runnable code.
4. **Explain** — a structured JSON result returns a summary, architecture notes, files, endpoints, README and an explanation.

The AI is instructed to return strict JSON matching the `GenerationResult` type. Without an API key, the **mock generator** produces the same shape from the analyzed schema, so the full UX (file tree, editor, Swagger, download) works offline.

## 🔒 Security notes

- All API input is validated with Zod.
- User schema input is **sanitized** and passed to the model strictly as *data* inside a delimited block, with explicit anti-prompt-injection instructions.
- Generation and prompt-improvement endpoints are **authenticated** and **rate-limited**.
- Sessions use httpOnly, SameSite cookies.

> All persistence is in **MongoDB via Mongoose** (`src/lib/db/`): the `User` model backs auth, and the `Generation` model stores each user's generation history. No application data is written to disk.

## 🧭 Extending it

The architecture is deliberately modular so you can add without a rewrite:

- **New framework** (NestJS, FastAPI, Laravel, Spring Boot): add a generator template in `src/lib/ai/` and a framework option.
- **New database**: extend the analyzer and mock/model generation.
- **GraphQL / gRPC / Docker / CI-CD / one-click deploy**: add as new output toggles and file generators.

## 📦 Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint
```

## 📄 License

MIT — build something great.
