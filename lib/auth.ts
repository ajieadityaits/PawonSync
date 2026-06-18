"use client";

import type { UserRole } from "./data";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const isPrototypeAuth = process.env.NEXT_PUBLIC_AUTH_MODE === "prototype";

function normalizeAuthError(error: { message?: string }) {
  const message = error.message ?? "";

  if (message.toLowerCase().includes("rate limit")) {
    return new Error("Terlalu banyak percobaan daftar. Tunggu beberapa menit, lalu coba lagi atau gunakan email lain.");
  }

  if (message.toLowerCase().includes("invalid login credentials")) {
    return new Error("Email atau password belum terdaftar di Supabase Auth. Daftar dulu, cek email confirmation, atau aktifkan mode prototype.");
  }

  return new Error(message || "Autentikasi gagal. Coba lagi.");
}

export function dashboardPath(role: UserRole) {
  return role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";
}

export async function signInWithRole(email: string, password: string, role: UserRole) {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && !isPrototypeAuth) {
    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) throw normalizeAuthError(error);
  }

  localStorage.setItem("pawonsync-role", role);
  document.cookie = `pawonsync-role=${role}; path=/; max-age=604800; SameSite=Lax`;
  return dashboardPath(role);
}

export async function registerWithRole(payload: {
  email: string;
  password: string;
  role: UserRole;
  fullName?: string;
  cateringName?: string;
  phone?: string;
}) {
  const normalizedEmail = payload.email.trim().toLowerCase();

  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: payload.password,
      options: {
        data: {
          role: payload.role,
          full_name: payload.fullName?.trim(),
          catering_name: payload.cateringName?.trim(),
          phone: payload.phone?.trim(),
        },
      },
    });
    if (error) throw normalizeAuthError(error);
  }

  localStorage.setItem("pawonsync-role", payload.role);
  document.cookie = `pawonsync-role=${payload.role}; path=/; max-age=604800; SameSite=Lax`;
  return dashboardPath(payload.role);
}

export async function signOut() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }

  localStorage.removeItem("pawonsync-role");
  document.cookie = "pawonsync-role=; path=/; max-age=0; SameSite=Lax";
}
