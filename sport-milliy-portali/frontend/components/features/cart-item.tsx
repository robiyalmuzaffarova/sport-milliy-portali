"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CartItemProps {
  id: string
  title: string
  image: string
  price: number
  quantity: number
  ownerName: string
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
  className?: string
}

export function CartItem({
  title,
  image,
  price,
  quantity,
  ownerName,
  onQuantityChange,
  onRemove,
  className,
}: CartItemProps) {
  return (
    <motion.div
      className={cn("flex items-center gap-4 p-4 bg-card rounded-2xl neu-card", className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Image */}
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif font-bold text-card-foreground line-clamp-1">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{ownerName}</p>
        <div className="font-serif font-bold text-sport mt-2">{price.toLocaleString()} so&apos;m</div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-lg bg-transparent"
          onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-lg bg-transparent"
          onClick={() => onQuantityChange?.(quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Total & Remove */}
      <div className="text-right">
        <div className="font-serif font-bold text-lg text-card-foreground">
          {(price * quantity).toLocaleString()} so&apos;m
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          O&apos;chirish
        </Button>
      </div>
    </motion.div>
  )
}
