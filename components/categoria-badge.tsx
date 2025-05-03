"use client"

import type React from "react"

interface CategoriaBadgeProps {
  categoria: {
    id: string
    nome: string
    contador: number
    gradientClass: string
    shadowClass: string
  }
  isActive: boolean
  onClick: () => void
}

export const CategoriaBadge: React.FC<CategoriaBadgeProps> = ({ categoria, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center ${isActive ? `bg-zinc-700/70` : `bg-zinc-800/50 hover:bg-zinc-700/50`} rounded-full px-4 py-1.5 transition-all duration-200 shadow-sm cursor-pointer`}
      onClick={onClick}
    >
      <span className="mr-2">{categoria.nome}</span>
      <span
        className={`${categoria.gradientClass} rounded-full px-2 py-0.5 text-xs font-medium shadow-inner ${categoria.shadowClass}`}
      >
        {categoria.contador}
      </span>
    </div>
  )
}

