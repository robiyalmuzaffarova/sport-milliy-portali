"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsCard } from "@/components/features/news-card"
import { Button } from "@/components/ui/button"
import { FloatingElement } from "@/components/common/floating-element"

const newsCategories = ["Barchasi", "Yutuqlar", "Musobaqalar", "Yangiliklar", "Intervyu", "Sport salomatligi"]

const mockNews = [
  {
    id: "1",
    title: "O'zbekiston terma jamoasi Osiyo o'yinlarida g'alaba qozondi",
    excerpt: "Bizning sportchilarimiz Osiyo o'yinlarida 15 ta oltin medal bilan tarixiy natija ko'rsatdi.",
    image: "/uzbekistan-athletes-celebrating-victory-asian-game.jpg",
    date: "15 Yanvar, 2026",
    category: "Yutuqlar",
  },
  {
    id: "2",
    title: "Yangi sport akademiyasi ochildi",
    excerpt: "Toshkent shahrida zamonaviy sport akademiyasi o'z eshiklarini ochdi.",
    image: "/modern-sports-academy-building-tashkent.jpg",
    date: "12 Yanvar, 2026",
    category: "Yangiliklar",
  },
  {
    id: "3",
    title: "Kurash bo'yicha jahon chempionati boshlandi",
    excerpt: "O'zbekiston milliy sport turi bo'yicha jahon chempionati o'tkazilmoqda.",
    image: "/kurash-wrestling-championship-uzbekistan.jpg",
    date: "10 Yanvar, 2026",
    category: "Musobaqalar",
  },
  {
    id: "4",
    title: "Boks bo'yicha yangi chempion paydo bo'ldi",
    excerpt: "Rustam Xoliqov jahon chempionatida oltin medal qo'lga kiritdi.",
    image: "/uzbek-boxer-champion-medal-ceremony.jpg",
    date: "8 Yanvar, 2026",
    category: "Yutuqlar",
  },
  {
    id: "5",
    title: "Sport va sog'lom turmush tarzi",
    excerpt: "Mutaxassislar sport bilan shug'ullanishning foydali tomonlarini tushuntiradi.",
    image: "/sports-healthy-lifestyle-uzbekistan.jpg",
    date: "5 Yanvar, 2026",
    category: "Sport salomatligi",
  },
  {
    id: "6",
    title: "Tennis bo'yicha yangi iste'dod",
    excerpt: "16 yoshli Dilnoza xalqaro turnirda g'olib chiqdi.",
    image: "/young-tennis-talent-uzbekistan.jpg",
    date: "3 Yanvar, 2026",
    category: "Yutuqlar",
  },
  {
    id: "7",
    title: "Futbol ligasi yangi mavsumga tayyorlanmoqda",
    excerpt: "O'zbekiston futbol ligasi yangi mavsumga start beradi.",
    image: "/uzbekistan-football-league-new-season.jpg",
    date: "1 Yanvar, 2026",
    category: "Musobaqalar",
  },
  {
    id: "8",
    title: "Olimpiya o'yinlariga tayyorgarlik davom etmoqda",
    excerpt: "Sportchilarimiz 2028 Los-Anjeles Olimpiadasiga tayyorlanmoqda.",
    image: "/uzbekistan-olympic-preparation-training.jpg",
    date: "28 Dekabr, 2025",
    category: "Yangiliklar",
  },
]

function NewsContent() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("Barchasi")

  const filteredNews = activeCategory === "Barchasi" ? mockNews : mockNews.filter((n) => n.category === activeCategory)

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 bg-primary overflow-hidden">
        <FloatingElement className="top-16 left-[10%] opacity-20" delay={0}>
          <div className="w-24 h-24 rounded-full bg-sport/30" />
        </FloatingElement>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground">{t.nav.news}</h1>
            <p className="text-primary-foreground/70 mt-3 max-w-xl">
              Sport olamidan eng so&apos;nggi yangiliklar va voqealar
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {newsCategories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                className={`rounded-full whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-sport hover:bg-sport/90 text-white"
                    : "border-border bg-transparent hover:bg-secondary"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NewsCard {...news} />
              </motion.div>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Bu kategoriyada yangiliklar topilmadi</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function NewsPage() {
  return (
    <LanguageProvider>
      <NewsContent />
    </LanguageProvider>
  )
}
