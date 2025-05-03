"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function CtaSection() {
  // Função para rolar até a seção de preços
  const scrollToPrecos = () => {
    const precosSection = document.getElementById("precos")
    if (precosSection) {
      precosSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-blue-500/20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-[10%] right-[10%] w-40 h-40 rounded-full bg-purple-500/20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-[40%] right-[20%] w-24 h-24 rounded-full bg-pink-500/20 blur-xl"
        />
      </div>

      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Pronto para Revolucionar suas Conversões?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-white/90"
          >
            Junte-se a mais de 10.000 empreendedores digitais que já transformaram seus negócios com a LiveTurb.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white hover:bg-gray-100 text-blue-600 font-bold"
              onClick={scrollToPrecos}
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10"
              onClick={scrollToPrecos}
            >
              Teste 7 Dias Gratis
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="pt-8 flex flex-wrap items-center justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-4xl font-bold">700%</div>
              <div className="text-white/80">Aumento em Conversões</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">10x</div>
              <div className="text-white/80">Maior Engajamento</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">5min</div>
              <div className="text-white/80">Implementação Rápida</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

