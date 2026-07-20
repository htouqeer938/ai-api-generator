"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GenerateRequest, GenerationResult } from "@/types";

interface GenerateResponse {
  result: GenerationResult;
  notices: { aiConfigured: boolean; injectionFlagged: boolean; truncated: boolean };
}

export function useGenerate() {
  return useMutation({
    mutationFn: async (req: GenerateRequest): Promise<GenerateResponse> => {
      const { data } = await api.post("/generate", req);
      return data as GenerateResponse;
    },
  });
}

export function useImprovePrompt() {
  return useMutation({
    mutationFn: async (input: string): Promise<string> => {
      const { data } = await api.post("/improve-prompt", { input });
      return data.improved as string;
    },
  });
}
