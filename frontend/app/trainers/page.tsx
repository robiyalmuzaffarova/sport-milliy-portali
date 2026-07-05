"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IOSFilterPanel } from "@/components/ios/ios-filter-panel"
import { TrainerCard } from "@/components/features/trainer-card"
import { FloatingElement } from "@/components/common/floating-element"
import { usersApi } from "@/lib/api/client"

interface Trainer {
  id: string
  name: string
  sport: string
  image: string
  rating: number
  experience: number
  location: string
  students: number
  isVerified: boolean
  price?: string
}

const staticExperienceFilter: any[] = [
  {
    id: "experience",
    label: "Tajriba",
    type: "radio" as const,
    options: [
      { value: "15", label: "15+ yil" },
      { value: "10", label: "10+ yil" },
      { value: "5", label: "5+ yil" },
    ],
  },
]

const mockTrainers: Trainer[] = [
  {
    id: "1",
    name: "Umidjon Odilov",
    sport: "Kurash",
    image: "/trainer1.jpg",
    rating: 4.9,
    experience: 22,
    location: "Toshkent",
    students: 48,
    isVerified: true,
    price: "550,000 so'm/oy",
  },
  {
    id: "2",
    name: "Otabek Mukhammadov",
    sport: "Boks",
    image: "/trainer2.jpeg",
    rating: 4.8,
    experience: 19,
    location: "Toshkent",
    students: 42,
    isVerified: true,
    price: "480,000 so'm/oy",
  },
  {
    id: "3",
    name: "Gulnora Yuldasheva",
    sport: "Tennis",
    image: "/trainer3.jpg",
    rating: 4.7,
    experience: 15,
    location: "Samarqand",
    students: 38,
    isVerified: true,
    price: "420,000 so'm/oy",
  },
  {
    id: "4",
    name: "Ekaterina Volkova",
    sport: "Gimnastika",
    image: "/trainer4.jpg",
    rating: 4.9,
    experience: 24,
    location: "Toshkent",
    students: 55,
    isVerified: true,
    price: "600,000 so'm/oy",
  },
  {
    id: "5",
    name: "Shavkat Karimov",
    sport: "Futbol",
    image: "/trainer5.jpg",
    rating: 4.6,
    experience: 17,
    location: "Farg'ona",
    students: 45,
    isVerified: true,
    price: "400,000 so'm/oy",
  },
  {
    id: "6",
    name: "Marina Sobolevskaya",
    sport: "Suzish",
    image: "/female1.jpg",
    rating: 4.8,
    experience: 20,
    location: "Toshkent",
    students: 40,
    isVerified: true,
    price: "450,000 so'm/oy",
  },
]

function TrainersContent() {
  const { t } = useLanguage()
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGroups, setFilterGroups] = useState<any[]>(staticExperienceFilter)

  // Initialize with mock data filters
  useEffect(() => {
    if (mockTrainers.length > 0) {
      buildSportFilters(mockTrainers)
    }
  }, [])

  // Build dynamic sport filter from trainers data
  const buildSportFilters = (trainersData: Trainer[]) => {
    // Extract unique sports and count occurrences
    const sportMap = new Map<string, number>()
    
    trainersData.forEach(trainer => {
      const sport = trainer.sport || "General Sport"
      sportMap.set(sport, (sportMap.get(sport) || 0) + 1)
    })

    // Sort by count descending
    const sortedSports = Array.from(sportMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([sport, count]) => ({
        value: sport.toLowerCase().replace(/\s+/g, "-"),
        label: sport,
        count: count,
      }))

    const dynamicFilters = [
      {
        id: "sport",
        label: "Sport turi",
        type: "checkbox" as const,
        options: sortedSports,
      },
      ...staticExperienceFilter,
    ]

    setFilterGroups(dynamicFilters)
  }

  // Fetch trainers from backend on component mount
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await usersApi.getTrainers(0, 100)
        
        if (response.items && Array.isArray(response.items) && response.items.length > 0) {
          const transformedTrainers: Trainer[] = response.items.map((user: any, index: number) => ({
            id: String(user.id),
            name: user.full_name || user.name || "Unknown Trainer",
            sport: user.sport_type || user.sport || "General Sport",
            image: user.avatar_url || user.image || "/placeholder.svg",
            rating: Number(user.rating) || (4.5 + (index % 5) * 0.1),
            experience: Number(user.years_experience) || Number(user.experience) || 8,
            location: user.location || "Unknown Location",
            students: Number(user.students_count) || (index % 10) * 25 + 50,
            isVerified: Boolean(user.is_verified),
            price: user.price || undefined,
          }))
          
          setTrainers(transformedTrainers)
          buildSportFilters(transformedTrainers)
        } else {
          // Use mock data as fallback
          setTrainers(mockTrainers)
          buildSportFilters(mockTrainers)
        }
      } catch (err) {
        console.error("Error fetching trainers:", err)
        // Use mock data as fallback - don't show error to user
        setTrainers(mockTrainers)
        buildSportFilters(mockTrainers)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  // Handle filter changes
  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }))
  }

  // Filtering logic
  const filteredTrainers = trainers.filter((trainer) => {
    // Search filter - match name or sport
    if (searchQuery && !trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !trainer.sport.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Sport filter - match sport by normalized comparison
    if (selectedFilters.sport && selectedFilters.sport.length > 0) {
      const trainerSportNormalized = trainer.sport.toLowerCase().replace(/\s+/g, "-")
      const sportMatch = selectedFilters.sport.some(sport => sport === trainerSportNormalized)
      if (!sportMatch) return false
    }

    // Experience filter - ensure experience is a number and compare
    if (selectedFilters.experience && selectedFilters.experience.length > 0) {
      const expValue = selectedFilters.experience[0]
      const expThreshold = parseInt(expValue)
      const trainerExp = Number(trainer.experience) || 0
      
      if (trainerExp < expThreshold) {
        return false
      }
    }

    return true
  })

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 bg-primary overflow-hidden">
        <FloatingElement className="top-20 left-[10%] opacity-20" delay={0}>
          <div className="w-28 h-28 rounded-full bg-accent/30" />
        </FloatingElement>
        <FloatingElement className="bottom-10 left-[25%] opacity-15" delay={1.5}>
          <div className="w-16 h-16 rounded-xl bg-sport/30 -rotate-12" />
        </FloatingElement>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground">{t.nav.trainers}</h1>
            <p className="text-primary-foreground/70 mt-3 max-w-xl">
              Professional murabbiylarni toping va sport mahoratingizni oshiring
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-28">
                <IOSFilterPanel
                  searchPlaceholder="Murabbiy qidirish..."
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterGroups={filterGroups}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={() => {
                    setSelectedFilters({})
                    setSearchQuery("")
                  }}
                />
              </div>
            </div>

            {/* Trainers Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Murabbiylar yuklanmoqda...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center p-6 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 font-semibold">Xato!</p>
                    <p className="text-muted-foreground text-sm mt-2">{error}</p>
                  </div>
                </div>
              ) : filteredTrainers.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <p className="text-muted-foreground">Siz tanlagan filtrlarga mos murabbiylar topilmadi</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{filteredTrainers.length}</span> murabbiy topildi
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {filteredTrainers.map((trainer, index) => (
                      <motion.div
                        key={trainer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <TrainerCard {...trainer} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function TrainersPage() {
  return (
    <LanguageProvider>
      <TrainersContent />
    </LanguageProvider>
  )
}
