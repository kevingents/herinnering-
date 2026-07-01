import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-meta text-xs uppercase tracking-[0.14em] transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // The scarce, gilded primary action.
        gold: "bg-forest text-cream shadow-[0_10px_30px_-12px_rgba(201,161,90,0.6)] hover:brightness-105 hover:shadow-[0_14px_36px_-12px_rgba(201,161,90,0.75)]",
        // The quiet "kom binnen" — a gold-outlined action that glows on hover.
        outline:
          "border border-gold/45 text-gold bg-transparent hover:border-gold/80 hover:bg-gold/[0.06] hover:shadow-[0_0_36px_-8px_rgba(201,161,90,0.4)]",
        ghost:
          "text-foreground-secondary hover:text-foreground hover:bg-surface-elevated",
        link: "text-gold underline-offset-4 hover:underline rounded-none tracking-normal normal-case font-body text-base",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-11 px-7",
        lg: "h-13 px-9 text-[0.8rem]",
      },
    },
    defaultVariants: { variant: "gold", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
