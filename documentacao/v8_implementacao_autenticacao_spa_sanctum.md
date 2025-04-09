# Documentação: v8 - Implementação de Autenticação SPA (Sanctum)

## 1. Resumo das Alterações
- Implementado fluxo de autenticação entre Frontend (Next.js) e Backend (Laravel) usando Laravel Sanctum no modo SPA.
- O segmento de rota `/escalando-agora` (e todas as suas sub-rotas) no Next.js agora requer autenticação.
- Usuários não autenticados que acessam `/escalando-agora` são redirecionados para a página de login do Laravel (`/login`).
- Após login bem-sucedido no Laravel, o usuário é redirecionado de volta para a URL original no Next.js (`/escalando-agora`).
- A rota raiz (`/`) continua pública, redirecionando para a home do Next.js (`http://localhost:3000`).
- Configurações de CORS, Sessão e Sanctum no Laravel foram verificadas/ajustadas.
- Lógica de redirecionamento pós-login no Laravel foi aprimorada.
- Criado Contexto de Autenticação (`AuthContext`) e instância Axios configurada no Next.js.
- Criado componente cliente `AuthGuard.tsx` para encapsular a lógica de verificação de autenticação e redirecionamento.
- O layout do segmento `/escalando-agora` (`app/escalando-agora/layout.tsx`) foi mantido como Server Component (para exportar `metadata`) e agora utiliza `AuthGuard.tsx` para proteger seu conteúdo (`children`).
- Removida a lógica de proteção redundante da página `/escalando-agora/page.tsx`.

## 2. Descrição Detalhada
O objetivo foi proteger a rota `/escalando-agora` da aplicação Next.js, exigindo que os usuários façam login através da aplicação Laravel existente, mantendo a experiência o mais transparente possível e preservando o estado da aplicação (redirecionamento para a URL original).

**Fluxo de Autenticação Implementado:**
1.  O usuário tenta acessar `http://localhost:3000/escalando-agora`.
2.  O layout do segmento (`escalando-agora/layout.tsx`), sendo um Server Component, renderiza um componente cliente `AuthGuard`.
3.  O `AuthGuard` utiliza o `AuthContext` para verificar o status de autenticação.
4.  O `AuthContext` faz a requisição para `/api/user`.
5.  Se a requisição falhar (usuário não autenticado), o `AuthGuard` redireciona o navegador para a página de login do Laravel (`http://localhost:8000/login`), anexando a URL atual como parâmetro `redirect_to`.
6.  O usuário insere suas credenciais na página de login do Laravel.
7.  Após a autenticação bem-sucedida, o `LoginController` do Laravel verifica o parâmetro `redirect_to` e redireciona o navegador de volta para a URL original no frontend.
8.  O navegador carrega novamente a página original no Next.js (ex: `/escalando-agora/anuncios/1`).
9.  O `AuthGuard` (via `AuthContext`) verifica novamente o status via `/api/user`. Desta vez, a requisição é autenticada.
10. A API retorna os dados do usuário, o estado no `AuthContext` é atualizado.
11. O `AuthGuard` renderiza seu conteúdo (`children`), que é a página originalmente solicitada.

## 3. Lógica de Implementação

**Backend (Laravel - `AppLaravel/`)**
- **CORS (`config/cors.php`):** Verificado se `paths` inclui `api/*` e `sanctum/csrf-cookie`, `allowed_origins` inclui `http://localhost:3000`, e `supports_credentials` é `true`. (Nenhuma alteração necessária).
- **Sessão (`config/session.php`):** Verificado se `domain` é `null` (via env) e `same_site` é `lax`. (Nenhuma alteração necessária).
- **Kernel (`app/Http/Kernel.php`):** Verificado se `EnsureFrontendRequestsAreStateful` está no grupo `api`. (Nenhuma alteração necessária).
- **Login Controller (`app/Http/Controllers/Auth/LoginController.php`):** Modificado o método `authenticated` para verificar explicitamente o parâmetro `redirect_to` da requisição e redirecionar para ele se for uma URL válida do frontend, antes de recorrer à lógica `intended()`.
- **Rotas (`routes/web.php`):** Removida a rota antiga `GET /escalando-agora/{path?}` que usava `NextJsController`, pois a rota agora é gerenciada pelo frontend. Mantido o redirecionamento da raiz (`/`) para `http://localhost:3000`.

