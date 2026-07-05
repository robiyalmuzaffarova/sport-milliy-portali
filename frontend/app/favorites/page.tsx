"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Heart, ArrowLeft, Loader2 } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MerchCard } from "@/components/features/merch-card"
import { Button } from "@/components/ui/button"
import { favoritesApi, cartApi } from "@/lib/api/client"

function FavoritesContent() {
  const { t } = useLanguage()
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token") || ""
    }
    return ""
  }

  useEffect(() => {
    async function loadFavorites() {
      const token = getToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const data = await favoritesApi.getMyFavorites(token)
        const items = (data.items || []).map((item: any) => ({
          id: String(item.id),
          merchId: item.merch_id,
          title: item.merch?.name || "Mahsulot",
          description: item.merch?.description || "",
          image: item.merch?.image_url || "/placeholder.svg",
          price: item.merch?.discount_percent > 0
            ? Math.round(item.merch.price * (1 - item.merch.discount_percent / 100))
            : item.merch?.price || 0,
          originalPrice: item.merch?.discount_percent > 0 ? item.merch.price : undefined,
          rating: 4.5,
          soldCount: 0,
          ownerName: item.merch?.owner?.full_name || "Sportchi",
          ownerImage: item.merch?.owner?.avatar_url || "/placeholder.svg",
          inStock: (item.merch?.stock || 0) > 0,
          category: item.merch?.category || "equipment",
        }))
        setFavorites(items)
      } catch (error) {
        console.error("Failed to load favorites:", error)
        setFavorites([])
      } finally {
        setIsLoading(false)
      }
    }
    loadFavorites()
  }, [])

  const removeFavorite = async (id: string) => {
    const token = getToken()
    try {
      await favoritesApi.removeFavorite(Number(id), token)
      setFavorites((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Failed to remove favorite:", error)
    }
  }

  const addToCart = async (merchId: number) => {
    const token = getToken()
    if (!token) {
      window.location.href = "/login"
      return
    }
    try {
      await cartApi.addToCart(merchId, 1, token)
      alert("Savatga qo'shildi!")
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/merches"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Mahsulotlarga qaytish
          </Link>

          <motion.h1
            className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t.nav.favorites}
          </motion.h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-sport animate-spin mb-4" />
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {favorites.map((item, index) => (
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
                      isLiked={true}
                      onToggleLike={() => removeFavorite(item.id)}
                      onAddToCart={() => addToCart(item.merchId)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-foreground mb-2">
                Sevimlilar ro&apos;yxati bo&apos;sh
              </h2>
              <p className="text-muted-foreground mb-6">
                Yoqtirgan mahsulotlaringizni qo&apos;shing
              </p>
              <Link href="/merches">
                <Button className="bg-sport hover:bg-sport/90 text-white rounded-xl">
                  Mahsulotlarni ko&apos;rish
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function FavoritesPage() {
  return (
    <LanguageProvider>
      <FavoritesContent />
    </LanguageProvider>
  )
}