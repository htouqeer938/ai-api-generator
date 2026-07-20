import Link from "next/link";
import { Boxes, Sparkles } from "lucide-react";
import { Logo } from "@/components/site/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-fuchsia-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20" />
        <Link href="/" className="relative z-10">
          <span className="inline-flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur">
              <Boxes className="h-5 w-5" />
            </span>
            AI API Generator
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <Sparkles className="h-10 w-10" />
          <h2 className="text-3xl font-bold leading-tight">
            From schema to shipped backend — in seconds.
          </h2>
          <p className="max-w-md text-white/80">
            Models, CRUD APIs, JWT auth, validation, Swagger docs and tests.
            Everything you keep rebuilding, generated for you.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>✓ SQL · Prisma · Mongoose · plain English</li>
            <li>✓ Express & Next.js — more coming</li>
            <li>✓ Export as a ready-to-run ZIP</li>
          </ul>
        </div>

        <p className="relative z-10 text-sm text-white/60">
          “It generated my entire CRM backend before my coffee was ready.”
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
