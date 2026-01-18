"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Star, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface MerchCardProps {
  id: string
  title: string
  description?: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  soldCount: number
  ownerName: string
  ownerImage: string
  inStock: boolean
  isLiked?: boolean
  onAddToCart?: () => void
  onToggleLike?: () => void
  className?: string
}

export function MerchCard({
  title,
  description,
  image,
  price,
  originalPrice,
  rating,
  soldCount,
  ownerName,
  ownerImage,
  inStock,
  isLiked = false,
  onAddToCart,
  onToggleLike,
  className,
}: MerchCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <motion.div
      className={cn("group bg-card rounded-3xl overflow-hidden ios-card-elevated", className)}
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-warm text-white text-xs font-bold shadow-lg">
            -{discount}%
          </span>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <Package className="w-8 h-8 text-white/80" />
            <span className="px-4 py-1.5 rounded-full bg-white/90 text-primary text-sm font-semibold">Tugadi</span>
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={onToggleLike}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            isLiked ? "bg-red-500 shadow-lg scale-110" : "bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105",
          )}
        >
          <Heart className={cn("w-5 h-5 transition-colors", isLiked ? "fill-white text-white" : "text-primary")} />
        </button>

        {/* Quick Add - appears on hover */}
        {inStock && (
          <motion.button
            onClick={onAddToCart}
            className="absolute bottom-4 left-4 right-4 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl"
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="w-4 h-4" />
            Savatga qo'shish
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Owner */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
            <Image
              src={ownerImage || "/placeholder.svg"}
              alt={ownerName}
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{ownerName}</span>
        </div>

        <h3 className="font-semibold text-lg text-card-foreground line-clamp-1 tracking-tight">{title}</h3>

        {description && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 leading-relaxed">{description}</p>
        )}

        {/* Rating & Sold */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-semibold text-yellow-700">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">{soldCount} sotilgan</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
          <div>
            <div className="font-bold text-xl text-sport tracking-tight">{price.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {originalPrice ? (
                <span className="line-through">{originalPrice.toLocaleString()} so'm</span>
              ) : (
                <span>so'm</span>
              )}
            </div>
          </div>

          {/* Mobile Add Button */}
          <button
            onClick={onAddToCart}
            disabled={!inStock}
            className={cn(
              "lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
              inStock
                ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
