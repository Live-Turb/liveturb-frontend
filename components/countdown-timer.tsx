"use client"

import { motion } from "framer-motion"

export default function CountdownTimer() {
  return (
    <section className="relative overflow-hidden">
      {/* Barra principal contínua */}
      <div className="relative w-full h-12 overflow-hidden bg-green-600">
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 80, // Alterado de 20 para 80 para movimento muito mais lento
            ease: "linear",
          }}
          className="absolute w-[200%] h-full flex items-center"
        >
          {/* Primeira metade do texto repetido */}
          <div className="flex items-center w-full">
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <div key={`first-${i}`} className="flex items-center mx-8 whitespace-nowrap">
                  <span className="font-bold text-white text-lg md:text-xl">//LIVE</span>
                  <span className="font-bold text-white/80 text-lg md:text-xl ml-1">TURB.</span>
                </div>
              ))}
          </div>

          {/* Segunda metade do texto repetido (para criar o efeito contínuo) */}
          <div className="flex items-center w-full">
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <div key={`second-${i}`} className="flex items-center mx-8 whitespace-nowrap">
                  <span className="font-bold text-white text-lg md:text-xl">//LIVE</span>
                  <span className="font-bold text-white/80 text-lg md:text-xl ml-1">TURB.</span>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Mini barra na direção contrária (sem fundo verde) */}
      <div className="relative w-full h-4 overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 120, // Alterado de 60 para 120 para movimento extremamente lento
            ease: "linear",
          }}
          className="absolute w-[200%] h-full flex items-center"
        >
          {Array(30)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center mx-4 whitespace-nowrap">
                <span className="font-bold text-white text-xs">//LIVE</span>
                <span className="font-bold text-white/80 text-xs ml-1">TURB.</span>
              </div>
            ))}
        </motion.div>
      </div>
    </section>
  )
}

