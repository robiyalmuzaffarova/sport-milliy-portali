"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Dumbbell, Trophy, Users } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestions = [
  { icon: Dumbbell, text: "Qaysi sport turi menga mos keladi?" },
  { icon: Trophy, text: "Yaqin orada qanday musobaqalar bo'ladi?" },
  { icon: Users, text: "Eng yaxshi murabbiylarni tavsiya qiling" },
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Assalomu alaykum! Men Sport Milliy Portali AI yordamchisiman. Sizga sport turlari, murabbiylar, musobaqalar va boshqa sport bilan bog'liq savollarda yordam berishim mumkin. Qanday savolingiz bor?",
    timestamp: new Date(),
  },
]

function AIBuddyContent() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Qaysi sport turi menga mos keladi?":
          "Sport turini tanlash uchun bir necha omillarni hisobga olish kerak: yoshingiz, jismoniy tayyorgarligingiz, qiziqishlaringiz va maqsadlaringiz. Masalan, agar siz kuchli va chidamli bo'lsangiz, kurash yoki boks mos kelishi mumkin. Tennis va suzish esa moslashuvchanlik va koordinatsiyani rivojlantiradi. Siz haqingizda ko'proq ma'lumot bersangiz, aniqroq tavsiya berishim mumkin.",
        "Yaqin orada qanday musobaqalar bo'ladi?":
          "Yaqin orada quyidagi musobaqalar rejalashtirilgan:\n\n1. Kurash bo'yicha O'zbekiston chempionati - 25 Yanvar\n2. Boxing bo'yicha xalqaro turnir - 5 Fevral\n3. Tennis bo'yicha Grand Slam saralash - 15 Fevral\n4. Futbol ligasi yangi mavsumi - 1 Mart\n\nQaysi sport turi sizni qiziqtiradi?",
        "Eng yaxshi murabbiylarni tavsiya qiling":
          "Eng yuqori reytingli murabbiylarimiz:\n\n1. Anvar Rahimov (Kurash) - 4.9 reyting, 15 yillik tajriba\n2. Bekzod Tursunov (Boxing) - 4.7 reyting, 20 yillik tajriba\n3. Olga Petrova (Tennis) - 4.8 reyting, 12 yillik tajriba\n\nBular haqida batafsil ma'lumot olish uchun Murabbiylar bo'limiga o'ting.",
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responses[messageText] ||
          "Rahmat savolingiz uchun! Sizga yordam berishdan xursandman. Agar sport turlari, murabbiylar, musobaqalar yoki boshqa mavzular haqida savollaringiz bo'lsa, bemalol so'rang.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-5rem)]">
          {/* Header */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-sport flex items-center justify-center">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-serif font-bold text-3xl text-foreground">{t.nav.aiBuddy}</h1>
            <p className="text-muted-foreground mt-2">Sport bo&apos;yicha shaxsiy yordamchingiz</p>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                      message.role === "assistant" ? "bg-sport text-white" : "bg-secondary"
                    }`}
                  >
                    {message.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "assistant"
                        ? "bg-card text-card-foreground neu-card"
                        : "bg-sport text-white ml-auto"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sport text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-card rounded-2xl px-4 py-3 neu-card">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Tavsiya etilgan savollar
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2 border-border bg-card hover:bg-sport hover:text-white hover:border-sport"
                    onClick={() => handleSend(suggestion.text)}
                  >
                    <suggestion.icon className="w-4 h-4" />
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Savolingizni yozing..."
              className="flex-1 h-14 rounded-2xl bg-card border-border text-base"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-14 h-14 rounded-2xl bg-sport hover:bg-sport/90 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AIBuddyPage() {
  return (
    <LanguageProvider>
      <AIBuddyContent />
    </LanguageProvider>
  )
}
