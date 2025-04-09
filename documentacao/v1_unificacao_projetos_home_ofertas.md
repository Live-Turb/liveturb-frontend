# Documentação v1: Unificação dos Projetos Home e Ofertas

## 1. Resumo das Alterações

- Unificação dos projetos Next.js `front-liveturb/home` e `front-liveturb/ofertas` em um único projeto `front`.
- Preservação da estrutura de arquivos e componentes originais, priorizando a `home` em conflitos.
- Manutenção das rotas `/` (home) e `/escalando-agora` (ofertas) usando a estrutura do App Router.
- Mesclagem de dependências (`package.json`) e configurações (`next.config.mjs`).
- Correção de erros de build, importação e hidratação pós-unificação.
- Correção de links de navegação e importações relativas na página de detalhes do anúncio (`/escalando-agora/anuncios/[id]`).
- **Correção do botão "voltar" na página de detalhes para usar `router.back()` em vez de `router.push('/')`.**
- Cópia de arquivos de tipos (`types/index.ts`) faltantes.
- Remoção de importações não utilizadas e correção de erros TypeScript.
- Correção de estilos CSS (arredondamentos) pela adição de variáveis CSS faltantes (`--radius`, etc.) em `app/globals.css`.
- Correção de erro de hidratação pela adição do atributo `lang="pt-BR"` e `suppressHydrationWarning` no layout raiz (`app/layout.js`).
- Atualização do script `dev` para limpar a porta 3000 (`kill-port`) antes de iniciar.

## 2. Descrição Detalhada

O objetivo principal foi combinar dois projetos Next.js separados (`home` e `ofertas`) em uma única base de código (`front`) sem alterar a funcionalidade ou a estrutura interna de cada um. Isso envolveu:

- **Cópia Estratégica de Arquivos:** Os arquivos de configuração e a estrutura principal do projeto `home` foram copiados primeiro para `front`. Em seguida, os arquivos do projeto `ofertas` foram copiados, mas configurados para **não sobrescrever** arquivos existentes da `home`, garantindo a prioridade da estrutura da `home` em caso de conflitos de nome. Exceções foram feitas para componentes específicos, tipos e a estrutura da pasta `app`.
- **Estrutura de Rotas (App Router):** Para manter as rotas `/` e `/escalando-agora`, a estrutura do App Router foi utilizada. O conteúdo da raiz (`/`) do projeto `home` (`app/page.tsx`, `app/layout.js`) permaneceu na raiz de `app/`. O conteúdo da raiz (`/`) do projeto `ofertas` (`app/page.tsx`, `app/layout.tsx`, `app/anuncios/`) foi movido para uma nova pasta `app/escalando-agora/`. Isso permite que o Next.js direcione as requisições corretamente.
- **Mesclagem de Dependências:** Os arquivos `package.json` foram comparados. Dependências exclusivas do projeto `ofertas` (`next-i18next`, `kill-port`) foram adicionadas. Para dependências comuns, a versão mais recente ou a especificação `latest` foi mantida, priorizando as versões do `home` quando ambas eram específicas. O script `dev` foi atualizado para incluir `npx kill-port 3000 &&`.
- **Mesclagem de Configuração (`next.config.mjs`):** Configurações essenciais do `ofertas` (como `rewrites` para a API e `images.domains`) foram adicionadas à configuração base vinda do `home`. A configuração `basePath: '/escalando-agora'` do `ofertas` foi **omitida** para não conflitar com a rota raiz (`/`) da `home`.
- **Correção de Erros Pós-Unificação:**
    - **Favicon:** O `favicon.ico` na pasta `app` causava erro de processamento de metadados. Foi movido para `public/`.
    - **Estrutura `/escalando-agora`:** A cópia inicial falhou em criar a estrutura `app/escalando-agora`. Foi criada manualmente e os arquivos `layout.tsx`, `page.tsx` e `anuncios/` foram copiados para ela.
    - **Importações Relativas:** Mover arquivos exigiu a correção de caminhos de importação relativa em `app/escalando-agora/page.tsx` (para `../../marketplace-dashboard`), `app/escalando-agora/layout.tsx` (para `../globals.css`), e `app/escalando-agora/anuncios/[id]/page.tsx` (para `../../../../components/modern-dashboard` e `../../../../types`).
    - **Componentes/Tipos Faltantes:** O `marketplace-dashboard.tsx` (copiado para a raiz), componentes como `anuncio-card.tsx` (copiados para `components/`), e o arquivo de tipos `types/index.ts` (copiado para `types/`) não foram copiados inicialmente devido à estratégia de não sobrescrever. Foram copiados manualmente depois.
    - **Hydration Mismatch (body/html):** Erros de hidratação, provavelmente causados por extensões de navegador injetando atributos (`bis_skin_checked`, etc.), foram mitigados adicionando `suppressHydrationWarning={true}` às tags `<body>` e `<html>` no layout raiz (`app/layout.js`).
    - **Hydration Mismatch (html lang):** O layout de `/escalando-agora` definia `lang="pt-BR"` na tag `<html>`, mas o layout raiz não. Isso causou um erro de hidratação. Solução: Adicionar `lang="pt-BR"` à tag `<html>` no layout raiz (`app/layout.js`).
    - **Erros de Build/Cache:** Erros persistentes (`Cannot find module '_document.js'`, `ENOENT ... _not-found\page.js`, 404s) foram resolvidos limpando o cache (`.next`), `node_modules` e `pnpm-lock.yaml`, e reinstalando as dependências com `pnpm install`.
    - **Link Detalhes Anúncio:** O link gerado em `marketplace-dashboard.tsx` para a página de detalhes apontava para `/anuncios/[id]` em vez de `/escalando-agora/anuncios/[id]`. Foi corrigido.
    - **Botão Voltar (Detalhes Anúncio):** O botão "voltar" em `components/modern-dashboard.tsx` usava `router.push('/')`, redirecionando sempre para a home. Foi corrigido para usar `router.back()`, retornando à página anterior no histórico.
    - **Erros TypeScript:** Importação não utilizada de dados mock foi removida e tipo `any` implícito foi corrigido em `marketplace-dashboard.tsx`.
    - **Estilos CSS (Arredondamento):** As classes de arredondamento do Tailwind (`rounded-lg`, etc.) não funcionavam porque dependiam da variável CSS `--radius`, que não estava definida no `app/globals.css` (vindo da `home`). A solução foi copiar o bloco `@layer base { ... }` completo do `globals.css` do projeto `ofertas`, que continha a definição de `--radius` e outras variáveis de tema, para o `app/globals.css` do projeto unificado.

