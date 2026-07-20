"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Mail, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { history } from "@/lib/history";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => setCount(history.all().length), []);

  const onLogout = async () => {
    await logout.mutateAsync();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-violet-600 to-indigo-600" />
        <CardContent className="-mt-10 space-y-4 p-6">
          <Avatar className="h-20 w-20 border-4 border-card text-xl">
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> {user.email}
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" /> Joined {formatDate(user.createdAt)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-0">
          <div className="rounded-xl border border-border p-4">
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs text-muted-foreground">Generations</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="text-2xl font-bold">Hobby</div>
            <div className="text-xs text-muted-foreground">Current plan</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Button variant="destructive" onClick={onLogout} disabled={logout.isPending}>
            {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
