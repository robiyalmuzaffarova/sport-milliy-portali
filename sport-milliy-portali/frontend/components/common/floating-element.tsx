"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  amplitude?: number
}

export function FloatingElement({
  children,
  className,
  delay = 0,
  duration = 6,
  amplitude = 20,
}: FloatingElementProps) {
  return (
    <motion.div
      className={cn("absolute", className)}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-5, 5, -5],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
