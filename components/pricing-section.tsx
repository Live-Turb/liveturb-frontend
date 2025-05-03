"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { initiateCheckout } from "@/lib/fbpixel" // Importa a função de rastreamento para checkout

export default function PricingSection() {
  const plans = [
    {
      name: "Iniciante",
      price: "R$97",
      period: "/mês",
      description: "Ideal para empreendedores iniciando no mercado digital.",
      features: [
        "Até 6 Mil Reproduções por mês",
        "R$ 0,02 por reprodução fora do Plano",
        "Até 1 Vídeo Ao Vivo formato Youtube",
        "Ferramenta de espionagem de anuncios",
        "Interação com IA básica nos videos",
        "Atualização plataforma anúncios 1x por dia",
        "Suporte por email",
      ],
      cta: "Começar Agora",
      popular: false,
      url: "https://liveturb.com/user/register/6bc0595a-f99b-45f0-9840-1b223603286d",
      value: 97
    },
    {
      name: "Profissional",
      price: "R$297",
      period: "/mês",
      description: "Para negócios em crescimento que buscam escalar resultados.",
      features: [
        "Até 25.000 reproduções por mês",
        "R$ 0,02 por reprodução fora do Plano",
        "Até 2 Vídeo Ao Vivo formato Youtube ou Instagram",
        "Ferramenta de espionagem de anuncios",
        "Interação com IA avançada",
        "Analise com IA dos criativos em alta",
        "Atualização plataforma anúncios 3x por dia",
        "Suporte prioritário",
      ],
      cta: "Escolher Plano",
      popular: true,
      url: "https://liveturb.com/user/register/313892f0-e4e9-4a7b-8927-ddd15f803879",
      value: 297
    },
    {
      name: "Empresarial",
      price: "R$597",
      period: "/mês",
      description: "Solução completa para agências e grandes produtores.",
      features: [
        "Até 50.000 Reproduções por mês",
        "R$ 0,02 por reprodução fora do Plano",
        "Até 3 Vídeo Ao Vivo formato Youtube ou Instagram",
        "Ferramenta de espionagem de anuncios",
        "Interação com IA personalizada via API",
        "Atualização plataforma Espionagem em Tempo Real",
        "Painel copywriter (Reescreva sua Vsl Automatico)",
        "API de integração",
        "Gerente de conta dedicado",
      ],
      cta: "Escolher Plano",
      popular: false,
      url: "https://liveturb.com/user/register/4445d507-5a66-4dda-83de-a660878e1274",
      value: 597
    },
  ]

  // Função para lidar com o clique no botão de plano
  const handlePlanClick = (plan) => {
    // Dispara o evento de início de checkout para o Facebook Pixel com os dados do plano
    initiateCheckout({
      content_name: `Plano ${plan.name}`,
      content_category: 'subscription',
      content_ids: [plan.name.toLowerCase()],
      value: plan.value,
      currency: 'BRL',
    });
  };

  return (
    <section id="precos" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Planos para Todos os Níveis de Negócio
          </h2>
          <p className="text-xl text-gray-300">
            Escolha o plano ideal para transformar seus vídeos e aumentar suas conversões.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div key={index} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <Card
                className={`relative bg-gradient-to-br from-gray-800 to-gray-900 border-none ${plan.popular ? "shadow-lg shadow-blue-500/10" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Mais Popular
                    </div>
                  </div>
                )}

                <CardHeader className="pb-0">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>

                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <a 
                    href={plan.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full"
                    onClick={() => handlePlanClick(plan)}
                  >
                    <Button
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none" : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"}`}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 text-gray-400">
          <p>Todos os planos incluem garantia de 7 dias. Cancele a qualquer momento.</p>
        </div>
      </div>
    </section>
  )
}
