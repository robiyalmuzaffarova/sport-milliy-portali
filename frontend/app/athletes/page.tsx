"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { LayoutGrid, List, Trophy, TrendingUp } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IOSFilterPanel } from "@/components/ios/ios-filter-panel"
import { AthleteCard } from "@/components/features/athlete-card"
import { SegmentedControl } from "@/components/ios/segmented-control"
import { AvatarStack } from "@/components/ios/avatar-stack"
import { PillButton } from "@/components/ios/pill-button"
import { usersApi } from "@/lib/api/client"

// Hero backdrop photo — swap this if you replace the Getty-watermarked image.
const HERO_BG_IMAGE = "/sportsmen.png"

// Dynamic Mock Data - Real athlete information structure
const mockAthletes = [
  {
    id: "1",
    name: "Diyora Keldiyorova",
    sport: "Kurash",
    image: "/female1.jpg",
    rating: 4.9,
    achievements: 27,
    location: "Toshkent",
    isVerified: true,
    isTopWeek: true,
  },
  {
    id: "2",
    name: "Mavluda Abdullayeva",
    sport: "Tennis",
    image: "/female.jpg",
    rating: 4.8,
    achievements: 22,
    location: "Samarqand",
    isVerified: true,
    isTopWeek: true,
  },
  {
    id: "3",
    name: "Firdavs Xasanov",
    sport: "Boks",
    image: "/male1.jpg",
    rating: 4.9,
    achievements: 35,
    location: "Toshkent",
    isVerified: true,
    isTopWeek: false,
  },
  {
    id: "4",
    name: "Irina Sobolevskaya",
    sport: "Gimnastika",
    image: "/female3.jpg",
    rating: 4.7,
    achievements: 32,
    location: "Andijon",
    isVerified: true,
    isTopWeek: true,
  },
  {
    id: "5",
    name: "Oybek Rahmatulloyev",
    sport: "Futbol",
    image: "/male2.jpg",
    rating: 4.6,
    achievements: 18,
    location: "Farg'ona",
    isVerified: true,
    isTopWeek: false,
  },
  {
    id: "6",
    name: "Nozima Qo'ziyeva",
    sport: "Suzish",
    image: "/female4.jpg",
    rating: 4.8,
    achievements: 24,
    location: "Toshkent",
    isVerified: true,
    isTopWeek: false,
  },
  {
    id: "7",
    name: "Komil Davronov",
    sport: "Kelosimas",
    image: "/male2.png",
    rating: 4.7,
    achievements: 20,
    location: "Bukhoro",
    isVerified: true,
    isTopWeek: false,
  },
  {
    id: "8",
    name: "Yulduz Shodmonova",
    sport: "Atletika",
    image: "/female2.jpg",
    rating: 4.8,
    achievements: 19,
    location: "Qashqadarya",
    isVerified: true,
    isTopWeek: true,
  },
]

const staticRatingFilter: any[] = [
  {
    id: "rating",
    label: "Reyting",
    type: "radio" as const,
    options: [
      { value: "4.5", label: "4.5 va yuqori" },
      { value: "4.0", label: "4.0 va yuqori" },
      { value: "3.5", label: "3.5 va yuqori" },
    ],
  },
]

const topAvatars = [
  { src: "/athlete-face-1.jpg", alt: "Top 1" },
  { src: "/athlete-face-2.jpg", alt: "Top 2" },
  { src: "/athlete-face-3.jpg", alt: "Top 3" },
  { src: "/athlete-face-4.jpg", alt: "Top 4" },
]

