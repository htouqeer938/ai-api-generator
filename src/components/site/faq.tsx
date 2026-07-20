"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What inputs can I use to generate a backend?",
    a: "SQL DDL, a Prisma schema, one or more Mongoose schemas, or a plain-English description of your product. The generator detects entities, fields, relationships, enums and indexes automatically.",
  },
  {
    q: "Do I need an OpenAI API key?",
    a: "No. Without a key the app runs in mock mode and produces a complete, coherent project locally so you can explore the whole experience. Add an OPENAI_API_KEY to unlock full AI generation via the OpenAI Responses API.",
  },
  {
    q: "What does the generated project include?",
    a: "Models, controllers, services, routes, middleware, JWT auth with refresh tokens, request validation, centralized error handling, pagination/filtering/sorting/search, Swagger/OpenAPI docs, unit-test templates, seed data and a thorough README.",
  },
  {
    q: "Which frameworks and databases are supported?",
    a: "Express and Next.js API routes today (NestJS is coming soon), with PostgreSQL, MySQL, SQLite (via Prisma) and MongoDB (via Mongoose). The architecture is designed so FastAPI, Laravel, Spring Boot and more can be added without a rewrite.",
  },
  {
    q: "Can I edit and download the code?",
    a: "Yes. Browse the file tree, edit any file in the Monaco editor, copy individual files or everything at once, and download the whole project as a ZIP.",
  },
  {
    q: "How do you handle security?",
    a: "All input is validated with Zod, untrusted content is sanitized and treated strictly as data to mitigate prompt injection, requests are rate-limited, and generation is behind authentication.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card/50">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="px-6">
            <button
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-medium">{item.q}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden text-sm text-muted-foreground">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
