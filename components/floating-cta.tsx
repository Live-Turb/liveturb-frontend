"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    // Show the floating CTA after 5 seconds
    const timer = setTimeout(() => {
      if (!isClosed) setIsVisible(true)
    }, 5000)

    // Show when scrolling down
    const handleScroll = () => {
      if (window.scrollY > 500 && !isClosed) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isClosed])

  const handleClose = () => {
    setIsVisible(false)
    setIsClosed(true)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          {/* Comentado temporariamente - pode ser descomentado para reativar
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-2xl border border-white/10 p-4">
            <button onClick={handleClose} className="absolute top-2 right-2 text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                🔥
              </div>

              <div>
                <h3 className="font-bold text-white mb-1">Oferta Especial de Lançamento</h3>
                <p className="text-sm text-white/80 mb-3">
                  Aproveite 50% de desconto nos primeiros 100 assinantes. Restam apenas 17 vagas!
                </p>

                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center justify-center gap-2">
                  Garantir Minha Vaga
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

