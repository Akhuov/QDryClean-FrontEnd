"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

const alertVariants = cva(
  // Базовые стили: сетка, скругление, блюр и анимация появления
  "relative w-full rounded-[20px] border px-4 py-4 text-sm grid has-[>svg]:grid-cols-[24px_1fr] grid-cols-[1fr] gap-x-3 items-start backdrop-blur-md transition-all",
  {
    variants: {
      variant: {
        default: 
          "bg-white/50 border-blue-100/50 text-slate-700 shadow-sm shadow-blue-500/5 [&>svg]:text-blue-500",
        destructive:
          "bg-red-50/50 border-red-100/50 text-red-800 shadow-sm shadow-red-500/5 [&>svg]:text-red-500 *:data-[slot=alert-description]:text-red-700/80",
        success:
          "bg-emerald-50/50 border-emerald-100/50 text-emerald-900 shadow-sm shadow-emerald-500/5 [&>svg]:text-emerald-500 *:data-[slot=alert-description]:text-emerald-800/80",
        info:
          "bg-blue-50/60 border-blue-100/50 text-blue-900 shadow-sm shadow-blue-500/5 [&>svg]:text-blue-600 *:data-[slot=alert-description]:text-blue-800/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert"
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-title"
    className={cn(
      "col-start-2 line-clamp-1 font-bold tracking-tight text-base leading-none mb-1",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn(
      "col-start-2 text-sm leading-relaxed opacity-90 [&_p]:leading-relaxed",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };