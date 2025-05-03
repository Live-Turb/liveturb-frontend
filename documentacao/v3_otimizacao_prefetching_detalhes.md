# Documentação v3: Otimização Carregamento Detalhes (Prefetching)

## 1. Resumo das Alterações

- Implementação de prefetching na página de listagem de anúncios (`/escalando-agora`).
- Adição da propriedade `onMouseEnter` ao componente `AnuncioCard`.
- Utilização de `router.prefetch` no `MarketplaceDashboard` para pré-carregar os dados e o código da página de detalhes quando o usuário passa o mouse sobre um card.

## 2. Descrição Detalhada

Após reverter a tentativa de usar Server Components para a página de detalhes (devido a não ter funcionado como esperado), o problema de lentidão (aprox. 3 segundos) no carregamento dessa página persistiu com a abordagem de Client Component + `useEffect`.

Para otimizar a percepção de velocidade sem alterar a estrutura de Client Component da página de detalhes, foi implementada a estratégia de **prefetching** do Next.js.

**Principais Mudanças:**

- **Prop `onMouseEnter` em `AnuncioCard`:** O componente `components/anuncio-card.tsx` foi modificado para aceitar uma nova prop opcional `onMouseEnter`. Essa prop foi adicionada ao `div` principal do card.
- **Chamada `router.prefetch` em `MarketplaceDashboard`:** No arquivo `marketplace-dashboard.tsx`, dentro do loop `.map()` que renderiza os `AnuncioCard`s, a nova prop `onMouseEnter` foi utilizada. Ela agora chama a função `router.prefetch()` passando a URL da página de detalhes correspondente (`/escalando-agora/anuncios/[id]`).

**Como Funciona:**

Quando o usuário passa o cursor do mouse sobre um `AnuncioCard` na página `/escalando-agora`, o evento `onMouseEnter` é disparado. A função `router.prefetch()` instrui o Next.js a iniciar, em segundo plano e com baixa prioridade, o carregamento dos recursos necessários para a página de detalhes associada àquele card. Isso inclui:

- O código JavaScript do componente da página de detalhes.
- Os dados necessários para a renderização inicial da página (o Next.js pode otimizar isso dependendo da estrutura).

Dessa forma, quando o usuário efetivamente clica no card, muitos dos recursos já estão disponíveis no cache do navegador, tornando a transição e a renderização da página de detalhes significativamente mais rápidas.

## 3. Lógica de Implementação

1.  **Identificação do Problema:** Lentidão persistente no carregamento da página de detalhes (`Client Component` + `useEffect`).
2.  **Escolha da Estratégia:** Optou-se por usar `router.prefetch` no evento `onMouseEnter` como alternativa ao Server Component, visando melhorar a performance percebida.
3.  **Modificação `AnuncioCard`:**
    - Adicionar `onMouseEnter?: () => void` à interface `AnuncioCardProps`.
    - Receber `onMouseEnter` na desestruturação das props.
    - Adicionar `onMouseEnter={onMouseEnter}` ao `div` principal do card.
4.  **Modificação `MarketplaceDashboard`:**
    - Localizar o loop `.map()` que renderiza `AnuncioCard` (linha ~625).
    - Adicionar a prop `onMouseEnter={() => router.prefetch(`/escalando-agora/anuncios/${anuncio.id.toString()}`)}` à chamada do componente `<AnuncioCard ... />`.

**Exemplo de Código Relevante (`AnuncioCard`):**

```typescript
// components/anuncio-card.tsx
interface AnuncioCardProps {
  // ... outras props
  onMouseEnter?: () => void // Adicionado
}

export const AnuncioCard: React.FC<AnuncioCardProps> = ({
  // ... outras props
  onMouseEnter, // Adicionado
}) => {
  return (
    <div
      // ... outras props
      onClick={onClick}
      onMouseEnter={onMouseEnter} // Adicionado
    >
      {/* ... conteúdo do card ... */}
    </div>
  )
}
```

**Exemplo de Código Relevante (`MarketplaceDashboard`):**

```typescript
// marketplace-dashboard.tsx
// ... dentro do return, no loop .map() ...
<AnuncioCard
  key={anuncio.id}
  anuncio={anuncio}
  onClick={() => navegarParaDetalhes(anuncio.id)}
  isFavorito={favoritos.includes(anuncio.id)}
  onFavoritoClick={(e) => toggleFavorito(anuncio.id, e)}
  onMouseEnter={() => router.prefetch(`/escalando-agora/anuncios/${anuncio.id.toString()}`)} // Adicionado
/>
// ...
```

## 4. Instruções de Replicação

1.  **Aplicar Modificações:**
    - Edite `components/anuncio-card.tsx` adicionando a prop `onMouseEnter` conforme exemplo acima.
    - Edite `marketplace-dashboard.tsx` adicionando a chamada `router.prefetch` na prop `onMouseEnter` do `AnuncioCard` dentro do loop `.map()`.
2.  **Reiniciar Servidor (se necessário):** `pnpm run dev`.
3.  **Testar:**
    - Acesse `/escalando-agora`.
    - Passe o mouse sobre um card.
    - Clique no card e observe o tempo de carregamento da página de detalhes. Compare com o tempo anterior.

## 5. Problemas Encontrados e Soluções

- **Problema:** Lentidão no carregamento da página de detalhes (Client Component).
- **Solução:** Implementar prefetching no evento `onMouseEnter` dos cards na página de listagem para antecipar o carregamento dos recursos da página de detalhes.

## 6. Sugestões de Otimização

- **Prefetching Estratégico:** Avaliar se o prefetching no `onMouseEnter` é a melhor estratégia. Se a lista for muito grande ou os usuários clicarem rapidamente, o prefetching pode consumir recursos desnecessários. Alternativas incluem prefetching quando o link entra na viewport (usando `IntersectionObserver`) ou usar o componente `<Link prefetch={true}>` do Next.js (que faz prefetch quando o link entra na viewport por padrão).
- **Tamanho do Bundle:** Analisar o tamanho do bundle JavaScript da página de detalhes. Componentes grandes ou muitas dependências podem contribuir para a lentidão, mesmo com prefetching. Considerar code-splitting ou lazy loading para componentes pesados dentro da página de detalhes.
- **Performance da API:** Investigar a performance da API (`/api/v1/anuncios/[id]`). Se a API demorar para responder, o carregamento ainda será lento, mesmo com prefetching do código. Otimizar a consulta no backend pode ser necessário.

## 7. Anexos

N/A