## 3. Lógica de Implementação

A implementação seguiu uma abordagem passo a passo, adaptada durante a resolução de problemas:

1.  **Análise:** Listagem de arquivos (`Get-ChildItem -Recurse -Name`).
2.  **Cópia Base (`home`):** Copiar configs e pastas principais (`Copy-Item`).
3.  **Cópia Complementar (`ofertas`):** Copiar pastas de `ofertas` sem sobrescrever (`Get-ChildItem | ForEach-Object { if (-not (Test-Path ...)) { Copy-Item ... } }`). *Nota: Esta etapa foi parcialmente ineficaz para `app/`, `components/`, `data/` e `types/`, exigindo cópias manuais posteriores.*
4.  **Dependências:** Ler `package.json` de ambos (`read_file`), mesclar manualmente, escrever novo `package.json` (`write_to_file`).
5.  **Configuração:** Ler `next.config.mjs` de ambos (`read_file`), mesclar manualmente, aplicar patch (`apply_diff`).
6.  **Instalação Inicial:** `pnpm install`.
7.  **Debugging e Correções:**
    - Mover `favicon.ico` (`Move-Item`).
    - Criar `app/escalando-agora` (`New-Item`).
    - Copiar arquivos/pastas específicos de `ofertas/app` para `app/escalando-agora` (`Copy-Item`).
    - Copiar `marketplace-dashboard.tsx` (`Copy-Item`).
    - Copiar componentes faltantes de `ofertas/components` (`Get-ChildItem | ForEach-Object { Copy-Item ... }`).
    - Copiar `types/index.ts` faltante (`Copy-Item`).
    - Ajustar importações (`apply_diff` em `app/escalando-agora/page.tsx`, `layout.tsx`, `marketplace-dashboard.tsx`, `app/escalando-agora/anuncios/[id]/page.tsx`).
    - Ajustar link de navegação em `marketplace-dashboard.tsx` (`apply_diff`).
    - **Ajustar botão "voltar" em `components/modern-dashboard.tsx` para usar `router.back()` (`apply_diff`).**
    - Adicionar `suppressHydrationWarning` às tags `<body>` e `<html>` (`apply_diff`).
    - Adicionar `lang="pt-BR"` à tag `<html>` em `app/layout.js` (`apply_diff`).
    - Corrigir CSS Globals: Ler `app/globals.css` atual e `ofertas/app/globals.css` (`read_file`), identificar variáveis CSS faltantes (`--radius`, etc.), inserir o bloco `@layer base` do `ofertas` no `app/globals.css` atual (`insert_content`).
    - **Limpeza Completa:** Parar servidor, `Remove-Item .next`, `Remove-Item node_modules`, `Remove-Item pnpm-lock.yaml`.
    - **Reinstalação:** `pnpm install`.
    - **Reiniciar Servidor:** `pnpm run dev`.
