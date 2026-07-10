import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2 font-medium",
    "transition-all select-none whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:opacity-40 disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[var(--color-cta)] text-[var(--color-cta-fg)]",
          "hover:bg-[var(--color-cta-hover)]",
          "active:scale-[0.98]",
        ],
        secondary: [
          "bg-[var(--color-surface-2)] text-[var(--color-fg)]",
          "border border-[var(--color-border-strong)]",
          "hover:bg-[var(--color-border-strong)]",
          "active:scale-[0.98]",
        ],
        ghost: [
          "text-[var(--color-fg-muted)]",
          "hover:text-[var(--color-fg)] hover:bg-[var(--color-border)]",
        ],
        outline: [
          "border border-[var(--color-border-strong)] text-[var(--color-fg)]",
          "hover:bg-[var(--color-surface-2)]",
          "active:scale-[0.98]",
        ],
      },
      size: {
        sm:  "h-8  px-3   text-sm  rounded-[var(--radius-md)]",
        md:  "h-10 px-4   text-sm  rounded-[var(--radius-md)]",
        lg:  "h-12 px-6   text-base rounded-[var(--radius-lg)]",
        xl:  "h-14 px-8   text-lg  rounded-[var(--radius-lg)]",
        full:"h-14 px-8   text-base rounded-[var(--radius-lg)] w-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(button({ variant, size }), "duration-[var(--dur-fast)]", className)}
      disabled={props.disabled ?? loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          {children}
        </span>
      ) : children}
    </Comp>
  );
}
