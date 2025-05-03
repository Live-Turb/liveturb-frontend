"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowRight, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function AnalyticsSection() {
  const [activeTab, setActiveTab] = useState("analytics")

  return (
    <section id="analises-2" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-[800px] mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Temos a <span style={{ color: "#22C55E" }}>Melhor</span> plataforma de Espionagem do Mercado
          </h2>
          <p className="text-xl text-gray-300">
            Descubra quais ofertas estão escalando agora e replique estratégias vencedoras com nossa plataforma de
            inteligência de mercado.
          </p>
        </div>

        <Tabs defaultValue="analytics" className="w-full max-w-[1440px] origin-left">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 p-1 rounded-lg">
            <TabsTrigger
              value="analytics"
              className={
                activeTab === "analytics" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "text-gray-400"
              }
              onClick={() => setActiveTab("analytics")}
            >
              Análise de Ofertas
            </TabsTrigger>
            <TabsTrigger
              value="criativos"
              className={
                activeTab === "criativos" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "text-gray-400"
              }
              onClick={() => setActiveTab("criativos")}
            >
              Biblioteca de Criativos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <Card className="shadow-lg border-none bg-gradient-to-br from-gray-800 to-gray-900 lg:w-[65%]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Desempenho de Ofertas em Alta</h3>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="aspect-[16/9] w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700 relative">
                    <Image
                      src="/images/imagem 4.jpg" // Substituído placeholder
                      alt="Gráfico de análise"
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full shadow-lg">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8 5.14V19.14L19 12.14L8 5.14Z"
                            fill="white"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-3 rounded-lg border border-blue-500/20"
                    >
                      <p className="text-sm text-gray-400">Conversão Média</p>
                      <p className="text-2xl font-bold text-green-400">24.8%</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-3 rounded-lg border border-blue-500/20"
                    >
                      <p className="text-sm text-gray-400">ROI Médio</p>
                      <p className="text-2xl font-bold text-green-400">987%</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-3 rounded-lg border border-blue-500/20"
                    >
                      <p className="text-sm text-gray-400">Ofertas Ativas</p>
                      <p className="text-2xl font-bold text-blue-400">243</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-none bg-gradient-to-br from-gray-800 to-gray-900 lg:w-[35%]">
                <CardContent className="p-4 pr-10 mb-4 text-foreground"> {/* Adicionar text-foreground */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-purple-700 p-1 rounded mr-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2 13.3333H14"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.33301 10H5.33301V13.3333H3.33301V10Z"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.66699 6.66663H8.66699V13.3333H6.66699V6.66663Z"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 2.66663H12V13.3333H10V2.66663Z"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-300">Espionagem de Anúncios</h3>
                        <p className="text-xs text-gray-400">Análise de campanhas concorrentes</p>
                      </div>
                    </div>
                    <div className="bg-green-500 text-xs px-2 py-1 rounded">Em alta</div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-xs text-gray-400">Atual</div>
                      <div className="font-bold text-gray-300">440</div>
                      <div className="text-xs text-gray-400">anúncios</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-xs text-gray-400">Máximo</div>
                      <div className="font-bold text-gray-300">446</div>
                      <div className="text-xs text-gray-400">anúncios</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-xs text-gray-400">Média</div>
                      <div className="font-bold text-gray-300">261</div>
                      <div className="text-xs text-gray-400">anúncios</div>
                    </div>
                    <div className="bg-gray-700 p-2 rounded">
                      <div className="text-xs text-gray-400">Mínimo</div>
                      <div className="font-bold text-gray-300">144</div>
                      <div className="text-xs text-gray-400">anúncios</div>
                    </div>
                  </div>

                  {/* IA Score */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-gray-300"> {/* Aplicar ao pai */}
                      <span className="text-purple-400">IA</span> {/* Manter roxo */}
                      <span className="ml-1">89%</span> {/* Deve herdar gray-300 */}
                      <span className="text-xs text-gray-400 ml-1">Score</span> {/* Manter cinza mais claro */}
                    </div>
                    <div className="w-1/2 bg-gray-700 h-2 rounded-full">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: "89%" }}></div>
                    </div>
                  </div>

                  {/* Analysis Timeframes */}
                  <div className="mb-4">
                    <div className="text-sm mb-2 text-gray-300">Análise</div>
                    <div className="flex space-x-2">
                      <div className="bg-purple-600 px-3 py-1 rounded text-sm">7 dias</div>
                      <div className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">15 dias</div>
                      <div className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">30 dias</div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-gray-900 p-4 rounded-lg mb-4 h-40">
                    <div className="relative h-full">
                      {/* Simple line chart simulation */}
                      <svg viewBox="0 0 300 100" className="w-full h-full">
                        <path
                          d="M0,70 C20,50 40,80 60,60 C80,40 100,50 120,60 C140,70 160,30 180,50 C200,70 220,20 240,40 C260,60 280,20 300,10"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2"
                        />
                        {/* Data points */}
                        <circle cx="0" cy="70" r="3" fill="#10b981" />
                        <circle cx="50" cy="60" r="3" fill="#10b981" />
                        <circle cx="100" cy="50" r="3" fill="#10b981" />
                        <circle cx="150" cy="60" r="3" fill="#10b981" />
                        <circle cx="200" cy="30" r="3" fill="#10b981" />
                        <circle cx="250" cy="40" r="3" fill="#10b981" />
                        <circle cx="300" cy="10" r="3" fill="#10b981" />
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                      </div>
                    </div>
                  </div>

                  {/* Chart Legend and Info */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-900 p-3 rounded-lg text-xs"> {/* Remover text-foreground daqui */}
                      <h4 className="font-bold mb-2 text-gray-300">Interpretação do Gráfico</h4> {/* Aplicar text-gray-300 */}
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <span className="h-3 w-3 rounded-full bg-green-500 mt-0.5 mr-1"></span>
                          <span className="text-gray-300">Acima de 120 criativos: Alta escala</span> {/* Aplicar text-gray-300 */}
                        </li>
                        <li className="flex items-start">
                          <span className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 mr-1"></span>
                          <span className="text-gray-300">Entre 80 e 120: Começando a escalar</span> {/* Aplicar text-gray-300 */}
                        </li>
                        <li className="flex items-start">
                          <span className="h-3 w-3 rounded-full bg-yellow-500 mt-0.5 mr-1"></span>
                          <span className="text-gray-300">Entre 30 e 80: Escala de teste</span> {/* Aplicar text-gray-300 */}
                        </li>
                        <li className="flex items-start">
                          <span className="h-3 w-3 rounded-full bg-red-500 mt-0.5 mr-1"></span>
                          <span className="text-gray-300">Menos de 30: Iniciando Campanha</span> {/* Aplicar text-gray-300 */}
                        </li>
                      </ul>
                      <p className="mt-2 text-gray-300"> {/* Aplicar text-gray-300 */}
                        Nossa ferramenta monitora em tempo real os anúncios dos competidores para te dar vantagem no
                        Facebook Ads
                      </p>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-lg text-xs"> {/* Remover text-foreground daqui */}
                      <h4 className="flex items-center font-bold mb-2 text-gray-300"> {/* Aplicar text-gray-300 */}
                        <span className="h-3 w-3 rounded-full bg-purple-500 mr-1"></span>
                        Insights da IA
                      </h4>
                      <p className="text-gray-300">Estabilidade de 261 criativos mostra um mercado com demanda constante.</p> {/* Aplicar text-gray-300 */}
                      <p className="text-orange-500 mt-2">
                        Experimente 2-3 variações testando diferentes abordagens de resolução de problemas. Com
                        validação, adicione 3-4 criativos com novos elementos visuais.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <a href="https://liveturb.com/login" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
                >
                  Acessar Análise Completa
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </TabsContent>

          <TabsContent value="criativos" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-none bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video w-full bg-gray-800 relative">
                      <Image
                        src="/images/imagem 1.jpg" // Substituído placeholder
                        alt="Criativo 1"
                        width={640}
                        height={360}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-orange-600/80 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> ESCALANDO
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none">
                          Alta Conversão
                        </Badge>
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          <span>440</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-400" />
                          <span>R$ 1.2M/mês</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Método Emagrecimento 30D</h4>
                        <button className="text-gray-400 hover:text-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-400">2025-03-27</span>
                        <div className="w-5 h-4 rounded overflow-hidden">
                          <div className="bg-blue-600 w-full h-1/3"></div>
                          <div className="bg-white w-full h-1/3"></div>
                          <div className="bg-red-600 w-full h-1/3"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">VARIAÇÃO DIÁRIA</div>
                          <div className="flex items-end justify-between">
                            <span className="text-red-500 font-medium">-9 anúncios</span>
                            <svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M0,10 L10,5 L20,15 L30,0 L40,10"
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">VARIAÇÃO SEMANAL</div>
                          <div className="flex items-end justify-between">
                            <span className="text-red-500 font-medium">-109 anúncios</span>
                            <svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0,5 L10,10 L20,5 L30,15 L40,5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Relacionamento</span>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Low Ticket</span>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">VSL</span>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Nutra</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-none bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video w-full bg-gray-800 relative">
                      <Image
                        src="/images/imagem 2.jpg" // Substituído placeholder
                        alt="Criativo 2"
                        width={640}
                        height={360}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-blue-600/80 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> ALTO POTENCIAL
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
                          Tendência
                        </Badge>
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          <span>325</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-400" />
                          <span>R$ 850K/mês</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Fórmula Renda Extra</h4>
                        <button className="text-gray-400 hover:text-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-400">2025-03-25</span>
                        <div className="w-5 h-4 rounded overflow-hidden">
                          <div className="bg-green-600 w-full h-1/2"></div>
                          <div className="bg-yellow-400 w-full h-1/2"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">VARIAÇÃO DIÁRIA</div>
                          <div className="flex items-end justify-between">
                            <span className="text-green-500 font-medium">+12 anúncios</span>
                            <svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M0,15 L10,10 L20,12 L30,5 L40,2"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">VARIAÇÃO SEMANAL</div>
                          <div className="flex items-end justify-between">
                            <span className="text-green-500 font-medium">+45 anúncios</span>
                            <svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0,15 L10,12 L20,8 L30,5 L40,2" fill="none" stroke="#10b981" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Finanças</span>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Mid Ticket</span>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Webinar</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-none bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video w-full bg-gray-800 relative">
                      <Image
                        src="/images/imagem 3.png" // Substituído placeholder
                        alt="Criativo 3"
                        width={640}
                        height={360}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-yellow-600/80 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> NOVO
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-none">
                          Novo
                        </Badge>
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          <span>187</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-400" />
                          <span>R$ 620K/mês</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">Masterclass Investimentos</h4>
                        <button className="text-gray-400 hover:text-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-400">2025-03-20</span>
                        <div className="w-5 h-4 rounded overflow-hidden">
                          <div className="bg-blue-600 w-full h-1/3"></div>
                          <div className="bg-white w-full h-1/3"></div>
                          <div className="bg-red-600 w-full h-1/3"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">VARIAÇÃO DIÁRIA</div>
                          <div className="flex items-end justify-between">
                            <span className="text-yellow-500 font-medium">+3 anúncios</span>
                            <svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M0,10 L10,12 L20,8 L30,10 L40,7"
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400 mb-1">VARIAÇÃO SEMANAL</div>
                          <div className="flex items-end justify-between">
                            <span className="text-green-500 font-medium">+187 anúncios</span>
                            <svg width="40" height="20" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M0,18 L10,15 L20,10 L30,5 L40,2"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Investimentos</span>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">High Ticket</span>
                        <span className="bg-gray-700 text-xs px-2 py-1 rounded">Masterclass</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="flex justify-center">
              <a href="https://liveturb.com/login" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
                >
                  Ver Biblioteca Completa
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

