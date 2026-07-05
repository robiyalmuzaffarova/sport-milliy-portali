"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Users, GraduationCap, ChevronRight, ArrowLeft, Star, Search } from "lucide-react"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { usersApi, educationApi } from "@/lib/api/client"
import Image from "next/image"
import Link from "next/link"

const REGIONS = [
  { id: "tashkent_city", label: "Toshkent shahri", flag: "🏙️", color: "bg-blue-500" },
  { id: "tashkent_region", label: "Toshkent viloyati", flag: "🌿", color: "bg-green-500" },
  { id: "samarkand", label: "Samarqand", flag: "🕌", color: "bg-yellow-500" },
  { id: "bukhara", label: "Buxoro", flag: "🏛️", color: "bg-orange-500" },
  { id: "andijan", label: "Andijon", flag: "⛰️", color: "bg-red-500" },
  { id: "fergana", label: "Farg'ona", flag: "🌸", color: "bg-pink-500" },
  { id: "namangan", label: "Namangan", flag: "🏔️", color: "bg-purple-500" },
  { id: "kashkadarya", label: "Qashqadaryo", flag: "🌾", color: "bg-amber-500" },
  { id: "surkhandarya", label: "Surxondaryo", flag: "☀️", color: "bg-rose-500" },
  { id: "navoiy", label: "Navoiy", flag: "💎", color: "bg-cyan-500" },
  { id: "jizzakh", label: "Jizzax", flag: "🌻", color: "bg-lime-500" },
  { id: "syrdarya", label: "Sirdaryo", flag: "🌊", color: "bg-teal-500" },
  { id: "khorezm", label: "Xorazm", flag: "🏺", color: "bg-indigo-500" },
  { id: "karakalpakstan", label: "Qoraqalpog'iston", flag: "🦅", color: "bg-slate-500" },
]

