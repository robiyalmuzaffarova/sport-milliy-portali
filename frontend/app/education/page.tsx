"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IOSFilterPanel } from "@/components/ios/ios-filter-panel"
import { EducationCard } from "@/components/features/education-card"
import { FloatingElement } from "@/components/common/floating-element"
import { educationApi } from "@/lib/api/client"

// Mock education data as fallback
const mockEducationData = [
  {
    id: "1",
    name: "O'zbekiston Kurash Akademiyasi",
    type: "academy",
    description: "Professional kurash o'qitish markazi",
    image: "/placeholder.svg",
    location: "TASHKENT CITY",
    address: "Tashkent, Yunusabad tumani",
    workingHours: "08:00 - 20:00",
    phone: "+998901234567",
    rating: 4.8,
    mapsLink: "https://maps.google.com",
  },
  {
    id: "2",
    name: "O'zbekiston Teniss Federatsiyasi",
    type: "federation",
    description: "Milliy teniss federatsiyasi",
    image: "/placeholder.svg",
    location: "TASHKENT CITY",
    address: "Tashkent, M.Ulug'bek tumani",
    workingHours: "09:00 - 18:00",
    phone: "+998901234568",
    rating: 4.6,
    mapsLink: "https://maps.google.com",
  },
]

function EducationContent() {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [filterGroups, setFilterGroups] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [allEducation, setAllEducation] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Transform backend response to match EducationCard props
  const transformEducationData = (backendData: any) => {
    return {
      id: backendData.id?.toString() || "",
      name: backendData.name || "",
      type: backendData.type || "academy",
      description: backendData.description || "",
      image: backendData.image_url || "/placeholder.svg",
      location: backendData.region?.replace("_", " ").toUpperCase() || "Unknown",
      address: backendData.address || "Not specified",
      workingHours: backendData.working_hours || "Not available",
      phone: backendData.phone || "Not available",
      rating: backendData.rating || 0,
      mapsLink: backendData.maps_link || "https://maps.google.com",
    }
  }

  // Ensure hydration matches by setting mounted flag first
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Build dynamic filters from education data
  const buildDynamicFilters = (educationData: any[]) => {
    // Extract unique types and count occurrences
    const typeMap = new Map<string, number>()
    const regionMap = new Map<string, number>()
    
    educationData.forEach(edu => {
      const type = edu.type || "academy"
      typeMap.set(type, (typeMap.get(type) || 0) + 1)
      
      const region = edu.location || "Unknown"
      regionMap.set(region, (regionMap.get(region) || 0) + 1)
    })

    // Type mapping for labels
    const typeLabels: Record<string, string> = {
      "academy": "Akademiya",
      "federation": "Federatsiya",
      "school": "Maktab",
      "club": "Club",
    }

    // Region mapping for labels
    const regionLabels: Record<string, string> = {
      "TASHKENT CITY": "Toshkent",
      "SAMARKAND": "Samarqand",
      "FERGANA": "Farg'ona",
      "BUKHARA": "Buxoro",
      "ANDIJAN": "Andijon",
      "NAMANGAN": "Namangan",
      "KASHKADARYA": "Qashqadarya",
      "KHOREZM": "Xorezm",
    }

    // Sort types by count
    const sortedTypes = Array.from(typeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        value: type.toLowerCase(),
        label: typeLabels[type] || type,
        count: count,
      }))

    // Sort regions by count
    const sortedRegions = Array.from(regionMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([region, count]) => ({
        value: region.toLowerCase().replace(/\s+/g, "-"),
        label: regionLabels[region] || region,
        count: count,
      }))

    const dynamicFilters = [
      {
        id: "type",
        label: "Turi",
        type: "checkbox" as const,
        options: sortedTypes.length > 0 ? sortedTypes : [
          { value: "academy", label: "Akademiya", count: 0 },
          { value: "federation", label: "Federatsiya", count: 0 },
          { value: "school", label: "Maktab", count: 0 },
          { value: "club", label: "Club", count: 0 },
        ],
      },
      {
        id: "region",
        label: "Viloyat",
        type: "checkbox" as const,
        options: sortedRegions.length > 0 ? sortedRegions : [
          { value: "tashkent-city", label: "Toshkent", count: 0 },
          { value: "samarkand", label: "Samarqand", count: 0 },
          { value: "fergana", label: "Farg'ona", count: 0 },
          { value: "bukhara", label: "Buxoro", count: 0 },
        ],
      },
    ]

    setFilterGroups(dynamicFilters)
  }

  // Fetch all education data on component mount
  const fetchEducationData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all education data - simple call without complex filtering
      const response = await educationApi.getAll(0, 200)

      if (response && response.items && Array.isArray(response.items) && response.items.length > 0) {
        const transformedData = response.items.map(transformEducationData)
        setAllEducation(transformedData)
        setEducation(transformedData)
        setTotalCount(response.total || transformedData.length)
        buildDynamicFilters(transformedData)
      } else {
        // Use mock data if API returns empty
        console.warn("No education data from API, using mock data")
        setAllEducation(mockEducationData)
        setEducation(mockEducationData)
        setTotalCount(mockEducationData.length)
        buildDynamicFilters(mockEducationData)
      }
    } catch (err: any) {
      console.error("Error fetching education data:", err)
      const errorMessage = err?.message || "Failed to fetch education data"
      console.warn("Using mock education data as fallback")
      
      // Use mock data as fallback on error
      setAllEducation(mockEducationData)
      setEducation(mockEducationData)
      setTotalCount(mockEducationData.length)
      buildDynamicFilters(mockEducationData)
      setError(null) // Don't show error if we have fallback data
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    if (!isMounted) return
    fetchEducationData()
  }, [isMounted])

  // Apply filters to education data
  useEffect(() => {
    let filtered = allEducation

    // Search filter - match name or description
    if (searchQuery) {
      filtered = filtered.filter((edu) =>
        edu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type filter - match type
    if (selectedFilters.type && selectedFilters.type.length > 0) {
      filtered = filtered.filter((edu) =>
        selectedFilters.type.some(type => type === edu.type.toLowerCase())
      )
    }

    // Region filter - match location with flexible string comparison
    if (selectedFilters.region && selectedFilters.region.length > 0) {
      filtered = filtered.filter((edu) => {
        const eduLocationLower = edu.location.toLowerCase().replace(/\s+/g, "-")
        return selectedFilters.region.some(region => {
          const regionLower = region.toLowerCase().replace(/\s+/g, "-")
          return eduLocationLower === regionLower || eduLocationLower.includes(regionLower) || regionLower.includes(eduLocationLower)
        })
      })
    }

    setEducation(filtered)
  }, [selectedFilters, searchQuery, allEducation])

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }))
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 bg-primary overflow-hidden">
        <FloatingElement className="top-20 right-[10%] opacity-20" delay={0}>
          <div className="w-28 h-28 rounded-2xl bg-accent/30 rotate-6" />
        </FloatingElement>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground">{t.nav.education}</h1>
            <p className="text-primary-foreground/70 mt-3 max-w-xl">
              Sport akademiyalari va federatsiyalarini toping, professional ta&apos;lim oling
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
                  searchPlaceholder="Akademiya qidirish..."
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

            {/* Education Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                {isLoading ? (
                  <p className="text-muted-foreground">
                    <span className="inline-block w-16 h-5 bg-muted rounded animate-pulse"></span>
                  </p>
                ) : error ? (
                  <p className="text-amber-600 font-medium text-sm">
                    ⚠️ Akademiyalar ehtiyot ma'lumotlari bilan ko'rsatilmoqda
                  </p>
                ) : education.length === 0 ? (
                  <p className="text-muted-foreground">
                    Akademiya topilmadi
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{education.length}</span> muassasa topildi
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="group bg-card rounded-3xl overflow-hidden h-96 animate-pulse"
                    >
                      <div className="w-full h-1/2 bg-muted"></div>
                      <div className="p-5 space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))
                ) : education.length > 0 ? (
                  education.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <EducationCard {...item} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Hech qanday muassasa topilmadi
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function EducationPage() {
  return (
    <LanguageProvider>
      <EducationContent />
    </LanguageProvider>
  )
}
