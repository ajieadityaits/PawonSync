import Link from "next/link";
import { ChefHat } from "lucide-react";
import { Button } from "./Button";

export function Logo() {
  return (
    <Link className="flex items-center gap-2" href="/">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-cocoa-800 text-cream-50 shadow-soft">
        <ChefHat size={22} />
      </span>
      <span>
        <span className="block text-lg font-black leading-5 text-cocoa-900">PawonSync</span>
        <span className="block text-xs font-semibold text-cocoa-500">Ketengan dari Dapur hingga Venue</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-cocoa-100 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-cocoa-600 md:flex">
          <a href="#beranda">Beranda</a>
          <a href="#fitur">Fitur</a>
          <a href="#tentang">Tentang</a>
          <Link href="/login">Masuk</Link>
        </nav>
        <Button href="/login" size="sm" className="md:hidden">
          Masuk
        </Button>
      </div>
    </header>
  );
}
