"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/lib/api/client"

function LoginContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Create FormData for OAuth2
      const formData = new FormData()
      formData.append("username", email)
      formData.append("password", password)

      const response = await authApi.login(formData)

      // Store token and user data
      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token)
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user))
        }

        // Redirect to profile
        router.push("/profile")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/go.jpg"
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
            <h2 className="font-serif font-bold text-4xl text-white mb-4">{t.hero.tagline}</h2>
            <p className="text-white/80 max-w-md">{t.hero.subtitle}</p>
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
            <h2 className="font-serif font-bold text-2xl text-card-foreground mb-2" suppressHydrationWarning>{t.nav.login}</h2>
            <p className="text-muted-foreground text-sm mb-8" suppressHydrationWarning>Hisobingizga kiring va davom eting</p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
              <div className="space-y-2">
                <Label htmlFor="email" suppressHydrationWarning>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" suppressHydrationWarning>Parol</Label>
                  <Link href="/forgot-password" className="text-sm text-sport hover:underline" suppressHydrationWarning>
                    Parolni unutdingizmi?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-sport hover:bg-sport/90 text-white rounded-xl font-medium"
                suppressHydrationWarning
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kirish...
                  </span>
                ) : (
                  <span className="flex items-center gap-2" suppressHydrationWarning>
                    {t.nav.login}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground text-sm" suppressHydrationWarning>
                Hisobingiz yo&apos;qmi?{" "}
                <Link href="/register" className="text-sport font-medium hover:underline">
                  {t.nav.register}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div suppressHydrationWarning>
      <LanguageProvider>
        <LoginContent />
      </LanguageProvider>
    </div>
  )
}
