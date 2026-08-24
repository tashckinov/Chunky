import * as React from "react"

import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-[var(--radius-xl)] border border-outline-variant/70 bg-card text-card-foreground shadow-[var(--elevation-1)]", className)} {...props} />
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-start justify-between gap-4 p-6", className)} {...props} />
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6 pb-6", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-2xl font-bold tracking-[-0.04em]", className)} {...props} />
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("mt-1.5 text-sm leading-6 text-muted-foreground", className)} {...props} />
}
