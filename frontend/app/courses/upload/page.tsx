"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Upload,
  Video,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  FileVideo,
} from "lucide-react"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PillButton } from "@/components/ios/pill-button"
import { usersApi } from "@/lib/api/client"
import {
  coursesApi,
  SportType,
  SPORT_TYPES,
  Course,
  canUploadCourses,
  validateVideoFile,
  validateThumbnailFile,
} from "@/lib/api/courses-client"

const DIFFICULTY_OPTIONS: { value: 1 | 2 | 3; label: string; color: string }[] = [
  { value: 1, label: "Boshlang'ich", color: "bg-green-100 text-green-700 border-green-200" },
  { value: 2, label: "O'rta",        color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: 3, label: "Murakkab",     color: "bg-red-100 text-red-700 border-red-200" },
]

// ── Access gate ──────────────────────────────────────────────────────────────

function useAccessGate() {
  const router = useRouter()
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking")
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem("access_token")
    if (!t) {
      router.push("/login")
      return
    }
    setToken(t)

    usersApi.getMe(t)
      .then((user) => {
        if (canUploadCourses(user.role)) {
          setStatus("allowed")
        } else {
          setStatus("denied")
        }
      })
      .catch(() => {
        router.push("/login")
      })
  }, [router])

  return { status, token }
}

// ── File drop zone ─────────────────────────────────────────────────────────

