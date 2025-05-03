# Documentação: v12 - Substituição da Imagem Placeholder da Hero Section

## 1. Resumo das Alterações
- Substituída a imagem placeholder (`/placeholder.svg?height=720&width=1280`) com `alt="LiveTurb Demo"` no componente `HeroSection` (`escalados/components/hero-section.tsx`).
- A imagem foi substituída pelo arquivo `vsl.jpg`, localizado na pasta `escalados/public/images/`.
- Corrigido um erro de tipagem TypeScript (`Parameter 'e' implicitly has an 'any' type`) no mesmo arquivo, adicionando o tipo `React.MouseEvent` ao parâmetro do evento `handleMouseMove`.

## 2. Descrição Detalhada
O componente `HeroSection`, responsável pela seção principal da página inicial, exibia uma imagem genérica como placeholder. O objetivo foi substituir essa imagem por um conteúdo visual específico (`vsl.jpg`) fornecido pelo usuário e já presente na pasta `public/images`.

Adicionalmente, durante a modificação, foi identificado e corrigido um erro de tipagem do TypeScript relacionado ao parâmetro do evento de movimento do mouse (`handleMouseMove`).

## 3. Lógica de Implementação
1.  **Localização:** O componente `HeroSection` (`escalados/components/hero-section.tsx`) foi identificado como o local contendo a imagem placeholder (`alt="LiveTurb Demo"`).
2.  **Identificação da Imagem:** A tag `<Image>` que utilizava `src="/placeholder.svg?..."` e tinha `alt="LiveTurb Demo"` foi localizada (linha ~232).
3.  **Atualização do Caminho:** O atributo `src` dessa tag `<Image>` foi modificado para `/images/vsl.jpg`.
4.  **Correção de Tipagem:** Na função `handleMouseMove` (linha ~17), o tipo do parâmetro `e` foi explicitamente definido como `React.MouseEvent`.

```typescript
// Trecho modificado em hero-section.tsx (linha ~17)
const handleMouseMove = (e: React.MouseEvent) => {
  setMousePosition({ x: e.clientX, y: e.clientY });
}

// Trecho modificado em hero-section.tsx (linha ~232)
<Image
  src="/images/vsl.jpg" // Substituído placeholder
  alt="LiveTurb Demo"
  width={1280}
  height={720}
  className="w-full h-full object-cover"
/>
```

## 4. Instruções de Replicação
1.  **Pré-requisitos:**
    - Aplicação Next.js (`escalados`) configurada e rodando.
    - Arquivo `vsl.jpg` presente na pasta `escalados/public/images/`.
2.  **Modificação:**
    - Abra o arquivo `escalados/components/hero-section.tsx`.
    - Localize a tag `<Image>` com `alt="LiveTurb Demo"`.
    - Altere o atributo `src` para `/images/vsl.jpg`.
    - Localize a função `handleMouseMove` e adicione o tipo `React.MouseEvent` ao parâmetro `e`.
3.  **Verificação:**
    - Execute a aplicação Next.js (`npm run dev` ou `pnpm dev`).
    - Navegue até a página inicial que utiliza o `HeroSection`.
    - Verifique se a seção principal agora exibe a imagem `vsl.jpg` no lugar do placeholder.
    - Verifique se não há erros de compilação relacionados à tipagem no terminal.

## 5. Problemas Encontrados e Soluções
- Identificado erro de tipagem TypeScript (`Parameter 'e' implicitly has an 'any' type`) durante a edição do arquivo.
- **Solução:** Adicionado o tipo explícito `React.MouseEvent` ao parâmetro `e` da função `handleMouseMove`.

## 6. Sugestões de Otimização
- **Otimização de Imagens (Next.js):** Verificar se as propriedades `width` e `height` (1280x720) correspondem às dimensões reais da imagem `vsl.jpg` para otimização ideal pelo Next.js.

## 7. Anexos
N/A