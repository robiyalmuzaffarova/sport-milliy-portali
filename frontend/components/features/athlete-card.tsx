"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Medal, MapPin, Trophy } from "lucide-react"
import { PillButton } from "@/components/ios/pill-button"
import { cn } from "@/lib/utils"

interface AthleteCardProps {
  id: string
  name: string
  sport: string
  image: string
  rating: number
  achievements: number
  location: string
  isVerified?: boolean
  isTopWeek?: boolean
  className?: string
}

export function AthleteCard({
  name,
  sport,
  image,
  rating,
  achievements,
  location,
  isVerified = false,
  isTopWeek = false,
  className,
}: AthleteCardProps) {
  return (
    <motion.div
      className={cn("group relative bg-card rounded-3xl overflow-hidden ios-card-elevated", className)}
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Top Week Badge */}
      {isTopWeek && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sport text-white text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          Hafta sportchisi
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name || "Sportchi"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-sport" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium mb-2">
            {sport}
          </span>
          <h3 className="font-bold text-xl text-white tracking-tight">{name}</h3>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-white/90">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <Medal className="w-4 h-4" />
              <span className="text-sm font-medium">{achievements}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="p-4">
        <PillButton variant="filled" className="w-full bg-primary hover:bg-primary/90">
          Profilni ko'rish
        </PillButton>
      </div>
    </motion.div>
  )
}
