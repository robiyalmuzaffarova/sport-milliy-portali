"use client"
import Link from "next/link"
import Image from "next/image"
import { merchApi, cartApi } from "@/lib/api/client"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Percent, LayoutGrid, List, Sparkles, Loader2, ArrowRight } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IOSFilterPanel } from "@/components/ios/ios-filter-panel"
import { MerchCard } from "@/components/features/merch-card"
import { SegmentedControl } from "@/components/ios/segmented-control"
import { PillButton } from "@/components/ios/pill-button"
import { useEffect, useState } from "react"

const mockMerch = [
  {
    id: "1",
    title: "Diyora Kurash Forması - Professional",
    description: "Diyora Keldiyorova tomonidan tavsya qilingan professional kurash forması",
    image: "/kurash-sport-uniform-merchandise-uzbekistan.jpg",
    price: 485000,
    originalPrice: 570000,
    rating: 4.9,
    soldCount: 156,
    ownerName: "Diyora Keldiyorova",
    ownerImage: "/uzbek-male-wrestler-athlete-portrait.jpg",
    inStock: true,
    category: "clothing",
  },
  {
    id: "2",
    title: "Mavluda Tennis Raketi Premium",
    description: "Xalqaro turnirlar uchun professional darajadagi tennis raketi",
    image: "/professional-tennis-racket-merchandise.jpg",
    price: 1350000,
    originalPrice: 1600000,
    rating: 4.9,
    soldCount: 87,
    ownerName: "Mavluda Abdullayeva",
    ownerImage: "/uzbek-female-tennis-player-portrait.jpg",
    inStock: true,
    category: "equipment",
  },
  {
    id: "3",
    title: "Firdavs Boks Botimlari Elite",
    description: "Jahon chempioni Firdavs Xasanov tomonidan tavsya qilingan professional boks botimlari",
    image: "/boxing-gloves-merchandise-red.jpg",
    price: 420000,
    originalPrice: 510000,
    rating: 4.8,
    soldCount: 124,
    ownerName: "Firdavs Xasanov",
    ownerImage: "/uzbek-male-boxer-athlete-portrait.jpg",
    inStock: true,
    category: "accessories",
  },
  {
    id: "4",
    title: "Olimpik Sport Sumkasi Deluxe",
    description: "Maksimal sig'imli va zamonaviy dizayning sport sumkasi",
    image: "/premium-sport-bag-merchandise-black.jpg",
    price: 325000,
    originalPrice: 420000,
    rating: 4.7,
    soldCount: 287,
    ownerName: "Irina Sobolevskaya",
    ownerImage: "/uzbek-female-gymnast-athlete-portrait.jpg",
    inStock: true,
    category: "accessories",
  },
  {
    id: "5",
    title: "FIFA Futbol To'pi Official",
    description: "Xalqaro standartlarda FIFA sertifikatsiyali futbol to'pi",
    image: "/professional-football-ball-merchandise.jpg",
    price: 215000,
    originalPrice: 280000,
    rating: 4.6,
    soldCount: 398,
    ownerName: "Shavkat Karimov",
    ownerImage: "/uzbek-male-football-player-portrait.jpg",
    inStock: true,
    category: "equipment",
  },
  {
    id: "6",
    title: "Premium Suzish Kozynak HD",
    description: "Anti-fog HD linzali professional suzish ko'zynaklari",
    image: "/swimming-goggles-merchandise-professional.jpg",
    price: 125000,
    originalPrice: 165000,
    rating: 4.8,
    soldCount: 243,
    ownerName: "Marina Sobolevskaya",
    ownerImage: "/uzbek-female-swimmer-athlete-portrait.jpg",
    inStock: true,
    category: "accessories",
  },
]

const filterGroups = [
  {
    id: "category",
    label: "Kategoriya",
    type: "checkbox" as const,
    options: [
      { value: "clothing", label: "Kiyimlar", count: 156 },
      { value: "equipment", label: "Jihozlar", count: 89 },
      { value: "accessories", label: "Aksessuarlar", count: 124 },
      { value: "footwear", label: "Oyoq kiyim", count: 67 },
    ],
  },
  {
    id: "price",
    label: "Narx oralig'i",
    type: "radio" as const,
    options: [
      { value: "0-100000", label: "100,000 gacha" },
      { value: "100000-500000", label: "100,000 - 500,000" },
      { value: "500000+", label: "500,000 dan yuqori" },
    ],
  },
]

