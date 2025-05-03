# Documentação: v14 - Imagem Dinâmica na Seção Live Demo

## 1. Resumo das Alterações
- Modificado o componente `LiveDemoSection` (`escalados/components/live-demo-section.tsx`) para exibir imagens diferentes na área de demonstração, dependendo da aba selecionada ("Antes" ou "Depois").
- Quando a aba "Depois: Com LiveTurb" está ativa, exibe `/images/imagem 6.png`.
- Quando a aba "Antes: Vídeo Comum" está ativa, exibe `/images/imagem 7.png`.
- O atributo `alt` da imagem também foi atualizado dinamicamente.
- Adicionada uma `key` ao componente `Image` baseada na aba ativa para ajudar o React a identificar a mudança e aplicar transições, se houver.

## 2. Descrição Detalhada
A seção de demonstração "Antes vs Depois" no componente `LiveDemoSection` precisava mostrar visuais diferentes para cada estado. Anteriormente, a mesma imagem (`imagem 6.png`) era exibida independentemente da aba selecionada.

A lógica foi ajustada para tornar o atributo `src` do componente `<Image>` dinâmico. Ele agora verifica o valor do estado `activeTab`:
- Se `activeTab` for igual a `"depois"`, o `src` é definido como `/images/imagem 6.png`.
- Se `activeTab` for igual a `"antes"`, o `src` é definido como `/images/imagem 7.png`.

O atributo `alt` também foi atualizado para refletir qual imagem está sendo exibida. Uma `key` dinâmica foi adicionada ao componente `<Image>` para garantir que o React trate a mudança de imagem como uma substituição completa, o que pode ser útil para animações ou efeitos de transição.

## 3. Lógica de Implementação
1.  **Localização:** O componente `<Image>` dentro da `div` com `className="aspect-video..."` no arquivo `escalados/components/live-demo-section.tsx` foi identificado.
2.  **Modificação do `src`:** O atributo `src` foi alterado de um valor estático para uma expressão condicional (ternária) baseada no estado `activeTab`:
    ```typescript
    src={activeTab === 'depois' ? "/images/imagem 6.png" : "/images/imagem 7.png"} // Corrigido extensão
    ```
3.  **Modificação do `alt`:** O atributo `alt` também foi tornado dinâmico:
    ```typescript
    alt={activeTab === 'depois' ? "Demonstração LiveTurb (Depois)" : "Demonstração LiveTurb (Antes)"}
    ```
4.  **Adição da `key`:** O atributo `key` foi adicionado para auxiliar na renderização:
    ```typescript
    key={activeTab}
    ```

```typescript
// Trecho modificado em live-demo-section.tsx (linhas ~242-249)
<Image
  // Define a imagem dinamicamente com base na aba ativa
  src={activeTab === 'depois' ? "/images/imagem 6.png" : "/images/imagem 7.png"} // Corrigido extensão
  alt={activeTab === 'depois' ? "Demonstração LiveTurb (Depois)" : "Demonstração LiveTurb (Antes)"}
  width={640} // Manter ou ajustar conforme dimensões das imagens
  height={360} // Manter ou ajustar conforme dimensões das imagens
  className="w-full h-full object-cover"
  key={activeTab} // Adiciona key para forçar remount/transição se necessário
/>
```

## 4. Instruções de Replicação
1.  **Pré-requisitos:**
    - Aplicação Next.js (`escalados`) configurada e rodando.
    - Arquivos `imagem 6.png` e `imagem 7.png` presentes na pasta `escalados/public/images/`.
2.  **Modificação:**
    - Abra o arquivo `escalados/components/live-demo-section.tsx`.
    - Localize a tag `<Image>` dentro da `div` com `className="aspect-video..."`.
    - Altere os atributos `src`, `alt` e adicione o atributo `key` conforme o trecho de código acima.
3.  **Verificação:**
    - Execute a aplicação Next.js (`npm run dev` ou `pnpm dev`).
    - Navegue até a página que utiliza o `LiveDemoSection`.
    - Clique nos botões "Antes: Vídeo Comum" e "Depois: Com LiveTurb".
    - Verifique se a imagem exibida na área de demonstração muda corretamente para `imagem 7.png` e `imagem 6.png`, respectivamente.

## 5. Problemas Encontrados e Soluções
- **Erros de Tipagem TypeScript:** Após a substituição inicial da imagem, foram detectados erros de tipo relacionados aos estados `comments` e `visibleNotifications` no componente `LiveDemoSection`. O TypeScript estava inferindo o tipo `never[]` para esses arrays.
- **Solução:** Foram definidas interfaces (`INotification`, `IComment`) para descrever a estrutura dos objetos nesses arrays e essas interfaces foram usadas nas declarações `useState` (`useState<IComment[]>(...)`, `useState<INotification[]>(...)`) para fornecer a tipagem correta. Casts de tipo (`as INotification`) foram adicionados onde necessário para garantir a compatibilidade ao acessar propriedades adicionadas dinamicamente (`uniqueId`).

## 6. Sugestões de Otimização
- **Pré-carregamento:** Se a troca de imagem parecer lenta, considerar estratégias de pré-carregamento da imagem inativa.
- **Dimensões:** Garantir que as propriedades `width` e `height` no componente `<Image>` correspondam às dimensões reais de ambas as imagens (`imagem 6.png` e `imagem 7.png`) para otimização.

## 7. Anexos
N/A