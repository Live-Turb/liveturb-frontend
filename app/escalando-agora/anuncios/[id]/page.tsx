"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ModernDashboard from "../../../../components/modern-dashboard"
import type { Anuncio } from "../../../../types"

// URL base da API Laravel
const API_BASE_URL = "/api/v1"

// Função para suprimir erros de hidratação causados por extensões do navegador
const suppressHydrationWarning = () => {
  // Só executa no cliente
  if (typeof window !== 'undefined') {
    // Salva o console.error original
    const originalError = console.error;

    // Substitui o console.error para filtrar avisos específicos de hidratação
    console.error = (...args) => {
      // Verifica se é um erro de hidratação relacionado a atributos bis_skin_checked
      const errorMessage = args.join(' ');
      if (errorMessage.includes('Hydration failed') ||
          errorMessage.includes('bis_skin_checked') ||
          errorMessage.includes('A tree hydrated but some attributes')) {
        return;
      }

      // Passa outros erros normalmente para o console.error original
      originalError(...args);
    };
  }
};

export default function AnuncioDetalhes() {
  const params = useParams()
  const [anuncioData, setAnuncioData] = useState<Anuncio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Suprimir avisos de hidratação causados por extensões
  useEffect(() => {
    suppressHydrationWarning();
  }, []);

  useEffect(() => {
    const fetchAnuncioData = async () => {
      setIsLoading(true)

      try {
        const anuncioId = params.id

        // Chamada real à API Laravel
        const response = await fetch(`${API_BASE_URL}/anuncios/${anuncioId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`)
        }

        const data = await response.json()

        if (!data || !data.data) {
          setError("Anúncio não encontrado")
        } else {
          setAnuncioData(data.data)
        }

        // Remover o setIsLoading(false) daqui para garantir que ele só seja chamado uma vez no final
      } catch (err) {
        setError("Erro ao carregar dados")
        console.error("Erro ao buscar dados do anúncio:", err)
      } finally {
        // Definir isLoading como false aqui, após a tentativa de fetch (sucesso ou erro)
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchAnuncioData()
    } else {
      // Se não houver ID, definir isLoading como false imediatamente
      setIsLoading(false)
      setError("ID do anúncio não fornecido.")
    }
  }, [params.id])

  return <ModernDashboard anuncioData={anuncioData} isLoading={isLoading} error={error} />
}
