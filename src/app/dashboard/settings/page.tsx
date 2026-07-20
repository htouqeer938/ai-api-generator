"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-settings";
import type { DatabaseType, Framework } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ar", label: "العربية" },
];

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="sm:w-64">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, update } = useSettings();
  const [apiKey, setApiKey] = React.useState("");

  React.useEffect(() => setApiKey(settings.apiKey), [settings.apiKey]);

  const saveApiKey = () => {
    update({ apiKey });
    toast.success(
      apiKey
        ? "API key hint saved locally. Set OPENAI_API_KEY on the server for live generation."
        : "API key cleared."
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Personalize your workspace and defaults.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Theme and language preferences.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Row title="Theme" description="Choose light, dark or match your system.">
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs transition-colors",
                    theme === t.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </Row>
          <Row title="Language" description="Interface language.">
            <select
              value={settings.language}
              onChange={(e) => update({ language: e.target.value })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generation defaults</CardTitle>
          <CardDescription>Pre-select these on the generator.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Row title="Default framework" description="Used when you open the generator.">
            <select
              value={settings.defaultFramework}
              onChange={(e) => update({ defaultFramework: e.target.value as Framework })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="express">Express</option>
              <option value="nextjs">Next.js API</option>
            </select>
          </Row>
          <Row title="Default database" description="Your most-used database.">
            <select
              value={settings.defaultDatabase}
              onChange={(e) => update({ defaultDatabase: e.target.value as DatabaseType })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlite">SQLite</option>
              <option value="mongodb">MongoDB</option>
            </select>
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4" /> OpenAI API key
          </CardTitle>
          <CardDescription>
            Optional. For live generation, set <code className="rounded bg-muted px-1">OPENAI_API_KEY</code>{" "}
            in your server environment. This field stores a local hint only and is never sent for real calls.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="sk-…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={saveApiKey}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
