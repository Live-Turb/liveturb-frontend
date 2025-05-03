"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Heart, Play, Pause, Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Definir interfaces para os tipos de estado
interface INotification {
  id: number;
  image: string;
  uniqueId?: number; // Adicionado opcionalmente no runtime
}

interface IComment {
  id: number;
  name: string;
  text: string;
  avatar: string;
  gender: string;
}

export default function LiveDemoSection() {
  const [activeTab, setActiveTab] = useState("depois")
  const [comments, setComments] = useState<IComment[]>([]) // Adicionado tipo IComment[]
  const [reactions, setReactions] = useState({ likes: 0, hearts: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [visibleNotifications, setVisibleNotifications] = useState<INotification[]>([]) // Adicionado tipo INotification[]
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Função para rolar até a seção de preços
  const scrollToPrecos = () => {
    const precosSection = document.getElementById("precos")
    if (precosSection) {
      precosSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Comentários separados por gênero
  const commentsByGender = {
    male: [
      { name: "Rafael Costa", text: "Isso é exatamente o que eu precisava! 🙌" },
      { name: "João Pedro", text: "Como faço para começar hoje mesmo? 🚀" },
      { name: "Bruno Oliveira", text: "Acabei de me inscrever! Melhor decisão! 💯" },
      { name: "Carlos Mendes", text: "Estou impressionado com os resultados! 👏" },
      { name: "Lucas Silva", text: "Recomendo para todos os empreendedores! 💼" },
    ],
    female: [
      { name: "Mariana Alves", text: "Já estou vendo resultados! 💰💰💰" },
      { name: "Camila Santos", text: "Incrível! Vou compartilhar com meus amigos 🔥" },
      { name: "Ana Paula", text: "Melhor investimento que fiz este ano! ✨" },
      { name: "Juliana Ferreira", text: "Meu engajamento aumentou 300% em uma semana! 📈" },
      { name: "Fernanda Lima", text: "Simplesmente fantástico! Obrigada LiveTurb! 🙏" },
    ],
  }

  // Avatares separados por gênero
  const avatarsByGender = {
    male: [
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/men/22.jpg",
      "https://randomuser.me/api/portraits/men/45.jpg",
      "https://randomuser.me/api/portraits/men/78.jpg",
      "https://randomuser.me/api/portraits/men/91.jpg",
      "https://randomuser.me/api/portraits/men/55.jpg",
      "https://randomuser.me/api/portraits/men/36.jpg",
    ],
    female: [
      "https://randomuser.me/api/portraits/women/12.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/women/56.jpg",
      "https://randomuser.me/api/portraits/women/33.jpg",
      "https://randomuser.me/api/portraits/women/68.jpg",
      "https://randomuser.me/api/portraits/women/26.jpg",
      "https://randomuser.me/api/portraits/women/89.jpg",
    ],
  }

  // Configuração das notificações de vendas
  const salesNotifications = [
    { id: 1, image: "/images/digistore.png" },
    { id: 2, image: "/images/hotmart.png" },
    { id: 3, image: "/images/kiwify.png" },
    { id: 4, image: "/images/cartpanda.png" },
    { id: 5, image: "/images/clickbank.png" },
  ]

  // Função para gerar um intervalo aleatório entre notificações (entre 8 e 20 segundos)
  const getRandomInterval = () => {
    return Math.floor(Math.random() * (20000 - 8000) + 8000)
  }

  // Função para mostrar uma notificação aleatória
  const showRandomNotification = () => {
    if (activeTab !== "depois") return

    // Escolher uma notificação aleatória
    const randomIndex = Math.floor(Math.random() * salesNotifications.length)
    const notification = salesNotifications[randomIndex]

    // Adicionar a notificação à lista de visíveis
    setVisibleNotifications((prev) => [...prev, { ...notification, uniqueId: Date.now() } as INotification]) // Cast para INotification

    // Remover a notificação após 8 segundos
    setTimeout(() => {
      setVisibleNotifications((prev) => prev.filter((item) => item.uniqueId !== (notification as INotification).uniqueId)) // Cast para INotification

      // Agendar a próxima notificação após um intervalo aleatório
      setTimeout(showRandomNotification, getRandomInterval())
    }, 8000)
  }

  useEffect(() => {
    if (activeTab === "depois") {
      // Comentários existentes
      const commentInterval = setInterval(() => {
        // Escolhe aleatoriamente entre comentário masculino ou feminino
        const gender = Math.random() > 0.5 ? "male" : "female"

        // Seleciona um comentário aleatório do gênero escolhido
        const commentsForGender = commentsByGender[gender]
        const randomCommentIndex = Math.floor(Math.random() * commentsForGender.length)
        const randomComment = commentsForGender[randomCommentIndex]

        // Seleciona um avatar aleatório do mesmo gênero
        const avatarsForGender = avatarsByGender[gender]
        const randomAvatarIndex = Math.floor(Math.random() * avatarsForGender.length)
        const randomAvatar = avatarsForGender[randomAvatarIndex]

        setComments((prev) => [
          {
            id: Date.now(),
            name: randomComment.name,
            text: randomComment.text,
            avatar: randomAvatar,
            gender: gender,
          },
          ...prev.slice(0, 4),
        ])

        setReactions((prev) => ({
          likes: prev.likes + Math.floor(Math.random() * 3),
          hearts: prev.hearts + Math.floor(Math.random() * 2),
        }))
      }, 2000)

      // Iniciar o sistema de notificações aleatórias
      const initialDelay = setTimeout(showRandomNotification, 3000)

      return () => {
        clearInterval(commentInterval)
        clearTimeout(initialDelay)
      }
    } else {
      setComments([])
      setReactions({ likes: 0, hearts: 0 })
      setVisibleNotifications([])
    }
  }, [activeTab])

  return (
    <section
      id="como-funciona"
      className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden"
    >
      {/* Notificações de vendas animadas */}
      <div className="fixed right-0 inset-y-0 w-[180px] md:w-[300px] overflow-hidden pointer-events-none z-50">
        <AnimatePresence>
          {visibleNotifications.map((notification, index) => (
            <motion.div
              key={notification.uniqueId || `${notification.id}-${Date.now()}`}
              initial={{ opacity: 0, y: "100vh" }}
              animate={{
                opacity: isMobile ? 0.85 : 0.55, // Opacidade mais baixa no desktop
                y: `${20 + index * 25}vh`, // Aumentado o espaçamento vertical entre notificações
              }}
              exit={{ opacity: 0, y: "0vh" }}
              transition={{
                duration: 8,
                ease: "easeOut",
                y: {
                  duration: 8,
                  ease: "easeOut",
                  // Quando a notificação chega ao topo, ela desaparece
                  onComplete: () => {
                    if (index === 0) {
                      setVisibleNotifications((prev) => prev.filter((item) => item.uniqueId !== (notification as INotification).uniqueId)) // Cast para INotification
                    }
                  },
                },
              }}
              className="absolute right-0"
              style={{ zIndex: 100 - index }}
            >
              <div className="relative">
                <div className="relative z-10 rounded-lg">
                  <Image
                    src={notification.image || "/placeholder.svg"}
                    alt="Notificação de venda"
                    width={300}
                    height={80}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Veja Você Mesmo a Diferença na Prática
          </h2>
          <p className="text-xl text-gray-300">
            Compare um vídeo normal com uma transmissão LiveTurb e veja o poder do engajamento em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeTab === "antes" ? "default" : "outline"}
                onClick={() => setActiveTab("antes")}
                className={`flex-1 ${activeTab === "antes" ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white" : "bg-gray-800/50 text-gray-300 border-gray-700"}`}
              >
                Antes: Vídeo Comum
              </Button>
              <Button
                variant={activeTab === "depois" ? "default" : "outline"}
                onClick={() => setActiveTab("depois")}
                className={`flex-1 ${activeTab === "depois" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-800/50 text-gray-300 border-gray-700"}`}
              >
                Depois: Com LiveTurb
              </Button>
            </div>

            <div className="relative rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <div className="aspect-video w-full bg-black">
                <Image
                  // Define a imagem dinamicamente com base na aba ativa
                  src={activeTab === 'depois' ? "/images/imagem 6.png" : "/images/imagem 7.png"} // Corrigido extensão para .png
                  alt={activeTab === 'depois' ? "Demonstração LiveTurb (Depois)" : "Demonstração LiveTurb (Antes)"}
                  width={640} // Manter ou ajustar conforme dimensões das imagens
                  height={360} // Manter ou ajustar conforme dimensões das imagens
                  className="w-full h-full object-cover"
                  key={activeTab} // Adiciona key para forçar remount/transição se necessário
                />

                {/* Modern Video Player Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                    </button>

                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[35%]"></div>
                    </div>

                    <div className="text-white text-sm">1:45 / 5:00</div>

                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Volume2 className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {activeTab === "depois" && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                      AO VIVO
                    </div>

                    <div className="absolute bottom-16 left-0 right-0 p-4 space-y-3 max-h-[40%] overflow-hidden">
                      <AnimatePresence>
                        {comments.map((comment) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg border border-white/10"
                          >
                            <Image
                              src={comment.avatar || "/placeholder.svg"}
                              alt={comment.name}
                              width={32}
                              height={32}
                              className="rounded-full border-2 border-blue-500"
                              unoptimized
                            />
                            <div>
                              <span className="font-medium text-blue-300">{comment.name}</span>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="absolute top-4 left-4 flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                        <ThumbsUp className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium">{reactions.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium">{reactions.hearts}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              {activeTab === "antes"
                ? "Vídeos Comuns Não Engajam Sua Audiência"
                : "LiveTurb: Engajamento e Conversão em Tempo Real"}
            </h3>

            {activeTab === "antes" ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-300">Vídeos tradicionais sofrem com:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-red-900/30 flex items-center justify-center">
                      <span className="text-red-400">✕</span>
                    </div>
                    <span className="text-gray-300">Baixa retenção de audiência</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-red-900/30 flex items-center justify-center">
                      <span className="text-red-400">✕</span>
                    </div>
                    <span className="text-gray-300">Falta de interatividade</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-red-900/30 flex items-center justify-center">
                      <span className="text-red-400">✕</span>
                    </div>
                    <span className="text-gray-300">Sensação de conteúdo pré-gravado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-red-900/30 flex items-center justify-center">
                      <span className="text-red-400">✕</span>
                    </div>
                    <span className="text-gray-300">Taxas de conversão medianas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-red-900/30 flex items-center justify-center">
                      <span className="text-red-400">✕</span>
                    </div>
                    <span className="text-gray-300">Sem prova social em tempo real</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg text-gray-300">Com a LiveTurb, você consegue:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <span className="text-gray-300">
                      Aumento de <span className="text-green-400 font-bold">700%</span> nas conversões
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <span className="text-gray-300">Interação automática com comentários via IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <span className="text-gray-300">Sensação de urgência e exclusividade</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <span className="text-gray-300">Prova social visível em tempo real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-900/30 flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <span className="text-gray-300">
                      <span className="text-green-400 font-bold">10x</span> mais tempo de permanência no vídeo
                    </span>
                  </li>
                </ul>

                <a
                  href="https://liveturb.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-none">
                    Transforme Seus Vídeos Agora
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

