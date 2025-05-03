"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';

// Definição da interface para o criativo
interface AdCreative {
  type: string;
  video_hd_url: string;
  thumbnail_url: string;
  image_url: string | null;
}

// Definição da interface para criativo por tipo
interface VideoAdCreative {
  type: "video";
  video_hd_url: string;
  thumbnail_url: string;
  image_url: null;
}

interface ImageAdCreative {
  type: "image";
  video_hd_url: string;
  thumbnail_url: string;
  image_url: string;
}

type AdCreativeType = VideoAdCreative | ImageAdCreative;

// Definição da interface para a avaliação
interface AdReviewFeedback {
  rating: number;
  learn_more_url: string;
}

/**
 * Componente AdCard - Replica os cards da Biblioteca de Anúncios do Meta
 * usando a nomenclatura original do Facebook
 * 
 * @param {Object} props
 * @param {string} props.ad_archived_status - Status do anúncio ("ACTIVE", "INACTIVE")
 * @param {string} props.ad_library_id - ID da biblioteca de anúncios
 * @param {string} props.ad_creation_time - Data de criação do anúncio
 * @param {Array<string>} props.publisher_platforms - Plataformas onde o anúncio é exibido
 * @param {number} props.ad_snapshot_count - Número de anúncios que usam este criativo
 * @param {string} props.page_name - Nome da página do anunciante
 * @param {string} props.page_profile_picture_url - URL da imagem do perfil da página
 * @param {string} props.page_id - ID da página/anunciante
 * @param {Array<string>} props.ad_creative_bodies - Lista de tópicos do anúncio
 * @param {AdCreativeType} props.ad_creative - Dados do criativo (vídeo ou imagem)
 * @param {AdReviewFeedback} props.ad_review_feedback - Dados de avaliação do anúncio
 * @param {function} props.onSelect - Função chamada quando o card é selecionado
 * @param {boolean} props.isSelected - Indica se o card está selecionado
 * @param {number} props.id - ID do card
 * @param {function} props.transformVideoUrl - Função para transformar a URL do vídeo
 * @param {function} props.onPlayClick - Função chamada quando o botão de play é clicado
 * @param {string} props.language - Idioma do anúncio
 */
