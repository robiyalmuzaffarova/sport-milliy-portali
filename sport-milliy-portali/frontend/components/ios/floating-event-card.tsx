"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Clock, Users } from "lucide-react"
import { AvatarStack } from "./avatar-stack"
import { PillButton } from "./pill-button"
import { cn } from "@/lib/utils"

interface FloatingEventCardProps {
  title: string
  date: string
  time: string
  location: string
  locationDetail: string
  image: string
  organizer: {
    name: string
    avatar: string
    role?: string
  }
  participants: { src: string; alt: string }[]
  participantCount: number
  isFree?: boolean
  className?: string
}

export function FloatingEventCard({
  title,
  date,
  time,
  location,
  locationDetail,
  image,
  organizer,
  participants,
  participantCount,
  isFree = false,
  className,
}: FloatingEventCardProps) {
  return (
    <motion.div
      className={cn("w-72 ios-card-dark text-white overflow-hidden", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Image */}
      <div className="relative h-32">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Time Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium">
          <Clock className="w-3 h-3" />
          {time}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-sport text-xs font-medium">
          {isFree ? "Bepul" : "Premium"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base leading-tight">{title}</h3>
          <p className="text-sm text-white/60 mt-0.5">{date}</p>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20">
            <Image src={organizer.avatar || "/placeholder.svg"} alt={organizer.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{organizer.name}</p>
            {organizer.role && <p className="text-xs text-white/50">{organizer.role}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-white/70">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">{location}</p>
            <p className="text-xs">{locationDetail}</p>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <AvatarStack avatars={participants} max={3} size="sm" showCount={false} />
            <span className="text-xs text-white/60">+{participantCount} qatnashuvchi</span>
          </div>
        </div>

        {/* Action */}
        <PillButton variant="filled" className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm">
          <Users className="w-4 h-4" />
          Qo'shilish
        </PillButton>

        {isFree && (
          <div className="flex items-center justify-center gap-1 text-xs text-white/50">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Bepul tadbirlar
          </div>
        )}
      </div>
    </motion.div>
  )
}
