"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MailCheck, Send } from "lucide-react";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Input = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async () => {
    // Demo: simulate sending a reset link.
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists for that email, we&apos;ve sent a link to reset
          your password.
        </p>
        <Button variant="outline" className="mt-6 w-full" asChild>
          <Link href="/login">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send reset link
        </Button>
      </form>

      <Button variant="ghost" className="mt-3 w-full" asChild>
        <Link href="/login">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </Button>
    </div>
  );
}
