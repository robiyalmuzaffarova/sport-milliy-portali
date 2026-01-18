"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  type: "checkbox" | "radio"
}

interface FilterPanelProps {
  searchPlaceholder?: string
  filterGroups: FilterGroup[]
  onSearchChange?: (value: string) => void
  onFilterChange?: (groupId: string, values: string[]) => void
  selectedFilters?: Record<string, string[]>
  className?: string
}

export function FilterPanel({
  searchPlaceholder = "Qidirish...",
  filterGroups,
  onSearchChange,
  onFilterChange,
  selectedFilters = {},
  className,
}: FilterPanelProps) {
  const [searchValue, setSearchValue] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<string[]>(filterGroups.map((g) => g.id))
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange?.(value)
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleFilterToggle = (groupId: string, value: string) => {
    const current = selectedFilters[groupId] || []
    const group = filterGroups.find((g) => g.id === groupId)

    if (group?.type === "radio") {
      onFilterChange?.(groupId, current.includes(value) ? [] : [value])
    } else {
      onFilterChange?.(groupId, current.includes(value) ? current.filter((v) => v !== value) : [...current, value])
    }
  }

  const clearAllFilters = () => {
    filterGroups.forEach((group) => {
      onFilterChange?.(group.id, [])
    })
    setSearchValue("")
    onSearchChange?.("")
  }

  const hasActiveFilters = searchValue || Object.values(selectedFilters).some((values) => values && values.length > 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 h-12 rounded-2xl bg-input border-border"
        />
      </div>

      {/* Filter Groups */}
      {filterGroups.map((group) => (
        <div key={group.id} className="border-b border-border pb-4 last:border-0">
          <button
            onClick={() => toggleGroup(group.id)}
            className="flex items-center justify-between w-full py-2 font-serif font-bold text-foreground"
          >
            {group.label}
            <ChevronDown
              className={cn("w-5 h-5 transition-transform", expandedGroups.includes(group.id) && "rotate-180")}
            />
          </button>

          <AnimatePresence>
            {expandedGroups.includes(group.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-2">
                  {group.options.map((option) => {
                    const isSelected = selectedFilters[group.id]?.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleFilterToggle(group.id, option.value)}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-left transition-colors",
                          isSelected
                            ? "bg-sport text-white"
                            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                        )}
                      >
                        <span className="text-sm">{option.label}</span>
                        {option.count !== undefined && (
                          <span className={cn("text-xs", isSelected ? "text-white/80" : "text-muted-foreground")}>
                            {option.count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full rounded-xl border-border bg-transparent">
          Filtrlarni tozalash
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filter Panel */}
      <div className={cn("hidden lg:block", className)}>
        <div className="glass-card rounded-3xl p-6 sticky top-24">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden">
        <Button
          onClick={() => setMobileFiltersOpen(true)}
          variant="outline"
          className="rounded-xl gap-2 border-border bg-card"
        >
          <Filter className="w-4 h-4" />
          Filtrlar
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-sport" />}
        </Button>

        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed top-0 right-0 bottom-0 w-80 bg-card z-50 p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif font-bold text-xl">Filtrlar</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
