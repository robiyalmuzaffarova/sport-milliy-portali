"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock, Banknote, Building, Calendar, ArrowRight } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FilterPanel } from "@/components/common/filter-panel"
import { Button } from "@/components/ui/button"
import { FloatingElement } from "@/components/common/floating-element"
import { jobVacanciesApi } from "@/lib/api/client"

interface JobListing {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  type: string
  salary: string
  posted: string
  description: string
}

const filterGroups = [
  {
    id: "type",
    label: "Ish turi",
    type: "checkbox" as const,
    options: [
      { value: "full-time", label: "To'liq vaqt", count: 45 },
      { value: "part-time", label: "Yarim vaqt", count: 18 },
      { value: "contract", label: "Shartnoma", count: 12 },
    ],
  },
  {
    id: "region",
    label: "Viloyat",
    type: "checkbox" as const,
    options: [
      { value: "tashkent", label: "Toshkent", count: 56 },
      { value: "samarkand", label: "Samarqand", count: 12 },
      { value: "fergana", label: "Farg'ona", count: 8 },
    ],
  },
  {
    id: "sport",
    label: "Sport turi",
    type: "checkbox" as const,
    options: [
      { value: "football", label: "Futbol", count: 25 },
      { value: "kurash", label: "Kurash", count: 15 },
      { value: "tennis", label: "Tennis", count: 10 },
      { value: "swimming", label: "Suzish", count: 12 },
      { value: "fitness", label: "Fitness", count: 20 },
    ],
  },
]

function JobVacanciesContent() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  // Fetch job vacancies from backend on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await jobVacanciesApi.getAll(0, 100) // Fetch up to 100 job vacancies
        
        if (response.items && Array.isArray(response.items)) {
          // Transform backend data to match JobListing props
          const transformedJobs: JobListing[] = response.items.map((vacancy: any) => ({
            id: String(vacancy.id),
            title: vacancy.title || "Job Title",
            company: vacancy.company || "Company Name",
            companyLogo: vacancy.image_url || "/placeholder.svg",
            location: vacancy.location || "Unknown Location",
            type: "To'liq vaqt", // Default value - can be extended in backend if needed
            salary: vacancy.salary_range || "Negotiable",
            posted: vacancy.created_at 
              ? calculateTimeAgo(new Date(vacancy.created_at))
              : "Recently posted",
            description: vacancy.description || "",
          }))
          
          setJobs(transformedJobs)
          setFilteredJobs(transformedJobs)
        } else {
          throw new Error("Invalid response format from server")
        }
      } catch (err) {
        console.error("Error fetching job vacancies:", err)
        setError(err instanceof Error ? err.message : "Failed to load job vacancies")
        setJobs([])
        setFilteredJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Helper function to calculate time ago
  const calculateTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Shu hozir"
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} minut oldin`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} soat oldin`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} kun oldin`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} hafta oldin`
  }

  const handleFilterChange = (groupId: string, values: string[]) => {
    const newFilters = { ...selectedFilters, [groupId]: values }
    setSelectedFilters(newFilters)
    
    // Apply filters to jobs
    let filtered = jobs
    
    // Filter by job type
    if (newFilters["type"]?.length > 0) {
      filtered = filtered.filter((job) =>
        newFilters["type"].some((type) =>
          job.type.toLowerCase().includes(type.toLowerCase())
        )
      )
    }
    
    // Filter by location
    if (newFilters["region"]?.length > 0) {
      filtered = filtered.filter((job) =>
        newFilters["region"].some((region) =>
          job.location.toLowerCase().includes(region.toLowerCase())
        )
      )
    }
    
    setFilteredJobs(filtered)
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 bg-primary overflow-hidden">
        <FloatingElement className="top-16 right-[15%] opacity-20" delay={0}>
          <div className="w-24 h-24 rounded-full bg-accent/30" />
        </FloatingElement>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground">{t.nav.jobs}</h1>
            <p className="text-primary-foreground/70 mt-3 max-w-xl">
              Sport sohasidagi eng yaxshi ish o&apos;rinlarini toping
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
                searchPlaceholder="Ish qidirish..."
                filterGroups={filterGroups}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Jobs List */}
            <div className="flex-1 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Ish o'rinlari yuklanmoqda...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center p-6 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-500 font-semibold">Xato!</p>
                    <p className="text-muted-foreground text-sm mt-2">{error}</p>
                  </div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <p className="text-muted-foreground">Siz tanlagan filtrlarga mos ish o'rinlari topilmadi</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{filteredJobs.length}</span> ish o&apos;rni topildi
                    </p>
                  </div>

                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-card rounded-3xl p-6 neu-card hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                          <Image
                            src={job.companyLogo || "/placeholder.svg"}
                            alt={job.company}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-bold text-lg text-card-foreground">{job.title}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Building className="w-4 h-4" />
                            <span className="text-sm">{job.company}</span>
                          </div>

                          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{job.description}</p>

                          <div className="flex flex-wrap items-center gap-4 mt-4">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-sport font-medium">
                              <Banknote className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action */}
                        <Button className="bg-sport hover:bg-sport/90 text-white rounded-xl gap-2 flex-shrink-0">
                          Ariza topshirish
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
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

export default function JobVacanciesPage() {
  return (
    <LanguageProvider>
      <JobVacanciesContent />
    </LanguageProvider>
  )
}
