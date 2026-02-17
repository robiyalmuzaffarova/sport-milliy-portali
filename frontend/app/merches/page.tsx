"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Percent, LayoutGrid, List, Sparkles, Loader2 } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IOSFilterPanel } from "@/components/ios/ios-filter-panel"
import { MerchCard } from "@/components/features/merch-card"
import { SegmentedControl } from "@/components/ios/segmented-control"
import { PillButton } from "@/components/ios/pill-button"
import { BentoCard } from "@/components/ios/bento-card"
import { useEffect, useState } from "react"
import { merchApi } from "@/lib/api/client"

const mockMerch = [
  {
    id: "1",
    title: "Kurash sport formasi",
    description: "Professional kurash mashqlari uchun maxsus forma",
    image: "/kurash-sport-uniform-merchandise-uzbekistan.jpg",
    price: 450000,
    originalPrice: 550000,
    rating: 4.8,
    soldCount: 124,
    ownerName: "Akmal Nurmatov",
    ownerImage: "/uzbek-male-wrestler-athlete-portrait.jpg",
    inStock: true,
    category: "clothing",
  },
  {
    id: "2",
    title: "Tennis raketi Pro",
    description: "Professional darajadagi tennis raketi",
    image: "/professional-tennis-racket-merchandise.jpg",
    price: 1200000,
    rating: 4.9,
    soldCount: 67,
    ownerName: "Dilnoza Karimova",
    ownerImage: "/uzbek-female-tennis-player-portrait.jpg",
    inStock: true,
    category: "equipment",
  },
  {
    id: "3",
    title: "Boxing qo'lqoplari",
    description: "Professional boxing mashqlari uchun qo'lqoplar",
    image: "/boxing-gloves-merchandise-red.jpg",
    price: 380000,
    originalPrice: 450000,
    rating: 4.7,
    soldCount: 89,
    ownerName: "Rustam Xoliqov",
    ownerImage: "/uzbek-male-boxer-athlete-portrait.jpg",
    inStock: true,
    category: "accessories",
  },
  {
    id: "4",
    title: "Sport sumka Premium",
    description: "Katta sig'imli sport sumkasi",
    image: "/premium-sport-bag-merchandise-black.jpg",
    price: 290000,
    rating: 4.6,
    soldCount: 203,
    ownerName: "Malika Azimova",
    ownerImage: "/uzbek-female-gymnast-athlete-portrait.jpg",
    inStock: true,
    category: "accessories",
  },
  {
    id: "5",
    title: "Futbol to'pi Professional",
    description: "FIFA standartlariga mos futbol to'pi",
    image: "/professional-football-ball-merchandise.jpg",
    price: 180000,
    rating: 4.5,
    soldCount: 312,
    ownerName: "Jamshid Raximov",
    ownerImage: "/uzbek-male-football-player-portrait.jpg",
    inStock: false,
    category: "equipment",
  },
  {
    id: "6",
    title: "Suzish ko'zoynaklari",
    description: "Anti-fog texnologiyali suzish ko'zoynaklari",
    image: "/swimming-goggles-merchandise-professional.jpg",
    price: 95000,
    originalPrice: 120000,
    rating: 4.8,
    soldCount: 178,
    ownerName: "Nilufar Saidova",
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
          price: m.price,
          originalPrice: m.price * 1.2, // Simulated
          rating: 4.5 + (m.id % 5) / 10,
          soldCount: Math.floor((m.id * 13) % 100),
          ownerName: m.owner?.full_name || "Sportchi",
          ownerImage: m.owner?.avatar_url || "/uzbek-male-wrestler-athlete-portrait.jpg",
          inStock: m.stock > 0,
          category: m.category || m.type || "equipment", // Get category from API or default to equipment
        }))
        console.log("🗺️ [MERCHES PAGE] Mapped merchandise:", mapped)
        
        setMerchItems(mapped.length > 0 ? mapped : mockMerch)
        console.log("✨ [MERCHES PAGE] Using real data:", mapped.length > 0)
      } catch (error) {
        console.error("❌ [MERCHES PAGE] Failed to load merch:", error)
        setMerchItems(mockMerch)
        console.log("⚠️ [MERCHES PAGE] Falling back to mock data")
      } finally {
        setIsLoading(false)
      }
    }
    loadMerch()
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

          {/* Promo Cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <BentoCard
              title="50% gacha chegirma"
              description="Tanlangan mahsulotlarga maxsus aksiya"
              icon={<Percent className="w-6 h-6" />}
              variant="warm"
              size="md"
            >
              <div className="mt-3">
                <PillButton size="sm" className="bg-white text-warm hover:bg-white/90">
                  Ko'rish
                </PillButton>
              </div>
            </BentoCard>
            <BentoCard
              title="Yangi kelganlar"
              description="Eng so'nggi sport jihozlari kolleksiyasi"
              icon={<Sparkles className="w-6 h-6" />}
              variant="sport"
              size="md"
            >
              <div className="mt-3">
                <PillButton size="sm" className="bg-white text-sport hover:bg-white/90">
                  Ko'rish
                </PillButton>
              </div>
            </BentoCard>
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
                          onToggleLike={() => toggleLike(item.id)}
                          onAddToCart={() => console.log("Add to cart:", item.id)}
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
