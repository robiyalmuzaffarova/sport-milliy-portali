"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FilterPanel } from "@/components/common/filter-panel"
import { EducationCard } from "@/components/features/education-card"
import { FloatingElement } from "@/components/common/floating-element"

const mockEducation = [
  {
    id: "1",
    name: "Toshkent Sport Akademiyasi",
    type: "academy" as const,
    description: "O'zbekistondagi eng yirik sport ta'lim muassasasi. Professional sportchilar tayyorlash.",
    image: "/tashkent-sports-academy-building.jpg",
    location: "Toshkent",
    address: "Chilonzor tumani, Bunyodkor ko'chasi, 15-uy",
    workingHours: "08:00 - 20:00",
    phone: "+998 71 123 45 67",
    rating: 4.9,
    mapsLink: "https://maps.google.com",
  },
  {
    id: "2",
    name: "O'zbekiston Kurash Federatsiyasi",
    type: "federation" as const,
    description: "Milliy sport turi - kurashni rivojlantirish va targ'ib qilish.",
    image: "/uzbekistan-kurash-federation-building.jpg",
    location: "Toshkent",
    address: "Yunusobod tumani, Amir Temur shoh ko'chasi, 108",
    workingHours: "09:00 - 18:00",
    phone: "+998 71 234 56 78",
    rating: 4.8,
    mapsLink: "https://maps.google.com",
  },
  {
    id: "3",
    name: "Samarqand Sport Maktabi",
    type: "academy" as const,
    description: "Yosh sportchilarni tarbiyalash va rivojlantirish markazi.",
    image: "/samarkand-sports-school-building.jpg",
    location: "Samarqand",
    address: "Samarqand shahar, Registon ko'chasi, 45",
    workingHours: "07:00 - 21:00",
    phone: "+998 66 123 45 67",
    rating: 4.7,
    mapsLink: "https://maps.google.com",
  },
  {
    id: "4",
    name: "O'zbekiston Boxing Federatsiyasi",
    type: "federation" as const,
    description: "Professional boks sportini rivojlantirish va xalqaro musobaqalarda ishtirok etish.",
    image: "/uzbekistan-boxing-federation-building.jpg",
    location: "Toshkent",
    address: "Mirzo Ulug'bek tumani, Sport ko'chasi, 22",
    workingHours: "09:00 - 19:00",
    phone: "+998 71 345 67 89",
    rating: 4.9,
    mapsLink: "https://maps.google.com",
  },
  {
    id: "5",
    name: "Farg'ona Olimpiya Zaxiralar Maktabi",
    type: "academy" as const,
    description: "Kelajak Olimpiya chempionlarini tayyorlash markazi.",
    image: "/fergana-olympic-reserve-school.jpg",
    location: "Farg'ona",
    address: "Farg'ona shahar, Al-Farg'oniy ko'chasi, 78",
    workingHours: "08:00 - 19:00",
    phone: "+998 73 244 55 66",
    rating: 4.6,
    mapsLink: "https://maps.google.com",
  },
  {
    id: "6",
    name: "O'zbekiston Tennis Federatsiyasi",
    type: "federation" as const,
    description: "Professional tennis sportini rivojlantirish va targ'ib qilish.",
    image: "/uzbekistan-tennis-federation-building.jpg",
    location: "Toshkent",
    address: "Sergeli tumani, Tennis ko'chasi, 5",
    workingHours: "08:00 - 20:00",
    phone: "+998 71 456 78 90",
    rating: 4.8,
    mapsLink: "https://maps.google.com",
  },
]

const filterGroups = [
  {
    id: "type",
    label: "Turi",
    type: "checkbox" as const,
    options: [
      { value: "academy", label: "Akademiya", count: 12 },
      { value: "federation", label: "Federatsiya", count: 8 },
    ],
  },
  {
    id: "region",
    label: "Viloyat",
    type: "checkbox" as const,
    options: [
      { value: "tashkent", label: "Toshkent", count: 15 },
      { value: "samarkand", label: "Samarqand", count: 4 },
      { value: "fergana", label: "Farg'ona", count: 3 },
      { value: "bukhara", label: "Buxoro", count: 2 },
    ],
  },
  {
    id: "sport",
    label: "Sport turi",
    type: "checkbox" as const,
    options: [
      { value: "kurash", label: "Kurash", count: 5 },
      { value: "boxing", label: "Boxing", count: 4 },
      { value: "tennis", label: "Tennis", count: 3 },
      { value: "football", label: "Football", count: 6 },
    ],
  },
]

function EducationContent() {
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
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{mockEducation.length}</span> muassasa topildi
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockEducation.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <EducationCard {...item} />
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

export default function EducationPage() {
  return (
    <LanguageProvider>
      <EducationContent />
    </LanguageProvider>
  )
}
