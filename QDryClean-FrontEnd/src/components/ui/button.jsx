import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  [
    // base
    "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
    "rounded-md text-sm font-medium",
    "transition-all duration-200",
    "select-none",
    "border border-transparent",
    // focus
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // states
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "active:translate-y-[1px]",
    // icons
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // validation
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 hover:shadow-sm focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground hover:border-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 hover:shadow-sm",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
