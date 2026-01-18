"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Clock, Banknote, Building, Calendar, ArrowRight } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FilterPanel } from "@/components/common/filter-panel"
import { Button } from "@/components/ui/button"
import { FloatingElement } from "@/components/common/floating-element"

const mockJobs = [
  {
    id: "1",
    title: "Professional Kurash Murabbiysi",
    company: "Toshkent Sport Akademiyasi",
    companyLogo: "/tashkent-sports-academy-logo.jpg",
    location: "Toshkent",
    type: "To'liq vaqt",
    salary: "8-12 mln so'm",
    posted: "2 kun oldin",
    description:
      "Professional kurash murabbiysi kerak. Kam deganda 5 yillik tajriba va malaka sertifikati talab qilinadi.",
  },
  {
    id: "2",
    title: "Yosh Futbolchilar Trener",
    company: "Pakhtakor FK",
    companyLogo: "/pakhtakor-fc-logo.jpg",
    location: "Toshkent",
    type: "To'liq vaqt",
    salary: "10-15 mln so'm",
    posted: "5 kun oldin",
    description: "U-18 jamoasi uchun tajribali trener qidirilmoqda. UEFA PRO lisenziyasi afzallik.",
  },
  {
    id: "3",
    title: "Suzish Bo'yicha Instruktor",
    company: "Aqua Sport Markazi",
    companyLogo: "/aqua-sport-center-logo.jpg",
    location: "Samarqand",
    type: "Yarim vaqt",
    salary: "4-6 mln so'm",
    posted: "1 hafta oldin",
    description: "Bolalar va kattalar uchun suzish darslari. Sertifikatlangan instruktor talab qilinadi.",
  },
  {
    id: "4",
    title: "Fitness Trener",
    company: "Gold Gym",
    companyLogo: "/gold-gym-logo.jpg",
    location: "Toshkent",
    type: "To'liq vaqt",
    salary: "6-9 mln so'm",
    posted: "3 kun oldin",
    description: "Professional fitness trener kerak. Shaxsiy mashg'ulotlar va guruh darslari.",
  },
  {
    id: "5",
    title: "Tennis Murabbiysi",
    company: "Tennis Academy Pro",
    companyLogo: "/tennis-academy-pro-logo.jpg",
    location: "Toshkent",
    type: "To'liq vaqt",
    salary: "12-18 mln so'm",
    posted: "1 kun oldin",
    description: "Xalqaro darajadagi tennis murabbiysi. ITF sertifikati va kam deganda 10 yillik tajriba.",
  },
]

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
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

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
              />
            </div>

            {/* Jobs List */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{mockJobs.length}</span> ish o&apos;rni topildi
                </p>
              </div>

              {mockJobs.map((job, index) => (
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