8.  **Ajuste Final:** Modificar script `dev` no `package.json` (`apply_diff`).

**Exemplo de Código Relevante (Ajuste de Importação - Detalhes):**

```typescript
// Em app/escalando-agora/anuncios/[id]/page.tsx (depois)
import ModernDashboard from "../../../../components/modern-dashboard"
import type { Anuncio } from "../../../../types"
```

**Exemplo de Código Relevante (Ajuste Link Navegação):**

```typescript
// Em marketplace-dashboard.tsx (depois)
const navegarParaDetalhes = (anuncioId: number) => {
  router.push(`/escalando-agora/anuncios/${anuncioId.toString()}`)
}
```

**Exemplo de Código Relevante (Ajuste Botão Voltar):**

```typescript
// Em components/modern-dashboard.tsx (depois)
<button
  onClick={() => router.back()} // Usa router.back()
  className="..."
  title="Voltar"
>
  <ArrowLeft className="w-5 h-5" />
</button>
```

**Exemplo de Código Relevante (Hydration Warning & Lang):**

```javascript
// Em app/layout.js (depois)
<html lang="pt-BR" suppressHydrationWarning={true}>
  <body suppressHydrationWarning={true}>{children}</body>
</html>
```

**Exemplo de Código Relevante (CSS Globals - Adição):**

