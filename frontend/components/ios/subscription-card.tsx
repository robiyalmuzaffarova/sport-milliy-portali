"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { AvatarStack } from "./avatar-stack"
import { PillButton } from "./pill-button"
import { cn } from "@/lib/utils"

interface SubscriptionCardProps {
  title: string
  price: string
  period: string
  features: string[]
  recentJoiners?: { src: string; alt: string }[]
  joinerCount?: number
  popular?: boolean
  variant?: "default" | "sport"
  className?: string
}

export function SubscriptionCard({
  title,
  price,
  period,
  features,
  recentJoiners = [],
  joinerCount = 0,
  popular = false,
  variant = "default",
  className,
}: SubscriptionCardProps) {
  const isSport = variant === "sport"
  
  return (
    <motion.div
      className={cn(
        "relative p-6 rounded-3xl overflow-hidden",
        popular ? "bg-primary text-primary-foreground" : 
        isSport ? "bg-sport text-white" : "ios-card",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true }}
    >
      {(popular || isSport) && (
        <div className={cn(
          "absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
          popular ? "bg-white/20" : "bg-white/10"
        )}>
          <Sparkles className="w-3 h-3" />
          {popular ? "Mashhur" : "Tavsiya"}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-bold tracking-tight">{price}</span>
            <span className="text-sm opacity-60">/ {period}</span>
          </div>
        </div>

        {recentJoiners.length > 0 && (
          <div className="flex items-center gap-2 py-2 border-y border-current/10">
            <AvatarStack avatars={recentJoiners} max={3} size="sm" showCount={false} />
            <span className="text-xs opacity-70">{joinerCount}+ so'nggi haftada qo'shildi</span>
          </div>
        )}

        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center",
                  (popular || isSport) ? "bg-white/20" : "bg-sport/10",
                )}
              >
                <Check className={cn("w-3 h-3", (popular || isSport) ? "text-white" : "text-sport")} />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        <PillButton
          suppressHydrationWarning
          variant={(popular || isSport) ? "outline" : "filled"}
          className={cn(
            "w-full",
            popular ? "border-white/30 text-white hover:bg-white/10" : 
            isSport ? "border-white/30 text-white hover:bg-white/10" :
            "bg-primary text-primary-foreground",
          )}
          onClick={() => window.location.href = "/monetization"}
        >
          Obuna bo'lish
        </PillButton>
      </div>
    </motion.div>
  )
}
