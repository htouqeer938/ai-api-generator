"use client";

import type { GenerationOptions } from "@/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OptionsPanelProps {
  options: GenerationOptions;
  onChange: (patch: Partial<GenerationOptions>) => void;
}

const DATABASES = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mongodb", label: "MongoDB" },
] as const;

const SCHEMA_TYPES = [
  { value: "sql", label: "SQL" },
  { value: "prisma", label: "Prisma" },
  { value: "mongoose", label: "Mongoose" },
  { value: "english", label: "Plain English" },
] as const;

const FRAMEWORKS = [
  { value: "express", label: "Express", disabled: false },
  { value: "nextjs", label: "Next.js API", disabled: false },
  { value: "nestjs", label: "NestJS", disabled: true },
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </Label>
      {children}
    </div>
  );
}

function Pills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly { value: T; label: string; disabled?: boolean }[];
  onChange: (v: T) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as T)}
      className="grid grid-cols-2 gap-2"
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
            opt.disabled && "cursor-not-allowed opacity-50",
            value === opt.value
              ? "border-primary bg-primary/5"
              : "border-border hover:bg-accent"
          )}
        >
          <RadioGroupItem value={opt.value} disabled={opt.disabled} />
          <span className="flex items-center gap-1.5">
            {opt.label}
            {opt.disabled && (
              <Badge variant="secondary" className="text-[10px]">
                Soon
              </Badge>
            )}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
    >
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      {label}
    </label>
  );
}

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  return (
    <div className="space-y-6">
      <Section title="Database">
        <Pills
          value={options.database}
          options={DATABASES}
          onChange={(v) => onChange({ database: v })}
        />
      </Section>

      <Section title="Schema type">
        <Pills
          value={options.schemaType}
          options={SCHEMA_TYPES}
          onChange={(v) => onChange({ schemaType: v })}
        />
      </Section>

      <Section title="Framework">
        <Pills
          value={options.framework}
          options={FRAMEWORKS}
          onChange={(v) => onChange({ framework: v })}
        />
      </Section>

      <Section title="Language">
        <Pills
          value={options.language}
          options={[
            { value: "typescript", label: "TypeScript" },
            { value: "javascript", label: "JavaScript" },
          ]}
          onChange={(v) => onChange({ language: v })}
        />
      </Section>

      <Section title="Authentication">
        <div className="space-y-2">
          <CheckRow
            id="jwt"
            label="JWT"
            checked={options.auth.jwt}
            onChange={(v) => onChange({ auth: { ...options.auth, jwt: v } })}
          />
          <CheckRow
            id="refresh"
            label="Refresh token"
            checked={options.auth.refreshToken}
            onChange={(v) => onChange({ auth: { ...options.auth, refreshToken: v } })}
          />
        </div>
      </Section>

      <Section title="Validation">
        <div className="space-y-2">
          <CheckRow
            id="zod"
            label="Zod"
            checked={options.validation.zod}
            onChange={(v) => onChange({ validation: { ...options.validation, zod: v } })}
          />
          <CheckRow
            id="joi"
            label="Joi"
            checked={options.validation.joi}
            onChange={(v) => onChange({ validation: { ...options.validation, joi: v } })}
          />
        </div>
      </Section>

      <Section title="Documentation">
        <div className="space-y-2">
          <CheckRow
            id="swagger"
            label="Swagger"
            checked={options.documentation.swagger}
            onChange={(v) =>
              onChange({ documentation: { ...options.documentation, swagger: v } })
            }
          />
          <CheckRow
            id="openapi"
            label="OpenAPI"
            checked={options.documentation.openapi}
            onChange={(v) =>
              onChange({ documentation: { ...options.documentation, openapi: v } })
            }
          />
        </div>
      </Section>
    </div>
  );
}
