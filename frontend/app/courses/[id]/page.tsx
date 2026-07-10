"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Eye,
  Star,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Share2,
  CheckCircle,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PillButton } from "@/components/ios/pill-button"
import { coursesApi, Course, triggerBlobDownload, getMediaUrl } from "@/lib/api/courses-client"
import { LanguageProvider } from "@/lib/i18n/language-context"

// ── Constants ──────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Boshlang'ich", color: "bg-green-100 text-green-700" },
  2: { label: "O'rta",        color: "bg-yellow-100 text-yellow-700" },
  3: { label: "Murakkab",     color: "bg-red-100 text-red-700" },
}

// Mock single course for fallback
const MOCK_COURSE: Course = {
  id:               "mock-1",
  title:            "Kurash asoslari: birinchi darslar va texnikalar",
  description:      `Bu kurs kurash sportining asosiy texnikalarini o'rgatishga bag'ishlangan. Kurs davomida siz quyidagilarni o'rganasiz:

• Asosiy turishlar va pozitsiyalar
• Ushlash texnikasi va griplash
• Tashlash usullari: o'ng va chap tomonga
• Himoya va qarshi hujum texnikasi
• Professional musobaqalarda qo'llaniladigan kombinatsiyalar

Kurs professional murabbiy tomonidan tayyorlangan va boshlang'ich darajadagi sportchilar uchun mo'ljallangan.`,
  sport_type:       "Kurash",
  difficulty_level: 1,
  video_url:        "/placeholder-video.mp4",
  thumbnail_url:    "/course-thumb-1.jpg",
  duration_seconds: 1800,
  qr_code_image_url:"/placeholder-qr.png",
  qr_code_url:      "https://yourapp.com/courses/mock-1",
  status:           "approved",
  view_count:       1247,
  rating:           4.7,
  uploaded_by: {
    id:        1,
    full_name: "Bobur Yusupov",
    avatar_url:"/male1.jpg",
    sport_type:"Kurash",
  },
  created_at: "2026-01-15T10:00:00Z",
  updated_at: "2026-01-15T10:00:00Z",
}

// ── Helper ────────────────────────────────────────────────────────────────────

