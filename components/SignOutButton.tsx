"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <Button className={cn(className)} icon={<LogOut size={18} />} onClick={handleSignOut} variant="danger">
      Keluar
    </Button>
  );
}
