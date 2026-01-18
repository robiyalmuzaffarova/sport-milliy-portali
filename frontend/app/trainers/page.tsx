"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FilterPanel } from "@/components/common/filter-panel"
import { TrainerCard } from "@/components/features/trainer-card"
import { FloatingElement } from "@/components/common/floating-element"

const mockTrainers = [
  {
    id: "1",
    name: "Anvar Rahimov",
    sport: "Kurash",
    image: "/uzbek-male-kurash-coach-portrait.jpg",
    rating: 4.9,
    experience: 15,
    location: "Toshkent",
    students: 150,
    isVerified: true,
    price: "150,000 so'm/soat",
  },
  {
    id: "2",
    name: "Olga Petrova",
    sport: "Tennis",
    image: "/female-tennis-coach-portrait.jpg",
    rating: 4.8,
    experience: 12,
    location: "Samarqand",
    students: 85,
    isVerified: true,
    price: "200,000 so'm/soat",
  },
  {
    id: "3",
    name: "Bekzod Tursunov",
    sport: "Boxing",
    image: "/uzbek-male-boxing-coach-portrait.jpg",
    rating: 4.7,
    experience: 20,
    location: "Farg'ona",
    students: 200,
    isVerified: true,
    price: "120,000 so'm/soat",
  },
  {
    id: "4",
    name: "Nodira Aliyeva",
    sport: "Gymnastics",
    image: "/uzbek-female-gymnastics-coach-portrait.jpg",
    rating: 4.9,
    experience: 18,
    location: "Buxoro",
    students: 120,
    isVerified: true,
    price: "180,000 so'm/soat",
  },
  {
    id: "5",
    name: "Sardor Ismailov",
    sport: "Football",
    image: "/uzbek-male-football-coach-portrait.jpg",
    rating: 4.6,
    experience: 10,
    location: "Andijon",
    students: 95,
    isVerified: true,
    price: "100,000 so'm/soat",
  },
  {
    id: "6",
    name: "Marina Sidorova",
    sport: "Swimming",
    image: "/female-swimming-coach-portrait.jpg",
    rating: 4.8,
    experience: 14,
    location: "Toshkent",
    students: 110,
    isVerified: true,
    price: "170,000 so'm/soat",
  },
]

const filterGroups = [
  {
    id: "sport",
    label: "Sport turi",
    type: "checkbox" as const,
    options: [
      { value: "kurash", label: "Kurash", count: 28 },
      { value: "boxing", label: "Boxing", count: 22 },
      { value: "tennis", label: "Tennis", count: 18 },
      { value: "football", label: "Football", count: 35 },
      { value: "gymnastics", label: "Gymnastics", count: 15 },
      { value: "swimming", label: "Swimming", count: 20 },
    ],
  },
  {
    id: "region",
    label: "Viloyat",
    type: "checkbox" as const,
    options: [
      { value: "tashkent", label: "Toshkent", count: 75 },
      { value: "samarkand", label: "Samarqand", count: 30 },
      { value: "fergana", label: "Farg'ona", count: 25 },
      { value: "bukhara", label: "Buxoro", count: 20 },
    ],
  },
  {
    id: "experience",
    label: "Tajriba",
    type: "radio" as const,
    options: [
      { value: "15+", label: "15+ yil" },
      { value: "10+", label: "10+ yil" },
      { value: "5+", label: "5+ yil" },
    ],
  },
]

function TrainersContent() {
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
              <FilterPanel
                searchPlaceholder={t.filters.search}
                filterGroups={filterGroups}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Trainers Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{mockTrainers.length}</span> murabbiy topildi
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {mockTrainers.map((trainer, index) => (
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