function MerchesContent() {
  const { t } = useLanguage()
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [likedItems, setLikedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState("grid")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [merchItems, setMerchItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  async function loadMerch() {
    try {
      console.log("🔄 [MERCHES PAGE] Fetching merchandise from API...")
      const data = await merchApi.getAll(0, 50)
      console.log("✅ [MERCHES PAGE] API Response:", data)
      console.log("📊 [MERCHES PAGE] Number of items:", data.items?.length || 0)
      
      const mapped = data.items.map((m: any) => ({
        id: m.id.toString(),
        title: m.name,
        description: m.description,
        image: m.image_url || "/kurash-sport-uniform-merchandise-uzbekistan.jpg",
        price: m.discount_percent > 0
          ? Math.round(m.price * (1 - m.discount_percent / 100))
          : m.price,
        originalPrice: m.discount_percent > 0 ? m.price : undefined,
        rating: 4.5 + (m.id % 5) / 10,
        soldCount: Math.floor((m.id * 13) % 100),
        ownerName: m.owner?.full_name || "Sportchi",
        ownerImage: m.owner?.avatar_url || "/uzbek-male-wrestler-athlete-portrait.jpg",
        inStock: m.stock > 0,
        category: m.category || m.type || "equipment",
      }))

      console.log("🗺️ [MERCHES PAGE] Mapped merchandise:", mapped)
      setMerchItems(mapped)
      console.log("✨ [MERCHES PAGE] Using real data:", mapped.length > 0)
    } catch (error) {
      console.error("❌ [MERCHES PAGE] Failed to load merch:", error)
      setMerchItems(mockMerch)
      console.log("⚠️ [MERCHES PAGE] Falling back to mock data")
    } finally {
      setIsLoading(false)
    }
  }

  async function loadFavorites() {
    const token = localStorage.getItem("access_token")
    if (!token) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/favorites`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await res.json()
      const likedIds = (data.items || []).map((item: any) => String(item.merch_id))
      setLikedItems(likedIds)
    } catch (error) {
      console.error("Failed to load favorites:", error)
    }
  }

  loadMerch()
  loadFavorites()
}, [])

  const filteredItems = merchItems.filter((item) => {
    // Search filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter - direct comparison with category field
    if (selectedFilters.category && selectedFilters.category.length > 0) {
      if (!selectedFilters.category.includes(item.category)) {
        return false
      }
    }

    // Price range filter
    if (selectedFilters.price && selectedFilters.price.length > 0) {
      const priceRange = selectedFilters.price[0]
      if (priceRange === "0-100000" && item.price > 100000) return false
      if (priceRange === "100000-500000" && (item.price < 100000 || item.price > 500000)) return false
      if (priceRange === "500000+" && item.price < 500000) return false
    }

    return true
  })

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [groupId]: values }))
  }

  const toggleLike = (id: string) => {
    setLikedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-card">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-8 bg-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-5 h-5 text-sport" />
                <span className="text-sm font-medium text-sport">Do'kon</span>
              </div>
              <h1 className="font-bold text-4xl md:text-5xl text-primary tracking-tight">{t.nav.merches}</h1>
              <p className="text-muted-foreground mt-3 max-w-xl">
                Sportchilarning shaxsiy brendlari va professional sport jihozlarini xarid qiling
              </p>
            </div>
          </motion.div>

          {/* Promo Cards - glass effect with image background, same treatment as
              the AI Buddy / Kurslar cards on the home page */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {/* Discount Card */}
            <Link href="/merches/discount" className="h-full">
              <motion.div
                className="relative rounded-3xl overflow-hidden h-full min-h-[220px] cursor-pointer hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/discount.jpg"
                    alt="50% gacha chegirma"
                    fill
                    className="object-cover"
                  />
                  {/* Brown/warm overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/95 via-amber-900/85 to-amber-800/70" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <Percent className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-white leading-tight">
                      50% gacha chegirma
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Tanlangan mahsulotlarga maxsus aksiya
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* New Arrivals Card */}
            <Link href="/merches/new" className="h-full">
              <motion.div
                className="relative rounded-3xl overflow-hidden h-full min-h-[220px] cursor-pointer hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/new-arrivals.jpg"
                    alt="Yangi kelganlar"
                    fill
                    className="object-cover"
                  />
                  {/* Green overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/85 to-green-800/70" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-white leading-tight">
                      Yangi kelganlar
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Eng so'nggi sport jihozlari kolleksiyasi
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <div className="sticky top-28">
                <IOSFilterPanel
                  searchPlaceholder="Mahsulot qidirish..."
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterGroups={filterGroups}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>

            {/* Mobile Filter */}
            <div className="lg:hidden">
              <PillButton
                variant="outline"
                className="w-full justify-center"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              >
                Filtrlar
                {Object.values(selectedFilters).flat().length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-sport text-white text-xs">
                    {Object.values(selectedFilters).flat().length}
                  </span>
                )}
              </PillButton>

              {mobileFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <IOSFilterPanel
                    searchPlaceholder="Mahsulot qidirish..."
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterGroups={filterGroups}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                  />
                </motion.div>
              )}
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6 ios-glass p-3 rounded-2xl">
                <p className="text-sm text-muted-foreground px-2">
                  <span className="font-semibold text-primary">{filteredItems.length}</span> mahsulot topildi
                </p>

                <SegmentedControl
                  options={[
                    { value: "grid", label: "", icon: <LayoutGrid className="w-4 h-4" /> },
                    { value: "list", label: "", icon: <List className="w-4 h-4" /> },
                  ]}
                  value={viewMode}
                  onChange={setViewMode}
                />
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-sport animate-spin mb-4" />
                  <p className="text-muted-foreground">Yuklanmoqda...</p>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <MerchCard
                          {...item}
                          isLiked={likedItems.includes(item.id)}
                          onToggleLike={async () => {
                            const token = localStorage.getItem("access_token")
                            if (!token) {
                              window.location.href = "/login"
                              return
                            }
                            try {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/favorites/toggle/${item.id}`,
                                {
                                  method: 'POST',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                }
                              )
                              const data = await res.json()
                              if (data.status === "liked") {
                                setLikedItems(prev => [...prev, item.id])
                              } else {
                                setLikedItems(prev => prev.filter(id => id !== item.id))
                              }
                            } catch (error) {
                              console.error("Failed to toggle favorite:", error)
                            }
                          }}
                          onAddToCart={async () => {
                            const token = localStorage.getItem("access_token")
                            if (!token) {
                              window.location.href = "/login"
                              return
                            }
                            try {
                              await cartApi.addToCart(Number(item.id), 1, token)
                              alert("Savatga qo'shildi!")
                            } catch (error) {
                              console.error("Failed to add to cart:", error)
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground">Criteria ga mos mahsulot topilmadi</p>
                </div>
              )}

              {/* Load More */}
              <div className="mt-10 text-center">
                <PillButton variant="outline" size="lg">
                  Ko'proq ko'rsatish
                </PillButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function MerchesPage() {
  return (
    <LanguageProvider>
      <MerchesContent />
    </LanguageProvider>
  )
}
