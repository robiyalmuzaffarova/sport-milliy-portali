"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FilterPanel } from "@/components/common/filter-panel"
import { EducationCard } from "@/components/features/education-card"
import { FloatingElement } from "@/components/common/floating-element"
import { educationApi } from "@/lib/api/client"

const filterGroups = [
  {
    id: "type",
    label: "Turi",
    type: "checkbox" as const,
    options: [
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
    options: [
      { value: "tashkent", label: "Toshkent", count: 0 },
      { value: "samarkand", label: "Samarqand", count: 0 },
      { value: "fergana", label: "Farg'ona", count: 0 },
      { value: "bukhara", label: "Buxoro", count: 0 },
      { value: "andijan", label: "Andijon", count: 0 },
      { value: "namangan", label: "Namangan", count: 0 },
      { value: "kashkadarya", label: "Qashqadarya", count: 0 },
      { value: "khorezm", label: "Xorezm", count: 0 },
    ],
  },
]

function EducationContent() {
  const { t } = useLanguage()
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [education, setEducation] = useState<any[]>([])
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

  // Fetch education data from backend
  const fetchEducationData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Build query parameters based on selected filters
      const selectedType = selectedFilters.type?.[0]
      const selectedRegion = selectedFilters.region?.[0]

      // Map frontend region filter to backend region enum
      const regionMap: Record<string, string> = {
        "tashkent": "tashkent city",
        "samarkand": "samarkand",
        "fergana": "fergana",
        "bukhara": "bukhara",
      }

      const response = await educationApi.getAll(
        0,
        50,
        selectedRegion ? regionMap[selectedRegion] || selectedRegion : undefined,
        selectedType,
        searchQuery
      )

      if (response && response.items) {
        const transformedData = response.items.map(transformEducationData)
        setEducation(transformedData)
        setTotalCount(response.total)
      }
    } catch (err: any) {
      console.error("Error fetching education data:", err)
      setError(err.message || "Failed to fetch education data")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data when filters change
  useEffect(() => {
    fetchEducationData()
  }, [selectedFilters, searchQuery])

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
              <FilterPanel
                searchPlaceholder="Akademiya qidirish..."
                filterGroups={filterGroups}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Education Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                {isLoading ? (
                  <p className="text-muted-foreground">
                    <span className="inline-block w-16 h-5 bg-muted rounded animate-pulse"></span>
                  </p>
                ) : error ? (
                  <p className="text-red-500">
                    Xatolik: {error}
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
