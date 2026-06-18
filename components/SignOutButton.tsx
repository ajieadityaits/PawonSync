"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Button } from "./Button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <Button icon={<LogOut size={18} />} onClick={handleSignOut} variant="danger">
      Keluar
    </Button>
  );
}
