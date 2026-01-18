"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, variant = "filled", size = "md", icon, iconPosition = "left", children, ...props }, ref) => {
    const variants = {
      filled: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border-2 border-border bg-transparent hover:bg-secondary",
      ghost: "bg-transparent hover:bg-secondary",
    }

    const sizes = {
      sm: "h-9 px-4 text-sm gap-1.5",
      md: "h-11 px-6 text-sm gap-2",
      lg: "h-14 px-8 text-base gap-2.5",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 active:scale-95",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </button>
    )
  },
)
PillButton.displayName = "PillButton"
