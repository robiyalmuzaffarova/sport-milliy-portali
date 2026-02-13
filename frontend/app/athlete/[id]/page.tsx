"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, MapPin, Calendar, Award, Trophy, Star, Settings, Edit, Camera, ChevronRight, Loader2, ArrowLeft } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usersApi } from "@/lib/api/client"

function AthleteProfileContent() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const athleteId = params.id as string

  const [athlete, setAthlete] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

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
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-sport animate-spin mb-4" />
          <p className="text-muted-foreground text-lg">Profil yuklanmoqda...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Profil topilmadi</h1>
            <p className="text-muted-foreground mb-8">{error || "Kechirasiz, bu sportchini topib bo'lmadi."}</p>
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
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Back Button */}
      <section className="py-4 bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/athletes')}
            className="flex items-center gap-2 text-sport hover:text-sport/80 hover:bg-sport/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Sportchilarga qaytish
          </Button>
        </div>
      </section>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image 
          src="/sport1.png" 
          alt="Cover" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-secondary shadow-xl">
                <Image 
                  src={normalizeImageUrl(athlete.avatar_url || "")} 
                  alt={athlete.full_name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              {athlete.is_verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-sport flex items-center justify-center border-4 border-secondary">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between w-full">
                <div>
                  <h1 className="font-serif font-bold text-2xl md:text-3xl text-foreground">{athlete.full_name}</h1>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-sport/10 text-sport text-sm font-medium">
                    {athlete.sport_type || "Sport"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-xl bg-card">
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mt-3 max-w-lg">{athlete.bio || "Professional sportchi o'zbekiston milliy terma jamoasining a'zosi."}</p>

              {/* Quick Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <div className="font-serif font-bold text-xl text-foreground">{mockStats.followers}</div>
                  <div className="text-xs text-muted-foreground">Kuzatuvchilar</div>
                </div>
                <div className="text-center">
                  <div className="font-serif font-bold text-xl text-foreground">{mockStats.following}</div>
                  <div className="text-xs text-muted-foreground">Kuzatilayotganlar</div>
                </div>
                <div className="text-center">
                  <div className="font-serif font-bold text-xl text-foreground">{mockStats.achievements}</div>
                  <div className="text-xs text-muted-foreground">Yutuqlar</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
