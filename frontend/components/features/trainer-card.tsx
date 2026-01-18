"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, MapPin, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TrainerCardProps {
  id: string
  name: string
  sport: string
  image: string
  rating: number
  experience: number
  location: string
  students: number
  isVerified?: boolean
  price?: string
  className?: string
}

export function TrainerCard({
  name,
  sport,
  image,
  rating,
  experience,
  location,
  students,
  isVerified = false,
  price,
  className,
}: TrainerCardProps) {
  return (
    <motion.div
      className={cn("group bg-card rounded-3xl overflow-hidden neu-card", className)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sport flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-lg text-card-foreground truncate">{name}</h3>
            <span className="inline-block px-3 py-1 rounded-full bg-sport/10 text-sport text-xs font-medium mt-1">
              {sport}
            </span>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium text-card-foreground">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-secondary rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs">Tajriba</span>
            </div>
            <div className="font-serif font-bold text-lg text-secondary-foreground">{experience} yil</div>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">O&apos;quvchilar</span>
            </div>
            <div className="font-serif font-bold text-lg text-secondary-foreground">{students}+</div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
          {price && (
            <div>
              <span className="text-xs text-muted-foreground">Narxi</span>
              <div className="font-serif font-bold text-lg text-sport">{price}</div>
            </div>
          )}
          <Button
            className={cn("bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl", !price && "w-full")}
          >
            Bog&apos;lanish
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
