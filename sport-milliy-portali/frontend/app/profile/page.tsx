"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, MapPin, Calendar, Award, Trophy, Star, Settings, Edit, Camera, ChevronRight } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockUser = {
  id: "1",
  name: "Akmal Nurmatov",
  email: "akmal@example.com",
  phone: "+998 90 123 45 67",
  location: "Toshkent, O'zbekiston",
  joinDate: "Yanvar 2024",
  bio: "Professional kurash sportchisi. 10+ yillik tajriba. O'zbekiston milliy terma jamoasi a'zosi.",
  avatar: "/uzbek-male-wrestler-athlete-portrait.jpg",
  coverImage: "/uzbekistan-sports-stadium-atmospheric-foggy-dramat.jpg",
  sport: "Kurash",
  isVerified: true,
  stats: {
    followers: 2450,
    following: 156,
    achievements: 23,
  },
}

const mockAchievements = [
  { id: "1", title: "Osiyo o'yinlari - Oltin", year: "2024", icon: Trophy },
  { id: "2", title: "Jahon chempionati - Kumush", year: "2023", icon: Award },
  { id: "3", title: "O'zbekiston chempioni", year: "2023", icon: Star },
  { id: "4", title: "Yoshlar orasida chempion", year: "2022", icon: Award },
]

function ProfileContent() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <Image src={mockUser.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
        <button className="absolute top-24 right-4 p-2 rounded-xl glass text-white hover:bg-white/20">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-secondary shadow-xl">
              <Image src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} fill className="object-cover" />
            </div>
            {mockUser.isVerified && (
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
            <button className="absolute bottom-0 right-0 p-2 rounded-xl bg-card shadow-lg hover:bg-card/80">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif font-bold text-2xl md:text-3xl text-foreground">{mockUser.name}</h1>
                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-sport/10 text-sport text-sm font-medium">
                  {mockUser.sport}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl bg-card">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button className="bg-sport hover:bg-sport/90 text-white rounded-xl gap-2">
                  <Edit className="w-4 h-4" />
                  Tahrirlash
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mt-3 max-w-lg">{mockUser.bio}</p>

            {/* Quick Stats */}
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <div className="font-serif font-bold text-xl text-foreground">{mockUser.stats.followers}</div>
                <div className="text-xs text-muted-foreground">Kuzatuvchilar</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-xl text-foreground">{mockUser.stats.following}</div>
                <div className="text-xs text-muted-foreground">Kuzatilayotganlar</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-xl text-foreground">{mockUser.stats.achievements}</div>
                <div className="text-xs text-muted-foreground">Yutuqlar</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                className="bg-card rounded-3xl p-6 neu-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-serif font-bold text-lg text-card-foreground mb-4">Aloqa ma&apos;lumotlari</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-card-foreground">{mockUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefon</p>
                      <p className="text-card-foreground">{mockUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Manzil</p>
                      <p className="text-card-foreground">{mockUser.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Qo&apos;shilgan</p>
                      <p className="text-card-foreground">{mockUser.joinDate}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Recent Achievements */}
              <motion.div
                className="bg-card rounded-3xl p-6 neu-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-lg text-card-foreground">So&apos;nggi yutuqlar</h3>
                  <Button variant="ghost" size="sm" className="text-sport">
                    Barchasini ko&apos;rish
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
                  className="flex items-center gap-4 p-4 bg-card rounded-2xl neu-card"
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
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Image
                    src={`/uzbek-athlete-training-.jpg?height=300&width=300&query=uzbek athlete training ${i}`}
                    alt={`Gallery ${i}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <LanguageProvider>
      <ProfileContent />
    </LanguageProvider>
  )
}
