"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen text-white">
      {/* Header com gradiente */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 container mx-auto px-4 py-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/30 rounded-full mb-6">
            <ArrowLeft className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Política de Privacidade
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Na LiveTurb, valorizamos a sua privacidade e nos comprometemos a proteger suas informações pessoais.
          </p>
        </motion.div>
      </div>

      {/* Navegação de retorno */}
      <div className="container mx-auto px-4 py-6">
                <Button 
          variant="ghost" 
          className="text-slate-300 hover:text-white" 
          onClick={() => useRouter().push('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8 mb-8 shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-blue-300 mb-4">1. Informações que Coletamos</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                A LiveTurb coleta informações que você nos fornece diretamente quando utiliza nossos serviços:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="text-white font-medium">Informações de registro:</span> Nome, endereço de e-mail, número de telefone e informações de pagamento.
                </li>
                <li>
                  <span className="text-white font-medium">Dados de perfil:</span> Informações comerciais ou profissionais relacionadas à sua empresa ou atividade.
                </li>
                <li>
                  <span className="text-white font-medium">Dados de uso:</span> Informações sobre como você utiliza nossa plataforma e quais recursos acessa.
                </li>
                <li>
                  <span className="text-white font-medium">Comunicações:</span> Quando você se comunica conosco, guardamos o histórico dessas interações.
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">2. Como Utilizamos Suas Informações</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Utilizamos as informações coletadas para os seguintes propósitos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer, manter e melhorar nossa plataforma e serviços.</li>
                <li>Processar transações e enviar notificações relacionadas.</li>
                <li>Personalizar sua experiência e oferecer conteúdo relevante.</li>
                <li>Comunicar novidades, atualizações e ofertas promocionais.</li>
                <li>Analisar padrões de uso para melhorar nosso serviço.</li>
                <li>Detectar, prevenir e resolver problemas técnicos ou de segurança.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">3. Cookies e Tecnologias de Rastreamento</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Utilizamos cookies e tecnologias similares, como o Facebook Pixel, para melhorar sua experiência na plataforma, entender padrões de uso e personalizar nosso marketing:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="text-white font-medium">Cookies necessários:</span> Essenciais para o funcionamento da plataforma.
                </li>
                <li>
                  <span className="text-white font-medium">Cookies analíticos:</span> Ajudam-nos a entender como os visitantes interagem com a plataforma.
                </li>
                <li>
                  <span className="text-white font-medium">Cookies de marketing:</span> Utilizados para rastrear visitantes em diferentes sites a fim de exibir anúncios relevantes.
                </li>
              </ul>
              <p className="mt-4">
                Você pode configurar seu navegador para recusar cookies, no entanto, isso pode impactar o funcionamento de certos recursos da plataforma.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">4. Compartilhamento de Informações</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                A LiveTurb não vende suas informações pessoais a terceiros. Podemos compartilhar dados nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Com provedores de serviço que nos ajudam a operar nossa plataforma.</li>
                <li>Para cumprir obrigações legais ou responder a processos legais.</li>
                <li>Para proteger os direitos, propriedade ou segurança da LiveTurb e de nossos usuários.</li>
                <li>Em conexão com uma fusão, aquisição ou venda de ativos da empresa, com garantias adequadas de proteção de dados.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">5. Segurança de Dados</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                A LiveTurb implementa medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia de dados em trânsito e em repouso.</li>
                <li>Acesso restrito a informações pessoais apenas a funcionários autorizados.</li>
                <li>Auditorias regulares de segurança e avaliações de vulnerabilidade.</li>
                <li>Planos de resposta a incidentes para lidar com possíveis violações de dados.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">6. Seus Direitos de Privacidade</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Dependendo de sua localização, você pode ter direitos específicos relacionados aos seus dados pessoais:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acessar e obter uma cópia de seus dados.</li>
                <li>Corrigir informações imprecisas ou incompletas.</li>
                <li>Solicitar a exclusão de seus dados pessoais.</li>
                <li>Restringir ou opor-se ao processamento de suas informações.</li>
                <li>Solicitar a transferência de seus dados a outro serviço (portabilidade).</li>
                <li>Retirar seu consentimento a qualquer momento para processamentos baseados em consentimento.</li>
              </ul>
              <p className="mt-4">
                Para exercer qualquer um desses direitos, entre em contato conosco através dos canais indicados ao final desta política.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">7. Retenção de Dados</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para os fins estabelecidos nesta política de privacidade, a menos que um período de retenção mais longo seja exigido por lei.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">8. Alterações nesta Política</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações significativas publicando a nova Política de Privacidade nesta página e, se necessário, através de notificação por e-mail.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-blue-300 mt-10 mb-4">9. Contato</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato conosco:
              </p>
              <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
                <p className="font-medium text-white">LiveTurb</p>
                <p>Email: contato@liveturb.com</p>
                <p>Website: www.liveturb.com</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Última atualização */}
        <div className="text-center text-slate-400 text-sm pb-12">
          <p>Esta Política de Privacidade foi atualizada pela última vez em 8 de maio de 2025.</p>
        </div>
      </div>
    </div>
  )
}
