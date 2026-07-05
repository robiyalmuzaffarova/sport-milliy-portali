"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2 } from "lucide-react"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MerchCard } from "@/components/features/merch-card"
import { useEffect, useState } from "react"
import { merchApi } from "@/lib/api/client"
import Link from "next/link"

function NewArrivalsContent() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedItems, setLikedItems] = useState<string[]>([])

  useEffect(() => {
    async function load() {
      try {
        const data = await merchApi.getAll(0, 50, undefined, undefined, 'new')
        const mapped = (data.items || []).map((m: any) => ({
          id: m.id.toString(),
          title: m.name,
          description: m.description,
          image: m.image_url || "/kurash-sport-uniform-merchandise-uzbekistan.jpg",
          price: m.price,
          originalPrice: m.discount_percent > 0
            ? Math.round(m.price / (1 - m.discount_percent / 100))
            : undefined,
          rating: 4.5 + (m.id % 5) / 10,
          soldCount: Math.floor((m.id * 13) % 100),
          ownerName: m.owner?.full_name || "Sportchi",
          ownerImage: m.owner?.avatar_url || "/uzbek-male-wrestler-athlete-portrait.jpg",
          inStock: m.stock > 0,
          category: m.category || "equipment",
        }))
        setItems(mapped)
      } catch (error) {
        console.error("Failed to load new merch:", error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const toggleLike = (id: string) => {
    setLikedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-card">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-8 bg-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/merches" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Do'konga qaytish
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-sport/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sport" />
            </div>
            <h1 className="font-bold text-4xl md:text-5xl text-primary tracking-tight">
              Yangi kelganlar
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Eng so'nggi sport jihozlari kolleksiyasi
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-sport animate-spin mb-4" />
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            </div>
          ) : items.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                <span className="font-semibold text-primary">{items.length}</span> yangi mahsulot topildi
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <MerchCard
                        {...item}
                        isLiked={likedItems.includes(item.id)}
                        onToggleLike={() => toggleLike(item.id)}
                        onAddToCart={() => console.log("Add to cart:", item.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Hozircha yangi mahsulotlar yo'q</p>
              <p className="text-muted-foreground text-sm mt-2">
                Admin paneldan mahsulotlarni "Yangi" deb belgilang
              </p>
              <Link href="/merches" className="inline-block mt-4 text-sport hover:underline">
                ← Barcha mahsulotlar
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function NewArrivalsPage() {
  return (
    <LanguageProvider>
      <NewArrivalsContent />
    </LanguageProvider>
  )
}