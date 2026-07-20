"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CODE_LINES = [
  { t: "$ ", c: "aigen generate --schema prisma", cls: "text-emerald-400" },
  { t: "› ", c: "Analyzing schema… 6 entities, 8 relations", cls: "text-muted-foreground" },
  { t: "› ", c: "Designing layered architecture", cls: "text-muted-foreground" },
  { t: "✓ ", c: "42 files generated", cls: "text-violet-400" },
  { t: "✓ ", c: "JWT auth + refresh tokens", cls: "text-violet-400" },
  { t: "✓ ", c: "Swagger docs at /docs", cls: "text-violet-400" },
  { t: "✓ ", c: "Zod validation · tests · seed", cls: "text-violet-400" },
  { t: "★ ", c: "Ready to ship 🚀", cls: "text-fuchsia-400" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* Background glow + grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-600/25 via-fuchsia-500/15 to-indigo-600/25 blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-5 gap-1.5 py-1 pl-2 pr-3">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by OpenAI Codex
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Ship a complete backend{" "}
            <span className="text-gradient">in seconds</span>, not sprints.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Paste a SQL, Prisma or Mongoose schema — or just describe your idea
            in plain English. Get models, CRUD APIs, authentication, validation,
            Swagger docs and tests as a production-ready project.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Button size="lg" variant="gradient" asChild>
              <Link href="/signup">
                Start generating <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/generate">
                <Play className="h-4 w-4" /> Live demo
              </Link>
            </Button>
          </motion.div>

          <motion.p
            className="mt-4 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No credit card required · Works offline in mock mode · Export as ZIP
          </motion.p>
        </div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="glow overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs text-muted-foreground">
                ai-api-generator — zsh
              </span>
            </div>
            <div className="space-y-2 p-5 font-mono text-sm">
              {CODE_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.18 }}
                  className="flex gap-2"
                >
                  <span className="select-none text-muted-foreground">{line.t}</span>
                  <span className={line.cls}>{line.c}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
