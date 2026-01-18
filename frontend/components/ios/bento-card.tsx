"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BentoCardProps {
  title: string
  description?: string
  image?: string
  icon?: React.ReactNode
  href?: string
  variant?: "default" | "sport" | "warm" | "dark" | "image"
  size?: "sm" | "md" | "lg"
  className?: string
  children?: React.ReactNode
}

export function BentoCard({
  title,
  description,
  image,
  icon,
  href,
  variant = "default",
  size = "md",
  className,
  children,
}: BentoCardProps) {
  const variants = {
    default: "bg-card text-card-foreground",
    sport: "gradient-sport text-white",
    warm: "gradient-warm text-white",
    dark: "bg-primary text-primary-foreground",
    image: "bg-card text-card-foreground",
  }

  const Content = (
    <motion.div
      className={cn(
        "relative rounded-3xl overflow-hidden bento-item",
        variants[variant],
        size === "sm" && "p-5",
        size === "md" && "p-6",
        size === "lg" && "p-8",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      {variant === "image" && image && (
        <div className="absolute inset-0">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 gradient-dark-bottom" />
        </div>
      )}

      <div className={cn("relative z-10", variant === "image" && "mt-auto")}>
        {icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
              variant === "default" ? "bg-sport/10 text-sport" : "bg-white/20 text-current",
            )}
          >
            {icon}
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={cn("font-semibold leading-tight", size === "lg" ? "text-2xl" : "text-lg")}>{title}</h3>
            {description && (
              <p className={cn("mt-1.5 opacity-70", size === "lg" ? "text-base" : "text-sm")}>{description}</p>
            )}
          </div>

          {href && (
            <div
              className={cn(
                "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                variant === "default" ? "bg-primary text-primary-foreground" : "bg-white/20",
              )}
            >
              <ArrowUpRight className="w-5 h-5" />
            </div>
          )}
        </div>

        {children}
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="group">
        {Content}
      </Link>
    )
  }

  return Content
}
