import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sport Milliy Portali | O'zbekiston Sport Jamiyati",
  description:
    "O'zbekistonning milliy sport portali - murabbiylar va sportchilar uchun ochiq raqamli portfolio tizimi. Sportchilarni toping, kurslarga yoziling, va sport jamiyatiga qo'shiling.",
  keywords: ["sport", "uzbekistan", "athletes", "trainers", "sportchilar", "murabbiylar", "portfolio"],
  authors: [{ name: "Sport Milliy Portali" }],
  generator: "Next.js",
  openGraph: {
    title: "Sport Milliy Portali",
    description: "O'zbekistonning milliy sport portali",
    url: "https://sportmilliyportali.uz",
    siteName: "Sport Milliy Portali",
    locale: "uz_UZ",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
