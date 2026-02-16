"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"

function PrivacyContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary-foreground">Maxfiylik Siyosati</h1>
            <p className="text-primary-foreground/70 mt-3 max-w-2xl">
              Sport Milliy Portali foydalanuvchilarining shaxsiy ma'lumotlarining himoyasini jiddiy qabul qiladi
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
                Bu maxfiylik siyosati Sport Milliy Portali platformasida qanday qilib sizning shaxsiy ma'lumotlarni
                jamlash, ishlatish va himoya qilishini tushuntiradi. Platformamizdan foydalanish orqali siz ushbu
                siyosatni qabul qilasiz.
              </p>
            </div>

            {/* Collected Information */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Jamlangan Ma'lumotlar</h3>
              <p className="text-muted-foreground leading-relaxed">
                Biz quyidagi ma'lumotlarni jamlashimiz mumkin:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Isim, elektron pochta manzili va telefon raqami</li>
                <li>Akkaunt profili ma'lumotlari (sport turi, yangi yutuqlar, reyting)</li>
                <li>Sayt foydalanish ma'lumotlari va faoliyat tarixlari</li>
                <li>To'lov ma'lumotlari (xavfsiz usullar orqali)</li>
                <li>Brauzer ma'lumotlari va IP manzili</li>
              </ul>
            </div>

            {/* Data Usage */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Ma'lumotlardan Foydalanish</h3>
              <p className="text-muted-foreground leading-relaxed">
                Biz sizning ma'lumotlardan quyidagi maqsadlarda foydalanamiz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Akkauntni yaratish va boshqarish</li>
                <li>Xizmatlarni taqdim etish va yaxshilash</li>
                <li>O'zaro munosabatlar va xabar yuborish</li>
                <li>Xavfsizlik va saxt huquqlarini himoya qilish</li>
                <li>Qonuniy talablarni bajarishni ta'minlash</li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Ma'lumotlarning Himoyasi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Biz sizning shaxsiy ma'lumotlarini himoya qilish uchun xavfsizlik choralarini qo'llaymiz. Biroq, hech
                qanday internet yoki elektron pochta uzatishi 100% xavfsiz emas.
              </p>
            </div>

            {/* Third Party */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Uchinchi Tomonlar</h3>
              <p className="text-muted-foreground leading-relaxed">
                Biz sizning shaxsiy ma'lumotlarini uchinchi tomonlarga sotmaymiz, sotmaymiz yoki tugatmaymiz. Biz
                xizmatlarni taqdim etish uchun ishonchli hamkorlar bilan ma'lumotlarni almashishimiz mumkin.
              </p>
            </div>

            {/* User Rights */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Foydalanuvchi Huquqlari</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sizda quyidagi huquqlar mavjud:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Bizniga o'z ma'lumotlarini taqdim etish huquqi</li>
                <li>O'z ma'lumotlarini o'zgartirish yoki o'chirish huquqi</li>
                <li>Ma'lumotlarning qayta ishlanishiga e'tiroz bildirish huquqi</li>
                <li>O'z ma'lumotlarni yig'indi formatida olish huquqi</li>
              </ul>
            </div>

            {/* Updates */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Siyosatning O'zgarishlari</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bu maxfiylik siyosati vaqti-vaqti bilan o'zgarilishi mumkin. Muhim o'zgarishlari haqida sizni
                xabardor qilamiz.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4 p-6 bg-secondary rounded-lg">
              <h3 className="text-2xl font-bold text-primary">Aloqa</h3>
              <p className="text-muted-foreground leading-relaxed">
                Agar siz maxfiylik siyosati haqida savollar bo'lsa, iltimos bizga quyidagi manzillarga murojaat qiling:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>📧 Email: maftuna@sportmilliyportali.uz</p>
                <p>📞 Telefon: +998941358035</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <LanguageProvider>
      <PrivacyContent />
    </LanguageProvider>
  )
}
