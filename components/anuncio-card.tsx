"use client"

import type React from "react"
import type { Anuncio } from "../types"
import { BarChart2, Flame, Heart, TrendingDown, TrendingUp } from "lucide-react"
import { CountryFlag } from "./country-flag"

interface AnuncioCardProps {
  anuncio: Anuncio
  onClick: () => void
  isFavorito?: boolean
  onFavoritoClick?: (event: React.MouseEvent) => void
  onMouseEnter?: () => void // Adicionar prop onMouseEnter
}

export const AnuncioCard: React.FC<AnuncioCardProps> = ({
  anuncio,
  onClick,
  isFavorito = false,
  onFavoritoClick = (e) => e.stopPropagation(),
  onMouseEnter, // Adicionar onMouseEnter aos props desestruturados
}) => {
  const isPositiveDiaria = anuncio.variacao_diaria > 0
  const isPositiveSemanal = anuncio.variacao_semanal > 0

  // Log de depuração para o valor de numero_anuncios
  console.log(`AnuncioCard ID ${anuncio.id}:`, {
    numero_anuncios: anuncio.numero_anuncios,
    tipo: typeof anuncio.numero_anuncios,
    titulo: anuncio.titulo
  });

  return (
    <div
      id={`card-${anuncio.id}`}
      data-anuncio-id={anuncio.id}
      className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] border border-zinc-700/20 group cursor-pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter} // Adicionar evento onMouseEnter ao div
    >
      <div className="aspect-video bg-zinc-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/50 group-hover:from-black/0 group-hover:to-black/40 transition-all duration-300"></div>
        <img
          src={anuncio.imagem || "/placeholder.svg"}
          alt={anuncio.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          data-field="IMAGEM"
        />
        <div className="absolute top-2 left-2 flex items-center bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10">
          <Flame size={14} className="text-orange-500 mr-1" />
          <span className="text-xs font-medium" data-field="TAG-PRINCIPAL">
            {anuncio.tag_principal}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex items-center bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 border border-zinc-500/30 shadow-lg">
          <BarChart2 size={14} className="mr-1" />
          <span className="text-xs font-medium" data-field="CONTADOR-ANUNCIOS">
            {anuncio.numero_anuncios ?? 0}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-base mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors duration-200">
          <span data-field="TITULO-PRINCIPAL">{anuncio.titulo}</span>
        </h3>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
            <span data-field="DATA-ANUNCIO">{anuncio.data_anuncio}</span>
          </div>
          <div
            className="flex items-center justify-center px-2 py-1 bg-zinc-800/80 rounded-md"
            data-field="PAIS-ANUNCIO"
          >
            <CountryFlag countryCode={anuncio.pais_codigo} />
          </div>
          <button
            className={`p-1.5 rounded-full ${
              isFavorito
                ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                : "text-zinc-400 bg-zinc-800/80 hover:bg-zinc-700/80 hover:text-red-400"
            } transition-colors duration-200`}
            onClick={onFavoritoClick}
            title={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart size={16} fill={isFavorito ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-1 text-xs">
          <div className="bg-zinc-800/50 p-2 rounded-lg relative group">
            <div className="text-zinc-400 mb-1 text-[10px] uppercase tracking-wider">Variação Diária</div>
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center ${isPositiveDiaria ? "text-green-400" : anuncio.variacao_diaria === 0 ? "text-zinc-300" : "text-red-400"} font-medium text-xs`}
              >
                {isPositiveDiaria ? (
                  <>
                    <TrendingUp size={12} className="mr-1" />
                    <span>+ {anuncio.variacao_diaria} anúncios</span>
                  </>
                ) : anuncio.variacao_diaria === 0 ? (
                  <span>0 anúncios</span>
                ) : (
                  <>
                    <TrendingDown size={12} className="mr-1" />
                    <span>- {Math.abs(anuncio.variacao_diaria)} anúncios</span>
                  </>
                )}
              </div>
              <div className="w-14 h-6 opacity-80">
                {isPositiveDiaria ? (
                  <svg viewBox="0 0 50 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`gradUp${anuncio.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="rgba(74, 222, 128, 0.2)" />
                        <stop offset="100%" stopColor="rgba(74, 222, 128, 0.8)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,24 L5,19 L10,20 L15,16 L20,17 L25,13 L30,11 L35,8 L40,5 L45,2 L50,0 L50,24 L0,24"
                      fill={`url(#gradUp${anuncio.id})`}
                    />
                    <path
                      d="M0,24 L5,19 L10,20 L15,16 L20,17 L25,13 L30,11 L35,8 L40,5 L45,2 L50,0"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : anuncio.variacao_diaria === 0 ? (
                  <svg viewBox="0 0 50 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`gradFlat${anuncio.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(148, 163, 184, 0.1)" />
                        <stop offset="100%" stopColor="rgba(148, 163, 184, 0.3)" />
                      </linearGradient>
                    </defs>
                    <path d="M0,12 L50,12 L50,14 L0,14 Z" fill={`url(#gradFlat${anuncio.id})`} />
                    <path d="M0,12 L50,12" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2,2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 50 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`gradDown${anuncio.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(248, 113, 113, 0.2)" />
                        <stop offset="100%" stopColor="rgba(248, 113, 113, 0.8)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,0 L5,2 L10,5 L15,4 L20,8 L25,12 L30,13 L35,17 L40,16 L45,20 L50,24 L50,24 L0,24"
                      fill={`url(#gradDown${anuncio.id})`}
                    />
                    <path
                      d="M0,0 L5,2 L10,5 L15,4 L20,8 L25,12 L30,13 L35,17 L40,16 L45,20 L50,24"
                      fill="none"
                      stroke="#F87171"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/50 p-2 rounded-lg relative group">
            <div className="text-zinc-400 mb-1 text-[10px] uppercase tracking-wider">Variação Semanal</div>
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center ${isPositiveSemanal ? "text-green-400" : anuncio.variacao_semanal === 0 ? "text-zinc-300" : "text-red-400"} font-medium text-xs`}
              >
                {isPositiveSemanal ? (
                  <>
                    <TrendingUp size={12} className="mr-1" />
                    <span>+ {anuncio.variacao_semanal} anúncios</span>
                  </>
                ) : anuncio.variacao_semanal === 0 ? (
                  <span>0 anúncios</span>
                ) : (
                  <>
                    <TrendingDown size={12} className="mr-1" />
                    <span>- {Math.abs(anuncio.variacao_semanal)} anúncios</span>
                  </>
                )}
              </div>
              <div className="w-14 h-6 opacity-80">
                {isPositiveSemanal ? (
                  <svg viewBox="0 0 50 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`gradUpSem${anuncio.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="rgba(74, 222, 128, 0.2)" />
                        <stop offset="100%" stopColor="rgba(74, 222, 128, 0.8)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,24 L5,19 L10,20 L15,16 L20,17 L25,13 L30,11 L35,8 L40,5 L45,2 L50,0 L50,24 L0,24"
                      fill={`url(#gradUpSem${anuncio.id})`}
                    />
                    <path
                      d="M0,24 L5,19 L10,20 L15,16 L20,17 L25,13 L30,11 L35,8 L40,5 L45,2 L50,0"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : anuncio.variacao_semanal === 0 ? (
                  <svg viewBox="0 0 50 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`gradFlatSem${anuncio.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(148, 163, 184, 0.1)" />
                        <stop offset="100%" stopColor="rgba(148, 163, 184, 0.3)" />
                      </linearGradient>
                    </defs>
                    <path d="M0,12 L50,12 L50,14 L0,14 Z" fill={`url(#gradFlatSem${anuncio.id})`} />
                    <path d="M0,12 L50,12" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2,2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 50 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`gradDownSem${anuncio.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(248, 113, 113, 0.2)" />
                        <stop offset="100%" stopColor="rgba(248, 113, 113, 0.8)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,0 L5,2 L10,5 L15,4 L20,8 L25,12 L30,13 L35,17 L40,16 L45,20 L50,24 L50,24 L0,24"
                      fill={`url(#gradDownSem${anuncio.id})`}
                    />
                    <path
                      d="M0,0 L5,2 L10,5 L15,4 L20,8 L25,12 L30,13 L35,17 L40,16 L45,20 L50,24"
                      fill="none"
                      stroke="#F87171"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
        {anuncio.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-700/30">
            <div className="flex flex-wrap gap-1.5">
              {anuncio.tags.map((tag, index) => (
                <span
                  key={`tag-${anuncio.id}-${index}`}
                  className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md text-xs hover:bg-zinc-700 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

