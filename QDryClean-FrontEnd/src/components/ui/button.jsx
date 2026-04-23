import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "./utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
    "rounded-md text-sm font-medium",
    "transition-all duration-200",
    "select-none",
    "border border-transparent",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "hover:text-blue-600 hover:shadow-sm border-border active:translate-y-[1px]",

        destructive:
          "bg-destructive text-white hover:bg-destructive/90 hover:shadow-sm focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",

        outline:
          [
            "bg-white text-slate-700 border-slate-200 shadow-sm",
            "hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-md",
            "active:translate-y-[1px]",
            "dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
          ].join(" "),

        secondary:
          [
            "bg-slate-100 text-slate-700 border-slate-100",
            "hover:bg-slate-200 hover:text-slate-900 hover:shadow-sm",
            "active:translate-y-[1px]",
          ].join(" "),

        ghost:
          [
            "absolute right-3 top-1/2 -translate-y-1/2",
            "text-muted-foreground",
            "rounded-md",
            "hover:bg-slate-100 hover:text-slate-900",
          ].join(" "),

        link:
          "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",

        delete:
          [
            "bg-white text-slate-500 border-slate-200 shadow-sm",
            "hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm",
            "focus-visible:ring-red-200",
            "active:translate-y-[1px]",
          ].join(" "),
      },

      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };