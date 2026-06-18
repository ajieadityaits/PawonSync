import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

const variants = {
  primary: "bg-cocoa-700 text-white shadow-soft hover:bg-cocoa-800",
  secondary: "bg-orange-soft text-cocoa-900 ring-1 ring-orange-200 hover:bg-orange-200",
  ghost: "bg-white text-cocoa-800 ring-1 ring-cocoa-100 hover:bg-cream-100",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-cocoa-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
}
