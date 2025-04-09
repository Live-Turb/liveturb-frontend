"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function PaymentLogos() {
  // Para telas pequenas, precisamos garantir que tudo se ajuste bem
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [progress, setProgress] = useState([0, 0, 0, 0, 0])
  // Ajustando o raio do círculo para ficar exatamente ao redor da imagem
  const circleRadius = 45 // Ajustado para corresponder ao raio da imagem
  const strokeWidth = 4
  const innerRadius = circleRadius - strokeWidth / 2
  const circumference = 2 * Math.PI * innerRadius

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => prev.map((p) => (p + 1) % 101))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Cores ajustadas para corresponder aos logos
  const colors = [
    { start: "#00A859", end: "#00D166" }, // Verde para Kiwify (verde mais escuro para verde mais claro)
    { start: "#0A2E81", end: "#1E50CF" }, // Azul escuro para ClickBank
    { start: "#2B78FE", end: "#0A4EFE" }, // Azul para Digistore24
    { start: "#FF5000", end: "#FF7A38" }, // Laranja para Hotmart
    { start: "#0066FF", end: "#000000" }, // Azul para preto para CartPanda
  ]

  const logos = [
    "/images/kiwify-logo.jpg",
    "/images/clickbank-logo.png",
    "/images/digistore-logo.jpg",
    "/images/hotmart-logo.png",
    "/images/cartpanda-logo.png",
  ]

  const logoNames = ["Kiwify", "ClickBank", "Digistore24", "Hotmart", "CartPanda"]

  return (
    <section className="py-8 bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center mb-6 w-full">
          <h2 className="text-xl font-bold text-white">Integrado com as Principais Plataformas de Vendas</h2>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row justify-center gap-2 md:gap-4 w-full max-w-4xl mx-auto">
            {progress.map((p, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colors[i].start} />
                        <stop offset="100%" stopColor={colors[i].end} />
                      </linearGradient>
                    </defs>

                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={innerRadius}
                      fill="transparent"
                      stroke="#e6e6e6"
                      strokeWidth={strokeWidth}
                    />

                    {/* Progress circle with gradient */}
                    <circle
                      cx="50"
                      cy="50"
                      r={innerRadius}
                      fill="transparent"
                      stroke={`url(#gradient-${i})`}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (p / 100) * circumference}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>

                  {/* Logo image in the center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[90px] h-[90px] rounded-full overflow-hidden">
                      <Image
                        src={logos[i] || "/placeholder.svg"}
                        alt={`${logoNames[i]} logo`}
                        width={130}
                        height={130}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Percentage display */}
                  <div className="absolute bottom-0 text-xs font-bold text-white">{p}%</div>
                </div>
                <h3 className="text-sm font-semibold mt-1 text-white text-center">{logoNames[i]}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

