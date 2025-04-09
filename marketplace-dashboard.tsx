"use client"

import type React from "react"
import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, Flame, Heart, LayoutGrid, ArrowLeft, Loader } from "lucide-react"
import { AnuncioCard } from "./components/anuncio-card"
import { CardSkeleton } from "./components/card-skeleton"
import { CategoriaBadge } from "./components/categoria-badge"
// import { anunciosMock } from "./data/mock-anuncios-shared" // Removido - Usando API
import type { Anuncio } from "./types" // Caminho deve estar correto agora

// Número de itens a serem carregados por vez
const ITEMS_PER_PAGE = 10

// URL base da API Laravel - Usando caminho relativo para compatibilidade com basePath
const API_BASE_URL = "/api/v1"

const MarketplaceDashboard: React.FC = () => {
  const router = useRouter()

  // Estados
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [anunciosVisiveis, setAnunciosVisiveis] = useState<Anuncio[]>([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [temMaisItens, setTemMaisItens] = useState(true)
  const [totalAnuncios, setTotalAnuncios] = useState(0)

  const observerTarget = useRef<HTMLDivElement>(null)

  const [categorias, setCategorias] = useState([
    {
      id: "escalando",
      nome: "Escalando",
      contador: 0,
      gradientClass: "bg-gradient-to-r from-amber-500 to-orange-500",
      shadowClass: "shadow-amber-500/30",
    },
    {
      id: "low-ticket",
      nome: "Low ticket",
      contador: 0,
      gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
      shadowClass: "shadow-emerald-500/30",
    },
    {
      id: "destaque",
      nome: "Em destaque",
      contador: 0,
      gradientClass: "bg-gradient-to-r from-violet-500 to-purple-500",
      shadowClass: "shadow-violet-500/30",
    },
  ])
  const [nichos, setNichos] = useState([
    { id: "relacionamento", nome: "Relacionamento" },
    { id: "saude", nome: "Saúde e Bem-estar" },
    { id: "financas", nome: "Finanças" },
    { id: "tecnologia", nome: "Tecnologia" },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroNicho, setFiltroNicho] = useState("")
  const [filtroBusca, setFiltroBusca] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("")
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false)

  // Função para buscar dados da API Laravel
  const fetchDataFromAPI = async (page = 1, filters: any = {}) => {
    try {
      setIsLoading(true)

      // Chamada real à API Laravel
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: ITEMS_PER_PAGE.toString(),
        ...(filters.busca ? { busca: filters.busca } : {}),
        ...(filters.nicho ? { nicho: filters.nicho } : {}),
        ...(filters.categoria ? { categoria: filters.categoria } : {})
      }).toString()
      
      const apiUrl = `${API_BASE_URL}/anuncios?${queryParams}`;
      console.log('Requisitando API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        console.error('Erro na resposta da API:', response.status, response.statusText);
        throw new Error(`Erro na API: ${response.status}`)
      }
      
      // Verificar a resposta JSON bruta
      const responseText = await response.text();
      console.log('Resposta JSON bruta da API:', responseText.substring(0, 1000) + '...');
      
      // Verificar se há o campo número_anuncios na resposta
      if (responseText.includes('numero_anuncios')) {
        console.log('Campo numero_anuncios encontrado na resposta bruta');
        // Tentar extrair alguns valores para visualização
        const matches = responseText.match(/"numero_anuncios":(\d+|null)/g);
        if (matches) {
          console.log('Valores de numero_anuncios encontrados:', matches);
        }
      } else {
        console.warn('Campo numero_anuncios NÃO encontrado na resposta bruta!');
      }
      
      const data = JSON.parse(responseText);
      console.log('Dados recebidos da API:', data);
      
      // Log detalhado dos anúncios
      if (data.data && Array.isArray(data.data)) {
        console.log('Formato dos dados recebidos:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
        
        data.data.forEach((anuncio: any, index: number) => {
          console.log(`Anúncio ${index + 1} (ID: ${anuncio.id}):`, {
            id: anuncio.id,
            titulo: anuncio.titulo,
            numero_anuncios: anuncio.numero_anuncios,
            tipo_numero_anuncios: typeof anuncio.numero_anuncios,
            raw: JSON.stringify(anuncio).substring(0, 200) + '...'
          });
        });
      }
      
      // Filtrar por favoritos localmente se necessário
      let anuncios = data.data;
      if (filters.favoritos && filters.favoritos.length > 0) {
        anuncios = anuncios.filter((a: Anuncio) => filters.favoritos.includes(a.id))
      }
      
      return {
        anuncios: anuncios,
        meta: data.meta || {
          total: data.total,
          current_page: page,
          last_page: Math.ceil(data.total / ITEMS_PER_PAGE),
          per_page: ITEMS_PER_PAGE
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar categorias da API
  const fetchCategoriasFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }
      
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      // Fallback para categorias estáticas em caso de erro
      return [
        {
          id: "escalando",
          nome: "Escalando",
          contador: 0,
          gradientClass: "bg-gradient-to-r from-amber-500 to-orange-500",
          shadowClass: "shadow-amber-500/30",
        },
        {
          id: "low-ticket",
          nome: "Low ticket",
          contador: 0,
          gradientClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
          shadowClass: "shadow-emerald-500/30",
        },
        {
          id: "destaque",
          nome: "Em destaque",
          contador: 0,
          gradientClass: "bg-gradient-to-r from-violet-500 to-purple-500",
          shadowClass: "shadow-violet-500/30",
        },
      ]
    }
  }

  // Função para buscar nichos da API
  const fetchNichosFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/nichos`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }
      
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error("Erro ao buscar nichos:", error)
      // Fallback para nichos estáticos em caso de erro
      return [
        { id: "relacionamento", nome: "Relacionamento" },
        { id: "saude", nome: "Saúde e Bem-estar" },
        { id: "financas", nome: "Finanças" },
        { id: "tecnologia", nome: "Tecnologia" },
      ]
    }
  }

  // Simular carregamento de dados
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        console.log('Iniciando carregamento de dados...');
        // Buscar categorias e nichos
        const [categoriasData, nichosData] = await Promise.all([
          fetchCategoriasFromAPI().catch(error => {
            console.error('Erro ao buscar categorias:', error);
            return null;
          }),
          fetchNichosFromAPI().catch(error => {
            console.error('Erro ao buscar nichos:', error);
            return null;
          })
        ]);

        if (categoriasData) setCategorias(categoriasData);
        if (nichosData) setNichos(nichosData);

        // Buscar anúncios iniciais
        const filters = getFilters()
        console.log('Filtros aplicados:', filters);
        const result = await fetchDataFromAPI(1, filters)
        console.log('Resultado da API:', result);

        if (result.anuncios && result.anuncios.length > 0) {
          console.log(`${result.anuncios.length} anúncios carregados com sucesso`);
          setAnuncios(result.anuncios)
          setAnunciosVisiveis(result.anuncios)
          setTotalAnuncios(result.meta.total)
          setTemMaisItens(result.meta.current_page < result.meta.last_page)
          setPaginaAtual(2)
        } else {
          console.warn('Nenhum anúncio retornado pela API.');
          setError("Nenhum anúncio encontrado. Verifique se existem anúncios cadastrados.")
        }

        // Carregar favoritos do localStorage
        const favoritosArmazenados = localStorage.getItem("favoritos")
        if (favoritosArmazenados) {
          setFavoritos(JSON.parse(favoritosArmazenados))
        }

        setError(null)
      } catch (err) {
        console.error('Erro completo:', err);
        setError("Erro ao carregar os dados. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    
    // Aumentar o intervalo para 30 segundos e adicionar tratamento de erro
    const interval = setInterval(() => {
      console.log('Recarregando dados automaticamente...');
      fetchData().catch(error => {
        console.error('Erro no recarregamento automático:', error);
        // Não atualizar o estado de erro para não interromper a experiência do usuário
      });
    }, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, [])

  // Obter filtros atuais para enviar à API
  const getFilters = () => {
    const filters: any = {}

    if (filtroBusca) filters.busca = filtroBusca
    if (filtroNicho) filters.nicho = filtroNicho
    if (filtroCategoria) filters.categoria = filtroCategoria
    if (mostrarFavoritos) filters.favoritos = favoritos

    return filters
  }

  // Filtrar anúncios - COMENTÁRIO: Esta função será substituída pela filtragem no servidor
  // quando a API real for implementada. Mantida para compatibilidade com o código existente.
  const anunciosFiltrados = useMemo(() => {
    let resultado = anuncios

    // Aplicar filtro de favoritos primeiro, se estiver ativo
    if (mostrarFavoritos) {
      resultado = resultado.filter((anuncio) => favoritos.includes(anuncio.id))
    }

    // Depois aplicar os outros filtros
    return resultado.filter((anuncio) => {
      // Filtro por busca textual
      const matchBusca = filtroBusca === "" || anuncio.titulo.toLowerCase().includes(filtroBusca.toLowerCase())

      // Filtro por nicho
      const matchNicho =
        filtroNicho === "" || anuncio.tags.some((tag: string) => tag.toLowerCase() === filtroNicho.toLowerCase())

      // Filtro por categoria
      const matchCategoria =
        filtroCategoria === "" ||
        (filtroCategoria === "escalando" && anuncio.tag_principal === "ESCALANDO") ||
        (filtroCategoria === "low-ticket" && anuncio.tags.includes("Low Ticket")) ||
        (filtroCategoria === "destaque" && anuncio.novo_anuncio)

      return matchBusca && matchNicho && matchCategoria
    })
  }, [anuncios, filtroBusca, filtroNicho, filtroCategoria, mostrarFavoritos, favoritos])

  // Função para carregar mais itens da API
  const carregarMaisItens = useCallback(async () => {
    if (carregandoMais || !temMaisItens || isLoading) return

    setCarregandoMais(true)

    try {
      // COMENTÁRIO: Aqui você fará a chamada real à API para carregar a próxima página
      const filters = getFilters()
      const result = await fetchDataFromAPI(paginaAtual, filters)

      if (result.anuncios.length > 0) {
        setAnunciosVisiveis((prev) => [...prev, ...result.anuncios])
        setPaginaAtual((prev) => prev + 1)
        setTemMaisItens(result.meta.current_page < result.meta.last_page)
      } else {
        setTemMaisItens(false)
      }
    } catch (error) {
      console.error("Erro ao carregar mais itens:", error)
      setError("Erro ao carregar mais anúncios. Tente novamente.")
    } finally {
      setCarregandoMais(false)
    }
  }, [carregandoMais, isLoading, paginaAtual, temMaisItens])

  // Configurar o IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !carregandoMais) {
          carregarMaisItens()
        }
      },
      { threshold: 0.1 },
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [carregarMaisItens, isLoading, carregandoMais])

  // Resetar a paginação quando os filtros mudam
  useEffect(() => {
    const recarregarComFiltros = async () => {
      try {
        setPaginaAtual(1)
        setAnunciosVisiveis([])
        setTemMaisItens(true)
        setIsLoading(true)

        // COMENTÁRIO: Aqui você faria a chamada real à API com os novos filtros
        const filters = getFilters()
        const result = await fetchDataFromAPI(1, filters)

        setAnunciosVisiveis(result.anuncios)
        setTotalAnuncios(result.meta.total)
        setTemMaisItens(result.meta.current_page < result.meta.last_page)
        setPaginaAtual(2) // Próxima página a ser carregada
      } catch (error) {
        console.error("Erro ao recarregar com filtros:", error)
        setError("Erro ao aplicar filtros. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    // Não executar na primeira renderização
    if (anuncios.length > 0) {
      recarregarComFiltros()
    }
  }, [filtroBusca, filtroNicho, filtroCategoria, mostrarFavoritos])

  // Contagem de anúncios escalando
  const anunciosEscalando = useMemo(() => {
    // COMENTÁRIO: Idealmente, este valor viria diretamente da API
    return anuncios.filter((anuncio) => anuncio.tag_principal === "ESCALANDO").length
  }, [anuncios])

  // Navegação para página de detalhes
  const navegarParaDetalhes = (anuncioId: number) => {
    router.push(`/escalando-agora/anuncios/${anuncioId.toString()}`)
  }

  // Manipuladores de eventos
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroBusca(e.target.value)
  }

  const handleNichoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroNicho(e.target.value)
  }

  const handleCategoriaClick = (categoriaId: string) => {
    setFiltroCategoria(filtroCategoria === categoriaId ? "" : categoriaId)
  }

  const toggleFavorito = (anuncioId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setFavoritos((prevFavoritos) => {
      const novosFavoritos = prevFavoritos.includes(anuncioId)
        ? prevFavoritos.filter((id) => id !== anuncioId)
        : [...prevFavoritos, anuncioId]

      // Salvar no localStorage para manter sincronizado com a página de detalhes
      localStorage.setItem("favoritos", JSON.stringify(novosFavoritos))

      // COMENTÁRIO: Aqui você poderia fazer uma chamada à API para salvar os favoritos no servidor
      // exemplo: fetch(`${API_BASE_URL}/favoritos`, { method: 'POST', body: JSON.stringify({ anuncioId }) })

      return novosFavoritos
    })
  }

  const toggleMostrarFavoritos = () => {
    setMostrarFavoritos(!mostrarFavoritos)
  }

  const mostrarTodosAnuncios = () => {
    // Limpar todos os filtros
    setMostrarFavoritos(false)
    setFiltroCategoria("")
    setFiltroNicho("")
    setFiltroBusca("")
  }

  // Função para pesquisar (poderia ser acionada por um botão de pesquisa)
  const handlePesquisar = async () => {
    try {
      setIsLoading(true)

      // COMENTÁRIO: Aqui você faria a chamada real à API com os filtros de pesquisa
      const filters = getFilters()
      const result = await fetchDataFromAPI(1, filters)

      setAnunciosVisiveis(result.anuncios)
      setTotalAnuncios(result.meta.total)
      setTemMaisItens(result.meta.current_page < result.meta.last_page)
      setPaginaAtual(2) // Próxima página a ser carregada
    } catch (error) {
      console.error("Erro ao pesquisar:", error)
      setError("Erro ao realizar pesquisa. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white">
      {/* Search Bar */}
      <div className="flex items-center justify-center p-6 relative">
        <a
          href="https://liveturb.com/my-broadcasts"
          // Atributos target e rel removidos para abrir na mesma guia
          className="absolute left-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2 px-2 hover:px-4 rounded-md shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center group overflow-hidden z-50"
        >
          <ArrowLeft size={16} className="mr-0 group-hover:mr-1" />
          <span className="w-0 overflow-hidden group-hover:w-auto whitespace-nowrap transition-all duration-200">
            Voltar P/ LiveTurb
          </span>
        </a>

        <div className="flex items-center w-full max-w-2xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Procure pelas melhores ofertas"
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-l-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              value={filtroBusca}
              onChange={handleBuscaChange}
            />
          </div>
          <div className="relative">
            <select
              className="bg-zinc-800/50 border border-zinc-700/50 border-l-0 py-3 px-4 pr-8 rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent appearance-none transition-all duration-200"
              value={filtroNicho}
              onChange={handleNichoChange}
            >
              <option value="">Selecione o nicho</option>
              {nichos.map((nicho) => (
                <option key={nicho.id} value={nicho.id}>
                  {nicho.nome}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown size={18} className="text-zinc-400" />
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 px-5 rounded-r-md shadow-md shadow-blue-500/20 transition-all duration-200"
            onClick={handlePesquisar}
          >
            Pesquisar
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-4">
        {categorias.map((categoria) => (
          <CategoriaBadge
            key={categoria.id}
            categoria={categoria}
            isActive={filtroCategoria === categoria.id}
            onClick={() => handleCategoriaClick(categoria.id)}
          />
        ))}
        <div className="flex items-center space-x-2 ml-4">
          <button
            className={`flex items-center space-x-1 px-4 py-1.5 ${mostrarFavoritos ? "bg-red-600 hover:bg-red-700" : "bg-zinc-800/50 hover:bg-zinc-700/50"} rounded-full transition-all duration-200 shadow-sm`}
            onClick={toggleMostrarFavoritos}
          >
            <Heart size={16} className={mostrarFavoritos ? "text-white" : ""} />
            <span>Favoritos{favoritos.length > 0 ? ` (${favoritos.length})` : ""}</span>
          </button>

          <button
            className="flex items-center space-x-1 px-4 py-1.5 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-full transition-all duration-200 shadow-sm"
            onClick={mostrarTodosAnuncios}
          >
            <LayoutGrid size={16} />
            <span>Todos os Anúncios</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-2">
        {/* Trending Section */}
        <div className="flex flex-col items-center mb-8 mx-auto px-4 md:px-12">
          <div className="flex items-center justify-between mb-6 w-full">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg shadow-lg shadow-orange-500/20 mr-3">
                <Flame className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                  Escalando agora
                </h2>
                <p className="text-xs text-zinc-400">Produtos com maior crescimento nas últimas 24h</p>
              </div>
              <span className="ml-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-2.5 py-1 text-xs font-medium shadow-lg shadow-orange-500/20">
                {anunciosEscalando}
              </span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 w-full">
            {isLoading && anunciosVisiveis.length === 0 ? (
              // Mostrar 5 cards skeleton
              Array(5)
                .fill(0)
                .map((_, index) => <CardSkeleton key={`skeleton-${index}`} />)
            ) : error ? (
              <div className="col-span-full text-center py-10">
                <div className="inline-block bg-red-500/10 text-red-400 px-4 py-3 rounded-lg">
                  <p>Erro ao carregar anúncios: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            ) : anunciosVisiveis.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-zinc-400">Nenhum anúncio encontrado com os filtros selecionados.</p>
              </div>
            ) : (
              // Renderização dos cards com rolagem infinita
              anunciosVisiveis.map((anuncio) => (
                <AnuncioCard
                  key={anuncio.id}
                  anuncio={anuncio}
                  onClick={() => navegarParaDetalhes(anuncio.id)}
                  isFavorito={favoritos.includes(anuncio.id)}
                  onFavoritoClick={(e) => toggleFavorito(anuncio.id, e)}
                  onMouseEnter={() => router.prefetch(`/escalando-agora/anuncios/${anuncio.id.toString()}`)} // Adicionar prefetch no hover
                />
              ))
            )}
          </div>

          {/* Loader para rolagem infinita */}
          {!error && anunciosVisiveis.length > 0 && (
            <div ref={observerTarget} className="w-full py-8 flex justify-center items-center">
              {carregandoMais ? (
                <div className="flex flex-col items-center">
                  <Loader size={24} className="animate-spin text-blue-500 mb-2" />
                  <p className="text-sm text-zinc-400">Carregando mais anúncios...</p>
                </div>
              ) : temMaisItens ? (
                <p className="text-sm text-zinc-500">Role para ver mais anúncios</p>
              ) : (
                <p className="text-sm text-zinc-500">
                  {totalAnuncios > 0
                    ? `Mostrando todos os ${totalAnuncios} anúncios`
                    : "Não há mais anúncios para mostrar"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketplaceDashboard
