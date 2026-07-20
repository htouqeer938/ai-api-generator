"use client";

import * as React from "react";
import type { DatabaseType, Framework } from "@/types";

export interface AppSettings {
  language: string;
  apiKey: string; // optional client-side key hint (not used for real calls)
  defaultFramework: Framework;
  defaultDatabase: DatabaseType;
}

const KEY = "aigen:settings";

const DEFAULTS: AppSettings = {
  language: "en",
  apiKey: "",
  defaultFramework: "express",
  defaultDatabase: "postgresql",
};

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return DEFAULTS;
  }
}

export function useSettings() {
  const [settings, setSettings] = React.useState<AppSettings>(DEFAULTS);

  React.useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const update = React.useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, update };
}
