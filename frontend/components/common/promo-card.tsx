"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PromoCardProps {
  title: string
  description: string
  actionLabel: string
  onAction?: () => void
  variant?: "sport" | "accent" | "dark"
  icon?: React.ReactNode
  badge?: string
  className?: string
}

export function PromoCard({
  title,
  description,
  actionLabel,
  onAction,
  variant = "sport",
  icon,
  badge,
  className,
}: PromoCardProps) {
  const variants = {
    sport: "bg-sport text-white",
    accent: "bg-accent text-accent-foreground",
    dark: "bg-primary text-primary-foreground",
  }

  return (
    <motion.div
      className={cn("relative rounded-3xl p-6 overflow-hidden", variants[variant], className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      {badge && (
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 text-xs font-medium">{badge}</span>
      )}

      {icon && <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">{icon}</div>}

      <h3 className="font-serif font-bold text-xl mb-2">{title}</h3>
      <p className="opacity-90 text-sm mb-4">{description}</p>

      <Button
        onClick={onAction}
        variant="secondary"
        className={cn("rounded-xl gap-2", variant === "sport" ? "bg-white text-sport hover:bg-white/90" : "")}
      >
        {actionLabel}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  )
}
