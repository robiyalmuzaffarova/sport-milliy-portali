"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react"
import { PillButton } from "./pill-button"
import { cn } from "@/lib/utils"

interface FilterGroup {
  id: string
  label: string
  options: { value: string; label: string; count?: number }[]
  type?: "radio" | "checkbox"
}

interface IOSFilterPanelProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filterGroups: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, values: string[]) => void
  onClearAll?: () => void
  moreCount?: number
  className?: string
}

export function IOSFilterPanel({
  searchPlaceholder = "Qidirish...",
  searchValue = "",
  onSearchChange,
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearAll,
  moreCount,
  className,
}: IOSFilterPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([filterGroups[0]?.id || ""])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleOptionToggle = (groupId: string, value: string, type: "radio" | "checkbox") => {
    const current = selectedFilters[groupId] || []
    if (type === "radio") {
      onFilterChange(groupId, [value])
    } else {
      if (current.includes(value)) {
        onFilterChange(
          groupId,
          current.filter((v) => v !== value),
        )
      } else {
        onFilterChange(groupId, [...current, value])
      }
    }
  }

  const totalSelected = Object.values(selectedFilters).flat().length

  return (
    <div className={cn("ios-card p-5 rounded-3xl", className)}>
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-secondary border-0 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sport/30 transition-shadow"
        />
      </div>

      {/* Filter Groups */}
      <div className="space-y-1">
        {filterGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id)
          const selected = selectedFilters[group.id] || []

          return (
            <div key={group.id} className="border-b border-border last:border-0">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="font-semibold text-primary">{group.label}</span>
                <div className="flex items-center gap-2">
                  {selected.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-sport/10 text-sport text-xs font-medium">
                      {selected.length}
                    </span>
                  )}
                  <ChevronDown
                    className={cn("w-5 h-5 text-muted-foreground transition-transform", isExpanded && "rotate-180")}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 space-y-2">
                      {group.options.slice(0, 5).map((option) => {
                        const isSelected = selected.includes(option.value)
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleOptionToggle(group.id, option.value, group.type || "checkbox")}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                              isSelected ? "bg-sport/10 text-sport" : "bg-secondary hover:bg-secondary/80 text-primary",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                  isSelected ? "border-sport bg-sport" : "border-muted-foreground/30",
                                )}
                              >
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm font-medium">{option.label}</span>
                            </div>
                            {option.count !== undefined && (
                              <span className="text-xs text-muted-foreground">{option.count}</span>
                            )}
                          </button>
                        )
                      })}

                      {group.options.length > 5 && (
                        <button className="w-full text-center py-2 text-sm font-medium text-sport hover:underline">
                          +{group.options.length - 5} ko'proq
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-5 pt-5 border-t border-border space-y-3">
        {totalSelected > 0 && (
          <button
            onClick={onClearAll}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            Tozalash ({totalSelected})
          </button>
        )}
        <PillButton variant="filled" className="w-full bg-primary hover:bg-primary/90">
          <SlidersHorizontal className="w-4 h-4" />
          Filterlash
        </PillButton>
      </div>
    </div>
  )
}
