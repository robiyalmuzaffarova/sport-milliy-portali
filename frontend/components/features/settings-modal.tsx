"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, KeyRound, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usersApi, authApi } from "@/lib/api/client"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const router = useRouter()

  // Password change
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  // Account deletion
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const handleChangePassword = async () => {
    setPasswordError("")
    setPasswordSuccess(false)

    if (newPassword.length < 8) {
      setPasswordError("Parol kamida 8 belgidan iborat bo'lishi kerak")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Parollar mos kelmadi")
      return
    }

    const token = localStorage.getItem("access_token")
    if (!token) return

    setIsSavingPassword(true)
    try {
      await usersApi.updateMe({ password: newPassword }, token)
      setPasswordSuccess(true)
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Parolni o'zgartirishda xatolik yuz berdi")
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    setIsDeleting(true)
    setDeleteError("")
    try {
      await usersApi.deleteMe(token)
      authApi.logout()
      router.push("/")
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Hisobni o'chirishda xatolik yuz berdi")
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sozlamalar</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Password change */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <KeyRound className="w-4 h-4" />
              Parolni o'zgartirish
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-new-password">Yangi parol</Label>
              <Input
                id="settings-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-confirm-password">Yangi parolni tasdiqlang</Label>
              <Input
                id="settings-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-green-600">Parol muvaffaqiyatli o'zgartirildi</p>}
            <Button
              onClick={handleChangePassword}
              disabled={isSavingPassword || !newPassword}
              className="bg-sport hover:bg-sport/90 text-white w-full"
            >
              {isSavingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Parolni yangilash
            </Button>
          </div>

          <div className="h-px bg-border" />

          {/* Danger zone */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-red-600">
              <Trash2 className="w-4 h-4" />
              Xavfli hudud
            </div>
            <p className="text-xs text-muted-foreground">
              Hisobingizni o'chirish qaytarib bo'lmaydigan amal. Barcha ma'lumotlaringiz butunlay yo'qoladi.
            </p>
            {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  Hisobni o'chirish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hisobni butunlay o'chirmoqchimisiz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu amalni ortga qaytarib bo'lmaydi. Profilingiz, kurslaringiz va boshqa barcha ma'lumotlaringiz
                    butunlay o'chiriladi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Ha, o'chirish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
