export interface Anuncio {
  id: number
  titulo: string
  tag_principal: string
  data_anuncio: string
  nicho: string
  pais_codigo: string
  status: string
  novo_anuncio: boolean
  destaque: boolean
  tags: string[]
  imagem: string
  url_video: string
  link_transcricao: string | null
  produto_tipo: string
  produto_estrutura: string
  produto_idioma: string
  produto_rede_trafego: string
  produto_funil_vendas: string
  link_pagina_anuncio: string
  link_criativos_fb: string
  link_anuncios_escalados: string
  link_site_cloaker: string
  variacao_diaria: number
  variacao_semanal: number
  numero_anuncios: number
  categoria_id: number
  user_id: number
  created_at: string
  updated_at: string
  criativos: Criativo[]
  estatisticas: {
    '7days': EstatsticaItem[]
    '15days': EstatsticaItem[]
    '30days': EstatsticaItem[]
  }
  links: {
    pagina_anuncio: string
    criativos_fb: string
    anuncios_escalados: string
    site_cloaker: string
  }
  produto: {
    tipo: string
    estrutura: string
    idioma: string
    rede_trafego: string
    funil_vendas: string
  }
}

export interface Criativo {
  id: number
  titulo: string
  tag: string
  platform: string
  language: string
  idioma: string
  status: string
  views: number
  anuncio_id: number
  created_at: string
  updated_at: string
  url: string
  image: string
  title: string
  value: number
  caption?: string
  creativeId?: string
}

export interface EstatsticaItem {
  day: string
  date: string
  value: number
}

export interface CreativePerformance {
  name: string
  value: number
  status: string
  color: string
  creativeId?: number | null
}

export interface Categoria {
  id: string
  nome: string
  contador: number
  gradientClass: string
  shadowClass: string
}

export interface Nicho {
  id: string
  nome: string
}