```css
/* Adicionado ao final de app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    /* ... outras variáveis ... */
    --radius: 0.5rem;
    /* ... mais variáveis ... */
  }
  .dark {
    /* ... variáveis do tema escuro ... */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 4. Instruções de Replicação

1.  **Pré-requisitos:** Node.js, pnpm. Acesso aos diretórios originais `Z:\xampp\htdocs\front-liveturb\home` e `Z:\xampp\htdocs\front-liveturb\ofertas`.
2.  **Diretório de Destino:** Crie um diretório vazio `Z:\xampp\htdocs\front`.
3.  **Navegue até o Diretório:** Abra um terminal em `Z:\xampp\htdocs\front`.
4.  **Copiar Configuração (`home`):**
    ```powershell
    $sourceDir = '..\front-liveturb\home'; $destDir = '.'; $configFiles = @('.gitignore', 'components.json', 'next-env.d.ts', 'next.config.mjs', 'package.json', 'postcss.config.mjs', 'tailwind.config.js', 'tsconfig.json', 'v0-user-next.config.js', 'v0-user-next.config.mjs'); foreach ($file in $configFiles) { Copy-Item -Path (Join-Path $sourceDir $file) -Destination $destDir -ErrorAction SilentlyContinue }
    ```
5.  **Copiar Pastas Principais (`home`):**
    ```powershell
    Copy-Item -Path ..\front-liveturb\home\app, ..\front-liveturb\home\components, ..\front-liveturb\home\hooks, ..\front-liveturb\home\lib, ..\front-liveturb\home\public, ..\front-liveturb\home\styles -Destination . -Recurse -Container
    ```
6.  **Copiar Pastas (`ofertas` - Sem Sobrescrever):**
    ```powershell
    $sourceRoot = '..\front-liveturb\ofertas'; $destRoot = '.'; $foldersToCopy = @('app', 'components', 'data', 'hooks', 'lib', 'public', 'styles', 'types'); foreach ($folder in $foldersToCopy) { $sourcePath = Join-Path $sourceRoot $folder; $destPath = Join-Path $destRoot $folder; if (-not (Test-Path $destPath -PathType Container)) { New-Item -ItemType Directory -Path $destPath | Out-Null }; Get-ChildItem -Path $sourcePath -Recurse | ForEach-Object { $itemDestPath = $_.FullName.Replace($sourcePath, $destPath); if (-not (Test-Path $itemDestPath)) { if ($_.PSIsContainer) { New-Item -ItemType Directory -Path $itemDestPath -Force | Out-Null } else { $parentDir = Split-Path -Path $itemDestPath -Parent; if (-not (Test-Path $parentDir -PathType Container)) { New-Item -ItemType Directory -Path $parentDir -Force | Out-Null }; Copy-Item -Path $_.FullName -Destination $itemDestPath -Force } } } }
    ```
7.  **Escrever `package.json` Unificado:** (Conteúdo conforme definido anteriormente na conversa)
    ```powershell
    # (Use write_to_file ou copie/cole o conteúdo mesclado para package.json)
    ```
8.  **Mesclar `next.config.mjs`:** (Aplicar as adições de `images.domains` e `rewrites` conforme feito com `apply_diff`)
9.  **Mover Favicon:**
    ```powershell
    Move-Item -Path app\favicon.ico -Destination public\favicon.ico
    ```
10. **Criar Estrutura `/escalando-agora`:**
    ```powershell
    New-Item -ItemType Directory -Path app\escalando-agora
    Copy-Item -Path ..\front-liveturb\ofertas\app\layout.tsx -Destination app\escalando-agora\layout.tsx
    Copy-Item -Path ..\front-liveturb\ofertas\app\page.tsx -Destination app\escalando-agora\page.tsx
    Copy-Item -Path ..\front-liveturb\ofertas\app\anuncios -Destination app\escalando-agora\anuncios -Recurse -Container
    ```
11. **Copiar Arquivos/Componentes/Tipos Faltantes:**
    ```powershell
    Copy-Item -Path ..\front-liveturb\ofertas\marketplace-dashboard.tsx -Destination .
    $sourceDir = '..\front-liveturb\ofertas\components'; $destDir = '.\components'; Get-ChildItem -Path $sourceDir -Filter *.tsx -File | ForEach-Object { $destPath = Join-Path $destDir $_.Name; if (-not (Test-Path $destPath)) { Copy-Item -Path $_.FullName -Destination $destPath } }
    Copy-Item -Path ..\front-liveturb\ofertas\types\index.ts -Destination .\types\index.ts
    ```
12. **Corrigir Importações e Links:** (Aplicar patches com `apply_diff` em `app/escalando-agora/page.tsx`, `layout.tsx`, `marketplace-dashboard.tsx`, `app/escalando-agora/anuncios/[id]/page.tsx`)
13. **Corrigir Botão Voltar:** (Aplicar patch com `apply_diff` em `components/modern-dashboard.tsx` para usar `router.back()`)
14. **Corrigir Hydration:** (Aplicar patch com `apply_diff` em `app/layout.js` para adicionar `suppressHydrationWarning` ao `body` e `html`, e `lang` ao `html`)
15. **Corrigir CSS Globals:** (Inserir conteúdo do `@layer base` de `ofertas/app/globals.css` em `app/globals.css` usando `insert_content`)
16. **Limpeza Completa:**
    ```powershell
    Remove-Item -Path .\.next -Recurse -Force
    Remove-Item -Path .\node_modules -Recurse -Force
    Remove-Item -Path .\pnpm-lock.yaml -Force -ErrorAction SilentlyContinue
    ```
17. **Instalar Dependências:**
    ```powershell
    pnpm install
    ```
18. **Verificar:**
    ```powershell
    pnpm run dev
    # Acesse http://localhost:3000/, http://localhost:3000/escalando-agora
    # Clique em um card em /escalando-agora e verifique http://localhost:3000/escalando-agora/anuncios/[id]
    # Clique no botão voltar na página de detalhes
    # Verifique os arredondamentos e erros de hidratação
    ```

## 5. Problemas Encontrados e Soluções

- **Conflito `dir` vs PowerShell:** Comando `dir /s /b` falhou. Solução: Usar `Get-ChildItem -Recurse -Name`.
- **Falha na Cópia Inicial (Não Sobrescrever):** A estratégia de não sobrescrever impediu que arquivos necessários de `ofertas/app`, `ofertas/components`, `ofertas/data`, `ofertas/types` fossem copiados para as pastas existentes. Solução: Copiar manualmente a estrutura de `ofertas/app` para `app/escalando-agora` e os arquivos/componentes/tipos faltantes para seus locais corretos.
- **Erro de Metadados (`favicon.ico`):** Next.js falhou ao processar `app/favicon.ico`. Solução: Mover para `public/favicon.ico`.
- **Erro `Module not found` (Importações Relativas):** Mover arquivos quebrou importações relativas. Solução: Ajustar os caminhos (`../` vs `../../` vs `../../../../`) nos arquivos afetados (`app/escalando-agora/page.tsx`, `layout.tsx`, `marketplace-dashboard.tsx`, `app/escalando-agora/anuncios/[id]/page.tsx`).
- **Erro `Module not found` (Arquivos Faltantes):** Erros de importação devido a arquivos não copiados (`types/index.ts`, `data/mock...`). Solução: Copiar os arquivos faltantes e remover importações não utilizadas (mock).
- **Erro `Hydration Mismatch` (body/html):** Atributos não padrão (`bis_skin_checked`, etc.) nas tags `<body>` e `<html>`. Solução: Adicionar `suppressHydrationWarning={true}` às tags `<body>` e `<html>` em `app/layout.js`.
- **Erro `Hydration Mismatch` (html lang):** Atributo `lang` inconsistente entre layouts. Solução: Adicionar `lang="pt-BR"` à tag `<html>` em `app/layout.js`.
- **Erro 404 (Link Incorreto):** Link para detalhes do anúncio apontava para rota errada. Solução: Corrigir o `router.push` em `marketplace-dashboard.tsx`.
- **Botão Voltar Incorreto:** Botão voltava para `/` em vez da página anterior. Solução: Alterar `router.push('/')` para `router.back()` em `components/modern-dashboard.tsx`.
- **Erros Persistentes (Build/Cache):** Erros 404 e `Cannot find module` mesmo após correções. Solução: Limpeza completa (`.next`, `node_modules`, `pnpm-lock.yaml`) e reinstalação (`pnpm install`).
- **Falha `pnpm install` (VSCE markers):** Erro transitório no terminal. Solução: Ignorar e prosseguir com a limpeza/reinstalação.
- **Porta Ocupada:** Potencial conflito de porta ao reiniciar o servidor. Solução: Adicionar `npx kill-port 3000 &&` ao script `dev`.
- **Erro TypeScript (`any` implícito):** Parâmetro sem tipo explícito. Solução: Adicionar tipo `string` ao parâmetro `tag`.
- **Estilos CSS (Arredondamento):** Classes `rounded-*` não funcionavam. Causa: Variável `--radius` não definida no `globals.css` mesclado. Solução: Copiar definições `@layer base` (incluindo `--radius` e outras variáveis de tema) do `globals.css` original do `ofertas` para o `globals.css` do projeto unificado.

## 6. Sugestões de Otimização

- **Revisão de Componentes Duplicados:** Verificar se há componentes com nomes diferentes mas funcionalidade similar nas pastas `components/` (vindos da `home`) e os copiados de `ofertas`. Refatorar para usar um único componente se possível.
- **Revisão de Dependências:** Analisar as dependências mescladas. Algumas podem ser específicas de funcionalidades não mais usadas ou podem ser atualizadas (considerando os avisos de `peer dependencies`).
- **Tipagem:** O projeto `ofertas` usava `layout.tsx` e `page.tsx`, enquanto `home` usava `layout.js` e `page.tsx`. Padronizar para TypeScript (`.tsx`) pode melhorar a manutenibilidade.
- **CSS Globals:** Ambos os projetos tinham `globals.css`. O arquivo da `home` foi mantido inicialmente, mas depois complementado com as variáveis do `ofertas`. Uma revisão completa para mesclar estilos de forma mais limpa pode ser benéfica.
- **Configuração `next-i18next`:** A dependência foi adicionada, mas a configuração necessária para internacionalização não foi portada/mesclada (requereria análise mais profunda dos arquivos de configuração e uso).
- **Tratamento de Erro API:** Melhorar o tratamento de erros nas chamadas `fetch` para fornecer feedback mais específico ao usuário em caso de falha da API.

## 7. Anexos

N/A