function AthletesContent() {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [athletes, setAthletes] = useState<any[]>(mockAthletes)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [filterGroups, setFilterGroups] = useState<any[]>(staticRatingFilter)

  // As the page scrolls, the fixed backdrop photo goes from sharp (hero) to softly blurred
  // and darkened, so it stops competing with the filters/athlete grid but keeps the page
  // feeling like one continuous surface all the way to the footer.
  const { scrollY } = useScroll()
  const bgBlurPx = useTransform(scrollY, [0, 480], [0, 22])
  const bgFilter = useTransform(bgBlurPx, (v) => `blur(${v}px)`)
  const overlayOpacity = useTransform(scrollY, [0, 480], [0.4, 0.68])

  // Ensure hydration matches by setting mounted flag first
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Build dynamic sport filter from athletes data
  const buildSportFilters = (athletesData: any[]) => {
    // Extract unique sports and count occurrences
    const sportMap = new Map<string, number>()
    
    athletesData.forEach(athlete => {
      const sport = athlete.sport || "General"
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
      ...staticRatingFilter,
    ]

    setFilterGroups(dynamicFilters)
  }

  useEffect(() => {
    if (!isMounted) return

    const fetchAthletes = async () => {
      try {
        setIsLoading(true)
        const response = await usersApi.getAthletes(0, 50)
        if (response.items && Array.isArray(response.items)) {
          // Transform API response to match AthleteCard props
          const transformedAthletes = response.items.map((user: any) => ({
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
          setAthletes(transformedAthletes)
          buildSportFilters(transformedAthletes)
        } else {
          setAthletes(mockAthletes)
          buildSportFilters(mockAthletes)
        }
      } catch (error) {
        console.error('Failed to fetch athletes:', error)
        setAthletes(mockAthletes)
        buildSportFilters(mockAthletes)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAthletes()
  }, [isMounted])

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    setSearchQuery("")
  }

  // Filtering logic
  const filteredAthletes = athletes.filter((athlete) => {
    // Search filter - match name or sport
    if (searchQuery && !athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !athlete.sport.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Sport filter - match sport by normalized comparison
    if (selectedFilters.sport && selectedFilters.sport.length > 0) {
      const athleteSportNormalized = athlete.sport.toLowerCase().replace(/\s+/g, "-")
      const sportMatch = selectedFilters.sport.some(sport => sport === athleteSportNormalized)
      if (!sportMatch) return false
    }

    // Rating filter - ensure rating is a number and compare
    if (selectedFilters.rating && selectedFilters.rating.length > 0) {
      const ratingValue = selectedFilters.rating[0]
      const ratingThreshold = parseFloat(ratingValue)
      const athleteRating = Number(athlete.rating) || 0
      
      if (athleteRating < ratingThreshold) {
        return false
      }
    }

    return true
  })

  return (
    <div className="relative min-h-screen" suppressHydrationWarning>
      {/* Fixed, page-wide backdrop photo. Sharp at the top (hero), then blurs and darkens
          as the person scrolls into the filters/athlete grid, fading into a solid tone at
          the bottom so it settles into the footer instead of cutting off. */}
      <motion.div className="fixed inset-0 -z-20" style={{ filter: bgFilter }}>
        <img src={HERO_BG_IMAGE} alt="" className="w-full h-full object-cover object-[50%_20%]" />
      </motion.div>
      <div className="fixed inset-0 -z-20 bg-primary/55" />
      <motion.div className="fixed inset-0 -z-20 bg-primary" style={{ opacity: overlayOpacity }} />
      <div className="fixed inset-x-0 bottom-0 h-56 -z-20 bg-gradient-to-b from-transparent to-primary/85" />

      <Header />

      {/* Hero Banner */}
      <section 
        className="relative pt-28 pb-12 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">Eng yaxshilar</span>
              </div>
              <h1 className="font-bold text-4xl md:text-5xl text-primary-foreground tracking-tight">{t.nav.athletes}</h1>
              <p className="text-primary-foreground/70 mt-3 max-w-xl">
                O'zbekistonning eng yaxshi sportchilarini toping va ularning yutuqlari bilan tanishing
              </p>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="ios-card p-5 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4">
                <AvatarStack avatars={topAvatars} max={4} size="md" showCount={false} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-sport" />
                    <span className="text-2xl font-bold text-primary">2,450+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ro'yxatdan o'tgan sportchilar</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-28">
                <IOSFilterPanel
                  searchPlaceholder={t.filters.search}
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterGroups={filterGroups}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <PillButton
                variant="outline"
                className="w-full justify-center"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              >
                Filtrlar
                {Object.values(selectedFilters).flat().length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-sport text-white text-xs">
                    {Object.values(selectedFilters).flat().length}
                  </span>
                )}
              </PillButton>

              {mobileFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <IOSFilterPanel
                    searchPlaceholder={t.filters.search}
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterGroups={filterGroups}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                  />
                </motion.div>
              )}
            </div>

            {/* Athletes Grid */}
            <div className="flex-1">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6 ios-glass p-3 rounded-2xl">
                <p className="text-sm text-primary-foreground/80 px-2">
                  <span className="font-semibold text-primary-foreground">{filteredAthletes.length}</span> sportchi topildi
                </p>

                <SegmentedControl
                  options={[
                    { value: "grid", label: "", icon: <LayoutGrid className="w-4 h-4" /> },
                    { value: "list", label: "", icon: <List className="w-4 h-4" /> },
                  ]}
                  value={viewMode}
                  onChange={setViewMode}
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent mx-auto mb-4"></div>
                    <p className="text-primary-foreground/70">Yuklanmoqda...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Grid */}
                  <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
                    {filteredAthletes.length > 0 ? (
                      filteredAthletes.map((athlete, index) => (
                        <motion.div
                          key={athlete.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <AthleteCard {...athlete} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-primary-foreground/70">Criteria ga mos sportchi topilmadi</p>
                      </div>
                    )}
                  </div>

                  {/* Load More */}
                  <div className="mt-10 text-center">
                    <PillButton variant="outline" size="lg">
                      Ko'proq ko'rsatish
                    </PillButton>
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

export default function AthletesPage() {
  return (
    <LanguageProvider>
      <AthletesContent />
    </LanguageProvider>
  )
}
