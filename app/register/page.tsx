"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Navbar";
import { registerWithRole } from "@/lib/auth";
import type { UserRole } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("seller");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const form = new FormData(event.currentTarget);
      const email = String(form.get("email") || "").trim().toLowerCase();
      const password = String(form.get("password") || "");
      const passwordConfirm = String(form.get("passwordConfirm") || "");

      if (!email.includes("@") || !email.includes(".")) {
        setErrorMessage("Masukkan email yang valid, contoh: nama@gmail.com.");
        return;
      }

      if (password.length < 8) {
        setErrorMessage("Password minimal 8 karakter.");
        return;
      }

      if (password !== passwordConfirm) {
        setErrorMessage("Konfirmasi password belum sama.");
        return;
      }

      const path = await registerWithRole({
        role,
        email,
        password,
        fullName: String(form.get("fullName") || form.get("ownerName") || ""),
        cateringName: String(form.get("cateringName") || ""),
        phone: String(form.get("phone") || ""),
      });
      router.push(path);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream-50 px-4 py-10">
      <section className="w-full max-w-3xl rounded-2xl border border-cocoa-100 bg-white p-5 shadow-soft sm:p-8">
        <Logo />
        <div className="mt-8">
          <h1 className="text-3xl font-black text-cocoa-900">Daftar Akun PawonSync</h1>
          <p className="mt-2 text-cocoa-500">Buat akun sesuai kebutuhan penggunaan prototype.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-cream-100 p-1">
          {(["seller", "buyer"] as UserRole[]).map((item) => (
            <button
              className={cn(
                "h-11 rounded-lg text-sm font-black transition",
                role === item ? "bg-white text-cocoa-900 shadow-sm" : "text-cocoa-500",
              )}
              key={item}
              onClick={() => setRole(item)}
              type="button"
            >
              {item === "seller" ? "Seller" : "Buyer"}
            </button>
          ))}
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {role === "seller" ? (
            <>
              <Input icon={<Building2 size={18} />} label="Nama Katering" name="cateringName" placeholder="Pawon Lestari" />
              <Input icon={<UserRound size={18} />} label="Nama Pemilik" name="ownerName" placeholder="Ibu Rani" />
            </>
          ) : (
            <Input icon={<UserRound size={18} />} label="Nama Lengkap" name="fullName" placeholder="Diana" />
          )}
          <Input icon={<Mail size={18} />} label="Email" name="email" placeholder="nama@gmail.com" type="email" />
          <Input icon={<Phone size={18} />} label="No. HP" name="phone" placeholder="081234567890" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input icon={<LockKeyhole size={18} />} label="Password" name="password" placeholder="Minimal 8 karakter" type="password" />
            <Input
              icon={<LockKeyhole size={18} />}
              label="Konfirmasi Password"
              name="passwordConfirm"
              placeholder="Ulangi password"
              type="password"
            />
          </div>
          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p>
          ) : null}
          <Button disabled={loading} size="lg" type="submit">
            {loading ? "Mendaftarkan..." : "Daftar"}
          </Button>
        </form>
      </section>
    </main>
  );
}
