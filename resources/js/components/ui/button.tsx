import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white shadow-lg hover:from-[#2563eb] hover:to-[#1e40af] hover:scale-105 transform",
        destructive:
          "bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white shadow-lg hover:from-[#b91c1c] hover:to-[#991b1b] hover:scale-105 transform",
        outline:
          "border border-[#e2e8f0] bg-white/90 text-[#1e293b] shadow-sm hover:bg-[#f8fafc] hover:border-[#cbd5e1] backdrop-blur-sm dark:border-[#475569] dark:bg-[#334155]/90 dark:text-[#f1f5f9] dark:hover:bg-[#475569]",
        secondary:
          "bg-[#f8fafc] text-[#1e293b] shadow-sm hover:bg-[#f1f5f9] dark:bg-[#334155] dark:text-[#f1f5f9] dark:hover:bg-[#475569]",
        ghost: "text-[#1e293b] hover:bg-[#f8fafc] dark:text-[#f1f5f9] dark:hover:bg-[#334155]",
        link: "text-[#3b82f6] underline-offset-4 hover:underline hover:text-[#2563eb]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