function formatDuration(seconds?: number): string {
  if (!seconds) return "--"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

// ── QR code panel ─────────────────────────────────────────────────────────────

function QrPanel({ course }: { course: Course }) {
  const [downloading, setDownloading] = useState(false)
  const [copied,      setCopied]      = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await coursesApi.downloadQr(course.id)
      triggerBlobDownload(blob, `qr_${course.title.slice(0, 30)}.png`)
    } catch {
      if (course.qr_code_image_url) window.open(course.qr_code_image_url, "_blank")
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    const url = course.qr_code_url || window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="ios-card rounded-3xl p-5"
    >
      <h3 className="font-semibold text-primary text-sm mb-4 flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-[#3c5a3c]/10 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-sm border-2 border-[#3c5a3c]" />
        </div>
        QR kod
      </h3>

      {/* QR image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-border mb-4 p-3">
        {course.qr_code_image_url ? (
          <Image
            src={getMediaUrl(course.qr_code_image_url)}
            alt="QR kod"
            fill
            className="object-contain p-2"
          />
        ) : (
          /* Placeholder SVG QR pattern */
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-primary">
              <rect x="5"  y="5"  width="30" height="30" fill="none" stroke="currentColor" strokeWidth="4"/>
              <rect x="12" y="12" width="16" height="16" fill="currentColor"/>
              <rect x="65" y="5"  width="30" height="30" fill="none" stroke="currentColor" strokeWidth="4"/>
              <rect x="72" y="12" width="16" height="16" fill="currentColor"/>
              <rect x="5"  y="65" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="4"/>
              <rect x="12" y="72" width="16" height="16" fill="currentColor"/>
              {[45,55,65,45,55,65,45,55,65].map((x, i) => (
                <rect key={i} x={x} y={45 + Math.floor(i/3)*10} width="8" height="8" fill="currentColor" opacity={Math.random() > 0.4 ? 1 : 0}/>
              ))}
            </svg>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
        Bu kursga to'g'ridan-to'g'ri kirish uchun QR kodni skanerlang
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#3c5a3c] text-white text-sm font-medium hover:bg-[#2d442d] transition-colors disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Yuklanmoqda..." : "QR kodni yuklash"}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Nusxalandi!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Havolani nusxalash
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

function CourseDetailContent() {
  const params   = useParams()
  const router   = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [course,    setCourse]    = useState<Course>(MOCK_COURSE)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted,   setIsMuted]   = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)

  useEffect(() => {
    const id = params?.id as string
    if (!id || id.startsWith("mock")) { setIsLoading(false); return }

    coursesApi.getById(id)
      .then(setCourse)
      .catch(() => { /* keep mock */ })
      .finally(() => setIsLoading(false))
  }, [params?.id])

  // Belt-and-suspenders duration detection: onLoadedMetadata / onDurationChange /
  // onTimeUpdate normally set this, but some mp4 encodes don't fire those
  // reliably. Polling the element directly guarantees we never get stuck with
  // videoDuration === 0 — which would silently cap the seek bar's max at 0 and
  // make every click seek to the very start, regardless of where it's clicked.
  useEffect(() => {
    const interval = setInterval(() => {
      const d = videoRef.current?.duration
      if (d && isFinite(d) && d > 0) {
        setVideoDuration((prev) => (prev !== d ? d : prev))
      }
    }, 300)
    return () => clearInterval(interval)
  }, [course.video_url])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false) }
    else           { videoRef.current.play();  setIsPlaying(true)  }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted((v) => !v)
  }

  const handleFullscreen = () => {
    containerRef.current?.requestFullscreen?.()
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = Number(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const diff = DIFFICULTY_LABELS[course.difficulty_level] || DIFFICULTY_LABELS[1]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#3c5a3c] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-card">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <Link href="/courses" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kurslarga qaytish
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-primary truncate max-w-xs">{course.title}</span>
        </motion.div>

        {/* Main layout: video (left/top) + QR panel (right) */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Video player */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-3xl overflow-hidden bg-black aspect-video group"
            >
              <video
                ref={videoRef}
                src={getMediaUrl(course.video_url)}
                poster={getMediaUrl(course.thumbnail_url)}
                className="w-full h-full object-contain"
                onPlay={()  => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                  setCurrentTime(e.currentTarget.currentTime)
                  // Some mp4 encodes don't report a valid duration until playback
                  // has started (metadata at the end of the file) — keep checking
                  // here as a fallback so it doesn't get stuck at "--".
                  const d = e.currentTarget.duration
                  if (isFinite(d) && d !== videoDuration) setVideoDuration(d)
                }}
                onDurationChange={(e) => {
                  const d = e.currentTarget.duration
                  if (isFinite(d)) setVideoDuration(d)
                }}
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration
                  if (isFinite(d)) setVideoDuration(d)
                }}
              />

              {/* Center play/pause + darkening overlay (hover only) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isPlaying
                      ? <Pause  className="w-7 h-7 text-white" />
                      : <Play   className="w-7 h-7 text-white ml-1" />
                    }
                  </button>
                </div>
              </div>

              {/* Bottom control strip — progress bar, time, and buttons stack in
                  normal flow (not independently-positioned) so their click areas
                  never overlap each other */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/80 to-transparent">
                {/* Progress bar — always visible */}
                <input
                  type="range"
                  min={0}
                  max={videoDuration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/25 accent-[#3c5a3c]
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                             [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
                  style={{
                    background: videoDuration
                      ? `linear-gradient(to right, #ffffff ${(currentTime / videoDuration) * 100}%, rgba(255,255,255,0.25) ${(currentTime / videoDuration) * 100}%)`
                      : undefined,
                  }}
                />

                {/* Time readout — always visible */}
                <div className="flex items-center justify-between mt-1.5 text-xs text-white/90 font-medium tabular-nums">
                  <span>{formatDuration(Math.floor(currentTime))}</span>
                  <span>{videoDuration ? formatDuration(Math.floor(videoDuration)) : "--"}</span>
                </div>

                {/* Mute / fullscreen — separate row below the progress bar,
                    only visible on hover, so it never sits on top of the slider */}
                <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={toggleMute} className="text-white hover:text-white/80 transition-colors">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button onClick={handleFullscreen} className="text-white hover:text-white/80 transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Initial play button (when not hovering) */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity"
                >
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-[#3c5a3c] ml-1" />
                  </div>
                </button>
              )}
            </motion.div>

            {/* Course info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-4"
            >
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#3c5a3c]/10 text-[#3c5a3c] text-xs font-medium">
                  {course.sport_type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${diff.color}`}>
                  {diff.label}
                </span>
                {course.duration_seconds && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(course.duration_seconds)}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Eye className="w-3.5 h-3.5" />
                  {course.view_count.toLocaleString()} ta ko'rilgan
                </span>
                {course.rating > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {course.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                {course.title}
              </h1>

              {/* Uploader info */}
              {course.uploaded_by && (
                <div className="flex items-center gap-3 py-3 border-t border-b border-border">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                    {course.uploaded_by.avatar_url ? (
                      <Image
                        src={getMediaUrl(course.uploaded_by.avatar_url)}
                        alt={course.uploaded_by.full_name || "Murabbiy"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#3c5a3c]/20 flex items-center justify-center text-[#3c5a3c] font-bold text-sm">
                        {(course.uploaded_by.full_name || "M")[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-primary text-sm">
                      {course.uploaded_by.full_name || "Murabbiy"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {course.uploaded_by.sport_type || "Sport murabbiy"}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {course.description && (
                <div className="ios-card rounded-2xl p-5">
                  <h2 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#3c5a3c]" />
                    Kurs haqida
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {course.description}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right column: QR panel ────────────────────────────────── */}
          <div className="space-y-4">
            <QrPanel course={course} />

            {/* Back to courses */}
            <Link href="/courses">
              <PillButton
                variant="outline"
                className="w-full justify-center"
                icon={<ArrowLeft className="w-4 h-4" />}
                iconPosition="left"
              >
                Barcha kurslar
              </PillButton>
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CourseDetailPage() {
  return (
    <LanguageProvider>
      <CourseDetailContent />
    </LanguageProvider>
  )
}
