"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Users,
  Newspaper,
  Briefcase,
  Heart,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Trophy,
  Play,
  Calendar,
  TrendingUp,
  Zap,
  MessageCircle,
} from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PillButton } from "@/components/ios/pill-button"
import { AvatarStack } from "@/components/ios/avatar-stack"
import { FloatingEventCard } from "@/components/ios/floating-event-card"
import { SubscriptionCard } from "@/components/ios/subscription-card"
import { BentoCard } from "@/components/ios/bento-card"
import { AthleteCard } from "@/components/features/athlete-card"
import { NewsCard } from "@/components/features/news-card"
import { usersApi, newsApi } from "@/lib/api/client"

// Mock data
const weekAthletes = [
  {
    id: "1",
    name: "Akmal Nurmatov",
    sport: "Kurash",
    image: "/kurash-wrestling-training-gym.jpg",
    rating: 4.9,
    achievements: 23,
    location: "Toshkent",
    isVerified: true,
    isTopWeek: true,
  },
  {
    id: "2",
    name: "Dilnoza Karimova",
    sport: "Tennis",
    image: "/athlete-face-2.jpg",
    rating: 4.8,
    achievements: 15,
    location: "Samarqand",
    isVerified: true,
    isTopWeek: false,
  },
  {
    id: "3",
    name: "Rustam Xoliqov",
    sport: "Boxing",
    image: "/athlete-face-3.jpg",
    rating: 4.7,
    achievements: 31,
    location: "Fargona",
    isVerified: true,
    isTopWeek: false,
  },
  {
    id: "4",
    name: "Malika Azimova",
    sport: "Gymnastics",
    image: "/athlete-avatar-.jpg",
    rating: 4.9,
    achievements: 28,
    location: "Buxoro",
    isVerified: true,
    isTopWeek: false,
  },
]

