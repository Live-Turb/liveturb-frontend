"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Quote } from "lucide-react"
import { motion } from "framer-motion"

export default function TestimonialSection() {
  const testimonials = [
    {
      id: "1",
      name: "Carlos Mendes",
      role: "Empreendedor Digital",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content:
        "A LiveTube transformou completamente o meu negócio. Em apenas um mês, minhas conversões dispararam 720%! A sensação de live real faz toda a diferença no engajamento da audiência—é algo que simplesmente prende a atenção como nada que já vi no mercado. Nunca imaginei um resultado tão rápido!",
      metrics: "720% de aumento nas conversões",
    },
    {
      id: "2",
      name: "Ana Paula Silva",
      role: "Criadora de Conteúdo",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content:
        "No início, eu tinha minhas dúvidas... Mas depois que comecei a usar a plataforma de espionagem da LiveTube, tudo mudou. Consegui modelar uma oferta poderosa, minha VSL começou a ter 10x mais engajamento e, quando percebi, as vendas estavam disparando. Hoje, já bati 7 dígitos em faturamento – e o melhor de tudo? Finalmente entendi o que realmente funciona no mercado.",
      metrics: "10x mais tempo de visualização",
    },
    {
      id: "3",
      name: "Roberto Almeida",
      role: "Coach de Negócios",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      content:
        "A ferramenta de análise de ofertas me economizou meses (ou talvez anos) de tentativa e erro. Consegui identificar, com precisão cirúrgica, quais criativos realmente funcionam no meu nicho e replicar o sucesso. O resultado? Um ROI absurdo de 1250% em apenas 30 dias. Se eu não tivesse visto com meus próprios olhos, também acharia inacreditável!",
      metrics: "ROI de 1250% em 30 dias",
    },
  ]

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Resultados Reais de Clientes Reais
          </h2>
          <p className="text-xl text-gray-300">
            Veja como a LiveTurb está transformando negócios digitais por todo o Brasil.
          </p>
        </div>

        <Tabs defaultValue="1" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-gray-800/50 p-1 rounded-lg">
            <TabsTrigger
              value="1"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-400"
            >
              Carlos
            </TabsTrigger>
            <TabsTrigger
              value="2"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-400"
            >
              Ana Paula
            </TabsTrigger>
            <TabsTrigger
              value="3"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-400"
            >
              Roberto
            </TabsTrigger>
          </TabsList>

          {testimonials.map((testimonial) => (
            <TabsContent key={testimonial.id} value={testimonial.id} className="space-y-8">
              <Card className="border-none bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-shrink-0">
                      <motion.div whileHover={{ scale: 1.05 }} className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm"></div>
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={120}
                          height={120}
                          className="rounded-full border-4 border-gray-800 relative z-10"
                          unoptimized
                        />
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <Quote className="h-10 w-10 text-blue-500/40" />
                      <p className="text-lg md:text-xl italic text-gray-300">{testimonial.content}</p>

                      <div className="pt-4">
                        <div className="font-bold text-lg text-white">{testimonial.name}</div>
                        <div className="text-gray-400">{testimonial.role}</div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-4 py-2 rounded-lg inline-block border border-blue-500/20">
                        <span className="font-semibold text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {testimonial.metrics}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

