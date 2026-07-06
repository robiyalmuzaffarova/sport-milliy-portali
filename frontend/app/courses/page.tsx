"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Play,
  Clock,
  Eye,
  Download,
  Filter,
  ChevronDown,
  Star,
  BookOpen,
  X,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PillButton } from "@/components/ios/pill-button"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { coursesApi, Course, SportType, triggerBlobDownload } from "@/lib/api/courses-client"

// ── Constants ──────────────────────────────────────────────────────────────────

const SPORT_TYPES: SportType[] = [
  "Futbol", "Kurash", "Boks", "Tennis", "Suzish",
  "Gimnastika", "Atletika", "Basketbol", "Voleybol",
  "Karate", "Taekwondo", "Boshqa",
]

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Boshlang'ich", color: "bg-green-100 text-green-700" },
  2: { label: "O'rta",        color: "bg-yellow-100 text-yellow-700" },
  3: { label: "Murakkab",     color: "bg-red-100 text-red-700" },
}

// Mock data shown while the real API loads / as fallback
const MOCK_COURSES: Course[] = Array.from({ length: 8 }, (_, i) => ({
  id:               `mock-${i}`,
  title:            ["Kurash asoslari: birinchi darslar", "Tennis texnikasi va strategiyasi",
                     "Boks: jab va cross kombinatsiyalari", "Futbol dribbling mahorati",
                     "Suzish: bajarilish texnikasi", "Gimnastika: muvozanat mashqlari",
                     "Atletika: sprint texnikasi", "Basketbol: top ushlab olish"][i],
  description:      "Bu kurs sport murabbiylar tomonidan tayyorlangan va professional darajadagi ko'nikmalarni rivojlantirishga yordam beradi.",
  sport_type:       SPORT_TYPES[i % SPORT_TYPES.length],
  difficulty_level: ([1, 2, 3, 1, 2, 3, 1, 2][i]) as 1 | 2 | 3,
  video_url:        "/placeholder-video.mp4",
  thumbnail_url:    `/course-thumb-${(i % 3) + 1}.jpg`,
  duration_seconds: 600 + i * 300,
  qr_code_image_url:"/placeholder-qr.png",
  status:           "approved",
  view_count:       120 + i * 47,
  rating:           4.2 + (i % 3) * 0.2,
  created_at:       new Date(2026, 0, i + 1).toISOString(),
  updated_at:       new Date(2026, 0, i + 1).toISOString(),
}))

// ── Helper functions ──────────────────────────────────────────────────────────

