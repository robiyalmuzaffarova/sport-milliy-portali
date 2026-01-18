"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Facebook, Instagram, Youtube, Send, MapPin, Phone, Mail } from "lucide-react"
import { PillButton } from "@/components/ios/pill-button"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Timeline Section - iOS Style */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <span className="text-3xl font-light text-white/40 tabular-nums">1991</span>
            <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-sport flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight">Sport Milliy Portali</span>
                <p className="text-xs text-white/50">O'zbekiston sport jamiyati</p>
              </div>
            </div>
            <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block" />
            <span className="text-3xl font-light text-white/40 tabular-nums">{currentYear}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Biz haqimizda</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              O'zbekistonning milliy sport portali - murabbiylar va sportchilar uchun ochiq raqamli portfolio tizimi.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-sport flex items-center justify-center transition-all hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-sport flex items-center justify-center transition-all hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-sport flex items-center justify-center transition-all hover:scale-105"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-sport flex items-center justify-center transition-all hover:scale-105"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Tezkor havolalar</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/athletes"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.athletes}
                </Link>
              </li>
              <li>
                <Link
                  href="/trainers"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.trainers}
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <Link
                  href="/education"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.education}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Xizmatlar</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/ai-buddy"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.aiBuddy}
                </Link>
              </li>
              <li>
                <Link
                  href="/merches"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.merches}
                </Link>
              </li>
              <li>
                <Link
                  href="/monetization"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.monetization}
                </Link>
              </li>
              <li>
                <Link
                  href="/job-vacancies"
                  className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sport opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t.nav.jobs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.footer.contact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-5 h-5 text-sport shrink-0 mt-0.5" />
                <span>Toshkent sh., Amir Temur ko'chasi, 108</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-5 h-5 text-sport shrink-0" />
                <span>+998 71 123 45 67</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-5 h-5 text-sport shrink-0" />
                <span>info@sportmilliyportali.uz</span>
              </li>
            </ul>

            <div className="mt-6">
              <PillButton variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Aloqa qilish
              </PillButton>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © {currentYear} Sport Milliy Portali. {t.footer.rights}.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-white/40 hover:text-white transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="/terms" className="text-white/40 hover:text-white transition-colors">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
