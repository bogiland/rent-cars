import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-fg-muted)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-dim)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-12 rounded-[var(--radius-md)]",
              "bg-[var(--color-input-bg)] border border-[var(--color-input-border)]",
              "text-[var(--color-fg)] text-base",
              "placeholder:text-[var(--color-fg-dim)]",
              "transition-colors duration-[var(--dur-fast)]",
              "focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-input-focus)]",
              icon ? "pl-10 pr-4" : "px-4",
              error && "border-[var(--color-danger)]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
