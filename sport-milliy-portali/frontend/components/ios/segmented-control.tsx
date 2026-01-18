"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SegmentedControlProps {
  options: { value: string; label: string; icon?: React.ReactNode }[]
  value: string
  onChange: (value: string) => void
  variant?: "default" | "white"
  className?: string
}

export function SegmentedControl({ options, value, onChange, variant = "default", className }: SegmentedControlProps) {
  const activeIndex = options.findIndex((opt) => opt.value === value)
  const isWhite = variant === "white"

  return (
    <div className={cn("inline-flex p-1 bg-black/[0.06] rounded-xl gap-0.5", className)}>
      {options.map((option, i) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
            value === option.value 
              ? (isWhite ? "text-sport" : "text-primary") 
              : (isWhite ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-primary/70"),
          )}
        >
          {value === option.value && (
            <motion.div
              layoutId="segmented-bg"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              initial={false}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {option.icon}
            {option.label}
          </span>
        </button>
      ))}
    </div>
  )
}
