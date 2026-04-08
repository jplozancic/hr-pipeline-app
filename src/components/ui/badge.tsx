import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-3xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        
        // --- Custom HR Pipeline Status Variants ---
        
        // Hired: Emerald green using fractional opacity
        hired: 
          "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 [a]:hover:bg-emerald-500/25",
        
        // Offer: Purple/Indigo
        offer: 
          "bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 [a]:hover:bg-purple-500/25",
        
        // Interview: Blue
        interview: 
          "bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 [a]:hover:bg-blue-500/25",
        
        // Screening: Amber/Orange
        screening: 
          "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 [a]:hover:bg-amber-500/25",
        
        // New: Teal
        new: 
          "bg-teal-500/15 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 [a]:hover:bg-teal-500/25",
          
        // Rejected: Rose
        rejected: 
          "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 [a]:hover:bg-rose-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }