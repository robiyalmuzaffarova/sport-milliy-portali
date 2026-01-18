"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Clock, ExternalLink, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EducationCardProps {
  id: string
  name: string
  type: "academy" | "federation"
  description: string
  image: string
  location: string
  address: string
  workingHours: string
  phone: string
  rating: number
  mapsLink: string
  className?: string
}

export function EducationCard({
  name,
  type,
  description,
  image,
  location,
  address,
  workingHours,
  phone,
  rating,
  mapsLink,
  className,
}: EducationCardProps) {
  return (
    <motion.div
      className={cn("group bg-card rounded-3xl overflow-hidden neu-card", className)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Type Badge */}
        <span
          className={cn(
            "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium",
            type === "academy" ? "bg-sport text-white" : "bg-accent text-accent-foreground",
          )}
        >
          {type === "academy" ? "Akademiya" : "Federatsiya"}
        </span>

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full glass">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-white text-sm font-medium">{rating.toFixed(1)}</span>
        </div>

        {/* Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-serif font-bold text-xl text-white line-clamp-2">{name}</h3>
          <div className="flex items-center gap-1 text-white/80 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-secondary rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Ish vaqti</span>
            </div>
            <span className="text-sm font-medium text-secondary-foreground">{workingHours}</span>
          </div>
          <div className="bg-secondary rounded-xl p-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Phone className="w-4 h-4" />
              <span className="text-xs">Telefon</span>
            </div>
            <span className="text-sm font-medium text-secondary-foreground">{phone}</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-xs text-muted-foreground mb-4">{address}</p>

        {/* Action */}
        <a href={mapsLink} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2">
            <ExternalLink className="w-4 h-4" />
            Xaritada ko&apos;rish
          </Button>
        </a>
      </div>
    </motion.div>
  )
}