**Frontend (Next.js - `escalados/`)**
- **Axios:** Instalado (`pnpm add axios`).
- **Instância Axios (`lib/axios.js`):** Criado um arquivo para configurar uma instância do Axios com `baseURL` apontando para o backend (`http://localhost:8000`), `withCredentials: true` e header `X-Requested-With`.
- **Contexto de Autenticação (`context/AuthContext.js`):** Criado um Contexto React (`AuthContext`) e um Provedor (`AuthProvider`) que:
    - Mantém o estado `user`, `isLoading`, `error`.
    - No `useEffect`, busca o cookie CSRF (`/sanctum/csrf-cookie`) e depois tenta buscar os dados do usuário (`/api/user`).
    - Atualiza o estado com base na resposta ou erro (ignorando erro 401 como erro de aplicação).
    - Fornece o estado e uma função `recheckAuth` para os componentes filhos.
- **Layout (`app/layout.js`):** O componente raiz foi envolvido com o `<AuthProvider>` para disponibilizar o contexto globalmente.
- **Componente `AuthGuard` (`components/AuthGuard.tsx`):**
    - Criado como um Client Component (`"use client";`).
    - Recebe `{children}` como propriedade.
    - Utiliza `useAuth()` para acessar `user` e `isLoading`.
    - Utiliza `useEffect` para monitorar `user` e `isLoading`.
    - Se `!isLoading && !user`, redireciona para `http://localhost:8000/login?redirect_to=[URL_ATUAL]`.
    - Exibe um estado de carregamento se `isLoading`.
    - Renderiza `{children}` somente se `!isLoading && user`.
- **Layout do Segmento (`app/escalando-agora/layout.tsx`):**
    - Mantido como Server Component para poder exportar `metadata`.
    - Importa e utiliza o `<AuthGuard>` envolvendo `{children}` para aplicar a proteção.
    - Corrigida a estrutura para remover tags `<html>`, `<head>` e `<body>` redundantes, que devem ser renderizadas apenas pelo layout raiz (`app/layout.js`).
- **Página (`app/escalando-agora/page.tsx`):**
    - Lógica de autenticação removida, pois agora está no layout.
    - Renderiza diretamente o conteúdo (`MarketplaceDashboard`).

## 4. Instruções de Uso/Teste
1.  **Pré-requisitos:**
    - Servidor Laravel rodando (`php artisan serve` em `AppLaravel`).
    - Servidor Next.js rodando (`npm run dev` ou `pnpm dev` em `escalados`).
2.  **Teste (Não Autenticado):**
    - Abra uma janela anônima do navegador.
    - Acesse `http://localhost:3000/escalando-agora` ou qualquer sub-rota como `http://localhost:3000/escalando-agora/anuncios/1`.
    - Você deve ser redirecionado para `http://localhost:8000/login`. Verifique se a URL contém `?redirect_to=...` com a URL original que você tentou acessar.
    - Acesse `http://localhost:3000/` (ou a URL raiz do Laravel, ex: `http://localhost:8000/`). Você deve ver a página inicial pública do Next.js sem ser redirecionado para o login.
3.  **Teste (Autenticação):**
    - Na página de login do Laravel (`http://localhost:8000/login`), insira credenciais válidas.
    - Após o login, você deve ser redirecionado de volta para a URL original que tentou acessar (ex: `http://localhost:3000/escalando-agora` ou `http://localhost:3000/escalando-agora/anuncios/1`).
    - O conteúdo protegido correspondente deve ser exibido.
