"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"

function TermsContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground">Foydalanish Shartlari</h1>
            <p className="text-primary-foreground/70 mt-3 max-w-2xl">
              Sport Milliy Portali platformasini ishlatish uchun zarur shartlar va qoidalar
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Introduction */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Kirish</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ushbu foydalanish shartlari Sport Milliy Portali platformasidan foydalanish uchun sharti. Platformamizni
                ishlatish orqali siz ushbu shartlarni to'liq qabul qilasiz.
              </p>
            </div>

            {/* User Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Foydalanuvchi Masuliyati</h3>
              <p className="text-muted-foreground leading-relaxed">
                Siz quyidagilarga rozilik ko'rsatasiz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Siz haqiqiy va to'liq ma'lumotlarni taqdim qilasiz</li>
                <li>Akkauntingiz xavfsizligini himoya qilasiz va parol sirini saqlaysiz</li>
                <li>Platformada qonun buzuvchi yoki kamalfaiyana yoki zararli faoliyatda ishtirok etmaysiz</li>
                <li>Boshqa foydalanuvchilarning huquqlarini hurmat qilasiz</li>
                <li>Axborot va fikrlarni insonparvar va xavfli bo'lgan usulda taqdim qilasiz</li>
              </ul>
            </div>

            {/* Prohibited Activities */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Taqiqlangan Faoliyatlar</h3>
              <p className="text-muted-foreground leading-relaxed">
                Siz platformada quyidagi faoliyatlarda ishtirok etmagani rozilik beraysiz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Zarar yoki o'zni o'z huquqlarini cheklash uchun desiramangan kodi yoki virusi yuborish</li>
                <li>Burchilangan yoki noqonuniy maqsadlarda platformadan foydalanish</li>
                <li>Boshqa foydalanuvchilarni o'tisiga, tajovuzga yoki suiiste'mol qilishga urinish</li>
                <li>Platformaning xavfiylik tizimlarini o'tish yoki shikastlash</li>
                <li>Spam, reklamalar yoki zararli kontentni joylashtirish</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Intellektual Mulk Huquqlari</h3>
              <p className="text-muted-foreground leading-relaxed">
                Platformada joylashtirilgan barcha kontent (matnlar, rasmlar, video, logotiplar) Sport Milliy Portali
                yoki uning litsenziyalaridagi mulkidir. Siz bu kontentni shaxsiy, nokommertsiyaviy foydalanish uchun
                nusxa ko'chirishingiz va ishlatishingiz mumkin.
              </p>
            </div>

            {/* User Content */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Foydalanuvchi Kontenti</h3>
              <p className="text-muted-foreground leading-relaxed">
                Siz platformada joylashtiridigan kontent (profillar, postlar, rasmlar) uchun mas'ul. Siz bizga bu
                kontentni ishlatish, nusxa ko'chirish, tayyorlash va joylashtirish huquqini berayotgan bo'lsangiz.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Javobgarligni Cheklash</h3>
              <p className="text-muted-foreground leading-relaxed">
                Platform "o'zi bilan" taqdim etiladi. Biz platformaning foydali bo'lishiga yoki xatosiz bo'lishiga
                kafolat bermaymiz. Platformadan foydalanish natijasida yuzaga kelgan zararlardan biz javobgar emasmiz.
              </p>
            </div>

            {/* Termination */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Akkauntni To'xtatish</h3>
              <p className="text-muted-foreground leading-relaxed">
                Kami vaqt o'lchovida akkauntingizni to'xtatishi yoki o'chirishiga huquq bog'langan bo'lsa, ushbu
                shartlarning buzilishini o'rnatsa, sababi qilish uchun ogohlantirib yoki ogohlantirmay.
              </p>
            </div>

            {/* Payment Terms */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">To'lov Shartlari</h3>
              <p className="text-muted-foreground leading-relaxed">
                Premium xizmatlardan foydalanish uchun to'lovni talab qilib. Barcha to'lovlar oxirgi va qaytarilmaydigan.
                To'lov muddatlarini rejalashtirib, akkaunt faol bo'lguncha davom etadi.
              </p>
            </div>

            {/* Modifications */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Shartlarning O'zgarishlari</h3>
              <p className="text-muted-foreground leading-relaxed">
                Biz vaqti-vaqti bilan ushbu shartlarni o'zgartirish huquqiga egamiz. O'zgarishlar kuchga kiradigan vaqti
                platformada e'lon qilinadi.
              </p>
            </div>

            {/* Governing Law */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Qonun</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ushbu shartlar O'zbekiston Respublikasining qonunlari asosida kuchali. Barcha nizolar O'zbekiston
                Respublikasining sudlarida ko'rib chiqilishi mumkin.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4 p-6 bg-secondary rounded-lg">
              <h3 className="text-2xl font-bold text-primary">Aloqa</h3>
              <p className="text-muted-foreground leading-relaxed">
                Agar siz foydalanish shartlari haqida savollar bo'lsa, iltimos bizga quyidagi manzillarga murojaat
                qiling:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>📧 Email: maftuna@sportmilliyportali.uz</p>
                <p>📞 Telefon: +998941358035</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-sm text-muted-foreground text-center p-4 bg-secondary rounded-lg">
              <p>Oxirgi yangilangan: 14 Fevral, 2026</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function TermsPage() {
  return (
    <LanguageProvider>
      <TermsContent />
    </LanguageProvider>
  )
}
