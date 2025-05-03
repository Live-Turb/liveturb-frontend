# Documentação: v15 - Guia de Implantação em Produção (Hospedagem cPanel)

## 1. Introdução

Este guia descreve os passos para implantar a aplicação combinada Laravel (backend) e Next.js (frontend) no domínio `https://liveturb.com`, utilizando uma hospedagem com painel cPanel (`us159-cp.valueserver.com.br:2083`).

**Arquitetura:**
- **Backend:** Laravel (API e autenticação via Sanctum SPA) - Pasta `AppLaravel`.
- **Frontend:** Next.js (Interface do usuário, consome API Laravel) - Pasta `escalados`.

**Desafios em Hospedagem Compartilhada (cPanel):**
- **Execução Node.js:** Hospedagens compartilhadas podem não suportar ou limitar a execução de processos Node.js persistentes, necessários para rodar o Next.js em modo servidor (`next start`).
- **Proxy Reverso:** A configuração ideal para servir ambas as aplicações sob o mesmo domínio (`https://liveturb.com`) requer um proxy reverso (Apache/Nginx), cuja configuração avançada pode não ser acessível no cPanel.
- **Acesso e Comandos:** Acesso SSH e permissão para executar comandos de build (`npm run build`, `composer install`) podem ser limitados.

Vamos explorar as opções viáveis.

## 2. Pré-requisitos Gerais

