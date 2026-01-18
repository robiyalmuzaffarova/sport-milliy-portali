"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SportCardProps {
  image: string
  title: string
  subtitle?: string
  rating?: number
  location?: string
  badge?: string
  badgeColor?: "sport" | "accent" | "primary"
  onLike?: () => void
  onAction?: () => void
  actionLabel?: string
  liked?: boolean
  className?: string
}

export function SportCard({
  image,
  title,
  subtitle,
  rating,
  location,
  badge,
  badgeColor = "sport",
  onLike,
  onAction,
  actionLabel,
  liked = false,
  className,
}: SportCardProps) {
  const badgeColors = {
    sport: "bg-sport text-white",
    accent: "bg-accent text-accent-foreground",
    primary: "bg-primary text-primary-foreground",
  }

  return (
    <motion.div
      className={cn("group relative bg-card rounded-3xl overflow-hidden neu-card", className)}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badge */}
        {badge && (
          <span
            className={cn("absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium", badgeColors[badgeColor])}
          >
            {badge}
          </span>
        )}

        {/* Like Button */}
        {onLike && (
          <button
            onClick={onLike}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center transition-transform hover:scale-110"
          >
            <Heart className={cn("w-5 h-5", liked ? "fill-red-500 text-red-500" : "text-white")} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif font-bold text-lg text-card-foreground line-clamp-1">{title}</h3>

        {subtitle && <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{subtitle}</p>}

        <div className="flex items-center gap-4 mt-3">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
          )}
        </div>

        {onAction && actionLabel && (
          <Button
            onClick={onAction}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
