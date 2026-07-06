"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IOSFilterPanel } from "@/components/ios/ios-filter-panel"
import { TrainerCard } from "@/components/features/trainer-card"
import { usersApi } from "@/lib/api/client"

// Hero backdrop photo. Swap this for a wide action/coaching shot if you have one —
// object-position is tuned to keep the subject visible on the right when cropped wide.
const HERO_BG_IMAGE = "/trainer1.jpg"

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

  // As the page scrolls, the fixed backdrop photo goes from sharp (hero) to softly blurred and
  // darkened (once filters/profiles are on screen), so it stops competing with those controls
  // but keeps the page feeling like one continuous surface all the way to the footer.
  const { scrollY } = useScroll()
  const bgBlurPx = useTransform(scrollY, [0, 480], [0, 22])
  const bgFilter = useTransform(bgBlurPx, (v) => `blur(${v}px)`)
  const overlayOpacity = useTransform(scrollY, [0, 480], [0.4, 0.68])

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

  // Top sports for the hero's quick-filter pills — a functional echo of the reference design's
  // top nav tabs, not decoration: clicking one actually drives the same sport filter below.
  const topSports = (filterGroups.find((g) => g.id === "sport")?.options || []).slice(0, 4)
  const toggleQuickSport = (value: string) => {
    const current = selectedFilters.sport || []
    const next = current.includes(value) ? current.filter((v) => v !== value) : [value]
    handleFilterChange("sport", next)
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
    <div className="relative min-h-screen">
      {/* Fixed, page-wide backdrop photo. It stays sharp at the very top (the hero moment),
          then blurs and darkens as the person scrolls into the filters/profile grid, and fades
          into a solid tone at the bottom so it settles into the footer instead of cutting off. */}
      <motion.div className="fixed inset-0 -z-20" style={{ filter: bgFilter }}>
        <img
          src={HERO_BG_IMAGE}
          alt=""
          className="w-full h-full object-cover object-[70%_20%]"
        />
      </motion.div>
      <div className="fixed inset-0 -z-20 bg-primary/55" />
      <motion.div className="fixed inset-0 -z-20 bg-primary" style={{ opacity: overlayOpacity }} />
      <div className="fixed inset-x-0 bottom-0 h-56 -z-20 bg-gradient-to-b from-transparent to-primary/85" />

      <Header />

      {/* Hero — short and to the point, so filters are already in view */}
      <section className="relative flex items-end min-h-[400px] pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              <span className="w-8 h-px bg-accent" />
              Murabbiylar reytingi
            </span>
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-primary-foreground leading-[1.02]">
              {t.nav.trainers}
            </h1>
            <p className="text-primary-foreground/75 mt-3 max-w-lg">
              Professional murabbiylarni toping va sport mahoratingizni oshiring
            </p>

            <div className="flex flex-wrap items-center gap-8 mt-6">
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary-foreground">{trainers.length}+</div>
                  <div className="text-primary-foreground/60 text-sm">Tasdiqlangan murabbiy</div>
                </div>
                <div className="w-px bg-primary-foreground/15" />
                <div>
                  <div className="text-3xl font-bold text-primary-foreground">
                    {(trainers.reduce((sum, tr) => sum + tr.rating, 0) / (trainers.length || 1)).toFixed(1)}
                  </div>
                  <div className="text-primary-foreground/60 text-sm">O'rtacha reyting</div>
                </div>
              </div>

              {/* Quick sport filters — a functional shortcut into the same filter panel below */}
              {topSports.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topSports.map((opt: any) => {
                    const active = (selectedFilters.sport || []).includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleQuickSport(opt.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          active
                            ? "bg-accent text-primary border-accent"
                            : "border-primary-foreground/25 text-primary-foreground/80 hover:border-primary-foreground/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-primary-foreground/50"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Main Content — filters and coach profiles stay in their own separate columns */}
      <section className="relative py-10">
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
                    <div className="w-12 h-12 rounded-full border-4 border-primary-foreground/20 border-t-primary-foreground animate-spin mx-auto mb-4"></div>
                    <p className="text-primary-foreground/70">Murabbiylar yuklanmoqda...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center p-6 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 font-semibold">Xato!</p>
                    <p className="text-primary-foreground/70 text-sm mt-2">{error}</p>
                  </div>
                </div>
              ) : filteredTrainers.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <p className="text-primary-foreground/70">Siz tanlagan filtrlarga mos murabbiylar topilmadi</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-primary-foreground/70">
                      <span className="font-semibold text-primary-foreground">{filteredTrainers.length}</span> murabbiy topildi
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
