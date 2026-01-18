"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatCardProps {
  value: string | number
  label: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ value, label, icon, className }: StatCardProps) {
  return (
    <motion.div
      className={cn("glass-card rounded-2xl p-6 text-center", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {icon && (
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sport/10 flex items-center justify-center text-sport">
          {icon}
        </div>
      )}
      <div className="font-serif font-bold text-3xl md:text-4xl text-primary">{value}</div>
      <div className="text-muted-foreground text-sm mt-1">{label}</div>
    </motion.div>
  )
}
