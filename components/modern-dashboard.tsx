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
import { AdCard } from './ad-card'

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
// Não precisamos mais dessa referência, pois agora usamos o botão animado customizado
// const SVG_URL = "/images/liveturb-play.svg";

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

// Função para transformar URLs do Google Drive em URLs reproduzíveis
const transformGoogleDriveUrl = (url: string): string => {
  // Verifica se é uma URL do Google Drive
  if (!url || typeof url !== 'string') return url;
  
  // Padrão para URL de compartilhamento do Google Drive
  // Exemplo: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  if (url.includes('drive.google.com/file/d/')) {
    // Extrai o ID do arquivo
    const regex = /\/file\/d\/([^\/]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      const fileId = match[1];
      // Retorna URL para streaming direto
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  
  // Padrão alternativo: URLs diretas de compartilhamento
  // Exemplo: https://drive.google.com/open?id=FILE_ID
  if (url.includes('drive.google.com/open?id=')) {
    const regex = /id=([^&]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  
  // Se não for do Google Drive ou o formato não for reconhecido, retorna a URL original
  return url;
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
  icon?: string; // Ícone opcional para status especiais como "Super Escalado"
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
    
    // Transforma URL do Google Drive se necessário
    const videoUrl = transformGoogleDriveUrl(url);
    
    // Adiciona o criativo à lista de reprodução para mostrar o vídeo inline
    setPlayingCreatives(prev => {
      // Verifica se o criativo já está sendo reproduzido
      if (prev.includes(creativeId)) {
        return prev; // Mantém como está se já estiver reproduzindo
      }
      return [...prev, creativeId]; // Adiciona o criativo à lista de reprodução
    });
    
    // Rola até o card do criativo para garantir que seja visível
    setTimeout(() => {
      const creativeElement = creativoRefs.current[creativeId];
      if (creativeElement) {
        creativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
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
      const videoUrl = transformGoogleDriveUrl(anuncioData.url_video);
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

  // Função para calcular há quantos dias um criativo foi criado
  const calcularDiasCriado = (dataString: string): number => {
    if (!dataString) return 1; // Valor padrão caso não tenha data
    
    try {
      const dataHoje = new Date();
      const dataCriacao = new Date(dataString);
      
      // Zerar as horas para comparar apenas a data
      dataHoje.setHours(0, 0, 0, 0);
      dataCriacao.setHours(0, 0, 0, 0);
      
      // Calcular diferença em dias
      const diferencaEmMilissegundos = dataHoje.getTime() - dataCriacao.getTime();
      const diferencaEmDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
      
      // Garantir que retorne pelo menos 1 dia
      return Math.max(1, diferencaEmDias);
    } catch (error) {
      console.error('Erro ao calcular dias de criação:', error);
      return 1; // Valor padrão em caso de erro
    }
  };
  
  // Função para verificar se um criativo está em "teste"
  const verificarEmTeste = (status: string): boolean => {
    return status?.toLowerCase().includes('teste');
  };
  
  // Função para obter o número total de criativos ativos
  const getTotalCriativosAtivos = (): number => {
    if (!anuncioData?.criativos) return 1;
    return anuncioData.criativos.filter(c => c.status !== 'inativo' && c.status !== 'pausado').length;
  };
  
  // Calcular o total de criativos ativos uma vez para reutilizar
  const totalCriativosAtivos = getTotalCriativosAtivos();

  // Filtrar criativos com base na seleção
  const filteredCreativos = selectedCreativeId
    ? anuncioData.criativos.filter((criativo) => criativo.id === selectedCreativeId)
    : anuncioData.criativos

  // Função para calcular o status do criativo baseado no tempo de criação e número de anúncios
  const calculateCreativeStatus = (
    value: number, 
    newCreativesCount: number = 0, 
    diasCriado: number = 1, 
    numCriativosAtivos: number = 1, 
    emTeste: boolean = false
  ): StatusInfo => {
    // Verificar se há 5+ criativos em teste
    if (emTeste && value >= 5) {
      return {
        status: "Testando Criativo",
        color: "#9ca3af", // Cinza
        textColor: "text-gray-400",
        bgColor: "bg-gray-500/20"
      };
    }

    // Verificar status baseado na quantidade de anúncios
    // Estes status têm prioridade independente do dia de criação
    if (value >= 30) {
      return {
        status: "Super Escalado",
        color: "#f97316", // Laranja - cor sólida para barras do gráfico
        textColor: "text-white", // Texto branco para melhor legibilidade
        bgColor: "bg-gradient-to-r from-orange-500 to-red-500", // Degradê para o badge
        icon: "fire" // Usado para mostrar ícone de fogo
      };
    } else if (value >= 9) {
      return {
        status: "Escalando",
        color: "#22c55e", // Verde
        textColor: "text-green-400",
        bgColor: "bg-green-500/20"
      };
    } else if (value >= 4) {
      return {
        status: "Começando a se destacar",
        color: "#eab308", // Amarelo
        textColor: "text-yellow-400",
        bgColor: "bg-yellow-500/20"
      };
    }
    
    // Para criativos com poucos anúncios, considerar o tempo de criação
    if (diasCriado === 1 && value <= 1) {
      return {
        status: "Recém adicionado",
        color: "#06b6d4", // Ciano
        textColor: "text-cyan-400",
        bgColor: "bg-cyan-500/20"
      };
    } else if (diasCriado === 2 && value <= 3) {
      // O status "Criativo estagnado" só se aplica a criativos com poucos anúncios (<=3)
      return {
        status: "Criativo estagnado",
        color: "#9ca3af", // Cinza
        textColor: "text-gray-400",
        bgColor: "bg-gray-500/20"
      };
    } else if (value <= 3) {
      // Verificar se está escalando horizontalmente (apenas para criativos com poucos anúncios)
      if (numCriativosAtivos >= 5 && diasCriado <= 2) {
        return {
          status: "Escalando Horizontalmente",
          color: "#8b5cf6", // Roxo
          textColor: "text-purple-400",
          bgColor: "bg-purple-500/20"
        };
      } else {
        return {
          status: "Perdendo desempenho",
          color: "#ef4444", // Vermelho
          textColor: "text-red-400",
          bgColor: "bg-red-500/20"
        };
      }
    }

    // Caso padrão (fallback)
    return {
      status: "Criativo estagnado",
      color: "#9ca3af", // Cinza
      textColor: "text-gray-400",
      bgColor: "bg-gray-500/20"
    };
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
              onClick={() => router.push("/escalando-agora")}
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
                        src={transformGoogleDriveUrl(selectedCreativeId 
                          ? anuncioData.criativos.find(c => c.id === selectedCreativeId)?.url || anuncioData.url_video 
                          : anuncioData.url_video)}
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
                            e.currentTarget.src = "";
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

              {/* Análise dos Criativos - Mobile only */}
              {activeTab === "creatives" && (
                <div className="mt-6 block lg:hidden">
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <BarChart size={20} className="mr-2 text-blue-400" />
                      Análise dos Criativos Desta Oferta
                    </h2>

                    <div className="space-y-4">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={anuncioData.criativos.map((criativo: CriativoType) => {
                              const diasCriado = calcularDiasCriado(criativo.created_at);
                              const emTeste = verificarEmTeste(criativo.status);
                              const statusInfo = calculateCreativeStatus(criativo.value || 0, 0, diasCriado, totalCriativosAtivos, emTeste);
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
                                const diasCriado = calcularDiasCriado(criativo.created_at);
                                const emTeste = verificarEmTeste(criativo.status);
                                const statusInfo = calculateCreativeStatus(criativo.value || 0, 0, diasCriado, totalCriativosAtivos, emTeste);
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
                          <BarChart2 size={14} className="mr-2 text-blue-400" />
                          Clique em uma barra para filtrar o criativo correspondente
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Status dos Criativos</h3>
                        {anuncioData.criativos.map((creative, index) => {
                          const diasCriado = calcularDiasCriado(creative.created_at);
                          const emTeste = verificarEmTeste(creative.status);
                          const statusInfo = calculateCreativeStatus(creative.value || 0, 0, diasCriado, totalCriativosAtivos, emTeste);
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
                                  {statusInfo.icon === 'fire' && (
                                    <span className="ml-1">🔥</span>
                                  )}
                                </span>
                                <ChevronRight size={16} className="ml-2 text-gray-400" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Creative Cards */}
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
                        
                        // Converter o criativo atual para o formato do AdCard
                        const adCardData = {
                          ad_archived_status: (() => {
                            if (!card.status) return "INACTIVE";
                            const statusStr = String(card.status).toLowerCase();
                            return (statusStr === "active" || 
                                    statusStr === "ativo" || 
                                    statusStr === "1") ? "ACTIVE" : "INACTIVE";
                          })(),
                          ad_library_id: card.creativeId || `C${card.id}`,
                          ad_creation_time: card.created_at || new Date().toISOString(),
                          publisher_platforms: card.platform === "instagram" ? ["instagram"] : 
                                               card.platform === "facebook" ? ["facebook"] : 
                                               ["facebook", "instagram"], // Default para ambos
                          ad_snapshot_count: card.value || 0,
                          page_name: anuncioData.titulo || "Nome da Página",
                          page_profile_picture_url: null,
                          page_id: anuncioData.links?.pagina_anuncio?.split('/').pop() || "pageid",
                          ad_creative_bodies: [
                            // Se não houver texto específico, usa o título do criativo e título do anúncio
                            card.title || "Criativo Original",
                            anuncioData.titulo || "Título do Anúncio",
                            // Informações adicionais que possam existir
                            card.tag ? `Categoria: ${card.tag}` : "",
                            card.language ? `Idioma: ${card.language}` : "",
                          ].filter(item => item.length > 0), // Remove itens vazios
                          ad_creative: card.url ? {
                            // Criativo tipo vídeo
                            type: "video" as const,
                            video_hd_url: card.url || "",
                            thumbnail_url: card.image || "",
                            image_url: null
                          } : {
                            // Criativo tipo imagem
                            type: "image" as const,
                            video_hd_url: "",
                            thumbnail_url: card.image || "",
                            image_url: card.image || ""
                          },
                          ad_review_feedback: {
                            rating: 5.0,
                            learn_more_url: anuncioData.links?.pagina_anuncio || "https://liveturb.com",
                          }
                        };

                        return (
                          <div
                            key={card.id}
                            id={`criativo-${card.id}`}
                            ref={(el) => {
                              if (el) {
                                creativoRefs.current[card.id] = el;
                              }
                            }}
                            className={`transition-all duration-300 ${isPlayingThisCard ? 'ring-2 ring-blue-500' : ''}`}
                          >
                            <AdCard 
                              {...adCardData}
                              id={card.id}
                              isSelected={selectedCreativeId === card.id}
                              onSelect={() => setSelectedCreativeId(card.id === selectedCreativeId ? null : card.id)}
                              transformVideoUrl={transformGoogleDriveUrl}
                              onPlayClick={(id) => {
                                if (card.url && card.title) {
                                  handleDownloadCreativeVideo(card.id, card.url, card.title);
                                }
                              }}
                            />
                          </div>
                        );
                      })
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
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg h-full hidden lg:block">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <BarChart size={20} className="mr-2 text-blue-400" />
                    Análise dos Criativos Desta Oferta
                  </h2>

                  <div className="space-y-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={anuncioData.criativos.map((criativo: CriativoType) => {
                            const diasCriado = calcularDiasCriado(criativo.created_at);
                            const emTeste = verificarEmTeste(criativo.status);
                            const statusInfo = calculateCreativeStatus(criativo.value || 0, 0, diasCriado, totalCriativosAtivos, emTeste);
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
                              const diasCriado = calcularDiasCriado(criativo.created_at);
                              const emTeste = verificarEmTeste(criativo.status);
                              const statusInfo = calculateCreativeStatus(criativo.value || 0, 0, diasCriado, totalCriativosAtivos, emTeste);
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
                        <BarChart2 size={14} className="mr-2 text-blue-400" />
                        Clique em uma barra para filtrar o criativo correspondente
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Status dos Criativos</h3>
                      {anuncioData.criativos.map((creative, index) => {
                        const diasCriado = calcularDiasCriado(creative.created_at);
                        const emTeste = verificarEmTeste(creative.status);
                        const statusInfo = calculateCreativeStatus(creative.value || 0, 0, diasCriado, totalCriativosAtivos, emTeste);
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
                                {statusInfo.icon === 'fire' && (
                                  <span className="ml-1">🔥</span>
                                )}
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
                          <div className="flex items-center text-gray-400">
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
                    <FileText size={18} className="mr-2" />
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