const latestNews = [
  {
    id: "1",
    title: "O'zbekiston terma jamoasi Osiyo o'yinlarida g'alaba qozondi",
    excerpt: "Bizning sportchilarimiz Osiyo o'yinlarida 15 ta oltin medal bilan tarixiy natija ko'rsatdi.",
    image: "/kurash-wrestling-championship-uzbekistan.jpg",
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
]

const participantAvatars = [
  { src: "/athlete-face-1.jpg", alt: "Participant 1" },
  { src: "/athlete-face-2.jpg", alt: "Participant 2" },
  { src: "/athlete-face-3.jpg", alt: "Participant 3" },
  { src: "/athlete-face-4.jpg", alt: "Participant 4" },
  { src: "/athlete-face-5.jpg", alt: "Participant 5" },
]

function HomeContent() {
  const { t } = useLanguage()
  const [weekAthletes, setWeekAthletes] = useState<any[]>([
    {
      id: "1",
      name: "Loading...",
      sport: "Sport",
      image: "/placeholder.svg",
      rating: 4.5,
      achievements: 0,
      location: "Location",
      isVerified: false,
      isTopWeek: false,
    },
  ])
  const [latestNews, setLatestNews] = useState<any[]>([
    {
      id: "1",
      title: "Loading...",
      excerpt: "Yangiliklar yuklanmoqda",
      image: "/placeholder.svg",
      date: new Date().toLocaleDateString("uz-UZ"),
      category: "Yangiliklar",
    },
  ])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fetchAthletes = async () => {
      try {
        const response = await usersApi.getAthletes(0, 4)
        const transformed = response.items.map((user: any) => ({
          id: String(user.id),
          name: user.full_name || user.name || "Unknown Athlete",
          sport: user.sport_type || user.sport || "General",
          image: user.avatar_url || user.image || "/placeholder.svg",
          rating: Number(user.rating) || 4.5,
          achievements: Number(user.achievements_count) || user.achievements || 0,
          location: user.location || "Unknown",
          isVerified: Boolean(user.is_verified),
          isTopWeek: Boolean(user.is_top_week),
        }))
        setWeekAthletes(transformed.length > 0 ? transformed : [])
      } catch (error) {
        console.error("Failed to fetch athletes:", error)
        // Keep the placeholder on error
      }
    }

    fetchAthletes()
  }, [isMounted])

  useEffect(() => {
    if (!isMounted) return

    const fetchNews = async () => {
      try {
        const response = await newsApi.getAll(0, 3)
        const transformed = response.items.map((news: any) => ({
          id: String(news.id),
          title: news.title || "News Title",
          excerpt: news.description || news.content || "No description",
          image: news.image_url || news.image || "/placeholder.svg",
          date: news.created_at
            ? new Date(news.created_at).toLocaleDateString("uz-UZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : new Date().toLocaleDateString("uz-UZ"),
          category: news.category || "Yangiliklar",
        }))
        setLatestNews(transformed.length > 0 ? transformed : [])
      } catch (error) {
        console.error("Failed to fetch news:", error)
        // Keep the placeholder on error
      }
    }

    fetchNews()
  }, [isMounted])

  return (
    <div className="min-h-screen bg-card">
      <Header />

      {/* Hero Section - Inspired by Street Basketball Reference */}
      <section className="relative min-h-screen pt-24 pb-16 overflow-hidden flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/basketball.jpg"
            alt="Hero Background"
            fill
            className="object-cover object-center opacity-60 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-card/10 to-card" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3c5a3c]/10 text-[#3c5a3c] text-sm font-medium backdrop-blur-sm border border-[#3c5a3c]/20">
                <Sparkles className="w-4 h-4" />
                Sport Jamiyati
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] flex flex-col items-center uppercase">
                <span className="text-primary">{t.hero.title1}</span>
                <span className="text-[#3c5a3c]">{t.hero.title2}</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/athletes">
                <PillButton
                  variant="filled"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="bg-[#3c5a3c] hover:bg-[#2d442d] text-white min-w-[200px]"
                >
                  {t.hero.cta1}
                </PillButton>
              </Link>
              <PillButton
                variant="outline"
                size="lg"
                className="min-w-[200px] backdrop-blur-sm bg-card/30 border-[#3c5a3c]/30 text-[#3c5a3c]"
              >
                {t.hero.cta2}
              </PillButton>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex items-center gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <AvatarStack avatars={participantAvatars} max={4} size="md" />
              <div className="text-sm">
                <span className="font-semibold text-primary text-base">2,450+</span>
                <span className="text-muted-foreground ml-1 text-base">sportchilar qo'shildi</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Signature */}
        <motion.div
          className="absolute bottom-8 right-8 hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
        >
          <svg width="80" height="40" viewBox="0 0 80 40" className="text-primary/40">
            <path d="M10 30 Q 20 10, 40 20 T 70 15" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>
      </section>

      {/* Bento Grid Section - Inspired by Tennis Club Reference */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">G'alaba boshlanadigan joy</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Barcha sport faoliyatlari uchun yagona platforma
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large Card - Court Rental Style */}
            <BentoCard
              title="Trening Maydonlari"
              description="Individual yoki guruh mashg'ulotlari uchun zamonaviy sport maydonlarini band qiling."
              icon={<Calendar className="w-6 h-6" />}
              href="/education"
              variant="default"
              size="lg"
              className="md:col-span-2 lg:col-span-1 lg:row-span-2"
            >
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Band qilish</span>
                  <span className="font-semibold text-sport">50,000 so'm/soat</span>
                </div>
                <PillButton variant="outline" size="sm" className="w-full mt-4">
                  Batafsil
                </PillButton>
              </div>
            </BentoCard>

            {/* Promo Card */}
            <BentoCard
              title="50% CHEGIRMA"
              description="Birinchi oy uchun maxsus taklif"
              variant="warm"
              size="md"
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm opacity-80">
                  <span>Amal qilish muddati:</span>
                  <span className="ml-2 font-semibold">28 Yanvar, 2026</span>
                </div>
                <PillButton size="sm" className="bg-white text-warm hover:bg-white/90">
                  Olish
                </PillButton>
              </div>
            </BentoCard>

            {/* Stats Card */}
            <div className="ios-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sport/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-sport" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Statistika</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-primary">2.4k+</div>
                  <div className="text-xs text-muted-foreground">Sportchilar</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">380</div>
                  <div className="text-xs text-muted-foreground">Murabbiylar</div>
                </div>
              </div>
            </div>

            {/* AI Buddy Card */}
            <BentoCard
              title="AI Sport Buddy"
              description="Sun'iy intellekt yordamida shaxsiy tavsiyalar"
              icon={<MessageCircle className="w-6 h-6" />}
              href="/ai-buddy"
              variant="sport"
              size="md"
            />

            {/* Quick Action Card */}
            <div className="ios-card p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Tezkor havolalar</h3>
                <Zap className="w-5 h-5 text-sport" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/athletes">
                  <div className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-sport" />
                    <span className="text-xs font-medium">Sportchilar</span>
                  </div>
                </Link>
                <Link href="/news">
                  <div className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                    <Newspaper className="w-5 h-5 mx-auto mb-1 text-sport" />
                    <span className="text-xs font-medium">Yangiliklar</span>
                  </div>
                </Link>
                <Link href="/job-vacancies">
                  <div className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                    <Briefcase className="w-5 h-5 mx-auto mb-1 text-sport" />
                    <span className="text-xs font-medium">Ish joylari</span>
                  </div>
                </Link>
                <Link href="/monetization">
                  <div className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-center">
                    <Heart className="w-5 h-5 mx-auto mb-1 text-sport" />
                    <span className="text-xs font-medium">Ehson</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section - Inspired by Tennis Club Pricing */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Obuna rejalari</h2>
            <p className="text-muted-foreground mt-2">O'zingizga mos rejani tanlang</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <SubscriptionCard
              title="Boshlang'ich"
              price="Bepul"
              period="oy"
              features={["Asosiy profil", "Sportchilarni ko'rish", "Yangiliklar"]}
              variant="sport"
            />
            <SubscriptionCard
              title="Professional"
              price="89,000"
              period="oy"
              features={["Premium profil", "AI tavsiyalar", "Guruh treninglari", "Cheksiz kirish", "Masterklasslar"]}
              recentJoiners={participantAvatars}
              joinerCount={26}
              popular={true}
            />
            <SubscriptionCard
              title="Murabbiy"
              price="149,000"
              period="oy"
              features={["Murabbiy profili", "Shogirdlar boshqaruvi", "Onlayn kurslar", "Daromad olish"]}
              variant="sport"
            />
          </div>
        </div>
      </section>

      {/* Week's Athletes */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-sport" />
                <span className="text-sm font-medium text-sport">Eng yaxshilar</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{t.sections.weekAthletes}</h2>
            </div>
            <Link href="/athletes">
              <PillButton variant="outline" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                {t.sections.viewAll}
              </PillButton>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weekAthletes.map((athlete, index) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AthleteCard {...athlete} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{t.sections.latestNews}</h2>
              <p className="text-muted-foreground mt-1">Sport olamidan so'nggi yangiliklar</p>
            </div>
            <Link href="/news">
              <PillButton variant="outline" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                {t.sections.viewAll}
              </PillButton>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <NewsCard {...news} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Premium Feel */}
      <section id="about" className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-sport" />
                <span className="text-sport font-medium">Biz haqimizda</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                O'zbekiston sportining kelajagi bu yerda boshlanadi
              </h2>

              <p className="text-primary-foreground/70 leading-relaxed mb-6">
                Sport Milliy Portali - O'zbekistonning milliy sport portali bo'lib, murabbiylar va sportchilar uchun
                ochiq raqamli portfolio tizimini taqdim etadi. Bizning maqsadimiz - yopiq davlat ma'lumotlar bazalari
                muammosini hal qilish va iste'dodli shaxslarni ko'rinishini ta'minlash.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sport/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-sport" />
                  </div>
                  <h4 className="font-semibold">Maqsad</h4>
                  <p className="text-sm text-primary-foreground/60 mt-1">Sport rivojlanishi</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sport/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-sport" />
                  </div>
                  <h4 className="font-semibold">Jamiyat</h4>
                  <p className="text-sm text-primary-foreground/60 mt-1">Birlashgan sportchilar</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sport/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-sport" />
                  </div>
                  <h4 className="font-semibold">Sifat</h4>
                  <p className="text-sm text-primary-foreground/60 mt-1">Yuqori standartlar</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="/uzbekistan-sports-team-athletes-training-modern-st.jpg"
                  alt="Sport Milliy Portali About"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 ios-card p-5 rounded-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-sport flex items-center justify-center text-white">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">150+</div>
                    <div className="text-sm text-muted-foreground">Xalqaro yutuqlar</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  )
}
