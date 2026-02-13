"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  className?: string
}

export function NewsCard({ id, title, excerpt, image, date, category, className }: NewsCardProps) {
  // Normalize image source: if the stored `image` is not an absolute URL,
  // try to resolve it against the backend uploads path so both full URLs
  // and stored filenames/slugs work.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  const API_BASE = API_URL.replace(/\/api\/v1\/?$/i, '')

  let src = image || '/placeholder.svg'
  const isAbsolute = /^(https?:)?\/\//i.test(src) || src.startsWith('data:')
  if (!isAbsolute) {
    if (src.startsWith('/')) src = `${API_BASE}${src}`
    else src = `${API_BASE}/uploads/${src}`
  }

  return (
    <motion.article
      className={cn("group bg-card rounded-3xl overflow-hidden ios-card-elevated", className)}
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={`/news/${id}`}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={src}
            alt={title || "Yangiliklar"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold shadow-sm">
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <Calendar className="w-4 h-4" />
            {date}
          </div>

          <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 group-hover:text-sport transition-colors tracking-tight">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm mt-2 line-clamp-2 leading-relaxed">{excerpt}</p>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sport font-medium text-sm">Batafsil</span>
            <div className="w-8 h-8 rounded-full bg-sport/10 flex items-center justify-center group-hover:bg-sport group-hover:text-white transition-colors">
              <ArrowUpRight className="w-4 h-4 text-sport group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
