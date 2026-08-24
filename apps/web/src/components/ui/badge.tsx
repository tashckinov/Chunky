import * as React from "react"

import { cn } from "@/lib/utils"

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-outline-variant px-3.5 text-xs text-muted-foreground", className)} {...props} />
}