function formatDuration(seconds?: number): string {
  if (!seconds) return "--"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

// ── Course card component ─────────────────────────────────────────────────────

function CourseCard({ course, onQrDownload }: {
  course: Course
  onQrDownload: (course: Course, e: React.MouseEvent) => void
}) {
  const diff = DIFFICULTY_LABELS[course.difficulty_level] || DIFFICULTY_LABELS[1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="ios-card rounded-3xl overflow-hidden group cursor-pointer"
    >
      <Link href={`/courses/${course.id}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-secondary overflow-hidden">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#3c5a3c]/40 to-[#3c5a3c]/80 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-80" />
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-6 h-6 text-[#3c5a3c] ml-1" />
            </div>
          </div>

          {/* Duration badge */}
          {course.duration_seconds && (
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-white text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(course.duration_seconds)}
            </div>
          )}

          {/* Sport type badge */}
          <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-[#3c5a3c]/90 backdrop-blur-sm text-white text-xs font-medium">
            {course.sport_type}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-primary text-sm leading-snug line-clamp-2 flex-1">
              {course.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.color}`}>
              {diff.label}
            </span>
            {course.rating > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {course.rating.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Eye className="w-3 h-3" />
              {course.view_count.toLocaleString()}
            </span>
          </div>

          {course.uploaded_by?.full_name && (
            <p className="text-xs text-muted-foreground truncate">
              Murabbiy: {course.uploaded_by.full_name}
            </p>
          )}
        </div>
      </Link>

      {/* QR download — outside the Link to prevent navigation */}
      {course.qr_code_image_url && (
        <div className="px-4 pb-4">
          <button
            onClick={(e) => onQrDownload(course, e)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border hover:bg-secondary transition-colors text-xs text-muted-foreground hover:text-primary"
          >
            <Download className="w-3.5 h-3.5" />
            QR kodni yuklab olish
          </button>
        </div>
      )}
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

function CoursesContent() {
  const [courses,        setCourses]        = useState<Course[]>(MOCK_COURSES)
  const [total,          setTotal]          = useState(MOCK_COURSES.length)
  const [isLoading,      setIsLoading]      = useState(false)
  const [search,         setSearch]         = useState("")
  const [selectedSport,  setSelectedSport]  = useState<SportType | "">("")
  const [filterOpen,     setFilterOpen]     = useState(false)
  const [page,           setPage]           = useState(0)
  const LIMIT = 16

  const fetchCourses = useCallback(async (searchVal: string, sport: string, pageNum: number) => {
    setIsLoading(true)
    try {
      const data = await coursesApi.getAll(
        pageNum * LIMIT,
        LIMIT,
        sport || undefined,
        searchVal || undefined,
      )
      setCourses(data.items.length > 0 ? data.items : MOCK_COURSES)
      setTotal(data.total || MOCK_COURSES.length)
    } catch {
      setCourses(MOCK_COURSES)
      setTotal(MOCK_COURSES.length)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0)
      fetchCourses(search, selectedSport, 0)
    }, 400)
    return () => clearTimeout(t)
  }, [search, selectedSport, fetchCourses])

  useEffect(() => {
    fetchCourses(search, selectedSport, page)
  }, [page]) // eslint-disable-line

  const handleQrDownload = async (course: Course, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const blob = await coursesApi.downloadQr(course.id)
      triggerBlobDownload(blob, `qr_${course.title.slice(0, 30)}.png`)
    } catch {
      // Fallback: open QR image in new tab
      if (course.qr_code_image_url) {
        window.open(course.qr_code_image_url, "_blank")
      }
    }
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedSport("")
    setPage(0)
  }

  const hasFilters = search || selectedSport

  return (
    <div className="min-h-screen bg-card">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#3c5a3c]/8 to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3c5a3c]/10 text-[#3c5a3c] text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Sport kurslari
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-3">
              Onlayn kurslar
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Professional murabbiylardan sport texnikasi va strategiyasini o'rganing
            </p>
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div
            className="max-w-2xl mx-auto flex gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Search input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kurs qidirish..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-secondary border border-border text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3c5a3c]/30 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${
                  selectedSport
                    ? "bg-[#3c5a3c] text-white border-[#3c5a3c]"
                    : "bg-secondary border-border text-primary hover:bg-secondary/80"
                }`}
              >
                <Filter className="w-4 h-4" />
                {selectedSport || "Filtr"}
                <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 ios-card rounded-2xl p-2 z-50 shadow-xl"
                  >
                    <button
                      onClick={() => { setSelectedSport(""); setFilterOpen(false) }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        !selectedSport ? "bg-[#3c5a3c] text-white font-medium" : "text-primary hover:bg-secondary"
                      }`}
                    >
                      Barcha sportlar
                    </button>
                    {SPORT_TYPES.map((sport) => (
                      <button
                        key={sport}
                        onClick={() => { setSelectedSport(sport); setFilterOpen(false) }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                          selectedSport === sport ? "bg-[#3c5a3c] text-white font-medium" : "text-primary hover:bg-secondary"
                        }`}
                      >
                        {sport}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Active filter chips */}
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mt-4 flex-wrap"
            >
              {selectedSport && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3c5a3c]/10 text-[#3c5a3c] text-sm">
                  {selectedSport}
                  <button onClick={() => setSelectedSport("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3c5a3c]/10 text-[#3c5a3c] text-sm">
                  "{search}"
                  <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary underline">
                Tozalash
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Yuklanmoqda..." : `${total} ta kurs topildi`}
            </p>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="ios-card rounded-3xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-secondary" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-secondary rounded-lg w-3/4" />
                    <div className="h-3 bg-secondary rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold text-primary mb-2">Kurs topilmadi</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Qidiruv so'zini yoki filtrlni o'zgartiring
              </p>
              <PillButton variant="outline" onClick={clearFilters}>
                Filtrlarni tozalash
              </PillButton>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${search}-${selectedSport}-${page}`}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onQrDownload={handleQrDownload}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {total > LIMIT && !isLoading && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <PillButton
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={page === 0 ? "opacity-40 pointer-events-none" : ""}
              >
                Oldingi
              </PillButton>
              <span className="text-sm text-muted-foreground px-4">
                {page + 1} / {Math.ceil(total / LIMIT)}
              </span>
              <PillButton
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                className={(page + 1) * LIMIT >= total ? "opacity-40 pointer-events-none" : ""}
              >
                Keyingi
              </PillButton>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function CoursesPage() {
  return (
    <LanguageProvider>
      <CoursesContent />
    </LanguageProvider>
  )
}
