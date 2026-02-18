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

function TrainersContent() {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGroups, setFilterGroups] = useState<any[]>(staticExperienceFilter)

  // Ensure hydration matches by setting mounted flag first
  useEffect(() => {
    setIsMounted(true)
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
    if (!isMounted) return

    const fetchTrainers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await usersApi.getTrainers(0, 100) // Fetch up to 100 trainers
        
        if (response.items && Array.isArray(response.items)) {
          // Transform backend data to match TrainerCard props
          const transformedTrainers: Trainer[] = response.items.map((user: any, index: number) => ({
            id: String(user.id),
            name: user.full_name || user.name || "Unknown Trainer",
            sport: user.sport_type || user.sport || "General Sport",
            image: user.avatar_url || user.image || "/placeholder.svg",
            rating: Number(user.rating) || (4.5 + (index % 5) * 0.1), // Use index for consistency
            experience: Number(user.years_experience) || Number(user.experience) || 8,
            location: user.location || "Unknown Location",
            students: Number(user.students_count) || (index % 10) * 25 + 50,
            isVerified: Boolean(user.is_verified),
            price: user.price || undefined,
          }))
          
          setTrainers(transformedTrainers)
          buildSportFilters(transformedTrainers)
        } else {
          throw new Error("Invalid response format from server")
        }
      } catch (err) {
        console.error("Error fetching trainers:", err)
        setError(err instanceof Error ? err.message : "Failed to load trainers")
        setTrainers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [isMounted])

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
