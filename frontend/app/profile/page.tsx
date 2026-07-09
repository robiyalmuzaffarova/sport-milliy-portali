"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Mail, Phone, MapPin, Calendar, Award, Trophy, Star, Settings, Edit, Camera,
  ChevronRight, Upload, Clock, CheckCircle2, XCircle, PlayCircle, AlertTriangle,
  Filter, Eye, ShieldCheck,
} from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usersApi } from "@/lib/api/client"
import {
  coursesApi,
  canUploadCourses,
  getMediaUrl,
  Course,
  CourseStatus,
  AdminStatusFilter,
} from "@/lib/api/courses-client"

const mockAchievements = [
  { id: "1", title: "Osiyo o'yinlari - Oltin", year: "2024", icon: Trophy },
  { id: "2", title: "Jahon chempionati - Kumush", year: "2023", icon: Award },
  { id: "3", title: "O'zbekiston chempioni", year: "2023", icon: Star },
  { id: "4", title: "Yoshlar orasida chempion", year: "2022", icon: Award },
]

// ── Status badge ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CourseStatus }) {
  const config: Record<CourseStatus, { label: string; className: string; icon: React.ReactNode }> = {
    pending:  { label: "Kutilmoqda",   className: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3.5 h-3.5" /> },
    approved: { label: "Tasdiqlangan", className: "bg-green-100 text-green-700",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    rejected: { label: "Rad etilgan",  className: "bg-red-100 text-red-700",       icon: <XCircle className="w-3.5 h-3.5" /> },
    draft:    { label: "Qoralama",     className: "bg-gray-100 text-gray-600",     icon: <Edit className="w-3.5 h-3.5" /> },
  }
  const c = config[status] || config.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  )
}

// ── Trainer's own-course card (My Courses tab) ─────────────────────────────────

function MyCourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl overflow-hidden neu-card"
    >
      <div className="flex gap-4 p-4">
        <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
          {course.thumbnail_url ? (
            <Image src={getMediaUrl(course.thumbnail_url)} alt={course.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className="font-medium text-card-foreground text-sm leading-snug line-clamp-2">
              {course.title}
            </h4>
            <StatusBadge status={course.status} />
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            {course.sport_type} • {new Date(course.created_at).toLocaleDateString()}
          </p>
          {course.status === "approved" && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {course.view_count} marta ko'rilgan
            </p>
          )}
          {course.status === "rejected" && course.rejection_reason && (
            <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-red-50 border border-red-100">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{course.rejection_reason}</p>
            </div>
          )}
          {course.status === "approved" && (
            <Link href={`/courses/${course.id}`} className="text-xs text-sport hover:underline mt-1 inline-block">
              Kursni ko'rish →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Admin moderation card (Moderation tab) ─────────────────────────────────────

function ModerationCard({
  course, onApprove, onReject, isProcessing,
}: {
  course: Course
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  isProcessing: boolean
}) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [reason, setReason] = useState("")
  const [showPlayer, setShowPlayer] = useState(false)

  const handleConfirmReject = () => {
    if (!reason.trim()) return
    onReject(course.id, reason.trim())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-card rounded-2xl overflow-hidden neu-card p-4"
    >
      <div className="flex gap-4">
        <div
          onClick={() => setShowPlayer((v) => !v)}
          className="relative w-32 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0 cursor-pointer group"
        >
          {course.thumbnail_url ? (
            <Image src={getMediaUrl(course.thumbnail_url)} alt={course.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-7 h-7 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-card-foreground text-sm leading-snug">{course.title}</h4>
            <StatusBadge status={course.status} />
          </div>
          <p className="text-xs text-muted-foreground mb-1">
            {course.sport_type} • {course.uploaded_by?.full_name || "Noma'lum murabbiy"}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Yuborilgan: {new Date(course.created_at).toLocaleDateString()}
          </p>
          {course.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{course.description}</p>
          )}

          {course.status === "rejected" && course.rejection_reason && (
            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-red-50 border border-red-100 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{course.rejection_reason}</p>
            </div>
          )}

          <button
            onClick={() => setShowPlayer((v) => !v)}
            className="text-xs text-sport hover:underline"
          >
            {showPlayer ? "Videoni yashirish" : "Videoni ko'rish"} →
          </button>
        </div>
      </div>

      {/* Inline video player — admin watches it here, no new tab needed */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <video
              src={getMediaUrl(course.video_url)}
              controls
              preload="metadata"
              className="w-full rounded-xl bg-black max-h-[400px]"
            >
              Brauzeringiz video formatini qo'llab-quvvatlamaydi.
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve/Reject controls — only for pending courses */}
      {course.status === "pending" && (
        <div className="mt-3 pt-3 border-t border-border">
          {!showRejectForm ? (
            <div className="flex gap-2">
              <Button
                onClick={() => onApprove(course.id)}
                disabled={isProcessing}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl gap-1.5 flex-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Tasdiqlash
              </Button>
              <Button
                onClick={() => setShowRejectForm(true)}
                disabled={isProcessing}
                variant="outline"
                size="sm"
                className="rounded-xl gap-1.5 flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
                Rad etish
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rad etish sababini yozing (majburiy)..."
                rows={2}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
              {reason.trim().length === 0 && (
                <p className="text-xs text-red-500">Sabab kiritish majburiy</p>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmReject}
                  disabled={isProcessing || !reason.trim()}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1 disabled:opacity-50"
                >
                  Rad etishni tasdiqlash
                </Button>
                <Button
                  onClick={() => { setShowRejectForm(false); setReason("") }}
                  disabled={isProcessing}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                >
                  Bekor qilish
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── Main profile content ────────────────────────────────────────────────────────

function ProfileContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // My Courses (trainer) state
  const [myCourses, setMyCourses] = useState<Course[]>([])
  const [myCoursesLoading, setMyCoursesLoading] = useState(false)
  const [myCoursesLoaded, setMyCoursesLoaded] = useState(false)

  // Moderation (admin) state
  const [moderationFilter, setModerationFilter] = useState<AdminStatusFilter>("pending")
  const [moderationCourses, setModerationCourses] = useState<Course[]>([])
  const [moderationLoading, setModerationLoading] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          router.push("/login")
          return
        }
        const response = await usersApi.getMe(token)
        setCurrentUser(response)
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err)
        setError("Failed to load profile. Please try again.")
        setTimeout(() => router.push("/login"), 2000)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCurrentUser()
  }, [router])

  // Lazy-load "My Courses" the first time that tab is opened
  const loadMyCourses = useCallback(async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return
    setMyCoursesLoading(true)
    try {
      const data = await coursesApi.getMyCourses(token)
      setMyCourses(data.items)
      setMyCoursesLoaded(true)
    } catch (err) {
      console.error("Failed to load my courses:", err)
    } finally {
      setMyCoursesLoading(false)
    }
  }, [])

  // Load moderation queue whenever the filter changes (and tab is active)
  const loadModerationCourses = useCallback(async (filter: AdminStatusFilter) => {
    const token = localStorage.getItem("access_token")
    if (!token) return
    setModerationLoading(true)
    try {
      const data = filter === "pending"
        ? await coursesApi.getPending(token)
        : await coursesApi.getAllAdmin(token, 0, 50, filter)
      setModerationCourses(data.items)
    } catch (err) {
      console.error("Failed to load moderation queue:", err)
    } finally {
      setModerationLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === "mycourses" && !myCoursesLoaded) {
      loadMyCourses()
    }
    if (activeTab === "moderation" && currentUser?.is_superuser) {
      loadModerationCourses(moderationFilter)
    }
  }, [activeTab, currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeTab === "moderation" && currentUser?.is_superuser) {
      loadModerationCourses(moderationFilter)
    }
  }, [moderationFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (courseId: string) => {
    const token = localStorage.getItem("access_token")
    if (!token) return
    setProcessingId(courseId)
    try {
      await coursesApi.approve(courseId, token)
      if (moderationFilter === "approved") {
        loadModerationCourses("approved")
      } else {
        setModerationCourses((prev) => prev.filter((c) => c.id !== courseId))
      }
    } catch (err) {
      console.error("Approve failed:", err)
      alert(err instanceof Error ? err.message : "Tasdiqlashda xatolik yuz berdi")
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (courseId: string, reason: string) => {
    const token = localStorage.getItem("access_token")
    if (!token) return
    setProcessingId(courseId)
    try {
      await coursesApi.reject(courseId, reason, token)
      if (moderationFilter === "rejected") {
        loadModerationCourses("rejected")
      } else {
        setModerationCourses((prev) => prev.filter((c) => c.id !== courseId))
      }
    } catch (err) {
      console.error("Reject failed:", err)
      alert(err instanceof Error ? err.message : "Rad etishda xatolik yuz berdi")
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sport mx-auto mb-4"></div>
          <p className="text-muted-foreground">Profil yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error || !currentUser) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Header />
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/login")} className="bg-sport">
            Login
          </Button>
        </div>
      </div>
    )
  }

  const showMyCoursesTab = canUploadCourses(currentUser.role)
  const showModerationTab = !!currentUser.is_superuser

  const moderationFilters: { value: AdminStatusFilter; label: string }[] = [
    { value: "pending",  label: "Kutilmoqda" },
    { value: "approved", label: "Tasdiqlangan" },
    { value: "rejected", label: "Rad etilgan" },
    { value: "",         label: "Barchasi" },
  ]

  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <Image src={currentUser.avatar_url || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
        <button className="absolute top-24 right-4 p-2 rounded-xl glass text-white hover:bg-white/20">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-secondary shadow-xl">
              <Image src={currentUser.avatar_url || "/placeholder.svg"} alt={currentUser.full_name} fill className="object-cover" />
            </div>
            {currentUser.is_verified && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-sport flex items-center justify-center border-4 border-secondary">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <button className="absolute bottom-0 right-0 p-2 rounded-xl bg-card shadow-lg hover:bg-card/80">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif font-bold text-2xl md:text-3xl text-foreground">{currentUser.full_name}</h1>
                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-sport/10 text-sport text-sm font-medium">
                  {currentUser.sport_type || "Sport"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl bg-card">
                  <Settings className="w-5 h-5" />
                </Button>
                {canUploadCourses(currentUser.role) && (
                  <Button
                    onClick={() => router.push("/courses/upload")}
                    variant="outline"
                    className="rounded-xl gap-2 bg-card"
                  >
                    <Upload className="w-4 h-4" />
                    Kurs yuklash
                  </Button>
                )}
                <Button className="bg-sport hover:bg-sport/90 text-white rounded-xl gap-2">
                  <Edit className="w-4 h-4" />
                  Tahrirlash
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mt-3 max-w-lg">{currentUser.bio || "Bio not set"}</p>

            {/* Quick Stats */}
            <div className="flex gap-6 mt-4">
              <div className="text-center">
                <div className="font-serif font-bold text-xl text-foreground">{currentUser.followers_count || 0}</div>
                <div className="text-xs text-muted-foreground">Kuzatuvchilar</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-xl text-foreground">{currentUser.following_count || 0}</div>
                <div className="text-xs text-muted-foreground">Kuzatilayotganlar</div>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-xl text-foreground">{currentUser.achievements_count || 0}</div>
                <div className="text-xs text-muted-foreground">Yutuqlar</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card rounded-2xl p-1 h-auto flex-wrap justify-start">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white">
              Umumiy
            </TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white">
              Yutuqlar
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white">
              Galereya
            </TabsTrigger>
            {showMyCoursesTab && (
              <TabsTrigger value="mycourses" className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white gap-1.5">
                <PlayCircle className="w-3.5 h-3.5" />
                Mening kurslarim
              </TabsTrigger>
            )}
            {showModerationTab && (
              <TabsTrigger value="moderation" className="rounded-xl data-[state=active]:bg-sport data-[state=active]:text-white gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Kurslarni tasdiqlash
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <motion.div
                className="bg-card rounded-3xl p-6 neu-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-serif font-bold text-lg text-card-foreground mb-4">Aloqa ma&apos;lumotlari</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-card-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefon</p>
                      <p className="text-card-foreground">{currentUser.phone_number || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Manzil</p>
                      <p className="text-card-foreground">{currentUser.location || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Qo&apos;shilgan</p>
                      <p className="text-card-foreground">{currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : "Not set"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Recent Achievements */}
              <motion.div
                className="bg-card rounded-3xl p-6 neu-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-lg text-card-foreground">So&apos;nggi yutuqlar</h3>
                  <Button variant="ghost" size="sm" className="text-sport">
                    Barchasini ko&apos;rish
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockAchievements.slice(0, 3).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sport/10 flex items-center justify-center text-sport">
                        <achievement.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {mockAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-2xl neu-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-sport/10 flex items-center justify-center text-sport">
                    <achievement.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-card-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Image
                    src={`/uzbek-athlete-training-.jpg?height=300&width=300&query=uzbek athlete training ${i}`}
                    alt={`Gallery ${i}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ── My Courses (trainer/admin) ──────────────────────────────── */}
          {showMyCoursesTab && (
            <TabsContent value="mycourses" className="mt-6">
              {myCoursesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sport" />
                </div>
              ) : myCourses.length === 0 ? (
                <div className="text-center py-16">
                  <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                  <h3 className="font-serif font-bold text-lg text-card-foreground mb-2">
                    Siz hali kurs yuklamagansiz
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Birinchi video darsingizni yuklab, boshqalarga bilim ulashing
                  </p>
                  <Button
                    onClick={() => router.push("/courses/upload")}
                    className="bg-sport hover:bg-sport/90 text-white rounded-xl gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Kurs yuklash
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myCourses.map((course) => (
                    <MyCourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* ── Moderation (admin/superuser only) ───────────────────────── */}
          {showModerationTab && (
            <TabsContent value="moderation" className="mt-6">
              {/* Filter pills */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {moderationFilters.map((f) => (
                  <button
                    key={f.value || "all"}
                    onClick={() => setModerationFilter(f.value)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      moderationFilter === f.value
                        ? "bg-sport text-white"
                        : "bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {moderationLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sport" />
                </div>
              ) : moderationCourses.length === 0 ? (
                <div className="text-center py-16">
                  <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                  <h3 className="font-serif font-bold text-lg text-card-foreground mb-2">
                    {moderationFilter === "pending" ? "Kutilayotgan kurslar yo'q" : "Kurslar topilmadi"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {moderationFilter === "pending"
                      ? "Barcha kurslar ko'rib chiqilgan"
                      : "Bu filtr bo'yicha kurslar mavjud emas"}
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-3">
                    {moderationCourses.map((course) => (
                      <ModerationCard
                        key={course.id}
                        course={course}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        isProcessing={processingId === course.id}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <LanguageProvider>
      <ProfileContent />
    </LanguageProvider>
  )
}
