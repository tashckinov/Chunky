import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/92",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border-outline-variant bg-transparent text-foreground hover:bg-surface-container-low",
        ghost: "text-foreground hover:bg-surface-container-low"
      },
      size: {
        default: "h-11",
        icon: "size-11 shrink-0 p-0"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
)

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
