"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, MapPin, Calendar, Award, Trophy, Star, Settings, Edit, Camera, ChevronRight, Loader2, ArrowLeft, UserCheck, Medal, Users } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usersApi } from "@/lib/api/client"

// Fixed backdrop photo for this page — deliberately different from the news page's photo
const HERO_BG_IMAGE = "/runners.jpg"

function AthleteProfileContent() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const athleteId = params.id as string

  const [athlete, setAthlete] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // As the page scrolls, the fixed backdrop photo goes from sharp (header) to softly blurred
  // and darkened — same treatment as the news/trainers pages.
  const { scrollY } = useScroll()
  const bgBlurPx = useTransform(scrollY, [0, 480], [0, 22])
  const bgFilter = useTransform(bgBlurPx, (v) => `blur(${v}px)`)
  const overlayOpacity = useTransform(scrollY, [0, 480], [0.4, 0.68])

  useEffect(() => {
    async function loadAthlete() {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log("🔄 [ATHLETE PROFILE] Fetching athlete ID:", athleteId)
        const data = await usersApi.getById(athleteId)
        console.log("✅ [ATHLETE PROFILE] API Response:", data)
        
        setAthlete(data)
      } catch (err: any) {
        console.error("❌ [ATHLETE PROFILE] Failed to load athlete:", err)
        setError(err.message || "Sportchini yuklashda xatolik yuz berdi")
      } finally {
        setIsLoading(false)
      }
    }

    if (athleteId) {
      loadAthlete()
    }
  }, [athleteId])

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
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-20">
          <img src={HERO_BG_IMAGE} alt="" className="w-full h-full object-cover object-[50%_30%]" />
        </div>
        <div className="fixed inset-0 -z-20 bg-primary/70" />
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
          <p className="text-white/80 text-lg">Profil yuklanmoqda...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !athlete) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-20">
          <img src={HERO_BG_IMAGE} alt="" className="w-full h-full object-cover object-[50%_30%]" />
        </div>
        <div className="fixed inset-0 -z-20 bg-primary/70" />
        <Header />
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Profil topilmadi</h1>
            <p className="text-white/70 mb-8">{error || "Kechirasiz, bu sportchini topib bo'lmadi."}</p>
            <Button 
              onClick={() => router.push('/athletes')}
              className="bg-sport hover:bg-sport/90 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sportchilarga qaytish
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const joinDate = new Date(athlete.created_at).toLocaleDateString('uz-UZ', { 
    month: 'long', 
    year: 'numeric' 
  })

  const mockStats = {
    followers: 2450 + Math.floor(Math.random() * 1000),
    following: 156 + Math.floor(Math.random() * 100),
    achievements: athlete.achievements ? athlete.achievements.split(',').length : 0,
  }

  const mockAchievements = [
    { id: "1", title: "Reyting etuvchi sportchi", year: new Date().getFullYear().toString(), icon: Trophy },
    { id: "2", title: "Tekshirilgan profil", year: new Date().getFullYear().toString(), icon: Award },
    { id: "3", title: "Faol sportchi", year: new Date().getFullYear().toString(), icon: Star },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Fixed, page-wide backdrop photo. Sharp at the top, then blurs and darkens as the
          person scrolls into the tabs/content — same treatment as the news/trainers pages. */}
      <motion.div className="fixed inset-0 -z-20" style={{ filter: bgFilter }}>
        <img src={HERO_BG_IMAGE} alt="" className="w-full h-full object-cover object-[50%_30%]" />
      </motion.div>
      <div className="fixed inset-0 -z-20 bg-primary/55" />
      <motion.div className="fixed inset-0 -z-20 bg-primary" style={{ opacity: overlayOpacity }} />
      <div className="fixed inset-x-0 bottom-0 h-56 -z-20 bg-gradient-to-b from-transparent to-primary/85" />

      <Header />

      {/* Back Button — glass pill instead of its own separate photo banner */}
      <section className="relative pt-6 pb-2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/athletes')}
            className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 hover:text-white rounded-full px-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Sportchilarga qaytish
          </Button>
        </div>
      </section>

      {/* Profile Header — frosted glass card over the blurred backdrop */}
      <section className="relative pt-6 pb-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="ios-glass rounded-3xl p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden ring-4 ring-white/25 shadow-2xl shadow-black/40">
                  <Image
                    src={normalizeImageUrl(athlete.avatar_url || "")}
                    alt={athlete.full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                {athlete.is_verified && (
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-sport flex items-center justify-center ring-4 ring-white/20 shadow-lg">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between w-full gap-4">
                  <div>
                    <h1 className="font-serif font-bold text-2xl md:text-3xl text-white drop-shadow-sm">{athlete.full_name}</h1>
                    <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-sport/25 backdrop-blur-sm border border-white/10 text-white text-sm font-medium">
                      <Medal className="w-3.5 h-3.5" />
                      {athlete.sport_type || "Sport"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <p className="text-white/80 mt-3 max-w-lg">{athlete.bio || "Professional sportchi o'zbekiston milliy terma jamoasining a'zosi."}</p>

                {/* Quick Stats — glass pill cards instead of bare numbers */}
                <div className="flex flex-wrap gap-3 mt-5">
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                    <Users className="w-4 h-4 text-white" />
                    <div>
                      <div className="font-serif font-bold text-base text-white leading-none">{mockStats.followers}</div>
                      <div className="text-[11px] text-white/60">Kuzatuvchilar</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                    <UserCheck className="w-4 h-4 text-white" />
                    <div>
                      <div className="font-serif font-bold text-base text-white leading-none">{mockStats.following}</div>
                      <div className="text-[11px] text-white/60">Kuzatilayotganlar</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5">
                    <Trophy className="w-4 h-4 text-white" />
                    <div>
                      <div className="font-serif font-bold text-base text-white leading-none">{mockStats.achievements}</div>
                      <div className="text-[11px] text-white/60">Yutuqlar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card rounded-2xl p-1 h-auto flex-wrap justify-start">
              <TabsTrigger
                value="overview"
                className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white"
              >
                Umumiy
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white"
              >
                Yutuqlar
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white"
              >
                Galereya
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <motion.div
                  className="bg-card rounded-3xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="font-serif font-bold text-lg text-card-foreground mb-4">Aloqa ma'lumotlari</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-card-foreground">{athlete.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Telefon</p>
                        <p className="text-card-foreground">{athlete.phone || "Qo'shilmagan"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Manzil</p>
                        <p className="text-card-foreground">{athlete.location || "Ko'rsatilmagan"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Qo'shilgan</p>
                        <p className="text-card-foreground">{joinDate}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Recent Achievements */}
                <motion.div
                  className="bg-card rounded-3xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-lg text-card-foreground">So'nggi yutuqlar</h3>
                    <Button variant="ghost" size="sm" className="text-sport">
                      Barchasini ko'rish
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {mockAchievements.slice(0, 3).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sport/10 flex items-center justify-center text-sport">
                          <achievement.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground text-sm">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {mockAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 bg-card rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-sport/10 flex items-center justify-center text-sport">
                      <achievement.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-card-foreground">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.year}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-sport/20 to-sport/5 flex items-center justify-center">
                      <p className="text-muted-foreground">Rasm {i}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default function AthleteProfilePage() {
  return (
    <LanguageProvider>
      <AthleteProfileContent />
    </LanguageProvider>
  )
}