export const AdCard = ({
  ad_archived_status = "ACTIVE",
  ad_library_id = "949934494021920",
  ad_creation_time = "2025-04-17T10:00:00",
  publisher_platforms = ["facebook", "instagram"],
  ad_snapshot_count = 56,
  page_name = "Fer Pinheiro",
  page_profile_picture_url = null,
  page_id = "fercoachpinheiro",
  ad_creative_bodies = [
    "Alcance os seus objetivos e receba",
    "Um plano personalizado de perda passo a passo",
    "Estratégias para queimar gordura",
    "Cardápio personalizado com base na sua meta",
    "Estratégias para acelerar seu metabolismo",
    "Mais confiança e noites de sono melhores"
  ],
  ad_creative = {
    type: "video",
    video_hd_url: "https://example.com/video.mp4",
    thumbnail_url: "/api/placeholder/400/320",
    image_url: null
  } as AdCreativeType,
  ad_review_feedback = {
    rating: 5.0,
    learn_more_url: "https://example.com/reviews"
  },
  onSelect = () => {},
  isSelected = false,
  id = 0,
  transformVideoUrl = (url: string) => url,
  onPlayClick = (id: number) => {},
  language = "PT-BR" // Parâmetro de fallback para o idioma
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Função para extrair o idioma real das descrições
  const extractLanguage = () => {
    if (!ad_creative_bodies || ad_creative_bodies.length === 0) return language;
    
    // Procurar por uma entrada com o formato "Idioma: XX-XX" ou similar
    const langEntry = ad_creative_bodies.find(desc => 
      desc.toLowerCase().startsWith("idioma:") || 
      desc.toLowerCase().includes("idioma:")
    );
    
    if (langEntry) {
      // Extrair o código do idioma da string
      const match = langEntry.match(/idioma:\s*([a-z]{2}(-[a-z]{2})?)/i);
      if (match && match[1]) {
        return match[1].trim(); // Retorna o código do idioma (ex: EN-US)
      }
    }
    
    return language; // Fallback para o valor padrão
  };
  
  // Idioma real extraído das descrições
  const realLanguage = extractLanguage();
  
  // Formatação da data de criação para formato legível
  const formatCreationDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return `${date.getDate()} de ${date.toLocaleDateString('pt-BR', { month: 'short' })} de ${date.getFullYear()}`;
  };
  
  // Função para renderizar os ícones de plataforma
  const renderPlatformIcons = () => {
    return (
      <div className="flex space-x-2 my-2">
        {publisher_platforms.includes("facebook") && (
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            f
          </div>
        )}
        
        {publisher_platforms.includes("instagram") && (
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <circle cx="12" cy="12" r="3"></circle>
              <circle cx="17" cy="7" r="1"></circle>
            </svg>
          </div>
        )}
      </div>
    );
  };
  
  // Função para extrair o frame do vídeo e usar como thumbnail
  const extractVideoFrame = useCallback(async (videoUrl: string) => {
    // Se já temos uma thumbnail válida no ad_creative, ou se já geramos uma, não precisamos extrair
    if (
      (ad_creative.thumbnail_url && 
       ad_creative.thumbnail_url !== "/api/placeholder/400/320" && 
       !ad_creative.thumbnail_url.includes("placeholder")) || 
      generatedThumbnail
    ) {
      return;
    }
    
    // Se a URL for inválida ou vazia, não tente extrair
    if (!videoUrl || videoUrl === "" || 
        (typeof videoUrl === 'string' && videoUrl.includes("placeholder"))) {
      console.log("URL de vídeo inválida ou vazia:", videoUrl);
      return;
    }
    
    // Garantir que estamos trabalhando com uma string
    if (typeof videoUrl !== 'string') {
      console.error("URL de vídeo não é uma string:", videoUrl);
      return;
    }
    
    console.log("Tentando extrair frame do vídeo:", videoUrl);
    
    // Se for um documento do Google Drive (não é vídeo), não tente extrair frame
    if (videoUrl.includes('docs.google.com/document') || 
        videoUrl.includes('docs.google.com/spreadsheets') || 
        videoUrl.includes('docs.google.com/presentation')) {
      console.log("URL é um documento do Google, não um vídeo. Não tentando extrair frame.");
      return;
    }
    
    // Processamos a URL do vídeo primeiro, pois isso é necessário para ambas as abordagens
    const processedUrl = transformVideoUrl ? transformVideoUrl(videoUrl) : videoUrl;
    
    // Tentamos ambas as abordagens para garantir que pelo menos uma funcione
    let success = false;
    
    // Verificar se é uma URL do Google Drive para usar método alternativo como fallback
    const isGoogleDriveUrl = videoUrl.includes('drive.google.com') || processedUrl.includes('drive.google.com');
    let driveFileId = "";
    
    // Extrair o ID do arquivo Google Drive (se aplicável)
    if (isGoogleDriveUrl) {
      if (videoUrl.includes('/file/d/') || processedUrl.includes('/file/d/')) {
        const urlToCheck = videoUrl.includes('/file/d/') ? videoUrl : processedUrl;
        const regex = /\/file\/d\/([^\/]+)/;
        const match = urlToCheck.match(regex);
        if (match && match[1]) {
          driveFileId = match[1];
        }
      } else if (videoUrl.includes('id=') || processedUrl.includes('id=')) {
        const urlToCheck = videoUrl.includes('id=') ? videoUrl : processedUrl;
        const regex = /id=([^&]+)/;
        const match = urlToCheck.match(regex);
        if (match && match[1]) {
          driveFileId = match[1];
        }
      }
      
      // Se for URL do Google Drive e temos o ID, usar imediatamente o método da API de thumbnails 
      if (driveFileId) {
        console.log("Usando API de thumbnails do Google Drive diretamente");
        const thumbnailUrl = `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w640`;
        setGeneratedThumbnail(thumbnailUrl);
        return; // Retorne imediatamente, não tente o método canvas para Drive
      }
    }
    
    // Se não for do Google Drive ou não tiver ID, tente o método canvas
    try {
      // Criar um elemento de vídeo temporário
      const video = document.createElement('video');
      
      // Configurações importantes para evitar problemas de carregamento
      video.crossOrigin = "anonymous";
      video.muted = true; // Importante para que o vídeo possa ser reproduzido sem interação do usuário
      video.playsInline = true;
      video.preload = "metadata"; // Tenta carregar apenas os metadados primeiro
      
      // Adicionar o vídeo ao DOM temporariamente (isso ajuda em alguns navegadores)
      video.style.display = 'none';
      document.body.appendChild(video);
      
      // Definir um timeout para garantir que o vídeo seja processado mesmo se alguns eventos não dispararem
      const timeoutId = setTimeout(() => {
        if (success) return; // Se já tivemos sucesso com outra abordagem, não continue
        
        console.warn("Timeout atingido, limpando recursos");
        cleanupVideo();
      }, 5000); // 5 segundos de timeout
      
      // Função para capturar o frame atual do vídeo
      const captureFrame = () => {
        if (success) return; // Se já tivemos sucesso com outra abordagem, não continue
        
        try {
          console.log("Capturando frame, dimensões:", video.videoWidth, "x", video.videoHeight);
          
          // Verificar se temos dimensões válidas
          if (video.videoWidth <= 0 || video.videoHeight <= 0) {
            console.warn("Dimensões de vídeo inválidas, abortando captura");
            cleanupVideo();
            return;
          }
          
          // Criar um canvas com as dimensões do vídeo
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Desenhar o frame atual do vídeo no canvas
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Converter o canvas para uma URL de dados (base64)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            // Verificar se a URL de dados é válida
            if (dataUrl && dataUrl.startsWith('data:image/jpeg')) {
              console.log("Thumbnail gerada com sucesso através do canvas!");
              // Atualizar o estado com a nova thumbnail
              setGeneratedThumbnail(dataUrl);
              success = true;
            } else {
              console.warn("URL de dados gerada é inválida");
            }
          }
        } catch (e) {
          console.error("Erro ao desenhar vídeo no canvas:", e);
        } finally {
          cleanupVideo();
        }
      };
      
      // Função para limpar recursos do vídeo
      const cleanupVideo = () => {
        clearTimeout(timeoutId);
        try {
          video.pause();
          video.src = "";
          video.load();
          // Remover o vídeo do DOM
          if (video.parentNode) {
            video.parentNode.removeChild(video);
          }
        } catch (e) {
          console.error("Erro ao limpar recursos de vídeo:", e);
        }
      };
      
      // Eventos de vídeo
      video.addEventListener('loadedmetadata', () => {
        if (success) return; // Se já tivemos sucesso com outra abordagem, não continue
        
        console.log("Metadados de vídeo carregados, duração:", video.duration);
        // Alguns vídeos podem não ter duração definida
        const targetTime = video.duration && !isNaN(video.duration) ? video.duration * 0.25 : 1.0;
        video.currentTime = targetTime;
      });
      
      video.addEventListener('seeked', () => {
        if (success) return; // Se já tivemos sucesso com outra abordagem, não continue
        
        console.log("Vídeo avançado para posição desejada:", video.currentTime);
        captureFrame();
      });
      
      video.addEventListener('loadeddata', () => {
        if (success) return; // Se já tivemos sucesso com outra abordagem, não continue
        
        console.log("Dados do vídeo carregados");
        if (video.duration === Infinity || isNaN(video.duration)) {
          // Para streams ou vídeos sem duração definida
          setTimeout(() => {
            if (!success) {
              video.currentTime = 1.0; // Tentar pular para 1 segundo
            }
          }, 1000);
        }
      });
      
      // Adicionar listener para tratar erros
      video.addEventListener('error', (e) => {
        if (success) return; // Se já tivemos sucesso com outra abordagem, não continue
        
        console.error('Erro ao carregar o vídeo para extração de frame:', video.error?.message || e);
        cleanupVideo();
      });
      
      // Iniciar carregamento
      video.src = processedUrl;
      video.load();
      
      // Tentar iniciar reprodução para ajudar com o carregamento em alguns navegadores
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(err => {
          console.warn("Erro ao reproduzir vídeo (esperado em alguns navegadores):", err);
          
          // Se não conseguir reproduzir, ainda assim tente avançar no vídeo
          setTimeout(() => {
            if (!success && video.readyState >= 2) {
              video.currentTime = video.duration ? video.duration * 0.25 : 1.0;
            }
          }, 1000);
        });
      }
      
    } catch (error) {
      console.error('Erro ao extrair frame do vídeo:', error);
    }
  }, [ad_creative.thumbnail_url, generatedThumbnail, transformVideoUrl]);
  
  // Tentar extrair o frame do vídeo quando o componente for montado
  useEffect(() => {
    if (ad_creative.type === "video" && ad_creative.video_hd_url) {
      extractVideoFrame(ad_creative.video_hd_url);
    }
  }, [ad_creative.type, ad_creative.video_hd_url, extractVideoFrame]);
  
  // Função para renderizar o player de vídeo ou imagem
  const renderCreative = () => {
    if (ad_creative.type === "video") {
      return (
        <div className="relative w-full h-64 bg-black">
          {isPlaying ? (
            <video 
              className="w-full h-full object-contain"
              controls
              autoPlay
              src={transformVideoUrl ? transformVideoUrl(ad_creative.video_hd_url) : ad_creative.video_hd_url}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div className="relative w-full h-full cursor-pointer" onClick={() => {
              setIsPlaying(true);
              if (onPlayClick) onPlayClick(id);
            }}>
              <img 
                src={generatedThumbnail || ad_creative.thumbnail_url || "/placeholder.jpg"}
                alt="Vídeo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Erro ao carregar thumbnail, usando fallback");
                  // Se a imagem falhar, tentar usar o fallback
                  const img = e.currentTarget;
                  // Evitar loop infinito
                  if (!img.src.includes('/placeholder.jpg')) {
                    img.src = "/placeholder.jpg";
                    // Tentar extrair frame novamente, se possível
                    if (ad_creative.video_hd_url) {
                      extractVideoFrame(ad_creative.video_hd_url);
                    }
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center group">
                {/* Overlay sutil com gradiente refinado */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300"></div>
                
                {/* Botão de play mais visível */}
                <button 
                  onClick={() => {
                    setIsPlaying(true);
                    if (onPlayClick) onPlayClick(id);
                  }}
                  className="relative transform transition-all duration-300 z-10 group-hover:scale-110"
                  aria-label="Reproduzir vídeo"
                >
                  {/* Container principal do botão */}
                  <div className="relative flex items-center justify-center w-20 h-20">
                    {/* Círculo externo */}
                    <div className="absolute inset-0 rounded-full bg-black/70"></div>
                    
                    {/* Círculo com borda gradiente */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/80"></div>
                    
                    {/* Efeito brilho no hover */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300 bg-gradient-to-r from-theme-orange to-theme-blue blur-sm"></div>
                    
                    {/* Ícone de play elegante - maior e mais visível */}
                    <div className="relative h-8 w-8 ml-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white drop-shadow-lg">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="relative w-full h-64 bg-gray-200">
          <img 
            src={ad_creative.image_url || "/placeholder.jpg"}
            alt="Criativo do anúncio"
            className="w-full h-full object-cover"
            onError={(e) => e.currentTarget.src = "/placeholder.jpg"}
          />
        </div>
      );
    }
  };
  
  // Criar estilos globais mais refinados e sutis
  useEffect(() => {
    // Verificar se já criamos os estilos para evitar duplicação
    if (!document.getElementById('player-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'player-styles';
      styleEl.innerHTML = `
        /* Cores do tema */
        :root {
          --theme-orange: rgb(246, 103, 34);
          --theme-blue: rgb(59, 130, 246);
        }
        
        /* Efeito de sombra para o botão de play */
        .drop-shadow-lg {
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
        }
        
        /* Certificar-se de que imagens com erro não mostrem o ícone de quebrado */
        img {
          object-fit: cover;
        }
        
        img:before {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #2d2d2d;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);
  
  return (
    <div 
      className={`flex flex-col w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}
    >
      {/* Status e Identificação */}
      <div className="p-4 pb-0">
        <div className="flex items-center">
          <span className={`text-white text-xs font-medium px-2 py-1 rounded ${ad_archived_status === "ACTIVE" ? "bg-green-500" : "bg-gray-500"}`}>
            {ad_archived_status === "ACTIVE" ? "Ativo" : "Inativo"}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-800 dark:text-gray-300">
          <p className="mb-1">Identificação da biblioteca: {ad_library_id}</p>
          <p className="mb-1">Vinculação iniciada em: {formatCreationDate(ad_creation_time)}</p>
          
          {/* Plataformas */}
          {renderPlatformIcons()}
          
          {/* Contagem de anúncios - Mostra apenas se for um grupo (ad_snapshot_count > 1) */}
          {ad_snapshot_count > 1 && (
            <div className="flex justify-between items-center mt-1">
              <p className="font-medium">{ad_snapshot_count} anúncios usam esse criativo e esse texto</p>
              <button className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium text-sm px-3 py-1.5 rounded-md transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400">Ver resumo</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Informações do anunciante */}
      <div className="px-4 py-3 flex items-center">
        {page_profile_picture_url ? (
          <img 
            src={page_profile_picture_url} 
            alt={`${page_name} avatar`}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
              {page_name.substring(0, 2)}
            </div>
          </div>
        )}
        <div>
          <p className="font-medium text-sm text-gray-800 dark:text-white">{page_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Patrocinado</p>
        </div>
        
        {/* Botão para visualizar página do anunciante */}
        <div className="ml-auto">
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium text-xs px-2.5 py-1 rounded-md transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400"
            onClick={() => window.open(`https://facebook.com/${page_id}`, '_blank')}
          >
            Ver página
          </button>
        </div>
      </div>
      
      {/* Conteúdo do anúncio */}
      <div className="px-4">
        {/* Descrição do criativo */}
        <div className="mb-3">
          {ad_creative_bodies && ad_creative_bodies.length > 0 ? (
            ad_creative_bodies
              // Filtrar descrições que contenham "Idioma:" ou que duplicam o page_name
              .filter(description => 
                !description.toLowerCase().includes("idioma:") && 
                description !== page_name && 
                description !== "Criativo 1"
              )
              .map((description, index) => (
                <div key={index} className="mb-1">
                  <span className="text-sm text-gray-800 dark:text-gray-200">{description}</span>
                </div>
              ))
          ) : (
            <div className="mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-500">Sem descrição disponível</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Criativo do anúncio - Agora com suporte para vídeo */}
      {renderCreative()}
      
      {/* Seção de Idioma - Substitui a seção de avaliações */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-800 dark:text-gray-200 font-medium mr-2">Idioma:</span>
            <div className="flex items-center">
              {/* Processamento para códigos de idioma compostos (ex: EN-US) */}
              {(() => {
                // Extrair o código principal do idioma (parte antes do hífen)
                const mainLangCode = realLanguage.split('-')[0].toUpperCase();
                const fullLangCode = realLanguage.toUpperCase();
                
                // Mapeamento de códigos de idioma para códigos de país para bandeiras
                const langToCountry: {[key: string]: string} = {
                  'PT': 'br',
                  'EN': 'us',
                  'ES': 'es',
                  'FR': 'fr',
                  'DE': 'de',
                  'IT': 'it',
                  'RU': 'ru',
                  'ZH': 'cn',
                  'JA': 'jp',
                  'KO': 'kr',
                  'AR': 'sa',
                  'HI': 'in'
                };
                
                const countryCode = langToCountry[mainLangCode] || mainLangCode.toLowerCase();
                
                return (
                  <span className="flex items-center">
                    <img 
                      src={`/images/flags/${countryCode}.svg`} 
                      alt={fullLangCode} 
                      className="w-5 h-[0.9rem] mr-1" 
                      onError={(e) => (e.currentTarget.src = `https://flagcdn.com/w20/${countryCode}.png`)} 
                    />
                    <span className="text-sm">{fullLangCode}</span>
                  </span>
                );
              })()}
            </div>
          </div>
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium text-sm px-3 py-1.5 rounded-md transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-400"
            onClick={() => window.open(ad_review_feedback.learn_more_url, '_blank')}
          >
            Saiba mais
          </button>
        </div>
      </div>
      
      {/* Div escondida para pré-carregar a imagem de fallback e evitar flicker */}
      <div style={{ display: 'none' }}>
        <img src="/placeholder.jpg" alt="preload" />
      </div>
    </div>
  );
};

export default AdCard;
