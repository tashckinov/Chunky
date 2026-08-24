import * as React from "react"

import { cn } from "@/lib/utils"

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("min-h-36 w-full resize-none rounded-3xl border border-outline-variant bg-card p-5 text-xl leading-relaxed tracking-[-0.02em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20", className)} {...props} />
}
