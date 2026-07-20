"use client";

import type { HistoryRecord } from "@/types";

/* ─────────────────────────────────────────────────────────────
 * Local generation history, persisted to localStorage so it
 * survives reloads without a database. Capped to the most recent
 * 50 records to avoid unbounded growth.
 * ───────────────────────────────────────────────────────────── */

const KEY = "aigen:history";
const LIMIT = 50;

function read(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as HistoryRecord[];
  } catch {
    return [];
  }
}

function write(records: HistoryRecord[]): void {
  localStorage.setItem(KEY, JSON.stringify(records.slice(0, LIMIT)));
  window.dispatchEvent(new Event("aigen:history-changed"));
}

export const history = {
  all(): HistoryRecord[] {
    return read();
  },
  get(id: string): HistoryRecord | undefined {
    return read().find((r) => r.id === id);
  },
  add(record: HistoryRecord): void {
    const records = read().filter((r) => r.id !== record.id);
    records.unshift(record);
    write(records);
  },
  remove(id: string): void {
    write(read().filter((r) => r.id !== id));
  },
  clear(): void {
    write([]);
  },
};
