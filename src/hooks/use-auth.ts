"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AuthUser } from "@/types";
import type { LoginInput, SignupInput } from "@/lib/validation";

async function fetchMe(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get("/auth/me");
    return data.user as AuthUser;
  } catch {
    return null;
  }
}

export function useAuth() {
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
  });

  const login = useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post("/auth/login", input);
      return data.user as AuthUser;
    },
    onSuccess: (u) => qc.setQueryData(["auth", "me"], u),
  });

  const signup = useMutation({
    mutationFn: async (input: SignupInput) => {
      const { data } = await api.post("/auth/signup", input);
      return data.user as AuthUser;
    },
    onSuccess: (u) => qc.setQueryData(["auth", "me"], u),
  });

  const logout = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => qc.setQueryData(["auth", "me"], null),
  });

  return { user: user ?? null, isLoading, login, signup, logout };
}