- **Acesso à Hospedagem:** Acesso ao painel cPanel (`us159-cp.valueserver.com.br:2083`) e, idealmente, acesso SSH (verifique com seu provedor).
- **Domínio:** Domínio `liveturb.com` configurado e apontando para a hospedagem.
- **Banco de Dados:** Banco de dados MySQL criado na hospedagem (você já tem os dados: `live5006_lvturb`).
- **Ferramentas Locais:** Git, Composer, Node.js e PNPM instalados na sua máquina para preparar os arquivos.
- **HTTPS/SSL:** Certificado SSL instalado para `https://liveturb.com` (geralmente gerenciável via cPanel - Let's Encrypt ou outro).

## 3. Opção 1: Tentativa de Implantação no Mesmo Servidor (Requer Suporte Específico)

Esta opção tenta rodar ambas as aplicações na mesma hospedagem cPanel. **Só é viável se sua hospedagem explicitamente suportar aplicações Node.js persistentes e permitir alguma forma de configuração de proxy reverso.**

**Passo 3.1: Verificar Suporte na Hospedagem**
- **Node.js:** Procure no cPanel por opções como "Setup Node.js App", "Application Manager" ou similar. Verifique se você pode criar uma aplicação Node.js, definir a pasta do projeto (`escalados`), o comando de inicialização (`pnpm start`) e se ela rodará persistentemente.
- **Proxy Reverso:** Consulte a documentação da sua hospedagem ou o suporte técnico para saber se é possível configurar o Apache ou Nginx (o servidor web usado por eles) para direcionar tráfego para a aplicação Node.js que roda em uma porta específica. Às vezes, isso pode ser feito parcialmente via `.htaccess` (para Apache), mas pode ser complexo e limitado.

**Passo 3.2: Preparar Arquivos Localmente**
- **Laravel:**
    - Certifique-se que `AppLaravel/.env` está configurado para produção (conforme v15).
    - Rode: `composer install --no-dev --optimize-autoloader`
- **Next.js:**
    - Crie o arquivo `escalados/.env.production` (ou `.env.local` se a Vercel não for usada) com:
      ```
      NEXT_PUBLIC_BACKEND_URL=https://liveturb.com
      ```
    - Rode: `pnpm build` na pasta `escalados`. Isso gerará a pasta `.next` otimizada.

**Passo 3.3: Upload dos Arquivos**
- Use FTP ou o Gerenciador de Arquivos do cPanel.
- **Laravel:** Envie o conteúdo da pasta `AppLaravel` para o diretório raiz do seu domínio (geralmente `public_html` ou um subdiretório configurado para `liveturb.com`). **Não envie a pasta `vendor`**, você rodará `composer install` no servidor. **Envie o arquivo `.env` de produção.**
- **Next.js:** Envie o conteúdo da pasta `escalados` (incluindo `.next`, `node_modules`, `package.json`, `pnpm-lock.yaml`, `.env.production`) para um diretório **fora** da raiz pública (ex: `/home/seu_usuario_cpanel/escalados_app`).

**Passo 3.4: Configuração do Laravel no Servidor**
- **Acesso SSH (Preferencial):**
    - Conecte-se via SSH.
    - Navegue até a pasta do Laravel.
    - Rode: `composer install --no-dev --optimize-autoloader`
    - Rode: `php artisan storage:link`
    - Rode: `php artisan config:cache`
    - Rode: `php artisan route:cache`
    - Rode: `php artisan view:cache`
    - Verifique as permissões das pastas `storage` e `bootstrap/cache` (devem permitir escrita pelo servidor web).
- **Sem Acesso SSH:**
    - Faça upload da pasta `vendor` gerada localmente (não ideal).
    - A execução dos comandos `storage:link` e `optimize` pode ser mais difícil (alguns painéis oferecem interfaces para comandos artisan, verifique).

**Passo 3.5: Configuração do Next.js no Servidor (Se Suportado)**
- Use a interface "Setup Node.js App" (ou similar) no cPanel:
    - Defina a raiz da aplicação para a pasta onde você enviou o Next.js (ex: `/home/seu_usuario_cpanel/escalados_app`).
    - Defina o "Application startup file" como o comando para iniciar: `node_modules/.bin/next` com o argumento `start` (ou configure para usar `pnpm start`).
    - Defina as variáveis de ambiente necessárias (como `NODE_ENV=production`).
    - Inicie a aplicação. O cPanel geralmente atribuirá uma porta interna.

**Passo 3.6: Configuração do Proxy Reverso (Se Suportado)**
- Este é o passo mais complexo e dependente da hospedagem.
- **Objetivo:** Fazer com que o servidor web (Apache/Nginx) que responde em `https://liveturb.com` direcione:
    - Requisições para `/` e `/escalando-agora/*` para a porta interna onde o Node.js está rodando (ex: `http://127.0.0.1:PORTA_NODE`).
    - Requisições para `/api/*`, `/login`, `/logout`, `/sanctum/csrf-cookie`, etc., para a aplicação Laravel (PHP-FPM).
- **Como Fazer:**
    - **Apache:** Pode envolver edição de arquivos `.htaccess` ou configuração de VirtualHost (se permitido) usando `mod_proxy`.
    - **Nginx:** Edição do bloco `server` correspondente (se permitido) usando diretivas `location` e `proxy_pass`.
    - **cPanel:** Verifique se há alguma interface gráfica para "Application Manager" ou "Proxy Domains" que facilite isso. **Consulte o suporte da sua hospedagem.**

**Passo 3.7: Testes**
- Verifique se `https://liveturb.com` carrega o frontend Next.js.
- Verifique se `https://liveturb.com/escalando-agora` carrega e aciona a autenticação.
- Verifique se `https://liveturb.com/login` carrega a página de login do Laravel.
- Teste o fluxo completo de login e redirecionamento.

**Se a Opção 1 não for viável devido a limitações da hospedagem, a Opção 2 é a mais recomendada.**

## 4. Opção 2: Hospedagens Separadas (Recomendado)

Esta abordagem é mais robusta e geralmente mais fácil de configurar, pois cada aplicação roda em um ambiente otimizado para ela.

**Passo 4.1: Configurar Laravel na Hospedagem Atual (`https://liveturb.com`)**
- Siga os passos de upload e configuração do Laravel descritos na **Opção 1 (Passo 3.4)**.
- **Ajuste crucial no `AppLaravel/.env`:**
    - `APP_URL=https://liveturb.com`
    - `SANCTUM_STATEFUL_DOMAINS=app.liveturb.com` (Substitua `app.liveturb.com` pelo subdomínio real que você usará para o Next.js).
    - `SESSION_DOMAIN=.liveturb.com` (O ponto inicial é importante para permitir cookies em subdomínios).
- **Ajuste CORS (`AppLaravel/config/cors.php`):**
    - Adicione a URL completa do seu frontend Next.js (com HTTPS) à lista `allowed_origins`:
      ```php
      'allowed_origins' => ['https://app.liveturb.com', env('APP_URL')],
      ```
- Configure HTTPS para `https://liveturb.com`.

**Passo 4.2: Implantar Next.js na Vercel (Exemplo)**
- **Preparar Repositório:** Certifique-se que a pasta `escalados` esteja em um repositório Git (GitHub, GitLab, Bitbucket).
- **Criar Projeto na Vercel:**
    - Crie uma conta na [Vercel](https://vercel.com/).
    - Importe seu repositório Git.
    - Configure a "Root Directory" para `escalados`.
    - A Vercel geralmente detecta o Next.js e configura os comandos de build (`pnpm build`) e o framework corretamente.
- **Configurar Variáveis de Ambiente na Vercel:**
    - Vá nas configurações do projeto na Vercel.
    - Adicione a variável de ambiente:
        - `NEXT_PUBLIC_BACKEND_URL` com o valor `https://liveturb.com`
- **Configurar Domínio Personalizado:**
    - Nas configurações do projeto Vercel, adicione seu subdomínio desejado (ex: `app.liveturb.com`).
    - Siga as instruções da Vercel para configurar os registros DNS (geralmente um registro CNAME ou A) no painel de controle do seu domínio `liveturb.com`.

**Passo 4.3: Testes**
- Verifique se `https://liveturb.com` (apontando para o Laravel) funciona.
- Verifique se `https://app.liveturb.com` (apontando para o Next.js na Vercel) carrega a aplicação Next.js.
- Teste o fluxo de autenticação: acessar `https://app.liveturb.com/escalando-agora` deve redirecionar para `https://liveturb.com/login`, e após o login, deve retornar para `https://app.liveturb.com/escalando-agora`.

## 5. Considerações Finais Pós-Implantação

- **Limpar Caches:** Após o deploy, limpe os caches do Laravel (`php artisan optimize:clear` se necessário) e o cache do seu navegador.
- **Segurança:** Garanta que `APP_DEBUG` esteja `false`, as permissões de arquivo/pasta estejam corretas, e use senhas fortes.
- **Monitoramento:** Considere ferramentas para monitorar a disponibilidade e performance das suas aplicações.
- **Backups:** Configure backups regulares do seu banco de dados e arquivos.

Este guia oferece um roteiro. A implementação exata, especialmente na Opção 1, pode variar significativamente dependendo das configurações específicas e limitações da sua hospedagem cPanel. Recomendo fortemente verificar a documentação do seu provedor ou contatar o suporte deles sobre a viabilidade de rodar Node.js e configurar proxy reverso. A Opção 2 (hospedagens separadas) é geralmente mais confiável e performática.