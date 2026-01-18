"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ShoppingBag, ArrowLeft, CreditCard, Truck, Shield } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartItem } from "@/components/features/cart-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialCartItems = [
  {
    id: "1",
    title: "Kurash sport formasi",
    image: "/kurash-sport-uniform-merchandise-uzbekistan.jpg",
    price: 450000,
    quantity: 2,
    ownerName: "Akmal Nurmatov",
  },
  {
    id: "2",
    title: "Boxing qo'lqoplari",
    image: "/boxing-gloves-merchandise-red.jpg",
    price: 380000,
    quantity: 1,
    ownerName: "Rustam Xoliqov",
  },
  {
    id: "3",
    title: "Sport sumka Premium",
    image: "/premium-sport-bag-merchandise-black.jpg",
    price: 290000,
    quantity: 1,
    ownerName: "Malika Azimova",
  },
]

function CartsContent() {
  const { t } = useLanguage()
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500000 ? 0 : 25000
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/merches"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Xarid qilishga qaytish
          </Link>

          <motion.h1
            className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t.nav.cart}
          </motion.h1>

          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:w-96">
                <div className="glass-card rounded-3xl p-6 sticky top-24">
                  <h3 className="font-serif font-bold text-xl text-card-foreground mb-6">Buyurtma xulosasi</h3>

                  {/* Promo Code */}
                  <div className="flex gap-2 mb-6">
                    <Input
                      placeholder="Promo kod"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="rounded-xl"
                    />
                    <Button variant="outline" className="rounded-xl px-6 bg-transparent">
                      Qo&apos;llash
                    </Button>
                  </div>

                  {/* Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Oraliq jami</span>
                      <span className="font-medium">{subtotal.toLocaleString()} so&apos;m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Yetkazib berish</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Bepul" : `${shipping.toLocaleString()} so'm`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        500,000 so&apos;mdan yuqori xaridlarda yetkazib berish bepul
                      </p>
                    )}
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between">
                        <span className="font-serif font-bold text-lg">Jami</span>
                        <span className="font-serif font-bold text-xl text-sport">
                          {total.toLocaleString()} so&apos;m
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button className="w-full h-14 bg-sport hover:bg-sport/90 text-white rounded-xl text-lg font-medium">
                    <CreditCard className="w-5 h-5 mr-2" />
                    To&apos;lovga o&apos;tish
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="w-4 h-4" />
                      Tez yetkazib berish
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      Xavfsiz to&apos;lov
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Cart */
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-foreground mb-2">Savatingiz bo&apos;sh</h2>
              <p className="text-muted-foreground mb-6">Xarid qilish uchun mahsulotlarni qo&apos;shing</p>
              <Link href="/merches">
                <Button className="bg-sport hover:bg-sport/90 text-white rounded-xl">Xarid qilishga o&apos;tish</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function CartsPage() {
  return (
    <LanguageProvider>
      <CartsContent />
    </LanguageProvider>
  )
}