function FileDropZone({
  label, icon, accept, file, onFile, error, hint,
}: {
  label: string
  icon: React.ReactNode
  accept: string
  file: File | null
  onFile: (f: File | null) => void
  error: string | null
  hint: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) onFile(f)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-colors ${
          isDragging
            ? "border-[#3c5a3c] bg-[#3c5a3c]/5"
            : error
              ? "border-red-300 bg-red-50"
              : "border-border hover:border-[#3c5a3c]/40 hover:bg-secondary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />

        {file ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#3c5a3c]/10 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFile(null) }}
              className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center flex-shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
              {icon}
            </div>
            <p className="text-sm text-primary font-medium mb-1">Faylni tanlang yoki shu yerga tashlang</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

// ── Main content ──────────────────────────────────────────────────────────────

function UploadContent() {
  const router = useRouter()
  const { status, token } = useAccessGate()

  const [title,       setTitle]       = useState("")
  const [description, setDescription] = useState("")
  const [sportType,   setSportType]   = useState<SportType | "">("")
  const [difficulty,  setDifficulty]  = useState<1 | 2 | 3>(1)
  const [video,       setVideo]       = useState<File | null>(null)
  const [thumbnail,   setThumbnail]   = useState<File | null>(null)

  const [videoError,     setVideoError]     = useState<string | null>(null)
  const [thumbnailError, setThumbnailError] = useState<string | null>(null)
  const [formError,      setFormError]      = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress,     setProgress]     = useState(0)
  const [result,       setResult]       = useState<Course | null>(null)

  const handleVideoFile = useCallback((f: File | null) => {
    setVideo(f)
    setVideoError(f ? validateVideoFile(f) : null)
  }, [])

  const handleThumbnailFile = useCallback((f: File | null) => {
    setThumbnail(f)
    setThumbnailError(f ? validateThumbnailFile(f) : null)
  }, [])

  const isValid =
    title.trim().length >= 3 &&
    sportType !== "" &&
    video !== null &&
    !videoError &&
    !thumbnailError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!isValid || !video || !sportType || !token) {
      setFormError("Iltimos, barcha majburiy maydonlarni to'g'ri to'ldiring")
      return
    }

    setIsSubmitting(true)
    setProgress(0)

    try {
      const course = await coursesApi.upload(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          sport_type: sportType,
          difficulty_level: difficulty,
          video,
          thumbnail: thumbnail || undefined,
        },
        token,
        setProgress,
      )
      setResult(course)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Yuklashda kutilmagan xatolik yuz berdi")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle(""); setDescription(""); setSportType(""); setDifficulty(1)
    setVideo(null); setThumbnail(null)
    setVideoError(null); setThumbnailError(null); setFormError(null)
    setResult(null); setProgress(0)
  }

  // ── Access gate states ──────────────────────────────────────────────────

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3c5a3c] animate-spin" />
      </div>
    )
  }

  if (status === "denied") {
    return (
      <div className="min-h-screen bg-card">
        <Header />
        <div className="max-w-lg mx-auto px-4 pt-32 pb-20 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-3">Ruxsat yo'q</h1>
          <p className="text-muted-foreground mb-8">
            Kurs yuklash faqat murabbiylar va administratorlar uchun mavjud.
          </p>
          <Link href="/profile">
            <PillButton icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
              Profilga qaytish
            </PillButton>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Success state ────────────────────────────────────────────────────────

  if (result) {
    const isPending = result.status === "pending"
    return (
      <div className="min-h-screen bg-card">
        <Header />
        <div className="max-w-lg mx-auto px-4 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isPending ? "bg-yellow-100" : "bg-green-100"
            }`}
          >
            <CheckCircle className={`w-8 h-8 ${isPending ? "text-yellow-600" : "text-green-600"}`} />
          </motion.div>
          <h1 className="text-2xl font-bold text-primary mb-3">
            {isPending ? "Kurs yuborildi!" : "Kurs nashr etildi!"}
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {isPending
              ? "Kursingiz admin tomonidan ko'rib chiqilmoqda. Tasdiqlangandan so'ng u barcha foydalanuvchilarga ko'rinadi."
              : "Kursingiz muvaffaqiyatli nashr etildi va endi barcha foydalanuvchilarga ko'rinadi."}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <PillButton variant="outline" onClick={resetForm}>
              Yana kurs yuklash
            </PillButton>
            {!isPending && (
              <Link href={`/courses/${result.id}`}>
                <PillButton>Kursni ko'rish</PillButton>
              </Link>
            )}
            <Link href="/profile">
              <PillButton variant="ghost">Profilga qaytish</PillButton>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-card">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Profilga qaytish
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">Kurs yuklash</h1>
          <p className="text-muted-foreground">
            Video darsingizni yuklang — u admin tasdig'idan so'ng barcha foydalanuvchilarga ko'rinadi.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ios-card rounded-3xl p-6 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Kurs nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Kurash asoslari: birinchi darslar"
              maxLength={255}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3c5a3c]/30 text-sm"
            />
            {title.length > 0 && title.trim().length < 3 && (
              <p className="text-xs text-red-600 mt-1.5">Kamida 3 ta belgi kiriting</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Tavsif</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurs haqida qisqacha ma'lumot..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3c5a3c]/30 text-sm resize-none"
            />
          </div>

          {/* Sport type */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Sport turi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SPORT_TYPES.map((sport) => (
                <button
                  key={sport}
                  type="button"
                  onClick={() => setSportType(sport)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    sportType === sport
                      ? "bg-[#3c5a3c] text-white border-[#3c5a3c]"
                      : "bg-secondary border-border text-primary hover:border-[#3c5a3c]/40"
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Daraja</label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    difficulty === opt.value
                      ? opt.color + " border-current"
                      : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video upload */}
          <FileDropZone
            label="Video fayl *"
            icon={<FileVideo className="w-6 h-6 text-[#3c5a3c]" />}
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            file={video}
            onFile={handleVideoFile}
            error={videoError}
            hint={`MP4, WebM, MOV yoki AVI — maksimal 500MB`}
          />

          {/* Thumbnail upload */}
          <FileDropZone
            label="Muqova rasmi (ixtiyoriy)"
            icon={<ImageIcon className="w-6 h-6 text-[#3c5a3c]" />}
            accept="image/jpeg,image/png,image/webp"
            file={thumbnail}
            onFile={handleThumbnailFile}
            error={thumbnailError}
            hint="JPG, PNG yoki WebP — maksimal 8MB"
          />

          {/* Form-level error */}
          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload progress */}
          {isSubmitting && (
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Yuklanmoqda...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full bg-[#3c5a3c]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <PillButton
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full justify-center ${(!isValid || isSubmitting) ? "opacity-50 pointer-events-none" : ""}`}
            icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            iconPosition="left"
          >
            {isSubmitting ? "Yuklanmoqda..." : "Kursni yuklash"}
          </PillButton>
        </motion.form>
      </div>

      <Footer />
    </div>
  )
}

export default function CourseUploadPage() {
  return (
    <LanguageProvider>
      <UploadContent />
    </LanguageProvider>
  )
}
