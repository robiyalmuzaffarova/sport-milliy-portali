"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface AvatarStackProps {
  avatars: { src: string; alt: string }[]
  max?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

export function AvatarStack({ avatars, max = 4, size = "md", showCount = true, className }: AvatarStackProps) {
  const displayed = avatars.slice(0, max)
  const remaining = avatars.length - max

  const sizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }

  const overlaps = {
    sm: "-ml-2",
    md: "-ml-3",
    lg: "-ml-3.5",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {displayed.map((avatar, i) => (
          <div
            key={i}
            className={cn(
              sizes[size],
              "relative rounded-full border-2 border-white overflow-hidden bg-muted",
              i > 0 && overlaps[size],
            )}
            style={{ zIndex: displayed.length - i }}
          >
            <Image src={avatar.src || "/placeholder.svg"} alt={avatar.alt} fill className="object-cover" />
          </div>
        ))}
        {showCount && remaining > 0 && (
          <div
            className={cn(
              sizes[size],
              overlaps[size],
              "rounded-full border-2 border-white bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground",
            )}
            style={{ zIndex: 0 }}
          >
            +{remaining}
          </div>
        )}
      </div>
    </div>
  )
}
