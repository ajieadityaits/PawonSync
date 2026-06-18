import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
};

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-cocoa-800">
      {label}
      <span className="relative block">
        {icon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-400">{icon}</span> : null}
        <input
          className={cn(
            "h-12 w-full rounded-lg border border-cocoa-100 bg-white px-4 text-sm text-cocoa-900 shadow-sm outline-none transition placeholder:text-cocoa-300 focus:border-cocoa-400 focus:ring-4 focus:ring-orange-100",
            icon ? "pl-10" : false,
            className,
          )}
          {...props}
        />
      </span>
    </label>
  );
}
