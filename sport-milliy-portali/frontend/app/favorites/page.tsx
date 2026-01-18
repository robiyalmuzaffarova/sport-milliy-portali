"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MerchCard } from "@/components/features/merch-card"
import { Button } from "@/components/ui/button"

const mockFavorites = [
  {
    id: "1",
    title: "Kurash sport formasi",
    description: "Professional kurash mashqlari uchun maxsus forma",
    image: "/kurash-sport-uniform-merchandise-uzbekistan.jpg",
    price: 450000,
    originalPrice: 550000,
    rating: 4.8,
    soldCount: 124,
    ownerName: "Akmal Nurmatov",
    ownerImage: "/uzbek-male-wrestler-athlete-portrait.jpg",
    inStock: true,
  },
  {
    id: "3",
    title: "Boxing qo'lqoplari",
    description: "Professional boxing mashqlari uchun qo'lqoplar",
    image: "/boxing-gloves-merchandise-red.jpg",
    price: 380000,
    originalPrice: 450000,
    rating: 4.7,
    soldCount: 89,
    ownerName: "Rustam Xoliqov",
    ownerImage: "/uzbek-male-boxer-athlete-portrait.jpg",
    inStock: true,
  },
]

function FavoritesContent() {
  const { t } = useLanguage()
  const [favorites, setFavorites] = useState(mockFavorites)

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
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

          {favorites.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <MerchCard
                    {...item}
                    isLiked={true}
                    onToggleLike={() => removeFavorite(item.id)}
                    onAddToCart={() => console.log("Add to cart:", item.id)}
                  />
                </motion.div>
              ))}
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
              <p className="text-muted-foreground mb-6">Yoqtirgan mahsulotlaringizni qo&apos;shing</p>
              <Link href="/merches">
                <Button className="bg-sport hover:bg-sport/90 text-white rounded-xl">Mahsulotlarni ko&apos;rish</Button>
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
