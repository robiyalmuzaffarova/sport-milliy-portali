"use client"

import { useState, useEffect, useCallback } from "react"
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
  region?: string
  employmentType?: string
  sportType?: string
  type: string
  salary: string
  posted: string
  description: string
}

// Uzbek label <-> backend enum value, for each filterable field.
// Keeping these maps here (rather than hardcoding fake counts) means the
// filter UI always sends values the backend actually understands.
const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "To'liq vaqt",
  part_time: "Yarim vaqt",
  contract: "Shartnoma",
}

const REGION_LABELS: Record<string, string> = {
  andijan: "Andijon",
  bukhara: "Buxoro",
  fergana: "Farg'ona",
  jizzakh: "Jizzax",
  karakalpakstan: "Qoraqalpog'iston",
  kashkadarya: "Qashqadaryo",
  khorezm: "Xorazm",
  namangan: "Namangan",
  navoiy: "Navoiy",
  samarkand: "Samarqand",
  surkhandarya: "Surxondaryo",
  syrdarya: "Sirdaryo",
  "tashkent city": "Toshkent shahri",
  "tashkent region": "Toshkent viloyati",
}

const SPORT_TYPE_LABELS: Record<string, string> = {
  football: "Futbol",
  kurash: "Kurash",
  tennis: "Tennis",
  swimming: "Suzish",
  fitness: "Fitness",
  boxing: "Boks",
  basketball: "Basketbol",
  volleyball: "Voleybol",
  gymnastics: "Gimnastika",
  other: "Boshqa",
}

const filterGroups = [
  {
    id: "employment_type",
    label: "Ish turi",
    type: "checkbox" as const,
    options: Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    id: "region",
    label: "Viloyat",
    type: "checkbox" as const,
    options: Object.entries(REGION_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    id: "sport_type",
    label: "Sport turi",
    type: "checkbox" as const,
    options: Object.entries(SPORT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  },
]

function JobVacanciesContent() {
  const { t } = useLanguage()
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchValue, setSearchValue] = useState("")

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

  // Re-fetch from the backend whenever search text or any filter selection
  // changes — filtering happens server-side now, not against fake local data.
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await jobVacanciesApi.getAll(
        0,
        100,
        searchValue || undefined,
        selectedFilters["region"],
        selectedFilters["employment_type"],
        selectedFilters["sport_type"],
        true,
      )

      if (response.items && Array.isArray(response.items)) {
        const transformedJobs: JobListing[] = response.items.map((vacancy: any) => ({
          id: String(vacancy.id),
          title: vacancy.title || "Job Title",
          company: vacancy.company || "Company Name",
          companyLogo: vacancy.image_url || "/placeholder.svg",
          location: vacancy.location || "Unknown Location",
          region: vacancy.region,
          employmentType: vacancy.employment_type,
          sportType: vacancy.sport_type,
          type: vacancy.employment_type
            ? EMPLOYMENT_TYPE_LABELS[vacancy.employment_type] || vacancy.employment_type
            : "Noma'lum",
          salary: vacancy.salary_range || "Kelishiladi",
          posted: vacancy.created_at
            ? calculateTimeAgo(new Date(vacancy.created_at))
            : "Recently posted",
          description: vacancy.description || "",
        }))

        setJobs(transformedJobs)
        setTotal(response.total ?? transformedJobs.length)
      } else {
        throw new Error("Invalid response format from server")
      }
    } catch (err) {
      console.error("Error fetching job vacancies:", err)
      setError(err instanceof Error ? err.message : "Failed to load job vacancies")
      setJobs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [searchValue, selectedFilters])

  useEffect(() => {
    // Debounce search-driven refetches slightly so we're not hitting the API
    // on every keystroke; filter-checkbox changes still feel instant since
    // they're infrequent clicks, not typing.
    const handle = setTimeout(fetchJobs, 300)
    return () => clearTimeout(handle)
  }, [fetchJobs])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }))
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
                onSearchChange={handleSearchChange}
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
              ) : jobs.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <p className="text-muted-foreground">Siz tanlagan filtrlarga mos ish o'rinlari topilmadi</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{total}</span> ish o&apos;rni topildi
                    </p>
                  </div>

                  {jobs.map((job, index) => (
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
