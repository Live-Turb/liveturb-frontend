"use client"

import type React from "react"
import { useRouter } from "next/navigation"

interface ErrorStateProps {
  error: string | null
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white font-sans items-center justify-center">
      <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-6 max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">Erro ao carregar anúncio</h2>
        <p className="text-gray-300 mb-4">{error || "Anúncio não encontrado"}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg"
        >
          Voltar para listagem
        </button>
      </div>
    </div>
  )
}

