"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { CreditCard, Heart, Users, Trophy, Check } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FloatingElement } from "@/components/common/floating-element"

const subscriptionPlans = [
  {
    id: "free",
    name: "Bepul",
    price: "0",
    period: "oyiga",
    description: "Boshlang'ich foydalanuvchilar uchun",
    features: ["Profil yaratish", "Sport yangiliklari", "Asosiy qidiruv", "Cheklangan AI Buddy"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "9,900",
    period: "oyiga",
    description: "Professional sportchilar uchun",
    features: [
      "Barcha bepul imkoniyatlar",
      "Cheksiz AI Buddy",
      "Murabbiylar bilan bog'lanish",
      "Maxsus statistikalar",
      "Reklama ko'rsatilmaydi",
    ],
    popular: true,
  },
  {
    id: "trainer",
    name: "Murabbiy",
    price: "19,900",
    period: "oyiga",
    description: "Professional murabbiylar uchun",
    features: [
      "Barcha Pro imkoniyatlar",
      "O'quvchilarni boshqarish",
      "Kurslar yaratish",
      "Merch sotish",
      "Donatsiyalar qabul qilish",
      "Maxsus analytics",
    ],
    popular: false,
  },
]

const recentDonations = [
  { id: "1", name: "Sardor A.", amount: "50,000", to: "Akmal Nurmatov", avatar: "/diverse-group-avatars.png" },
  { id: "2", name: "Nilufar S.", amount: "100,000", to: "Tennis Federatsiyasi", avatar: "/pandora-ocean-scene.png" },
  { id: "3", name: "Bobur T.", amount: "25,000", to: "Rustam Xoliqov", avatar: "/diverse-group-futuristic-setting.png" },
]

function MonetizationContent() {
  const { t } = useLanguage()
  const [donationAmount, setDonationAmount] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 bg-primary overflow-hidden">
        <FloatingElement className="top-16 right-[10%] opacity-20" delay={0}>
          <div className="w-28 h-28 rounded-full bg-sport/30" />
        </FloatingElement>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground">{t.nav.monetization}</h1>
            <p className="text-primary-foreground/70 mt-3 max-w-xl">
              Obuna bo&apos;ling yoki sevimli sportchilaringizni qo&apos;llab-quvvatlang
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-foreground">Obuna tariflari</h2>
            <p className="text-muted-foreground mt-2">O&apos;zingizga mos tarifni tanlang</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative bg-card rounded-3xl p-6 neu-card ${plan.popular ? "ring-2 ring-sport" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sport text-white text-xs font-medium">
                    Mashhur
                  </span>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-serif font-bold text-xl text-card-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                  <div className="mt-4">
                    <span className="font-serif font-bold text-4xl text-sport">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">so&apos;m/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-sport/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-sport" />
                      </div>
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-xl ${
                    plan.popular ? "bg-sport hover:bg-sport/90 text-white" : "bg-secondary hover:bg-secondary/80"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  Tanlash
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <motion.div
              className="bg-card rounded-3xl p-8 neu-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-sport/10 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-sport" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-card-foreground">{t.promo.donateTitle}</h3>
                  <p className="text-muted-foreground text-sm">{t.promo.donateDesc}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Ehson miqdori</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {["10,000", "50,000", "100,000", "500,000"].map((amount) => (
                      <Button
                        key={amount}
                        variant={donationAmount === amount ? "default" : "outline"}
                        className={`rounded-xl ${donationAmount === amount ? "bg-sport text-white" : "bg-transparent"}`}
                        onClick={() => setDonationAmount(amount)}
                      >
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Yoki o&apos;z miqdoringizni kiriting</Label>
                  <Input
                    type="text"
                    placeholder="Miqdorni kiriting (so'm)"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <Button className="w-full h-14 bg-sport hover:bg-sport/90 text-white rounded-xl text-lg">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Ehson qilish
                </Button>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <Image src="/click-payment-logo.png" alt="Click" width={60} height={30} className="opacity-60" />
                  <Image src="/generic-payment-logo.png" alt="Payme" width={60} height={30} className="opacity-60" />
                </div>
              </div>
            </motion.div>

            {/* Recent Donations */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="font-serif font-bold text-xl text-foreground mb-6">So&apos;nggi ehsonlar</h3>

              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center gap-4 p-4 bg-card rounded-2xl neu-card">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={donation.avatar || "/placeholder.svg"}
                        alt={donation.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{donation.name} ehson qildi</p>
                      <p className="text-sm text-muted-foreground">{donation.to} uchun</p>
                    </div>
                    <div className="font-serif font-bold text-sport">{donation.amount} so&apos;m</div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-card rounded-2xl p-4 text-center neu-card">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-sport/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-sport" />
                  </div>
                  <div className="font-serif font-bold text-xl text-card-foreground">1,250+</div>
                  <div className="text-xs text-muted-foreground">Ehson qiluvchilar</div>
                </div>
                <div className="bg-card rounded-2xl p-4 text-center neu-card">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-sport/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-sport" />
                  </div>
                  <div className="font-serif font-bold text-xl text-card-foreground">50M+</div>
                  <div className="text-xs text-muted-foreground">Jami ehsonlar</div>
                </div>
                <div className="bg-card rounded-2xl p-4 text-center neu-card">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-sport/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-sport" />
                  </div>
                  <div className="font-serif font-bold text-xl text-card-foreground">320+</div>
                  <div className="text-xs text-muted-foreground">Qo&apos;llab-quvvatlangan</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function MonetizationPage() {
  return (
    <LanguageProvider>
      <MonetizationContent />
    </LanguageProvider>
  )
}
