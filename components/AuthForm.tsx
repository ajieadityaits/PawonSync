"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LockKeyhole, Mail, UserRound } from "lucide-react";
import type { UserRole } from "@/lib/data";
import { signInWithRole } from "@/lib/auth";
import { Button } from "./Button";
import { Input } from "./Input";

export function AuthForm({
  role,
  title,
  subtitle,
  registerLabel,
}: {
  role: UserRole;
  title: string;
  subtitle: string;
  registerLabel: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const form = new FormData(event.currentTarget);
      const email = String(form.get("email") || "demo@pawonsync.test");
      const password = String(form.get("password") || "password");
      const path = await signInWithRole(email, password, role);
      router.push(path);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div>
        <h1 className="text-3xl font-black text-cocoa-900">{title}</h1>
        <p className="mt-2 leading-7 text-cocoa-500">{subtitle}</p>
      </div>
      {role === "seller" ? (
        <Input icon={<Building2 size={18} />} label="Nama Katering" name="cateringName" placeholder="Pawon Lestari" type="text" />
      ) : (
        <Input icon={<UserRound size={18} />} label="Nama Lengkap" name="fullName" placeholder="Bu Diana" type="text" />
      )}
      <Input icon={<Mail size={18} />} label="Email / No. HP" name="email" placeholder="nama@email.com" type="text" />
      <Input icon={<LockKeyhole size={18} />} label="Password" name="password" placeholder="Masukkan password" type="password" />
      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p>
      ) : null}
      <Button disabled={loading} size="lg" type="submit">
        {loading ? "Memproses..." : "Masuk"}
      </Button>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
        <a className="text-cocoa-500 hover:text-cocoa-900" href="#">
          Lupa password?
        </a>
        <a className="font-black text-orange-700" href="/register">
          {registerLabel}
        </a>
      </div>
    </form>
  );
}
