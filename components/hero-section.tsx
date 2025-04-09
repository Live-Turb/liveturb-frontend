"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Users, TrendingUp, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { // Corrigido tipo para MouseEvent nativo
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Função para rolar até a seção de preços
  const scrollToPrecos = () => {
    const precosSection = document.getElementById("precos")
    if (precosSection) {
      precosSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      title: "Audiência 10x Maior",
      description: "Aumente o tempo médio de visualização com a sensação de transmissão ao vivo.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-400" />,
      title: "Aumento de 700% nas Conversões",
      description: "Clientes relatam aumento médio de 700% nas taxas de conversão.",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-yellow-400" />,
      title: "ROI Garantido de 1000%",
      description: "Retorno sobre investimento médio de 1000% nos primeiros 30 dias.",
    },
  ]

  // Avatar images
  const avatarImages = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
  ]

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black to-blue-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full filter blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: "spring", damping: 10 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl"
          animate={{
            x: -mousePosition.x * 0.01,
            y: -mousePosition.y * 0.01,
          }}
          transition={{ type: "spring", damping: 15 }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                <span className="relative">
                  Transforme Sua VSL em{" "}
                  <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Lives Interativas
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>{" "}
                com IA
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Aumente suas conversões em até{" "}
                <motion.span
                  className="font-bold text-green-400"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  700%
                </motion.span>{" "}
                com a tecnologia que está revolucionando o mercado digital brasileiro
              </p>
            </motion.div>

            {/* Rotating features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-full bg-white/10">{features[activeFeature].icon}</div>
                  <div>
                    <h3 className="font-bold text-white">{features[activeFeature].title}</h3>
                    <p className="text-sm text-gray-300">{features[activeFeature].description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center mt-3 gap-1">
                {features.map((_, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      activeFeature === idx ? "bg-blue-500" : "bg-white/20",
                    )}
                    onClick={() => setActiveFeature(idx)}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none text-lg px-8 group relative overflow-hidden"
                onClick={scrollToPrecos}
              >
                <span className="relative z-10">Começar Gratuitamente</span>
                <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-950/50 text-lg px-8 flex items-center gap-2"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <Play className="h-4 w-4" />
                Veja Como Funciona
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-400"
            >
              <div className="flex items-center">
                <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
                10.000+ usuários ativos
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
                ROI médio de 30%
              </div>
              <div className="flex items-center">
                <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
                Implementação em 5 minutos
              </div>
            </motion.div>
          </div>

          {/* Hero image/video section */}
          <div className="flex-1 w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-sm" />
              <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-white/10 aspect-video">
                <Image
                  src="/images/vsl.jpg" // Substituído placeholder
                  alt="LiveTurb Demo"
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="rounded-full w-16 h-16 bg-blue-600/90 hover:bg-blue-700 text-white flex items-center justify-center"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>

                {/* Simulated live elements */}
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                  AO VIVO
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {avatarImages.map((avatar, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden">
                        <Image
                          src={avatar || "/placeholder.svg"}
                          alt={`Usuário ${i + 1}`}
                          width={50}
                          height={50}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-white bg-black/50 px-2 py-1 rounded-full">+1.2k assistindo agora</div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -right-4 -top-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                +700% Conversões
              </motion.div>

              <motion.div
                className="absolute -left-4 -bottom-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                10x Engajamento
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center"
                onClick={() => setIsVideoModalOpen(false)}
              >
                ✕
              </button>
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <p className="text-white">Vídeo de demonstração</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

