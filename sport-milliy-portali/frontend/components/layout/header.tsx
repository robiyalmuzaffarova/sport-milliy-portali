"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import type { Language } from "@/lib/i18n/translations"
import { Menu, X, Globe, ShoppingCart, Heart, User, MapPin, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ios/segmented-control"
import { PillButton } from "@/components/ios/pill-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
]

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState("menu")

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-sport/90 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-sport font-bold text-base">S</span>
              </div>
              <span className="hidden sm:block font-semibold text-white">Sport Milliy</span>
            </Link>

            <div className="hidden lg:block">
              <SegmentedControl
                className="bg-white/10"
                variant="white"
                options={[
                  { value: "menu", label: t.nav.home, icon: <LayoutGrid className="w-4 h-4" /> },
                  { value: "map", label: "Xarita", icon: <MapPin className="w-4 h-4" /> },
                ]}
                value={activeNav}
                onChange={setActiveNav}
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  href="/athletes"
                  className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg transition-colors"
                >
                  {t.nav.athletes}
                </Link>
                <Link
                  href="/trainers"
                  className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg transition-colors"
                >
                  {t.nav.trainers}
                </Link>
                <Link
                  href="/news"
                  className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg transition-colors"
                >
                  {t.nav.news}
                </Link>
                <Link
                  href="/merches"
                  className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-lg transition-colors"
                >
                  {t.nav.merches}
                </Link>
              </nav>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-white/20 mx-2" />

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/10">
                    <Globe className="w-4 h-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ios-card border-0 shadow-xl min-w-[160px]">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={cn("cursor-pointer rounded-lg", language === lang.code && "bg-sport/10")}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-1">
                <Link href="/favorites">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/10">
                    <Heart className="w-4 h-4 text-white" />
                  </Button>
                </Link>
                <Link href="/carts">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/10 relative">
                    <ShoppingCart className="w-4 h-4 text-white" />
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-[10px] text-sport rounded-full flex items-center justify-center font-bold">
                      3
                    </span>
                  </Button>
                </Link>
              </div>

              <Link href="/profile" className="hidden md:block">
                <PillButton variant="filled" size="sm" className="bg-white text-sport hover:bg-white/90 border-0" icon={<User className="w-4 h-4" />}>
                  {t.nav.login}
                </PillButton>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 rounded-lg text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-sport border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/athletes"
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.athletes}
              </Link>
              <Link
                href="/trainers"
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.trainers}
              </Link>
              <Link
                href="/ai-buddy"
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.aiBuddy}
              </Link>
              <Link
                href="/news"
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.news}
              </Link>
              <Link
                href="/merches"
                className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.merches}
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex gap-2">
              <Link href="/login" className="flex-1">
                <PillButton variant="outline" className="w-full text-white border-white/30 hover:bg-white/10">
                  {t.nav.login}
                </PillButton>
              </Link>
              <Link href="/register" className="flex-1">
                <PillButton variant="filled" className="w-full bg-white text-sport hover:bg-white/90">
                  {t.nav.register}
                </PillButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
