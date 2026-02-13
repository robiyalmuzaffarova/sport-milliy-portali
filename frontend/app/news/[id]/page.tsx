"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Eye, User, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { newsApi } from '@/lib/api/client'
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { FloatingElement } from "@/components/common/floating-element"
import { NewsCard } from "@/components/features/news-card"

const categoryMap: Record<string, string> = {
  "FOOTBALL": "Musobaqalar",
  "TENNIS": "Musobaqalar",
  "BASKETBALL": "Musobaqalar",
  "GENERAL": "Yangiliklar",
  "ACHIEVEMENTS": "Yutuqlar",
  "COMPETITIONS": "Musobaqalar",
  "NEWS": "Yangiliklar",
  "INTERVIEW": "Intervyu",
  "HEALTH": "Sport salomatligi",
  "BOXING": "Yutuqlar",
  "WRESTLING": "Musobaqalar",
  "SWIMMING": "Musobaqalar",
}

function NewsDetailContent() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const newsId = params.id as string

  const [news, setNews] = useState<any>(null)
  const [relatedNews, setRelatedNews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadNews() {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log("🔄 [NEWS DETAIL] Fetching news ID:", newsId)
        const data = await newsApi.getById(newsId)
        console.log("✅ [NEWS DETAIL] API Response:", data)
        
        setNews(data)

        // Load related news from same category
        try {
          const allNews = await newsApi.getAll(0, 12)
          const related = allNews.items
            .filter((item: any) => item.id !== parseInt(newsId) && item.category === data.category)
            .slice(0, 3)
            .map((n: any) => ({
              id: n.id.toString(),
              title: n.title,
              excerpt: n.snippet || (n.content ? n.content.substring(0, 120) + "..." : ""),
              image: n.image_url || "/uzbekistan-athletes-celebrating-victory-asian-game.jpg",
              date: new Date(n.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }),
              category: categoryMap[n.category] || "Yangiliklar",
            }))
          setRelatedNews(related)
        } catch (err) {
          console.warn("⚠️ [NEWS DETAIL] Failed to load related news:", err)
        }
      } catch (err: any) {
        console.error("❌ [NEWS DETAIL] Failed to load news:", err)
        setError(err.message || "Yangilikni yuklashda xatolik yuz berdi")
      } finally {
        setIsLoading(false)
      }
    }

    if (newsId) {
      loadNews()
    }
  }, [newsId])

  const normalizeImageUrl = (image: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
    const API_BASE = API_URL.replace(/\/api\/v1\/?$/i, '')
    
    let src = image || '/placeholder.svg'
    const isAbsolute = /^(https?:)?\/\//i.test(src) || src.startsWith('data:')
    if (!isAbsolute) {
      if (src.startsWith('/')) src = `${API_BASE}${src}`
      else src = `${API_BASE}/uploads/${src}`
    }
    return src
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-sport animate-spin mb-4" />
          <p className="text-muted-foreground text-lg">Yangilik yuklanmoqda...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Yangilik topilmadi</h1>
            <p className="text-muted-foreground mb-8">{error || "Kechirasiz, bu yangilikni topib bo'lmadi."}</p>
            <Button 
              onClick={() => router.push('/news')}
              className="bg-sport hover:bg-sport/90 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Yangiliklarga qaytish
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const displayCategory = categoryMap[news.category] || "Yangiliklar"
  const displayDate = new Date(news.created_at).toLocaleDateString('uz-UZ', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Back Button */}
      <section className="py-4 bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/news')}
            className="flex items-center gap-2 text-sport hover:text-sport/80 hover:bg-sport/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Yangiliklarga qaytish
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Hero Image */}
            {news.image_url && (
              <div className="relative aspect-video overflow-hidden rounded-2xl mb-8 shadow-lg">
                <Image
                  src={normalizeImageUrl(news.image_url)}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-sport text-white text-sm font-semibold shadow-lg">
                  {displayCategory}
                </span>
              </div>
            )}

            {/* Title & Meta */}
            <div className="mb-8">
              <h1 className="font-serif font-bold text-4xl md:text-5xl text-[#3F583F] mb-6 leading-tight">
                {news.title}
              </h1>

              {/* Metadata Bar */}
              <div className="flex flex-wrap gap-6 py-6 border-b border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-sport" />
                  <span>{displayDate}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-5 h-5 text-sport" />
                  <span>{news.views_count || 0} ko&apos;rishlar</span>
                </div>

                {/* Author */}
                {news.author && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-5 h-5 text-sport" />
                    <span>{news.author.full_name || news.author.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Article Snippet */}
            {news.snippet && (
              <div className="bg-sport/5 border-l-4 border-sport pl-6 py-4 mb-8 rounded-r-lg">
                <p className="text-lg text-[#3F583F] italic font-medium">{news.snippet}</p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-12">
              <div className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {news.content}
              </div>
            </div>

            {/* Author Card */}
            {news.author && (
              <div className="bg-card border border-border rounded-2xl p-8 mb-12">
                <div className="flex items-start gap-6">
                  {news.author.avatar_url && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={normalizeImageUrl(news.author.avatar_url)}
                        alt={news.author.full_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {news.author.full_name}
                    </h3>
                    <p className="text-sport font-medium capitalize mb-3">
                      {news.author.role === 'admin' ? 'Administrator' : news.author.role}
                    </p>
                    <p className="text-muted-foreground">
                      Sport Milliy Portali muharriri va sport tahlilchisi
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </article>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="py-16 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-12">
                Shunga o&apos;xshash yangiliklar
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <NewsCard {...item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default function NewsDetailPage() {
  return (
    <LanguageProvider>
      <NewsDetailContent />
    </LanguageProvider>
  )
}
