"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usersApi } from "@/lib/api/client"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUser: any
  onSaved: (updatedUser: any) => void
}

export function EditProfileModal({ open, onOpenChange, currentUser, onSaved }: EditProfileModalProps) {
  const [fullName, setFullName] = useState(currentUser.full_name || "")
  const [phone, setPhone] = useState(currentUser.phone || "")
  const [sportType, setSportType] = useState(currentUser.sport_type || "")
  const [location, setLocation] = useState(currentUser.location || "")
  const [bio, setBio] = useState(currentUser.bio || "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    setIsSaving(true)
    setError("")
    try {
      const updated = await usersApi.updateMe(
        {
          full_name: fullName,
          phone: phone || null,
          sport_type: sportType || null,
          location: location || null,
          bio: bio || null,
        },
        token
      )
      onSaved(updated)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xatolik yuz berdi")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profilni tahrirlash</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-full-name">Ism familiya</Label>
            <Input id="edit-full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">Telefon</Label>
            <Input id="edit-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-sport">Sport turi</Label>
            <Input id="edit-sport" value={sportType} onChange={(e) => setSportType(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-location">Manzil</Label>
            <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-bio">Bio</Label>
            <Textarea id="edit-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Bekor qilish
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-sport hover:bg-sport/90 text-white">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