function MapContent() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [athletes, setAthletes] = useState<any[]>([])
  const [institutions, setInstitutions] = useState<any[]>([])
  const [allAthletes, setAllAthletes] = useState<any[]>([])
  const [allInstitutions, setAllInstitutions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"athletes" | "institutions">("athletes")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const [athleteData, trainerData, eduData] = await Promise.all([
          usersApi.getAthletes(0, 100),
          usersApi.getTrainers(0, 100),
          educationApi.getAll(0, 100),
        ])
        const allUsers = [
          ...(athleteData.items || []),
          ...(trainerData.items || []),
        ]
        setAllAthletes(allUsers)
        setAllInstitutions(eduData.items || [])
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!selectedRegion) return

    const region = REGIONS.find(r => r.id === selectedRegion)
    if (!region) return

    // Filter athletes by location containing region label
    const filteredAthletes = allAthletes.filter((a: any) =>
      a.location?.toLowerCase().includes(region.label.toLowerCase()) ||
      a.location?.toLowerCase().includes(selectedRegion.toLowerCase())
    )
    setAthletes(filteredAthletes)

    // Filter institutions by region
    const filteredInstitutions = allInstitutions.filter((i: any) =>
      i.region?.toLowerCase() === selectedRegion.toLowerCase() ||
      i.region?.toLowerCase().replace(" ", "_") === selectedRegion.toLowerCase()
    )
    setInstitutions(filteredInstitutions)
  }, [selectedRegion, allAthletes, allInstitutions])

  const getRegionStats = (regionId: string) => {
    const region = REGIONS.find(r => r.id === regionId)
    if (!region) return { athletes: 0, institutions: 0 }

    const athleteCount = allAthletes.filter((a: any) =>
      a.location?.toLowerCase().includes(region.label.toLowerCase()) ||
      a.location?.toLowerCase().includes(regionId.toLowerCase())
    ).length

    const institutionCount = allInstitutions.filter((i: any) =>
      i.region?.toLowerCase() === regionId.toLowerCase() ||
      i.region?.toLowerCase().replace(" ", "_") === regionId.toLowerCase()
    ).length

    return { athletes: athleteCount, institutions: institutionCount }
  }

  const filteredAthletes = athletes.filter(a =>
    !search || a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.sport_type?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredInstitutions = institutions.filter(i =>
    !search || i.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-10 bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-8 h-8 text-white" />
              <h1 className="font-bold text-4xl md:text-5xl text-white tracking-tight">
                Mintaqaviy Sport Markazi
              </h1>
            </div>
            <p className="text-white/70 mt-2 max-w-xl">
              O'zbekiston viloyatlari bo'ylab sportchilar va sport muassasalarini toping
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-6">
              <div className="bg-white/10 rounded-2xl px-5 py-3 text-white">
                <div className="text-2xl font-bold">{allAthletes.length}</div>
                <div className="text-sm opacity-70">Sportchilar</div>
              </div>
              <div className="bg-white/10 rounded-2xl px-5 py-3 text-white">
                <div className="text-2xl font-bold">{allInstitutions.length}</div>
                <div className="text-sm opacity-70">Muassasalar</div>
              </div>
              <div className="bg-white/10 rounded-2xl px-5 py-3 text-white">
                <div className="text-2xl font-bold">14</div>
                <div className="text-sm opacity-70">Viloyatlar</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!selectedRegion ? (
            <>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Viloyatni tanlang
              </h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sport" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {REGIONS.map((region, index) => {
                    const stats = getRegionStats(region.id)
                    return (
                      <motion.div
                        key={region.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all border border-border hover:border-sport/30 group"
                        onClick={() => setSelectedRegion(region.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl ${region.color} flex items-center justify-center text-2xl`}>
                            {region.flag}
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-sport transition-colors" />
                        </div>

                        <h3 className="font-semibold text-primary text-lg mb-3">
                          {region.label}
                        </h3>

                        <div className="flex gap-4">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-sport" />
                            <span className="text-sm text-muted-foreground">
                              <span className="font-semibold text-primary">{stats.athletes}</span> sportchi
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-sport" />
                            <span className="text-sm text-muted-foreground">
                              <span className="font-semibold text-primary">{stats.institutions}</span> muassasa
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Region Detail View */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => {
                    setSelectedRegion(null)
                    setSearch("")
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Barcha viloyatlar
                </button>
                <span className="text-muted-foreground">/</span>
                <span className="font-semibold text-primary">
                  {REGIONS.find(r => r.id === selectedRegion)?.flag}{" "}
                  {REGIONS.find(r => r.id === selectedRegion)?.label}
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Qidirish..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-primary placeholder:text-muted-foreground focus:outline-none focus:border-sport"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab("athletes")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === "athletes"
                      ? "bg-sport text-white"
                      : "bg-card border border-border text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Sportchilar ({filteredAthletes.length})
                </button>
                <button
                  onClick={() => setActiveTab("institutions")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === "institutions"
                      ? "bg-sport text-white"
                      : "bg-card border border-border text-muted-foreground hover:text-primary"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Muassasalar ({filteredInstitutions.length})
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "athletes" ? (
                  <motion.div
                    key="athletes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {filteredAthletes.length === 0 ? (
                      <div className="text-center py-20">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Bu viloyatda sportchilar topilmadi</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredAthletes.map((athlete, index) => (
                          <motion.div
                            key={athlete.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link href={`/${athlete.role === "trainer" ? "trainers" : "athletes"}/${athlete.id}`}>
                              <div className="bg-card rounded-2xl p-5 border border-border hover:border-sport/30 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary shrink-0">
                                    {athlete.avatar_url ? (
                                      <img src={athlete.avatar_url} alt={athlete.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-sport">
                                        {athlete.full_name?.[0]}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-primary text-sm leading-tight">
                                      {athlete.full_name}
                                    </h3>
                                    <span className="text-xs text-muted-foreground capitalize">
                                      {athlete.role === "trainer" ? "Murabbiy" : "Sportchi"}
                                    </span>
                                  </div>
                                </div>

                                {athlete.sport_type && (
                                  <span className="inline-block px-2 py-1 rounded-lg bg-sport/10 text-sport text-xs font-medium mb-2">
                                    {athlete.sport_type}
                                  </span>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                      {athlete.location || "Noma'lum"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                    <span className="text-xs font-semibold text-yellow-700">
                                      {athlete.rating?.toFixed(1) || "4.5"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="institutions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {filteredInstitutions.length === 0 ? (
                      <div className="text-center py-20">
                        <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Bu viloyatda muassasalar topilmadi</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredInstitutions.map((inst, index) => (
                          <motion.div
                            key={inst.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-md transition-all cursor-pointer"
                            onClick={() => inst.maps_link && window.open(inst.maps_link, '_blank')}
                          >
                            {inst.image_url && (
                              <div className="w-full h-40 overflow-hidden bg-secondary">
                                <img src={inst.image_url} alt={inst.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="p-5">
                              <h3 className="font-semibold text-primary mb-2">{inst.name}</h3>
                              {inst.address && (
                                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                                  <span className="text-xs">{inst.address}</span>
                                </div>
                              )}
                              {inst.working_hours && (
                                <p className="text-xs text-muted-foreground mt-1">🕐 {inst.working_hours}</p>
                              )}
                              {inst.maps_link && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <span className="text-xs text-sport font-medium">Xaritada ko'rish →</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function MapPage() {
  return (
    <LanguageProvider>
      <MapContent />
    </LanguageProvider>
  )
}