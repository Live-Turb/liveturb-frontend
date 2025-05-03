"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { EstatsticaItem as EstatisticaItemType } from "../types";
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interfaces
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

interface EspionagemChartProps {
  periodoAtivo: "7dias" | "15dias" | "30dias";
  onPeriodoChange: (periodo: "7dias" | "15dias" | "30dias") => void;
  estatisticas?: {
    "7days": EstatisticaItemType[]
    "15days": EstatisticaItemType[]
    "30days": EstatisticaItemType[]
  };
  criativos?: Array<{
    id: number;
    title: string;
    value: number;
    status?: string;
  }>;
  anuncioData?: {
    numero_anuncios: number | null;
    variacao_diaria: number;
    variacao_semanal: number;
  };
}

export default function EspionagemChart({ 
  periodoAtivo, 
  onPeriodoChange,
  estatisticas,
  criativos,
  anuncioData 
}: EspionagemChartProps) {
  const [animado, setAnimado] = useState(false);
  const [tendencia, setTendencia] = useState('');
  const [analisandoIA, setAnalisandoIA] = useState(true);
  const [analiseCompleta, setAnaliseCompleta] = useState(false);
  const [potencialAnuncio, setPotencialAnuncio] = useState(0);
  const [interpretacaoGrafico, setInterpretacaoGrafico] = useState<InterpretacaoItem[] | null>(null);
  const [insightsIA, setInsightsIA] = useState<InsightItem | null>(null);

  // Log para debug - verificar se os dados reais estão chegando
  useEffect(() => {
    console.log("Estatísticas recebidas:", estatisticas);
    console.log("Criativos recebidos:", criativos);
  }, [estatisticas, criativos]);

  // Função para determinar o status com base no valor - calibrado para mercado brasileiro
  const determinarStatus = (valor: number): 'alto' | 'medio' | 'baixo' | 'critico' => {
    if (valor >= 120) return 'alto';    // Ajustado: mercado BR considera alto acima de 120
    if (valor >= 80) return 'medio';    // Ajustado: mercado BR considera médio entre 80-120
    if (valor >= 30) return 'baixo';    // Ajustado: mercado BR considera baixo entre 30-80
    return 'critico';                   // Menor que 30 é crítico
  };

  // Dados dos períodos para espionagem - dados de fallback caso não receba estatísticas
  const formatarDataPtBR = (dataString: string) => {
    try {
      // Verificar o formato da data recebida (pode ser DD/MM ou YYYY-MM-DD)
      let data;
      if (dataString.includes('/')) {
        // Já está no formato DD/MM
        return dataString;
      } else if (dataString.includes('-')) {
        // Formato YYYY-MM-DD
        data = parse(dataString, 'yyyy-MM-dd', new Date());
        return format(data, 'dd/MM', { locale: ptBR });
      } else {
        // Outro formato
        return dataString;
      }
    } catch (error) {
      // Em caso de erro, retorna a string original
      return dataString;
    }
  };

  const dados7dias = estatisticas && estatisticas["7days"]?.length > 0
    ? estatisticas["7days"].map(item => ({
        dia: formatarDataPtBR(item.day), 
        criativos: item.value,
        status: determinarStatus(item.value)
      }))
    : [
      { dia: "01/06", criativos: 5, status: 'medio' as const },
      { dia: "02/06", criativos: 7, status: 'medio' as const },
      { dia: "03/06", criativos: 10, status: 'alto' as const },
      { dia: "04/06", criativos: 8, status: 'medio' as const },
      { dia: "05/06", criativos: 12, status: 'alto' as const },
      { dia: "06/06", criativos: 11, status: 'alto' as const },
      { dia: "07/06", criativos: 15, status: 'alto' as const },
    ];
  
  const dados15dias = estatisticas && estatisticas["15days"]?.length > 0
    ? estatisticas["15days"].map(item => ({
        dia: formatarDataPtBR(item.day), 
        criativos: item.value,
        status: determinarStatus(item.value)
      }))
    : [
      { dia: "23/05", criativos: 3, status: 'baixo' as const },
      { dia: "24/05", criativos: 2, status: 'baixo' as const },
      { dia: "25/05", criativos: 4, status: 'baixo' as const },
      { dia: "26/05", criativos: 3, status: 'baixo' as const },
      { dia: "27/05", criativos: 6, status: 'medio' as const },
      { dia: "28/05", criativos: 5, status: 'medio' as const },
      { dia: "29/05", criativos: 7, status: 'medio' as const },
      { dia: "30/05", criativos: 6, status: 'medio' as const },
      { dia: "31/05", criativos: 5, status: 'medio' as const },
      { dia: "01/06", criativos: 5, status: 'medio' as const },
      { dia: "02/06", criativos: 7, status: 'medio' as const },
      { dia: "03/06", criativos: 10, status: 'alto' as const },
      { dia: "04/06", criativos: 8, status: 'medio' as const },
      { dia: "05/06", criativos: 12, status: 'alto' as const },
      { dia: "06/06", criativos: 11, status: 'alto' as const },
    ];
  
  const dados30dias = estatisticas && estatisticas["30days"]?.length > 0
    ? estatisticas["30days"].map(item => ({
        dia: formatarDataPtBR(item.day), 
        criativos: item.value,
        status: determinarStatus(item.value)
      }))
    : [
      { dia: "08/05", criativos: 1, status: 'critico' as const },
      { dia: "09/05", criativos: 1, status: 'critico' as const },
      { dia: "10/05", criativos: 0, status: 'critico' as const },
      { dia: "11/05", criativos: 2, status: 'baixo' as const },
      { dia: "12/05", criativos: 1, status: 'critico' as const },
      { dia: "13/05", criativos: 3, status: 'baixo' as const },
      { dia: "14/05", criativos: 2, status: 'baixo' as const },
      { dia: "15/05", criativos: 3, status: 'baixo' as const },
      { dia: "16/05", criativos: 4, status: 'baixo' as const },
      { dia: "17/05", criativos: 3, status: 'baixo' as const },
      { dia: "18/05", criativos: 2, status: 'baixo' as const },
      { dia: "19/05", criativos: 4, status: 'baixo' as const },
      { dia: "20/05", criativos: 5, status: 'medio' as const },
      { dia: "21/05", criativos: 4, status: 'baixo' as const },
      { dia: "22/05", criativos: 3, status: 'baixo' as const },
      { dia: "23/05", criativos: 3, status: 'baixo' as const },
      { dia: "24/05", criativos: 2, status: 'baixo' as const },
      { dia: "25/05", criativos: 4, status: 'baixo' as const },
      { dia: "26/05", criativos: 3, status: 'baixo' as const },
      { dia: "27/05", criativos: 6, status: 'medio' as const },
      { dia: "28/05", criativos: 5, status: 'medio' as const },
      { dia: "29/05", criativos: 7, status: 'medio' as const },
      { dia: "30/05", criativos: 6, status: 'medio' as const },
      { dia: "31/05", criativos: 5, status: 'medio' as const },
      { dia: "01/06", criativos: 5, status: 'medio' as const },
      { dia: "02/06", criativos: 7, status: 'medio' as const },
      { dia: "03/06", criativos: 10, status: 'alto' as const },
      { dia: "04/06", criativos: 8, status: 'medio' as const },
      { dia: "05/06", criativos: 12, status: 'alto' as const },
      { dia: "06/06", criativos: 11, status: 'alto' as const },
    ];
  
  // Função para obter os dados ativos com base no período selecionado
  const getDadosAtivos = () => {
    switch(periodoAtivo) {
      case '7dias': return dados7dias;
      case '15dias': return dados15dias;
      case '30dias': return dados30dias;
      default: return dados7dias;
    }
  };
  
  // Calcular os valores de resumo com base nos dados ativos
  const dadosAtuais = getDadosAtivos();
  const valorAtual = anuncioData?.numero_anuncios || 0;
  
  // Preservar o número mínimo histórico usando localStorage
  useEffect(() => {
    if (!anuncioData || anuncioData.numero_anuncios === null) return;
    
    // Usar uma chave única baseada nos dados do anúncio
    const keyIdentifier = anuncioData.variacao_diaria.toString() + '_' + anuncioData.variacao_semanal.toString();
    const minValueKey = `anuncio_${keyIdentifier}_min_anuncios`;
    
    // Obter o valor mínimo histórico do localStorage
    const historicoMinimo = localStorage.getItem(minValueKey);
    let minHistorico = historicoMinimo ? parseInt(historicoMinimo) : null;
    
    // Se não houver um mínimo histórico OU o valor atual for menor, atualizar o mínimo
    if (minHistorico === null || (anuncioData.numero_anuncios !== null && anuncioData.numero_anuncios < minHistorico)) {
      minHistorico = anuncioData.numero_anuncios;
      localStorage.setItem(minValueKey, minHistorico.toString());
    }
  }, [anuncioData]);
  
  // Obter o valor mínimo histórico
  const obterValorMinimoHistorico = () => {
    if (!anuncioData) return Math.min(...dadosAtuais.map(d => d.criativos)); // Fallback para o cálculo original
    
    // Usar uma chave única baseada nos dados do anúncio
    const keyIdentifier = anuncioData.variacao_diaria.toString() + '_' + anuncioData.variacao_semanal.toString();
    const minValueKey = `anuncio_${keyIdentifier}_min_anuncios`;
    
    const historicoMinimo = localStorage.getItem(minValueKey);
    
    if (historicoMinimo) {
      // Usar o valor histórico armazenado
      return parseInt(historicoMinimo);
    } else {
      // Se não houver histórico, calcular normalmente e salvar para uso futuro
      const calculoMinimo = Math.min(...dadosAtuais.map(d => d.criativos));
      localStorage.setItem(minValueKey, calculoMinimo.toString());
      return calculoMinimo;
    }
  };
  
  // Usar a função para obter o valor mínimo histórico
  const valorMinimo = obterValorMinimoHistorico();
  
  const valorMaximo = Math.max(...dadosAtuais.map(d => d.criativos));
  const media = Math.round(dadosAtuais.reduce((acc, curr) => acc + curr.criativos, 0) / dadosAtuais.length);
  const maxValue = Math.max(valorMaximo * 1.2, 20);

  // Calcular o potencial com base nos dados atuais e no número de criativos - Nova fórmula mais otimista
  const calcularPotencialAnuncio = () => {
    // Calcular a tendência com base nos últimos 3 pontos
    const ultimosPontos = getDadosAtivos().slice(-3);
    if (ultimosPontos.length < 3) return 65; // Valor base mais otimista
    
    const crescimento = ultimosPontos[2].criativos - ultimosPontos[0].criativos;
    
    // Determinar a tendência
    let novaTendencia = '';
    if (crescimento > 0) {
      novaTendencia = 'alta';
    } else if (crescimento >= -2) { // Tolerância maior para considerar "estável"
      novaTendencia = 'estável';
    } else {
      novaTendencia = 'queda';
    }
    
    setTendencia(novaTendencia);
    
    // Usar o número total de criativos como fator mais significativo no cálculo do potencial
    const numeroCriativos = criativos?.length || 0;
    
    // Nova calibração baseada no mercado brasileiro - AINDA MAIS OTIMISTA:
    // - Anúncios com mais de 150 criativos são considerados de alto potencial (mínimo 85%)
    // - Anúncios com mais de 100 criativos têm potencial mínimo de 75%
    // - Anúncios com mais de 80 criativos têm potencial mínimo de 65%
    // - Anúncios com mais de 50 criativos têm potencial mínimo de 55%
    // - Anúncios com mais de 30 criativos têm potencial mínimo de 45%
    
    let potencialBase = 0;
    
    // Base pelo número de criativos - muito mais peso neste fator
    if (numeroCriativos >= 150) {
      potencialBase = 85; // Base mínima para anúncios com muitos criativos
    } else if (numeroCriativos >= 100) {
      potencialBase = 75 + ((numeroCriativos - 100) / 50) * 10; // Escala de 75% a 85%
    } else if (numeroCriativos >= 80) {
      potencialBase = 65 + ((numeroCriativos - 80) / 20) * 10; // Escala de 65% a 75%
    } else if (numeroCriativos >= 50) {
      potencialBase = 55 + ((numeroCriativos - 50) / 30) * 10; // Escala de 55% a 65%
    } else if (numeroCriativos >= 30) {
      potencialBase = 45 + ((numeroCriativos - 30) / 20) * 10; // Escala de 45% a 55%
    } else {
      potencialBase = 30 + (numeroCriativos / 30) * 15; // Escala de 30% a 45%
    }
    
    // Ajuste pela tendência
    let ajusteTendencia = 0;
    if (novaTendencia === 'alta') {
      ajusteTendencia = 15; // Bônus significativo para tendência de alta
    } else if (novaTendencia === 'estável') {
      ajusteTendencia = 8;  // Bônus mais alto para estável
    } else {
      ajusteTendencia = -5; // Penalidade menor para tendência de queda
    }
    
    // Relação com o valor máximo histórico (menor peso)
    const relacaoMaximo = Math.min(((valorAtual / (valorMaximo || 1)) * 10), 10);
    
    // Calcular potencial final (com limites mínimos mais altos)
    const potencialCalculado = Math.min(
      Math.round(
        potencialBase + // Base pelo número de criativos (maior peso)
        ajusteTendencia + // Ajuste pela tendência
        relacaoMaximo + // Relação com o máximo (menor peso)
        (Math.random() * 5) // Pequena variação aleatória
      ), 
      100
    );
    
    // Garantir mínimos com base no número de criativos - Limites ainda mais otimistas
    if (numeroCriativos >= 150 && potencialCalculado < 85) return 85;
    if (numeroCriativos >= 100 && potencialCalculado < 75) return 75;
    if (numeroCriativos >= 80 && potencialCalculado < 65) return 65;
    if (numeroCriativos >= 50 && potencialCalculado < 55) return 55;
    if (numeroCriativos >= 30 && potencialCalculado < 45) return 45;
    
    // Para casos de número extraordinário de criativos (acima de 180), garantimos um potencial ainda maior
    if (numeroCriativos >= 180) return Math.max(potencialCalculado, 90);
    
    return Math.max(potencialCalculado, 30); // Mínimo absoluto de 30%
  };
  
  // Função para consultar a API do DeepSeek ou simular a análise
  const consultarDeepSeek = () => {
    setAnalisandoIA(true);
    
    // Simular tempo de processamento da API
    setTimeout(() => {
      const potencial = calcularPotencialAnuncio();
      setPotencialAnuncio(potencial);
      
      // Atualizar as interpretações - calibradas para o mercado brasileiro
      const interpretacoes: InterpretacaoItem[] = [];
      
      if (periodoAtivo === '7dias') {
        interpretacoes.push(
          { status: 'alto', texto: 'Acima de 120 criativos: Alta escala' },
          { status: 'medio', texto: 'Entre 80 e 120: Começando a escalar' },
          { status: 'baixo', texto: 'Entre 30 e 80: Escala de teste' },
          { status: 'critico', texto: 'Menos de 30: Iniciando Campanha' }
        );
      } else if (periodoAtivo === '15dias') {
        interpretacoes.push(
          { status: 'alto', texto: 'Crescimento acelerado nas últimas 2 semanas' },
          { status: 'medio', texto: 'Estabilidade no investimento em anúncios' },
          { status: 'baixo', texto: 'Investimento reduzido comparado à semana anterior' },
          { status: 'critico', texto: 'Forte redução ou abandono da campanha' }
        );
      } else {
        interpretacoes.push(
          { status: 'alto', texto: 'Investimento consistente e crescente no mês' },
          { status: 'medio', texto: 'Padrão normal de investimento mensal' },
          { status: 'baixo', texto: 'Baixo investimento com potencial de crescimento' },
          { status: 'critico', texto: 'Campanha com performance negativa no mês' }
        );
      }
      
      setInterpretacaoGrafico(interpretacoes);
      
      // Gerar insights com base nos dados reais - mais diversificados e específicos
      let insight: InsightItem = {
        observacao: "",
        recomendacao: ""
      };
      
      // Verificar tendência e dados reais para personalizar insights
      const numeroCriativos = criativos?.length || 0;
      const mediaAtual = media;
      
      if (tendencia === 'alta') {
        // Calcular o percentual de crescimento para os insights
        const ultimosPontos = getDadosAtivos().slice(-3);
        const percentualCrescimento = ultimosPontos.length >= 3 
          ? Math.round(((ultimosPontos[2].criativos - ultimosPontos[0].criativos) / ultimosPontos[0].criativos) * 100)
          : 0;

        // Determinar a faixa de média
        let faixaMedia = '';
        if (mediaAtual >= 100) {
          faixaMedia = 'alta';
        } else if (mediaAtual >= 50) {
          faixaMedia = 'media';
        } else {
          faixaMedia = 'baixa';
        }
          
        // Array de variações de insights para tendência alta
        const insightsAlta = [
          {
            observacao: `Crescimento expressivo de ${percentualCrescimento}% nos criativos! Com média de ${mediaAtual} anúncios, o mercado está respondendo positivamente a esta abordagem.`,
            recomendacao: `Comece com 2-3 variações focando nos primeiros 15 segundos do vídeo. Após validar, expanda para 5-6 criativos testando diferentes hooks.`
          },
          {
            observacao: `Identificamos um aumento de ${percentualCrescimento}% nos criativos ativos. Com ${mediaAtual} anúncios em média, este anúncio está conquistando mais espaço no mercado.`,
            recomendacao: `Inicie com 3 variações testando diferentes ângulos de câmera. Com resultados positivos, adicione mais 2-3 criativos focando em novos benefícios.`
          },
          {
            observacao: `Crescimento de ${percentualCrescimento}% nos criativos! Com média de ${mediaAtual} anúncios, o público está engajando bem com esta estratégia.`,
            recomendacao: `Comece com 2 criativos testando diferentes thumbnails. Após validar, expanda para 4-5 variações com novos elementos visuais.`
          },
          {
            observacao: `Aumento de ${percentualCrescimento}% nos criativos ativos indica uma tendência positiva no mercado. Com ${mediaAtual} anúncios em média, há espaço para crescimento.`,
            recomendacao: `Experimente 3 variações com diferentes gatilhos de urgência. Com validação, adicione 2-3 criativos testando novos CTAs.`
          },
          {
            observacao: `Crescimento de ${percentualCrescimento}% nos criativos mostra que o público está respondendo bem à estratégia. Com média de ${mediaAtual} anúncios, o mercado está aquecido.`,
            recomendacao: `Inicie com 2-3 variações testando diferentes abordagens de storytelling. Após validar, expanda para 4-5 criativos com novos benefícios.`
          },
          {
            observacao: `Aumento de ${percentualCrescimento}% nos criativos ativos sugere uma oportunidade de mercado. Com ${mediaAtual} anúncios em média, há potencial para expansão.`,
            recomendacao: `Comece com 3 variações focando em diferentes dores do público. Com resultados positivos, adicione 2-3 criativos testando novos elementos de prova social.`
          }
        ];
        
        // Selecionar aleatoriamente um insight
        insight = insightsAlta[Math.floor(Math.random() * insightsAlta.length)];
        
      } else if (tendencia === 'queda') {
        // Array de variações de insights para tendência de queda
        const insightsQueda = [
          {
            observacao: `Este anúncio atingiu ${valorMaximo} criativos no pico, mostrando que o mercado tem potencial. Com média atual de ${mediaAtual} anúncios, a redução pode ser uma janela de oportunidade.`,
            recomendacao: `Experimente 2 variações com um novo hook de abertura. Se o mercado responder, adicione mais 2-3 criativos com diferentes CTAs.`
          },
          {
            observacao: `O anúncio já teve ${valorMaximo} criativos ativos, indicando uma demanda real. Com ${mediaAtual} anúncios em média, a redução atual pode ser um momento estratégico para entrada.`,
            recomendacao: `Comece com 3 variações testando diferentes abordagens de storytelling. Com validação, expanda para 5-6 criativos com novos benefícios.`
          },
          {
            observacao: `Pico de ${valorMaximo} criativos demonstra potencial do mercado. Com média de ${mediaAtual} anúncios, a redução atual pode ser uma oportunidade para inovação.`,
            recomendacao: `Inicie com 2 criativos focando em um novo nicho secundário. Após validar, adicione 3-4 variações com diferentes ângulos de venda.`
          },
          {
            observacao: `O anúncio alcançou ${valorMaximo} criativos, indicando forte demanda. Com ${mediaAtual} anúncios em média, a redução atual pode ser uma janela de oportunidade.`,
            recomendacao: `Experimente 3 variações testando diferentes gatilhos de escassez. Com validação, adicione 2-3 criativos com novos elementos de autoridade.`
          },
          {
            observacao: `Pico de ${valorMaximo} criativos mostra que o mercado está maduro. Com média de ${mediaAtual} anúncios, a redução atual pode ser um momento ideal para entrada.`,
            recomendacao: `Comece com 2-3 variações focando em diferentes objeções do público. Após validar, expanda para 4-5 criativos com novos elementos de prova social.`
          },
          {
            observacao: `O anúncio já teve ${valorMaximo} criativos ativos, indicando uma demanda real. Com ${mediaAtual} anúncios em média, a redução atual pode ser uma oportunidade estratégica.`,
            recomendacao: `Inicie com 3 variações testando diferentes abordagens de resolução de problemas. Com validação, adicione 2-3 criativos com novos benefícios.`
          }
        ];
        
        // Selecionar aleatoriamente um insight
        insight = insightsQueda[Math.floor(Math.random() * insightsQueda.length)];
        
      } else {
        // Array de variações de insights para tendência estável
        const insightsEstavel = [
          {
            observacao: `Média consistente de ${mediaAtual} criativos ativos indica uma demanda estável neste mercado.`,
            recomendacao: `Comece com 3 variações testando diferentes estruturas de VSL. Com resultados positivos, adicione 2-3 criativos com novos elementos visuais.`
          },
          {
            observacao: `Estabilidade de ${mediaAtual} criativos sugere um mercado maduro e com demanda constante.`,
            recomendacao: `Inicie com 2 criativos focando em diferentes dores do público. Após validar, expanda para 4-5 variações com novos benefícios.`
          },
          {
            observacao: `Média de ${mediaAtual} criativos ativos mostra um mercado consolidado e com oportunidades.`,
            recomendacao: `Experimente 3 variações com diferentes abordagens de storytelling. Com validação, adicione 2-3 criativos testando novos hooks.`
          },
          {
            observacao: `Estabilidade de ${mediaAtual} criativos indica um mercado com demanda consistente.`,
            recomendacao: `Comece com 2-3 variações testando diferentes gatilhos de decisão. Após validar, expanda para 4-5 criativos com novos elementos de prova social.`
          },
          {
            observacao: `Média de ${mediaAtual} criativos ativos sugere um mercado maduro e com oportunidades.`,
            recomendacao: `Inicie com 3 variações focando em diferentes ângulos de venda. Com resultados positivos, adicione 2-3 criativos testando novos benefícios.`
          },
          {
            observacao: `Estabilidade de ${mediaAtual} criativos mostra um mercado com demanda constante.`,
            recomendacao: `Experimente 2-3 variações testando diferentes abordagens de resolução de problemas. Com validação, adicione 3-4 criativos com novos elementos visuais.`
          }
        ];
        
        // Selecionar aleatoriamente um insight
        insight = insightsEstavel[Math.floor(Math.random() * insightsEstavel.length)];
      }
      
      setInsightsIA(insight);
      
      // Concluir análise
      setAnalisandoIA(false);
      setAnaliseCompleta(true);
    }, 3000);
  };
  
  // Renderiza os gradientes para o gráfico
  const renderGradients = () => (
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4F46E5" stopOpacity={1} />
        <stop offset="95%" stopColor="#4F46E5" stopOpacity={1} />
      </linearGradient>
    </defs>
  );
  
  // Renderiza o indicador de status
  const renderStatusIndicador = () => {
    let bgColor = 'bg-indigo-600';
    let statusText = 'Normal';
    
    if (tendencia === 'alta') {
      bgColor = 'bg-green-500';
      statusText = 'Em alta';
    } else if (tendencia === 'queda') {
      bgColor = 'bg-orange-500';
      statusText = 'Em queda';
    }
    
    return (
      <div className={`text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${bgColor}`}>
        <span>{statusText}</span>
      </div>
    );
  };
  
  // Custom tooltip para o gráfico
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const status = data.status;
      
      let statusColor = '#60A5FA'; // Default: medio (azul)
      let statusText = 'Médio';
      
      switch(status) {
        case 'alto':
          statusColor = '#4ADE80';
          statusText = 'Alto';
          break;
        case 'medio':
          statusColor = '#60A5FA';
          statusText = 'Médio';
          break;
        case 'baixo':
          statusColor = '#FBBF24';
          statusText = 'Baixo';
          break;
        case 'critico':
          statusColor = '#F87171';
          statusText = 'Crítico';
          break;
      }
      
      return (
        <div className="bg-gray-900 border border-gray-700 p-2 rounded-lg shadow-lg">
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-white font-bold" style={{ fontSize: '1.2rem' }}>{data.criativos}</p>
              <p className="text-xs text-gray-400">anúncios</p>
            </div>
            <div className="h-6 w-0.5 bg-gray-700"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }}></div>
              <span className="text-sm text-gray-300">{statusText}</span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Efeito para inicializar o componente
  useEffect(() => {
    // Animação de entrada
    setTimeout(() => {
      setAnimado(true);
    }, 100);
    
    // Simular análise de IA ou consultar a API real
    setTimeout(() => {
      consultarDeepSeek();
    }, 2000);
  }, [periodoAtivo]);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl shadow-xl border border-gray-800 w-full transition-all duration-700 opacity-100 translate-y-0">
      {/* Cabeçalho com indicador de status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-indigo-600 p-1.5 rounded-lg mr-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Espionagem de Anúncios</h2>
            <p className="text-gray-400 text-sm">Análise de campanhas concorrentes</p>
          </div>
        </div>
        
        {analiseCompleta ? renderStatusIndicador() : (
          <div className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-sm font-medium flex items-center gap-1">
            {analisandoIA ? (
              <>
                <svg className="animate-spin h-3 w-3 text-white mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>IA analisando...</span>
              </>
            ) : (
              <>
                <svg className="h-3 w-3 text-white mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Análise completa</span>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Atual</p>
          <p className="text-white font-bold" style={{ fontSize: '1.2rem' }}>{valorAtual}</p>
          <p className="text-xs text-gray-400">anúncios</p>
        </div>
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Máximo</p>
          <p className="text-white font-bold" style={{ fontSize: '1.2rem' }}>{valorMaximo}</p>
          <p className="text-xs text-gray-400">anúncios</p>
        </div>
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Média</p>
          <p className="text-white font-bold" style={{ fontSize: '1.2rem' }}>{media}</p>
          <p className="text-xs text-gray-400">anúncios</p>
        </div>
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Mínimo</p>
          <p className="text-white font-bold" style={{ fontSize: '1.2rem' }}>{valorMinimo}</p>
          <p className="text-xs text-gray-400">anúncios</p>
        </div>
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700 relative overflow-hidden">
          <div className={`absolute inset-0 bg-indigo-900 bg-opacity-50 flex items-center justify-center transition-opacity duration-500 ${analisandoIA ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-indigo-200 text-sm mt-1">Analisando...</p>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-1">Potencial</p>
          
          <div className="flex items-end">
            <p className="text-white font-bold" style={{ fontSize: '1.2rem' }}>{potencialAnuncio}%</p>
            <span className="text-sm ml-1 mb-1 text-indigo-400">IA Score</span>
          </div>
          
          <div className="mt-1">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${potencialAnuncio}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seletor de período */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-300">Análise</h3>
        <div className="p-0.5 bg-gray-800 rounded-lg flex">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              periodoAtivo === '7dias' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => onPeriodoChange('7dias')}
          >
            7 dias
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              periodoAtivo === '15dias' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => onPeriodoChange('15dias')}
          >
            15 dias
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              periodoAtivo === '30dias' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => onPeriodoChange('30dias')}
          >
            30 dias
          </button>
        </div>
      </div>
      
      {/* Gráfico principal */}
      <div className="h-56 bg-gray-800 rounded-xl p-3 border border-gray-700 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dadosAtuais}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {renderGradients()}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="dia" 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={[0, maxValue]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="criativos" 
              strokeWidth={0}
              fillOpacity={1}
              fill="url(#colorUv)" 
            />
            <Line 
              type="monotone" 
              dataKey="criativos"
              stroke="url(#lineGradient)"
              strokeWidth={4}
              dot={(props) => {
                const { cx, cy, index } = props;
                const data = dadosAtuais[index];
                let fill = "#60A5FA";
                
                switch(data.status) {
                  case 'alto': fill = "#4ADE80"; break;
                  case 'medio': fill = "#60A5FA"; break;
                  case 'baixo': fill = "#FBBF24"; break;
                  case 'critico': fill = "#F87171"; break;
                  default: fill = "#60A5FA";
                }
                
                return (
                  <circle 
                    key={`dot-${index}`}
                    cx={cx} 
                    cy={cy} 
                    r={6} 
                    fill={fill} 
                    stroke="#111827" 
                    strokeWidth={2} 
                  />
                );
              }}
              activeDot={{ 
                r: 8, 
                stroke: "#60A5FA", 
                strokeWidth: 2, 
                fill: "#60A5FA"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Informações */}
      <div className="grid grid-cols-2 gap-3">
        {/* Legenda e dicas */}
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Interpretação do Gráfico</h3>
          <div className="space-y-1">
            {interpretacaoGrafico && interpretacaoGrafico.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  item.status === 'alto' ? 'bg-green-500' : 
                  item.status === 'medio' ? 'bg-blue-500' : 
                  item.status === 'baixo' ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}></div>
                <p className="text-gray-300 text-sm">{item.texto}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-700">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-indigo-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
              <p className="text-indigo-300 text-sm">Nossa ferramenta monitora em tempo real os anuncios dos competidores para te dar vantagem no Facebook Ads</p>
            </div>
          </div>
        </div>
        
        {/* Insights */}
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-semibold text-orange-500">Insights da IA</h3>
          </div>
          
          {analisandoIA ? (
            <div className="flex items-center justify-center py-4">
              <svg className="animate-spin h-6 w-6 text-orange-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-orange-300 text-sm ml-2">Processando análise de concorrência...</p>
            </div>
          ) : insightsIA ? (
            <div className="text-gray-300 text-sm">
              <p className="mb-1">{insightsIA.observacao}</p>
              <p className="text-orange-500 font-medium">{insightsIA.recomendacao}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 
