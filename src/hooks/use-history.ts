"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { HistoryRecord } from "@/types";

const KEY = ["history"];

export interface NewHistoryRecord {
  title: string;
  database: string;
  framework: string;
  input: string;
  result: HistoryRecord["result"];
}

/** List + mutate the current user's generation history (MongoDB-backed). */
export function useHistory() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<HistoryRecord[]> => {
      const { data } = await api.get("/history");
      return data.records as HistoryRecord[];
    },
  });

  const add = useMutation({
    mutationFn: async (record: NewHistoryRecord): Promise<HistoryRecord> => {
      const { data } = await api.post("/history", record);
      return data.record as HistoryRecord;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/history/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const clear = useMutation({
    mutationFn: async () => {
      await api.delete("/history");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    records: list.data ?? [],
    isLoading: list.isLoading,
    add,
    remove,
    clear,
  };
}

/** Fetch a single generation by id (for reopening in the generator). */
export async function fetchHistoryRecord(id: string): Promise<HistoryRecord | null> {
  try {
    const { data } = await api.get(`/history/${id}`);
    return data.record as HistoryRecord;
  } catch {
    return null;
  }
}
