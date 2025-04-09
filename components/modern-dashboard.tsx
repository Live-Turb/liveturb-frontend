"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Maximize,
  FileText,
  Heart,
  Target,
  BarChart2,
  BookOpen,
  Clock,
  Share2,
  Globe,
  Activity,
  Filter,
  Tag,
  Facebook,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart,
  LockOpen,
  ArrowLeft,
  X,
} from "lucide-react"
import { useTranslation } from "next-i18next"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import {
  MenuIcon,
  Settings,
  Plus,
  Calendar,
  List,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Area,
} from "recharts"
import type { Anuncio, Criativo as CriativoType } from "../types"
import { LoadingState } from "./loading-state"
import { ErrorState } from "./error-state"
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load dos componentes pesados
const WordDocumentViewer = dynamic(() => import('./word-document-viewer').then(mod => mod.WordDocumentViewer), {
  loading: () => (
    <div className="w-full h-[600px] bg-gray-800/50 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  ),
  ssr: false
})

const EspionagemChart = dynamic(() => import('./espionagem-chart'), {
  loading: () => (
    <div className="p-8 text-center bg-gray-800/50 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
    </div>
  ),
  ssr: false
})

// Define o caminho correto para o SVG do play/pause
const WEBP_URL = "/storage/sitelogo/Liveturb-video-play.webp";
const SVG_URL = "/images/liveturb-play.svg";

// Funções auxiliares
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Função para lidar com tela cheia
const toggleFullscreen = (elementId: string | React.MouseEvent): void => {
  // Se for um evento de mouse, usar o ID do contêiner de vídeo
  const id = typeof elementId === 'string' ? elementId : 'videoContainer';
  const element = document.getElementById(id);
  if (!element) return;

  if (!document.fullscreenElement) {
    element.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
};

// SVG inline como fallback para garantir que nunca quebre
const SVG_FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%231a1a1a'/%3E%3Ccircle cx='400' cy='200' r='120' fill='%23222' stroke='%233366ff' stroke-width='8'/%3E%3Cpath d='M 360 140 L 360 260 L 480 200 Z' fill='%233366ff'/%3E%3C/svg%3E`;

// Variável para controlar se já tentamos carregar o SVG
let tentouSVG = false;

interface ModernDashboardProps {
  anuncioData: Anuncio | null
  isLoading: boolean
  error: string | null
}

interface PieChartCustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

interface Criativo {
  id: number;
  title: string;
  value: number;
  newCreativesCount: number;
  url?: string;
  status?: string;
}

interface StatusInfo {
  status: string;
  color: string;
  textColor: string;
  bgColor: string;
}

// Esta interface é apenas para uso interno no componente
// Diferente da interface Criativo importada dos types
interface CreativoInterno {
  id: number;
  title: string;
  value: number;
  newCreativesCount: number;
  url?: string;
  status?: string;
}

interface EstatisticaItem {
  dia: string;
  criativos: number;
  status: 'alto' | 'medio' | 'baixo' | 'critico';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface InterpretacaoItem {
  status: 'alto' | 'medio' | 'baixo' | 'critico';
  texto: string;
}

interface InsightItem {
  observacao: string;
  recomendacao: string;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({ anuncioData, isLoading, error }) => {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDateRange, setSelectedDateRange] = useState<"7days" | "15days" | "30days">("7days")
  const [likedCreatives, setLikedCreatives] = useState<number[]>([])
  const [isFavorito, setIsFavorito] = useState(false)
  const [selectedCreativeId, setSelectedCreativeId] = useState<number | null>(null)
  const [playingCreatives, setPlayingCreatives] = useState<number[]>([])
  const creativoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoContainerRef = useRef<HTMLDivElement | null>(null)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false)
  const [lastPlayPosition, setLastPlayPosition] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCentralPlayButton, setShowCentralPlayButton] = useState(true)
  const [periodoAtivo, setPeriodoAtivo] = useState<"7dias" | "15dias" | "30dias">("7dias")
  // Estas variáveis foram movidas para o componente EspionagemChart
  // const [animado, setAnimado] = useState(false)
  // const [hoveredData, setHoveredData] = useState<any>(null)
  // const [tendencia, setTendencia] = useState('')
  // const [analisandoIA, setAnalisandoIA] = useState(true)
  // const [analiseCompleta, setAnaliseCompleta] = useState(false)
  // const [potencialAnuncio, setPotencialAnuncio] = useState(0)
  // const [interpretacaoGrafico, setInterpretacaoGrafico] = useState<InterpretacaoItem[] | null>(null)
  // const [insightsIA, setInsightsIA] = useState<InsightItem | null>(null)

  // A função inicializarEspionagem e dados do gráfico foram movidos para o componente EspionagemChart
  
  // Verificar se o anúncio já está nos favoritos ao carregar
  useEffect(() => {
    if (anuncioData) {
      // Recuperar favoritos do localStorage
      const favoritosArmazenados = localStorage.getItem("favoritos")
      if (favoritosArmazenados) {
        const favoritos = JSON.parse(favoritosArmazenados)
        setIsFavorito(favoritos.includes(anuncioData.id))
      }
    }
  }, [anuncioData])

  // Efeito para rolar até o criativo selecionado quando ele muda
  useEffect(() => {
    if (selectedCreativeId && creativoRefs.current[selectedCreativeId]) {
      creativoRefs.current[selectedCreativeId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [selectedCreativeId])

  // Efeito para atualizar o tempo atual do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadStart = () => {
      setLoading(true);
    };

    const handleCanPlay = () => {
      setLoading(false);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateTime);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isPlaying]);

  // Ocultar botão de play central após alguns segundos de reprodução
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      timeoutId = setTimeout(() => {
        setShowCentralPlayButton(false);
      }, 2000); // Oculta após 2 segundos
    } else {
      setShowCentralPlayButton(true);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  // Melhorar o comportamento de visibilidade dos controles
  useEffect(() => {
    let controlsTimeoutId: NodeJS.Timeout | null = null;
    
    const handleMouseMove = () => {
      setShowControls(true);
      
      // Limpar timeout anterior se existir
      if (controlsTimeoutId) {
        clearTimeout(controlsTimeoutId);
      }
      
      // Definir novo timeout para esconder os controles após inatividade
      if (isPlaying) {
        controlsTimeoutId = setTimeout(() => {
          setShowControls(false);
        }, 3000); // Esconde controles após 3 segundos de inatividade
      }
    };
    
    // Adicionar listener apenas ao container de vídeo se ele existir
    const container = videoContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (controlsTimeoutId) {
        clearTimeout(controlsTimeoutId);
      }
      
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isPlaying]);

  // Controlar o volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Alternar mudo
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume > 0 ? volume : 1;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Avançar/retroceder
  const seekVideo = (seconds: number) => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime + seconds;
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, videoRef.current.duration));
    }
  };

  // Controlar a barra de progresso
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Alterar a velocidade de reprodução
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowPlaybackOptions(false);
  };

  // Função para reproduzir/pausar vídeo
  const handlePlayVideo = () => {
    if (!anuncioData) return;
    
    // Usar apenas a URL do anúncio principal, nunca a dos criativos
    const videoUrl = anuncioData.url_video;
    
    console.log('URL do vídeo principal:', videoUrl);
    
    if (!videoUrl || videoUrl.trim() === "") {
      alert("Não há URL de vídeo disponível para este anúncio.");
      return;
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Erro ao reproduzir o vídeo:", error);
          alert("Não foi possível reproduzir o vídeo. Verifique se a URL está correta.");
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Função para alternar favorito
  const toggleFavorito = () => {
    if (!anuncioData) return;

    // Recuperar favoritos do localStorage
    const favoritosArmazenados = localStorage.getItem("favoritos");
    let favoritos: number[] = [];

    if (favoritosArmazenados) {
      favoritos = JSON.parse(favoritosArmazenados);
    }

    // Alternar favorito
    if (isFavorito) {
      favoritos = favoritos.filter((itemId: number) => itemId !== anuncioData.id);
    } else {
      favoritos.push(anuncioData.id);
    }

    // Salvar no localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    // Atualizar estado
    setIsFavorito(!isFavorito);
  };

  // Função para download do vídeo de um criativo específico
  const handleDownloadCreativeVideo = (creativeId: number, url: string | undefined, title: string) => {
    // Verifica se tem URL do vídeo
    if (!url) {
      alert('Este criativo não possui uma URL de vídeo válida para download');
      return;
    }
    
    try {
      // Cria uma página de download simples com atalho automatizado
      const videoUrl = url;
      const fileName = videoUrl.split('/').pop() || `Criativo_${creativeId}_${title.replace(/\s+/g, '_')}.mp4`;
      
      // Cria um elemento <a> temporário para download
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = fileName;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      
      // Adiciona o elemento ao DOM, clica nele e remove
      document.body.appendChild(a);
      a.click();
      
      // Pequeno delay antes de remover o elemento
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Erro ao baixar o vídeo do criativo:', error);
      
      // Fallback - método simples, abre o vídeo em uma nova aba
      alert('Redirecionando para o vídeo. Use o menu de contexto (botão direito) para salvá-lo.');
      window.open(url, '_blank');
    }
  };

  // Renderizar estados de carregamento e erro
  if (isLoading) {
    return <LoadingState />
  }

  if (error || !anuncioData) {
    return <ErrorState error={error} />
  }

  // Funções para download
  const handleDownloadVideo = () => {
    // Verifica se tem URL do vídeo
    if (!anuncioData || !anuncioData.url_video) {
      alert('URL do vídeo não disponível');
      return;
    }
    
    try {
      // Cria uma página de download simples com atalho automatizado
      const videoUrl = anuncioData.url_video;
      const fileName = videoUrl.split('/').pop() || `${anuncioData.titulo.replace(/\s+/g, '_')}.mp4`;
      
      // Abre uma nova janela para o download
      const downloadWindow = window.open('', '_blank');
      
      if (!downloadWindow) {
        alert('O navegador bloqueou a janela popup. Por favor, permita popups para este site.');
        return;
      }
      
      downloadWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Download do Vídeo</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
            .download-area {
              margin-top: 30px;
              background: white;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            h1 {
              color: #2563eb;
              margin-bottom: 30px;
            }
            .video-container {
              margin: 20px auto;
              max-width: 90%;
              position: relative;
            }
            video {
              width: 100%;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .shortcut-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.85);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              opacity: 0;
              transition: opacity 0.3s ease;
              pointer-events: none;
            }
            .shortcut-box {
              background: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
              max-width: 90%;
              width: 450px;
            }
            .keyboard-shortcut {
              display: inline-flex;
              align-items: center;
              margin: 20px 0;
            }
            .key {
              background: #333;
              color: white;
              padding: 8px 15px;
              border-radius: 6px;
              font-weight: bold;
              margin: 0 5px;
              box-shadow: 0 3px 0 #111;
              min-width: 20px;
              text-align: center;
            }
            .plus {
              margin: 0 10px;
              font-weight: bold;
            }
            .download-btn {
              background: #2563eb;
              color: white;
              border: none;
              padding: 12px 25px;
              font-size: 16px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: bold;
              display: block;
              margin: 25px auto 15px;
              transition: background 0.2s;
            }
            .download-btn:hover {
              background: #1d4ed8;
            }
            .download-progress {
              width: 100%;
              height: 20px;
              background: #e0e0e0;
              border-radius: 10px;
              margin-top: 20px;
              position: relative;
              overflow: hidden;
              display: none;
            }
            .progress-bar {
              height: 100%;
              background: #2563eb;
              width: 0%;
              transition: width 0.3s ease;
              border-radius: 10px;
            }
            .skip-button {
              display: inline-block;
              margin-top: 20px;
              color: #2563eb;
              text-decoration: underline;
              cursor: pointer;
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            .pulse {
              animation: pulse 1.5s infinite;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="download-area">
              <h1>Seu vídeo está pronto para download</h1>
              
              <div class="video-container">
                <video controls>
                  <source src="${videoUrl}" type="video/mp4">
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>

              <button class="download-btn pulse" onclick="downloadVideo()">
                Baixar Vídeo
              </button>

              <div class="download-progress">
                <div class="progress-bar"></div>
              </div>

              <div class="skip-button" onclick="skipDownload()">
                Pular download e continuar navegando
              </div>
            </div>
          </div>

          <script>
            function downloadVideo() {
              const link = document.createElement('a');
              link.href = '${videoUrl}';
              link.download = '${fileName}';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }

            function skipDownload() {
              window.close();
            }

            // Mostrar atalho de teclado
            document.addEventListener('keydown', function(e) {
              if (e.key === 's' || e.key === 'S') {
                downloadVideo();
              }
            });
          </script>
        </body>
        </html>
      `);
    } catch (error) {
      console.error('Erro ao baixar o vídeo:', error);
      alert('Não foi possível baixar o vídeo. Tente novamente mais tarde.');
    }
  };

  const toggleLike = (id: number) => {
    setLikedCreatives((prev) => (prev.includes(id) ? prev.filter((creativeId) => creativeId !== id) : [...prev, id]))
  }

  // Função para selecionar um criativo a partir do gráfico
  const handleCreativeSelect = (id: number): void => {
    setSelectedCreativeId(id === selectedCreativeId ? null : id);
  }

  // Função para limpar a seleção
  const clearCreativeSelection = () => {
    setSelectedCreativeId(null)
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }: PieChartCustomLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "green" : "red"
  }

  // Função para obter a cor da tag
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "ESCALANDO":
        return "[#F66722]"
      case "TESTE":
        return "yellow-500"
      case "PAUSADO":
        return "red-500"
      default:
        return "blue-500"
    }
  }

  // Função para obter a cor hover da tag
  const getTagHoverColor = (tag: string) => {
    switch (tag) {
      case "ESCALANDO":
        return "orange-600"
      case "TESTE":
        return "yellow-600"
      case "PAUSADO":
        return "red-600"
      default:
        return "blue-600"
    }
  }

  // Filtrar criativos com base na seleção
  const filteredCreativos = selectedCreativeId
    ? anuncioData.criativos.filter((criativo) => criativo.id === selectedCreativeId)
    : anuncioData.criativos

  // Função para calcular o status do criativo baseado no número de criativos
  const calculateCreativeStatus = (value: number, newCreativesCount: number = 0): StatusInfo => {
    // Verifica se está escalando horizontalmente (muitos criativos novos)
    if (newCreativesCount >= 15) {
      return {
        status: "Lateralizando Oferta",
        color: "#3b82f6", // azul
        textColor: "text-blue-400",
        bgColor: "bg-blue-500/20"
      };
    }

    // Verifica o status baseado no número total de criativos
    if (value >= 50) {
      return {
        status: "Escalando",
        color: "#22c55e", // verde
        textColor: "text-green-400",
        bgColor: "bg-green-500/20"
      };
    } else if (value >= 20) {
      return {
        status: "Testando criativos",
        color: "#eab308", // amarelo
        textColor: "text-yellow-400",
        bgColor: "bg-yellow-500/20"
      };
    } else {
      return {
        status: "Perdendo desempenho",
        color: "#ef4444", // vermelho
        textColor: "text-red-400",
        bgColor: "bg-red-500/20"
      };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white font-sans">
      {/* Main Content */}
      <div className="mx-auto px-4 md:px-20 py-6 flex-grow w-full">
        <div className="flex flex-col gap-6">
          {/* Back Button */}
          <div className="flex-none mr-3 -ml-1">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              onClick={() => router.back()}
            >
              <ArrowLeft size={19} className="text-gray-300" />
            </button>
          </div>

          {/* Campaign Title & Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
            <div>
              <h1
                className="text-2xl font-bold"
                id={`titulo-principal-${anuncioData.id}`}
                data-field="TITULO-PRINCIPAL"
              >
                {anuncioData.titulo}
              </h1>
              <div className="flex items-center mt-1 text-gray-400 text-sm">
                <Clock size={14} className="mr-1" />
                <span id={`data-anuncio-${anuncioData.id}`} data-field="DATA-ANUNCIO">
                  {anuncioData.data_anuncio}
                </span>
                <span className="mx-2">•</span>
                <Target size={14} className="mr-1" />
                <span>{anuncioData.nicho}</span>
                <span className="mx-2">•</span>
                <div
                  className={`bg-${getStatusColor(anuncioData.status)}-500/20 text-${getStatusColor(anuncioData.status)}-400 text-xs rounded-full px-2 py-0.5 flex items-center`}
                >
                  <span>{anuncioData.status}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4 md:mt-0">
              {/* Tag ESCALANDO - Botão para ação de escalabilidade */}
              <button
                className={`bg-[#F66722] hover:bg-[#E55611] transition rounded-lg px-3 py-1.5 text-sm font-medium flex items-center`}
                id={`tag-principal-${anuncioData.id}`}
                data-field="TAG-PRINCIPAL"
              >
                <TrendingUp size={16} className="mr-1" />
                {anuncioData.tag_principal}
              </button>
              <button
                className={`${isFavorito ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"} transition rounded-lg px-3 py-1.5 text-sm font-medium flex items-center`}
                onClick={toggleFavorito}
              >
                <Heart size={16} className="mr-1" fill={isFavorito ? "currentColor" : "none"} />
                {isFavorito ? "Favoritado" : "Favoritar"}
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 transition rounded-lg px-3 py-1.5 text-sm font-medium flex items-center">
                <Share2 size={16} className="mr-1" />
                Compartilhar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800/50 rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === "overview" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white border border-gray-700/50 shadow-sm hover:shadow-md hover:border-gray-600/70 transition-all duration-200"}`}
            >
              Visão Geral
            </button>

            <button
              onClick={() => setActiveTab("creatives")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === "creatives" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white border border-gray-700/50 shadow-sm hover:shadow-md hover:border-gray-600/70 transition-all duration-200"}`}
            >
              Criativos
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeTab === "settings" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white border border-gray-700/50 shadow-sm hover:shadow-md hover:border-gray-600/70 transition-all duration-200"}`}
            >
              Links dos Anuncios
            </button>
          </div>

          {/* Content based on active tab */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player - Always visible */}
            <div className="lg:col-span-2">
              <div 
                ref={videoContainerRef}
                className="relative rounded-xl overflow-hidden bg-black border border-gray-700 shadow-lg group"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
                onClick={(e) => {
                  // Evitar que o clique do botão central ou dos controles dispare esse evento também
                  if (
                    e.target === e.currentTarget || 
                    e.target === videoRef.current || 
                    (e.target as HTMLElement).closest('.video-container') !== null
                  ) {
                    handlePlayVideo();
                  }
                }}
              >
                <div className="aspect-video relative video-container">
                  {isPlaying ? (
                    <div className="w-full h-full bg-black">
                      <video
                        ref={videoRef}
                        src={selectedCreativeId 
                          ? anuncioData.criativos.find(c => c.id === selectedCreativeId)?.url || anuncioData.url_video 
                          : anuncioData.url_video}
                        className="w-full h-full object-cover"
                        playsInline
                        autoPlay
                        onEnded={() => setIsPlaying(false)}
                        muted={isMuted}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <img
                        src={selectedCreativeId 
                          ? anuncioData.criativos.find(c => c.id === selectedCreativeId)?.image || anuncioData.imagem || WEBP_URL
                          : anuncioData.imagem || WEBP_URL}
                        alt={selectedCreativeId 
                          ? anuncioData.criativos.find(c => c.id === selectedCreativeId)?.title || anuncioData.titulo
                          : anuncioData.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Verifica se já tentamos o SVG anteriormente
                          if (!tentouSVG) {
                            console.log("Falha ao carregar imagem principal ou WEBP, tentando SVG...");
                            tentouSVG = true;
                            e.currentTarget.src = SVG_URL;
                          } else {
                            // Se já tentamos o SVG, usamos diretamente o SVG_FALLBACK
                            console.log("Falha ao carregar SVG, usando fallback inline...");
                            e.currentTarget.src = SVG_FALLBACK;
                          }
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Overlay de carregamento */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                  
                  {/* Botão de play central - Agora com exibição condicional */}
                  {showCentralPlayButton && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={handlePlayVideo}
                      className="bg-blue-600 hover:bg-blue-700 rounded-full w-16 h-16 flex items-center justify-center transition transform hover:scale-105"
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                    </button>
                  </div>
                  )}
                  
                  {/* Controles de vídeo */}
                  <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Barra de progresso */}
                    <div className="w-full relative group">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-full h-1.5 rounded-full bg-gray-600 appearance-none cursor-pointer accent-blue-500"
                      />
                      <div 
                        className="absolute top-0 left-0 h-1.5 bg-blue-500 rounded-full pointer-events-none" 
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mt-2">
                      <div className="flex items-center">
                        {/* Tempo atual / duração */}
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                        
                        {/* Controles de avançar/retroceder */}
                        <div className="ml-4 flex items-center space-x-2">
                          <button 
                            onClick={() => seekVideo(-10)}
                            className="text-gray-300 hover:text-white"
                            title="Retroceder 10 segundos"
                          >
                            -10s
                          </button>
                          <button 
                            onClick={() => seekVideo(10)}
                            className="text-gray-300 hover:text-white"
                            title="Avançar 10 segundos"
                          >
                            +10s
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4 items-center">
                        {/* Botão de play/pause na barra de controles */}
                        <button
                          onClick={handlePlayVideo}
                          className="text-gray-300 hover:text-white"
                          title={isPlaying ? "Pausar" : "Reproduzir"}
                        >
                          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        
                        {/* Controle de volume */}
                        <div className="flex items-center relative group">
                          <button onClick={toggleMute}>
                            {isMuted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                              </svg>
                            ) : (
                          <Volume2 size={18} />
                            )}
                        </button>
                          <div className="w-0 overflow-hidden transition-all duration-300 group-hover:w-20 ml-2">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="w-full h-1 bg-gray-600 rounded-full accent-blue-500"
                            />
                          </div>
                        </div>
                        
                        {/* Controle de velocidade */}
                        <div className="relative">
                          <button 
                            onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
                            className="text-sm font-medium bg-gray-700/50 px-2 py-0.5 rounded hover:bg-gray-600/70"
                          >
                            {playbackRate}x
                        </button>
                          
                          {showPlaybackOptions && (
                            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-lg p-2 w-24">
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                <button
                                  key={rate}
                                  onClick={() => changePlaybackRate(rate)}
                                  className={`block w-full text-left px-2 py-1 text-sm rounded ${playbackRate === rate ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                                >
                                  {rate}x
                        </button>
                              ))}
                      </div>
                          )}
                    </div>
                        
                        {/* Tela cheia */}
                        <button onClick={toggleFullscreen}>
                          <Maximize size={18} />
                        </button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-4">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 flex items-center justify-center font-medium"
                  onClick={handleDownloadVideo}
                >
                  <FileText size={18} className="mr-2" />
                  Baixar Vídeo
                </button>
              </div>

              {/* Creative Cards - Only visible on creatives tab */}
              {activeTab === "creatives" && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center">
                      <FileText size={20} className="mr-2 text-blue-400" />
                      Biblioteca de Criativos
                    </h2>

                    {selectedCreativeId && (
                      <button
                        onClick={clearCreativeSelection}
                        className="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-sm"
                      >
                        <X size={14} className="mr-1" />
                        Limpar filtro
                      </button>
                    )}
                  </div>

                  {selectedCreativeId && (
                    <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700/30 rounded-lg text-sm">
                      <p className="flex items-center">
                        <Filter size={16} className="mr-2 text-blue-400" />
                        Mostrando criativo selecionado do gráfico de desempenho
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredCreativos && filteredCreativos.length > 0 ? (
                      filteredCreativos.map((card) => {
                        // Verificar se este card específico está reproduzindo um vídeo
                        const isPlayingThisCard = playingCreatives.includes(card.id);
                        
                        return (
                        <div
                          key={card.id}
                          id={`criativo-${card.id}`}
                          ref={(el) => {
                            if (el) {
                              creativoRefs.current[card.id] = el;
                            }
                          }}
                          className={`bg-gray-800/50 backdrop-blur-sm border ${selectedCreativeId === card.id ? "border-blue-500 ring-2 ring-blue-500/50" : "border-gray-700"} rounded-xl overflow-hidden shadow-lg transition-all duration-300`}
                        >
                          <div className="relative">
                            {/* Mostra o vídeo ou imagem dependendo do estado de reprodução deste card */}
                            {isPlayingThisCard && card.url ? (
                              <div className="w-full aspect-[9/16] max-h-96 mx-auto">
                                <video
                                  src={card.url}
                                  className="w-full h-full object-fill"
                                  playsInline
                                  autoPlay
                                  controls
                                  controlsList="download"
                                  onEnded={() => {
                                    // Remover este criativo da lista de reprodução quando o vídeo terminar
                                    setPlayingCreatives(prev => prev.filter(id => id !== card.id));
                                  }}
                                  onClick={(e) => {
                                    // Evitar propagação para não interferir com o player principal
                                    e.stopPropagation();
                                  }}
                                />
                              </div>
                            ) : (
                              <>
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                  {card.value}
                                </div>
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                  Usam esse Criativo
                                </div>
                                {card.url ? (
                                  <div className="w-full aspect-[9/16] max-h-80 overflow-hidden">
                                    <video
                                      src={card.url}
                                      className="w-full h-full object-cover"
                                      playsInline
                                      preload="metadata"
                                      muted
                                      disablePictureInPicture
                                      disableRemotePlayback
                                      onLoadedMetadata={(e) => {
                                        // Capturar o primeiro quadro e pausar o vídeo
                                        const video = e.target as HTMLVideoElement;
                                        video.currentTime = 0;
                                      }}
                                      onTimeUpdate={(e) => {
                                        // Quando o vídeo atualizar o tempo (chegando ao primeiro quadro), pausar
                                        const video = e.target as HTMLVideoElement;
                                        if (video.currentTime > 0) {
                                          video.pause();
                                        }
                                      }}
                                      onError={(e) => {
                                        console.log("Erro ao carregar thumbnail do vídeo, usando imagem fallback...");
                                        const target = e.target as HTMLVideoElement;
                                        target.style.display = 'none';
                                        const imgElement = document.createElement('img');
                                        imgElement.src = card.image || SVG_URL;
                                        imgElement.alt = card.title || 'Imagem do criativo';
                                        imgElement.className = "w-full h-full object-cover";
                                        imgElement.onerror = () => {
                                          imgElement.src = SVG_FALLBACK;
                                        };
                                        target.parentNode?.appendChild(imgElement);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <img
                                    src={card.image || SVG_URL}
                                    alt={card.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                      console.log("Usando SVG fallback para card...");
                                      e.currentTarget.src = SVG_FALLBACK;
                                    }}
                                  />
                                )}
                                {/* Botão de play sobre a imagem */}
                                <div 
                                  className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (card.url && card.title) {
                                      handleDownloadCreativeVideo(card.id, card.url, card.title);
                                    }
                                  }}
                                >
                                  <div className="bg-blue-600/80 group-hover:bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center transition transform group-hover:scale-110">
                                    <Play size={28} className="text-white" />
                                  </div>
                                </div>
                                {card.caption && (
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <div className="bg-black/50 text-white text-sm md:text-base font-bold px-3 py-2 rounded whitespace-nowrap">
                                      {card.caption}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-sm">{card.title}</h3>
                                <p className="text-gray-400 text-xs mt-1">{card.creativeId}</p>
                              </div>
                              {isPlayingThisCard ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // Remover este criativo da lista de reprodução
                                    setPlayingCreatives(prev => prev.filter(id => id !== card.id));
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition"
                                  title="Parar reprodução"
                                >
                                  <Pause size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDownloadCreativeVideo(card.id, card.url, card.title);
                                  }}
                                  className="text-gray-400 hover:text-blue-500 transition"
                                  title="Baixar vídeo do criativo"
                                >
                                  <Download size={18} />
                                </button>
                              )}
                            </div>
                            <div className="flex mt-3 space-x-2">
                              <div className="bg-blue-900/50 text-blue-400 text-xs rounded-md px-2 py-1">
                                {card.platform}
                              </div>
                              <div className="bg-gray-700/50 text-gray-300 text-xs rounded-md px-2 py-1">
                                {card.language}
                              </div>
                            </div>
                          </div>
                        </div>
                      )})
                    ) : (
                      <p className="col-span-3 text-center text-gray-400">
                        Nenhum criativo disponível para este anúncio.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Dynamic based on tab */}
            <div className="lg:col-span-1">
              {activeTab === "creatives" && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg h-full">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <BarChart size={20} className="mr-2 text-blue-400" />
                    Desempenho de Criativos
                  </h2>

                  <div className="space-y-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={anuncioData.criativos.map((criativo: CriativoType) => {
                            const statusInfo = calculateCreativeStatus(criativo.value || 0, 0);
                            return {
                              name: criativo.title || `Criativo ${criativo.id}`,
                              value: criativo.value || 0,
                              status: statusInfo.status,
                              color: statusInfo.color,
                              creativeId: criativo.id
                            };
                          })}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                          <XAxis type="number" stroke="#9ca3af" />
                          <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                            itemStyle={{ color: "#fff" }}
                            formatter={(value) => [`${value} criativos`, "Total"]}
                            animationDuration={300}
                          />
                          <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            onClick={(data) => handleCreativeSelect(data.creativeId)}
                            cursor="pointer"
                            isAnimationActive={true}
                            animationBegin={300}
                            animationDuration={1500}
                          >
                            {anuncioData.criativos.map((criativo, index) => {
                              const statusInfo = calculateCreativeStatus(criativo.value || 0, 0);
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={selectedCreativeId === criativo.id ? "#3b82f6" : statusInfo.color}
                                  stroke={selectedCreativeId === criativo.id ? "#1d4ed8" : "none"}
                                  strokeWidth={selectedCreativeId === criativo.id ? 2 : 0}
                                />
                              );
                            })}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-2 text-sm text-gray-400">
                      <p className="flex items-center">
                        <BarChart2 size={14} className="mr-1 text-blue-400" />
                        Clique em uma barra para filtrar o criativo correspondente
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Status dos Criativos</h3>
                      {anuncioData.criativos.map((creative, index) => {
                        const statusInfo = calculateCreativeStatus(creative.value || 0, 0);
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700/30 transition-colors ${
                              selectedCreativeId === creative.id ? "bg-blue-900/20 border-blue-700/30" : ""
                            }`}
                            onClick={() => handleCreativeSelect(creative.id)}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full mr-2`}
                                style={{ backgroundColor: statusInfo.color }}
                              ></div>
                              <span>{creative.title || `Criativo ${creative.id}`}</span>
                            </div>
                            <div className="flex items-center">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                {statusInfo.status}
                              </span>
                              <ChevronRight size={16} className="ml-2 text-gray-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "overview" && (
                <React.Suspense fallback={<div className="p-8 text-center">Carregando gráfico de espionagem...</div>}>
                  <EspionagemChart 
                    periodoAtivo={periodoAtivo}
                    onPeriodoChange={(novoPeriodo) => {
                      console.log("Modern Dashboard - Enviando estatísticas:", anuncioData?.estatisticas);
                      console.log("Modern Dashboard - Enviando criativos:", anuncioData?.criativos);
                      setPeriodoAtivo(novoPeriodo);
                    }}
                    estatisticas={anuncioData.estatisticas}
                    criativos={anuncioData.criativos.map(criativo => ({
                      id: criativo.id,
                      title: criativo.title || `Criativo ${criativo.id}`,
                      value: criativo.value || 0,
                      status: criativo.status
                    }))}
                    anuncioData={{
                      numero_anuncios: anuncioData.numero_anuncios,
                      variacao_diaria: anuncioData.variacao_diaria,
                      variacao_semanal: anuncioData.variacao_semanal
                    }}
                  />
                </React.Suspense>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Integrations Card */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Facebook size={20} className="mr-2 text-blue-400" />
                      Anuncios Filtrados Por IA
                    </h2>

                    <div className="space-y-3">
                      <a
                        href={anuncioData.links?.pagina_anuncio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">Pagina do Anuncio</h3>
                            <p className="text-sm text-gray-400 mt-1 truncate">
                              {anuncioData.links?.pagina_anuncio || "Link não disponível"}
                            </p>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      </a>

                      <a
                        href={anuncioData.links?.criativos_fb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">Link Dos Criativos no Fb</h3>
                            <p className="text-sm text-gray-400 mt-1 truncate">
                              {anuncioData.links?.criativos_fb || "Link não disponível"}
                            </p>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      </a>

                      <a
                        href={anuncioData.links?.anuncios_escalados}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">Link dos Anuncios mais Escalados no Facebook</h3>
                            <p className="text-sm text-gray-400 mt-1 truncate">
                              {anuncioData.links?.anuncios_escalados || "Link não disponível"}
                            </p>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      </a>

                      <a
                        href={anuncioData.links?.site_cloaker}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0">
                                <LockOpen size={14} className="text-white" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-medium">Site Cloaker Quebrado</h3>
                                <p className="text-sm text-gray-400 mt-1 truncate">
                                  {anuncioData.links?.site_cloaker || "Link não disponível"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Product Info Card */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-5">
                      <h2 className="text-xl font-bold mb-4 flex items-center">
                        <BookOpen size={20} className="mr-2 text-blue-400" />
                        Produto
                      </h2>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <BookOpen size={16} className="mr-2" />
                            <span>Tipo</span>
                          </div>
                          <span>{anuncioData.produto?.tipo || "Não informado"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <BarChart2 size={16} className="mr-2" />
                            <span>Estrutura</span>
                          </div>
                          <span>{anuncioData.produto?.estrutura || "Não informado"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <Globe size={16} className="mr-2" />
                            <span>Idioma</span>
                          </div>
                          <div className="flex items-center">
                            <span>{anuncioData.produto?.idioma || "Não informado"}</span>
                            <span className="ml-2">🇧🇷</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <Activity size={16} className="mr-2" />
                            <span>Status</span>
                          </div>
                          <span
                            className={`bg-${getStatusColor(anuncioData.status)}-500/20 text-${getStatusColor(anuncioData.status)}-400 text-xs rounded-full px-2 py-1`}
                          >
                            {anuncioData.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 p-5">
                      <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Target size={20} className="mr-2 text-blue-400" />
                        Marketing
                      </h2>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <Target size={16} className="mr-2" />
                            <span>Nicho</span>
                          </div>
                          <span>{anuncioData.nicho}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <Share2 size={16} className="mr-2" />
                            <span>Rede de tráfego</span>
                          </div>
                          <div className="flex items-center">
                            <span>{anuncioData.produto?.rede_trafego || "Não informado"}</span>
                            <div className="ml-2 w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-xs font-bold">
                              f
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <Filter size={16} className="mr-2" />
                            <span>Funil de vendas</span>
                          </div>
                          <span>{anuncioData.produto?.funil_vendas || "Não informado"}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-400">
                            <Tag size={16} className="mr-2" />
                            <span>Tags</span>
                          </div>
                          <span className="bg-orange-500/30 text-orange-500 text-xs rounded-full px-2 py-1">
                            {anuncioData.tag_principal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transcription - Only visible on overview tab */}
          {activeTab === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FileText size={18} className="mr-2 text-blue-400" />
                  Transcrição
                </h2>
                <div className="flex space-x-2">
                  <button
                    className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 transition rounded-lg"
                    onClick={handleDownloadVideo}
                  >
                    Baixar VSL
                  </button>
                  {anuncioData?.link_transcricao && (
                    <a
                      href={anuncioData.link_transcricao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 transition rounded-lg"
                    >
                      Baixar Copy Completa
                    </a>
                  )}
                </div>
              </div>

              {anuncioData.link_transcricao ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-400">
                      <FileText size={16} className="mr-2" />
                      <span>Link do Documento</span>
                    </div>
                    <a
                      href={anuncioData.link_transcricao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Abrir em Nova Aba
                    </a>
                  </div>
                  <Suspense fallback={
                    <div className="w-full h-[600px] bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  }>
                    <WordDocumentViewer url={anuncioData.link_transcricao} />
                  </Suspense>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">Nenhuma transcrição disponível.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModernDashboard

