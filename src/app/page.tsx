import Link from "next/link";
import {
  Boxes,
  ShieldCheck,
  Workflow,
  FileCode2,
  Gauge,
  BookOpenCheck,
  Database,
  Braces,
  Leaf,
  FileJson,
  Check,
  ArrowRight,
  Upload,
  Cpu,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Reveal } from "@/components/site/reveal";
import { Faq } from "@/components/site/faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  { icon: FileCode2, title: "Full CRUD APIs", desc: "Models, controllers, services and routes generated for every entity — consistent and idiomatic." },
  { icon: ShieldCheck, title: "Auth built-in", desc: "JWT with refresh tokens, bcrypt password hashing and route guards, ready out of the box." },
  { icon: Gauge, title: "Pagination & search", desc: "List endpoints ship with pagination, filtering, sorting and search by default." },
  { icon: BookOpenCheck, title: "Swagger & OpenAPI", desc: "Interactive API docs and an OpenAPI 3 spec generated alongside your code." },
  { icon: Workflow, title: "Clean architecture", desc: "A layered, modular structure that scales — routes → controllers → services → models." },
  { icon: Braces, title: "Validation & tests", desc: "Zod or Joi validation on every write, plus unit-test templates and seed data." },
];

const STEPS = [
  { icon: Upload, title: "Provide your schema", desc: "Paste SQL, Prisma or Mongoose — or describe your app in plain English." },
  { icon: Cpu, title: "AI designs & generates", desc: "We analyze entities and relationships, design the architecture and write every file." },
  { icon: Download, title: "Preview, edit & export", desc: "Browse the file tree, tweak in the editor, then download the project as a ZIP." },
];

const DATABASES = [
  { icon: Database, name: "PostgreSQL", tag: "Prisma" },
  { icon: Database, name: "MySQL", tag: "Prisma" },
  { icon: FileJson, name: "SQLite", tag: "Prisma" },
  { icon: Leaf, name: "MongoDB", tag: "Mongoose" },
];

const PRICING = [
  {
    name: "Hobby",
    price: "$0",
    period: "forever",
    highlight: false,
    features: ["Unlimited mock generations", "All templates", "ZIP export", "Local history"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    highlight: true,
    features: ["Everything in Hobby", "Full AI generation (Codex)", "Refresh-token auth", "Swagger + OpenAPI", "Priority generation"],
    cta: "Start free trial",
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    highlight: false,
    features: ["Everything in Pro", "Shared team templates", "SSO (coming soon)", "Audit log", "Priority support"],
    cta: "Contact sales",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Features */}
        <section id="features" className="container py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you keep rebuilding, generated for you
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stop scaffolding the same backend over and over. Focus on the parts
              that make your product unique.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-y border-border bg-muted/30 py-24">
          <div className="container">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4">How it works</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From schema to shipped in three steps
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.1}>
                  <div className="relative text-center">
                    <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-primary/30">
                      <s.icon className="h-7 w-7" />
                    </div>
                    <span className="mb-2 block text-sm font-semibold text-primary">
                      Step {i + 1}
                    </span>
                    <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                    <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Supported databases */}
        <section id="databases" className="container py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Supported databases</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Bring your own database
            </h2>
            <p className="mt-4 text-muted-foreground">
              SQL or NoSQL — we generate the right models, migrations and data
              layer for your stack.
            </p>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4">
            {DATABASES.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.05}>
                <Card className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                  <d.icon className="h-10 w-10 text-primary" />
                  <div>
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-xs text-muted-foreground">via {d.tag}</div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Frameworks:</span>
            <Badge variant="outline">Express</Badge>
            <Badge variant="outline">Next.js API</Badge>
            <Badge variant="secondary">NestJS — soon</Badge>
            <Badge variant="secondary">FastAPI — soon</Badge>
            <Badge variant="secondary">Spring Boot — soon</Badge>
          </Reveal>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-y border-border bg-muted/30 py-24">
          <div className="container">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4">Pricing</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-muted-foreground">
                Start free. Upgrade when you are ready to ship with full AI power.
              </p>
            </Reveal>
            <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
              {PRICING.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <Card
                    className={
                      p.highlight
                        ? "relative h-full border-primary/50 shadow-xl shadow-primary/10"
                        : "h-full"
                    }
                  >
                    {p.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                          Most popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="flex h-full flex-col p-8">
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{p.price}</span>
                        <span className="text-muted-foreground">{p.period}</span>
                      </div>
                      <ul className="mt-6 space-y-3 text-sm">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="mt-8 w-full"
                        variant={p.highlight ? "gradient" : "outline"}
                        asChild
                      >
                        <Link href="/signup">{p.cta}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="mt-14">
            <Faq />
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-24">
          <Reveal>
            <div className="glow relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-indigo-600/10 p-12 text-center">
              <Boxes className="mx-auto mb-5 h-12 w-12 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Build your next backend in minutes
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join developers shipping faster with AI-generated,
                production-ready backends.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" variant="gradient" asChild>
                  <Link href="/signup">
                    Get started free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard/generate">Try the demo</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
