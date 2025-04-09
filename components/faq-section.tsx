import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
  const faqs = [
    {
      question: "Como a LiveTurb transforma meus vídeos em lives?",
      answer:
        "A LiveTurb utiliza tecnologia avançada de IA para simular uma transmissão ao vivo a partir do seu vídeo pré-gravado. O sistema adiciona elementos de interatividade como comentários em tempo real, reações e respostas automáticas, criando a sensação de uma transmissão ao vivo genuína que aumenta drasticamente o engajamento e as conversões.",
    },
    {
      question: "Preciso gravar novos vídeos para usar a plataforma?",
      answer:
        "Não! Você pode usar qualquer vídeo que já tenha gravado. A LiveTurb transforma seu conteúdo existente em uma experiência interativa, sem necessidade de novas gravações. Em minutos, seu vídeo comum se torna uma poderosa máquina de vendas.",
    },
    {
      question: "A IA realmente responde aos comentários de forma natural?",
      answer:
        "Sim! Nossa IA foi treinada com os mais avançados algoritmos para entender o contexto do seu vídeo e responder aos comentários de forma natural e coerente. Você também pode configurar respostas personalizadas para perguntas frequentes, criando uma experiência totalmente personalizada.",
    },
    {
      question: "Como funciona a análise de ofertas em tempo real?",
      answer:
        "Nossa plataforma monitora constantemente mais de 200 ofertas ativas no mercado digital brasileiro, analisando métricas como CTR, taxa de conversão, ROI e outros indicadores. Você tem acesso a dashboards atualizados em tempo real, mostrando quais estratégias e criativos estão performando melhor, permitindo que você replique o sucesso dos maiores players do mercado.",
    },
    {
      question: "Quanto tempo leva para implementar a LiveTurb no meu negócio?",
      answer:
        "A implementação é extremamente rápida e simples. Após a assinatura, você pode fazer upload do seu primeiro vídeo e configurar sua primeira 'live' em menos de 5 minutos. Nossa equipe de suporte está disponível 24/7 para ajudar em todo o processo e garantir que você comece a ver resultados imediatamente.",
    },
    {
      question: "Posso integrar a LiveTurb com outras ferramentas que já uso?",
      answer:
        "Absolutamente! A LiveTurb oferece integrações perfeitas com as principais plataformas de marketing digital, incluindo sistemas de email marketing, CRMs, plataformas de pagamento como Kiwify, ClickBank, Hotmart, Monetizze e Digistore. Nos planos Empresarial, você também tem acesso à nossa API para integrações personalizadas com qualquer sistema.",
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Perguntas Frequentes</h2>
          <p className="text-xl text-gray-300">
            Tudo o que você precisa saber sobre a LiveTurb e como ela pode transformar seu negócio.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-800">
                <AccordionTrigger className="text-lg font-medium text-white hover:text-blue-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