4.  **Teste (Persistência):**
    - Atualize a página dentro de `/escalando-agora`. Você deve permanecer logado e ver o conteúdo.
    - Feche e reabra o navegador (sem ser janela anônima). Acesse uma rota dentro de `/escalando-agora`. Você deve permanecer logado (dependendo do tempo de vida da sessão do Laravel).

## 5. Problemas Encontrados e Soluções (Potenciais)
- **Configuração de Domínio em Produção:** Em produção, com domínios diferentes (ex: `app.com` e `api.app.com`), será crucial configurar corretamente `SESSION_DOMAIN` no `.env` do Laravel (ex: `.app.com`) e garantir que as URLs no CORS e na instância Axios estejam corretas.
- **Tratamento de Erros:** O tratamento de erros no `AuthContext` é básico. Pode ser necessário adicionar lógica para lidar com erros de rede ou outros erros do servidor de forma mais robusta.
- **Logout:** A funcionalidade de logout não foi implementada neste escopo. Requereria uma chamada API para `/logout` no Laravel e a atualização do estado no `AuthContext`.
- **Avisos de Peer Dependency:** A instalação do Axios gerou avisos. Monitorar se causam problemas em `react-day-picker` ou `vaul`.
- **Erro `metadata` em Client Component:** Ao mover a lógica de autenticação para `layout.tsx` e marcá-lo com `"use client";`, surgiu um erro impedindo a exportação de `metadata`.
- **Solução:** A lógica de autenticação foi movida para um novo componente cliente (`AuthGuard.tsx`), e o `layout.tsx` foi mantido como Server Component, usando o `AuthGuard` para envolver `{children}`.
- **Aviso do Linter (`Undefined method 'hasRole'`):** O linter (Intelephense) reporta um erro `Undefined method 'hasRole'` na linha `auth()->user()->hasRole('admin')` dentro do `LoginController.php`. No entanto, o modelo `App/Models/User.php` utiliza corretamente o trait `Spatie\Permission\Traits\HasRoles`, que fornece este método. Portanto, este é um **falso positivo** do linter, que não está reconhecendo o método adicionado pelo trait. O código funcionará corretamente.
- **Solução (para o Linter):** Para ajudar o linter a reconhecer o método, pode-se tentar:
    - Reiniciar o VS Code.
    - Gerar arquivos de ajuda para o IDE usando o pacote `barryvdh/laravel-ide-helper` (executando `php artisan ide-helper:models -W` ou `php artisan ide-helper:generate` na pasta `AppLaravel`).
- **Erro de Hidratação (`Hydration Mismatch`):** Após implementar o `AuthGuard`, pode ocorrer um erro de hidratação no console do navegador, frequentemente mostrando atributos inesperados (como `bis_skin_checked`) no HTML do cliente.
- **Solução:** Este erro específico é quase sempre causado por **extensões do navegador** que modificam o DOM antes que o React possa hidratá-lo. Desabilitar temporariamente as extensões (especialmente Grammarly, ferramentas de SEO, etc.) e recarregar a página geralmente resolve o problema. A correção da estrutura do layout aninhado também ajuda a prevenir outros tipos de erros de hidratação.



## 6. Sugestões de Otimização
- **Middleware Next.js:** Em vez de proteger cada página individualmente com `useEffect`, o Middleware do Next.js (arquivo `middleware.js` ou `middleware.ts` na raiz de `app` ou `src`) pode ser usado para interceptar requisições para rotas específicas (`/escalando-agora/**`) e realizar a verificação/redirecionamento antes mesmo da página renderizar. Isso pode ser mais performático e centralizado.
- **Estado de Carregamento:** Melhorar a UI do estado de carregamento no `AuthGuard.tsx` (usar um Spinner ou Skeleton).
- **Validação de URL `redirect_to`:** A validação no `LoginController` pode ser aprimorada para ser mais rigorosa.

## 7. Anexos
N/A