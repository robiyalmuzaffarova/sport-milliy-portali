"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NewsCard } from "@/components/features/news-card"
import { Button } from "@/components/ui/button"
import { FloatingElement } from "@/components/common/floating-element"
import { newsApi } from "@/lib/api/client"
import { formatDateUzbekConsistent } from "@/lib/date-utils"

const newsCategories = ["Barchasi", "Yutuqlar", "Musobaqalar", "Yangiliklar", "Intervyu", "Sport salomatligi"]

const categoryMap: Record<string, string> = {
  "Yutuqlar": "ACHIEVEMENTS",
  "Musobaqalar": "COMPETITIONS",
  "Yangiliklar": "NEWS",
  "Intervyu": "INTERVIEW",
  "Sport salomatligi": "HEALTH",
}

// Dynamic Mock Data - Real news with dynamic information
const mockNews = [
  {
    id: "1",
    title: "Diyora Keldiyorova Osiyo chempionatida podium qazo qildi",
    excerpt: "O'zbekiston kurash federatsiyasi tanloviga kirgan yosh sportchi Osiyo o'yinlarida yutuq qozondi.",
    image: "/news2.jpg",
    date: "24 Fevral, 2026",
    category: "Yutuqlar",
  },
  {
    id: "2",
    title: "Toshkent shahrida sport texnologiyasi markazida yangi qismni ochariladi",
    excerpt: "500 dan ortiq yoshlar uchun talim dasturlari va sport dasturlari qoplanadigan markazing yangi qismi.",
    image: "/news.jpg",
    date: "22 Fevral, 2026",
    category: "Yangiliklar",
  },
  {
    id: "3",
    title: "Jahon kups kurash chempionatiga O'zbekiston delegatsiyasi tayyorlanmoqda",
    excerpt: "200 dan ortiq respublika milliy sportchilari selektor tomonidan jahon chempionatiga tayinlandi.",
    image: "/news3.jpg",
    date: "20 Fevral, 2026",
    category: "Musobaqalar",
  },
  {
    id: "4",
    title: "Firdavs Xasanov: Iqtidorli yoshlar respublikaning faxri",
    excerpt: "Boks bo'yicha jahon chempioni Firdavs Xasanov iqtidorli yoshlarning rivozatlanishi haqida holosa berdi.",
    image: "/news6.jpg",
    date: "18 Fevral, 2026",
    category: "Intervyu",
  },
  {
    id: "5",
    title: "Sport va sog'liq: Doktorlar nimaligini maslahat beradi",
    excerpt: "Tibbiyot olimlar aytdiki, kuniga 30 minut sport bilan shug'ullanish og'ir kasalliklardan himoya qiladi.",
    image: "/news4.jpg",
    date: "16 Fevral, 2026",
    category: "Sport salomatligi",
  },
  {
    id: "6",
    title: "Mavluda Abdullayeva xalqaro tennis turnirida g'olib chiqdi",
    excerpt: "24 yoshli tennis oyunchisi Samarqand qo'lningida xalqaro tanlovda yutuq qozondi.",
    image: "/news7.jpg",
    date: "14 Fevral, 2026",
    category: "Yutuqlar",
  },
  {
    id: "7",
    title: "O'zbekiston futbol ligasi yangi iyunida savoziyo o'yinlarni boshlamoqda",
    excerpt: "To'qqizta klub orasida mashhar turnir boshlanadi. Birinchi o'yinlar 1-mart kuni bo'lib o'tadi.",
    image: "/news1.jpg",
    date: "12 Fevral, 2026",
    category: "Musobaqalar",
  },
  {
    id: "8",
    title: "Paris-2024 Olimpiadasiga O'zbekiston delegatsiyasi konusultsiyasini tugatdi",
    excerpt: "Sportchilarimiz quyidagi yo'z-jami olimpik meqoniblari uchun tayyorlanmoqda yoki keltirilmoqda.",
    image: "/news5.jpg",
    date: "10 Fevral, 2026",
    category: "Yangiliklar",
  },
]

function NewsContent() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("Barchasi")
  const [isMounted, setIsMounted] = useState(false)
  const [news, setNews] = useState<any[]>(mockNews)
  const [isLoading, setIsLoading] = useState(false)

  // Ensure hydration matches by setting mounted flag first
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const response = await newsApi.getAll(0, 50)
        if (response.items && Array.isArray(response.items)) {
          // Transform API data to match NewsCard props
          const transformed = response.items.map((news: any) => ({
            id: String(news.id),
            title: news.title || "News Title",
            excerpt: news.description || news.content || "No description",
            image: news.image_url || news.image || "/placeholder.svg",
            date: news.created_at
              ? news.created_at.split("T")[0]
              : "2026-02-13",
            category: news.category || "Yangiliklar",
          }))
          setNews(transformed)
        } else {
          setNews(mockNews)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
        setNews(mockNews)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [isMounted])

  const filteredNews = activeCategory === "Barchasi"
  ? news
  : news.filter((n) => {
      const backendCategory = categoryMap[activeCategory]
      return n.category === backendCategory || n.category === activeCategory
    })
    
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sport mx-auto mb-4"></div>
                <p className="text-muted-foreground">Yuklanmoqda...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((newsItem, index) => (
                  <motion.div
                    key={newsItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <NewsCard {...newsItem} />
                  </motion.div>
                ))}
              </div>

              {filteredNews.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Bu kategoriyada yangiliklar topilmadi</p>
                </div>
              )}
            </>
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
