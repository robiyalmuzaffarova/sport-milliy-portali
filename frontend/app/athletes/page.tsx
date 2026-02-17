"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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

const mockAthletes = [
  {
    id: "1",
    name: "Loading...",
    sport: "Sport",
    image: "/placeholder.svg",
    rating: 0,
    achievements: 0,
    location: "Location",
    isVerified: false,
    isTopWeek: false,
  },
]

const filterGroups = [
  {
    id: "sport",
    label: "Sport turi",
    type: "checkbox" as const,
    options: [
      { value: "kurash", label: "Kurash", count: 45 },
      { value: "boxing", label: "Boxing", count: 38 },
      { value: "tennis", label: "Tennis", count: 32 },
      { value: "football", label: "Football", count: 56 },
      { value: "gymnastics", label: "Gymnastics", count: 24 },
      { value: "swimming", label: "Swimming", count: 28 },
      { value: "judo", label: "Judo", count: 35 },
      { value: "athletics", label: "Athletics", count: 41 },
    ],
  },
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

  // Ensure hydration matches by setting mounted flag first
  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        } else {
          setAthletes(mockAthletes)
        }
      } catch (error) {
        console.error('Failed to fetch athletes:', error)
        setAthletes(mockAthletes)
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

    // Sport filter - match exact sport name
    if (selectedFilters.sport && selectedFilters.sport.length > 0) {
      const sportMatch = selectedFilters.sport.some(sport => {
        const athleteSportLower = athlete.sport.toLowerCase()
        const filterSportLower = sport.toLowerCase()
        return athleteSportLower === filterSportLower || athleteSportLower.includes(filterSportLower)
      })
      if (!sportMatch) return false
    }

    // Rating filter
    if (selectedFilters.rating && selectedFilters.rating.length > 0) {
      const ratingValue = selectedFilters.rating[0]
      const ratingThreshold = parseFloat(ratingValue)
      if (athlete.rating < ratingThreshold) return false
    }

    return true
  })

  return (
    <div className="min-h-screen bg-card" suppressHydrationWarning>
      <Header />

      {/* Hero Banner - iOS Style */}
      <section className="relative pt-28 pb-12 bg-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-sport" />
                <span className="text-sm font-medium text-sport">Eng yaxshilar</span>
              </div>
              <h1 className="font-bold text-4xl md:text-5xl text-primary tracking-tight">{t.nav.athletes}</h1>
              <p className="text-muted-foreground mt-3 max-w-xl">
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
                <p className="text-sm text-muted-foreground px-2">
                  <span className="font-semibold text-primary">{filteredAthletes.length}</span> sportchi topildi
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
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sport mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Yuklanmoqda...</p>
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
                        <p className="text-muted-foreground">Criteria ga mos sportchi topilmadi</p>
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
