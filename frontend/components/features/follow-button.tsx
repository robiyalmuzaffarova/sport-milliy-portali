"use client"

import { useState } from "react"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { followApi } from "@/lib/api/client"

interface FollowButtonProps {
  userId: number
  initialIsFollowing: boolean
  initialFollowersCount: number
  onFollowersCountChange?: (count: number) => void
  className?: string
}

export function FollowButton({
  userId,
  initialIsFollowing,
  initialFollowersCount,
  onFollowersCountChange,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    setIsLoading(true)
    // Optimistic update — reverted in the catch block if the request fails
    const previousIsFollowing = isFollowing
    setIsFollowing(!previousIsFollowing)
    try {
      const data = await followApi.toggle(userId, token)
      setIsFollowing(data.status === "followed")
      onFollowersCountChange?.(data.followers_count)
    } catch (err) {
      console.error("Failed to toggle follow:", err)
      setIsFollowing(previousIsFollowing)
      alert(err instanceof Error ? err.message : "Kuzatishda xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={
        className ||
        (isFollowing
          ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl gap-2"
          : "bg-sport hover:bg-sport/90 text-white rounded-xl gap-2 shadow-lg shadow-sport/30")
      }
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="w-4 h-4" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      {isFollowing ? "Kuzatishni bekor qilish" : "Kuzatish"}
    </Button>
  )
}
