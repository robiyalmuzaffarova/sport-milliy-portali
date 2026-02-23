"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Upload } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authApi } from "@/lib/api/client"

function RegisterContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    userType: "",
    sportType: "",
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg']
      if (!validTypes.includes(file.type)) {
        setError('Faqat PNG yoki JPG formatida rasmlar yuborilishi mumkin')
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Fayl hajmi 5MB dan kam bo\'lishi kerak')
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      // Validate first step
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError("Iltimos, barcha maydonlarni to'ldiring")
        return
      }
      setStep(2)
      setError("")
      return
    }

    // Validate second step
    // Sport type is only required for athletes and trainers, not observers
    const requiresSportType = formData.userType === "athlete" || formData.userType === "trainer"
    if (!formData.password || !formData.userType || (requiresSportType && !formData.sportType)) {
      setError("Iltimos, barcha maydonlarni to'ldiring")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phone,
        role: formData.userType,
        sport_type: formData.sportType,
      })

      // If registration was successful, redirect to login
      if (response && response.id) {
        // User created successfully, redirect to login
        router.push("/login")
      } else if (response.access_token) {
        // Or if backend returns a token, auto-login
        localStorage.setItem("access_token", response.access_token)
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user))
        }
        router.push("/profile")
      } else {
        setError(response.message || "Registration failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
      console.error("Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/basket.jpg"
          alt="Sport Milliy Portali"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <Link href="/" className="absolute top-8 left-8 flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Sport Milliy Portali Logo"
              width={140}
              height={140}
              className="rounded-lg"
            />
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="font-serif font-bold text-4xl text-white mb-4">Jamiyatga qo&apos;shiling</h2>
            <p className="text-white/80 max-w-md">
              Ro&apos;yxatdan o&apos;ting va O&apos;zbekiston sport jamiyatining bir qismi bo&apos;ling
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-8">
            <Image
              src="/icon.png"
              alt="Sport Milliy Portali Logo"
              width={60}
              height={60}
              className="rounded-lg"
              priority
            />
            <div>
              <h1 className="font-serif font-bold text-lg text-foreground">Sport Milliy Portali</h1>
            </div>
          </Link>

          <div className="glass-card rounded-3xl p-8" suppressHydrationWarning>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-sport" : "bg-border"}`} />
              <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-sport" : "bg-border"}`} />
            </div>

            <h2 className="font-serif font-bold text-2xl text-card-foreground mb-2" suppressHydrationWarning>{t.nav.register}</h2>
            <p className="text-muted-foreground text-sm mb-8" suppressHydrationWarning>
              {step === 1 ? "Shaxsiy ma'lumotlaringizni kiriting" : "Qo'shimcha ma'lumotlar"}
            </p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" suppressHydrationWarning>To&apos;liq ism</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Ismingiz Familiyangiz"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" suppressHydrationWarning>Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="pl-12 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" suppressHydrationWarning>Parol</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className="pl-12 pr-12 h-12 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label suppressHydrationWarning>Foydalanuvchi turi</Label>
                    <Select value={formData.userType} onValueChange={(v) => handleChange("userType", v)}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="athlete">Sportchi</SelectItem>
                        <SelectItem value="trainer">Murabbiy</SelectItem>
                        <SelectItem value="observer">Kuzatuvchi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.userType === "athlete" || formData.userType === "trainer") && (
                    <>
                      <div className="space-y-2">
                        <Label suppressHydrationWarning>Sport turi</Label>
                        <Select value={formData.sportType} onValueChange={(v) => handleChange("sportType", v)}>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Sport turini tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kurash">Kurash</SelectItem>
                            <SelectItem value="boxing">Boxing</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="swimming">Suzish</SelectItem>
                            <SelectItem value="gymnastics">Gimnastika</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label suppressHydrationWarning>Hujjatlar</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={handleFileChange}
                          className="hidden"
                          aria-label="Upload documents"
                        />
                        <div
                          onClick={handleFileClick}
                          className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-sport transition-colors cursor-pointer"
                        >
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {selectedFile ? selectedFile.name : 'Passport va guvohnoma rasmini yuklang'}
                            <br />
                            <span className="text-xs">PNG, JPG - 5MB gacha</span>
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="flex gap-3">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-xl bg-transparent"
                  >
                    Orqaga
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-sport hover:bg-sport/90 text-white rounded-xl font-medium"
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Ro&apos;yxatdan o&apos;tilmoqda...
                    </span>
                  ) : step === 1 ? (
                    <span className="flex items-center gap-2">
                      Davom etish
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2" suppressHydrationWarning>
                      {t.nav.register}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground text-sm" suppressHydrationWarning>
                Hisobingiz bormi?{" "}
                <Link href="/login" className="text-sport font-medium hover:underline">
                  {t.nav.login}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div suppressHydrationWarning>
      <LanguageProvider>
        <RegisterContent />
      </LanguageProvider>
    </div>
  )
}
