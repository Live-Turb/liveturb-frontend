# Documentação: v6 - Redirecionamento da Raiz Laravel para Next.js

## 1. Resumo das Alterações
- Modificação da rota raiz (`/`) no arquivo de rotas web do Laravel (`AppLaravel/routes/web.php`).
- A rota raiz agora redireciona o navegador para a aplicação Next.js, presumidamente rodando em `http://localhost:3000`.
- A definição original da rota raiz foi comentada para referência.

## 2. Descrição Detalhada
Para fazer com que a página inicial do projeto (servida pela raiz `/`) exibisse o conteúdo da aplicação Next.js (localizada em `escalados/`) em vez da landing page original do Laravel, foi implementado um redirecionamento HTTP.

A alteração foi feita diretamente no arquivo de configuração de rotas web do Laravel (`AppLaravel/routes/web.php`). A rota `Route::get('/', ...)` que anteriormente apontava para `UserController::class, 'landingPage'` foi substituída por uma diretiva `Route::redirect`.

Este redirecionamento instrui o navegador do usuário a buscar o conteúdo da URL especificada (`http://localhost:3000`), efetivamente trocando a página inicial sem alterar a configuração do servidor web (Apache/XAMPP) ou impactar outras rotas existentes na aplicação Laravel.

## 3. Lógica de Implementação
1.  **Identificação da Rota:** O arquivo `AppLaravel/routes/web.php` foi analisado para localizar a definição da rota raiz (`/`). Foi encontrada na linha 58: `Route::get('/', [UserController::class, 'landingPage'])->name('landing');`.
2.  **Modificação:** A linha original foi comentada para preservar a lógica anterior como referência.
3.  **Implementação do Redirecionamento:** Uma nova linha foi adicionada utilizando a função `Route::redirect()` do Laravel:
    ```php
    Route::redirect('/', 'http://localhost:3000');
    ```
    Esta função cria um redirecionamento HTTP 302 (por padrão) da rota `/` para a URL `http://localhost:3000`.

```php
// Trecho modificado em AppLaravel/routes/web.php (~linha 58):

// Route::get('/', [UserController::class, 'landingPage'])->name('landing'); // Rota original comentada
Route::redirect('/', 'http://localhost:3000'); // Redireciona a raiz para a aplicação Next.js
```

## 4. Instruções de Replicação
1.  **Pré-requisitos:**
    - Aplicação Laravel (`AppLaravel`) configurada e rodando (via XAMPP ou `php artisan serve`).
    - Aplicação Next.js (`escalados`) configurada e rodando na URL de destino (ex: `http://localhost:3000`).
2.  **Modificação:**
    - Abra o arquivo `AppLaravel/routes/web.php`.
    - Localize a definição da rota `Route::get('/', ...)` (provavelmente em torno da linha 58).
    - Comente ou remova a linha original.
    - Adicione a linha: `Route::redirect('/', 'http://localhost:3000');` (ajuste a URL se a aplicação Next.js rodar em outra porta/endereço).
3.  **Verificação:**
    - Certifique-se de que ambas as aplicações (Laravel e Next.js) estejam em execução.
    - Acesse a URL raiz da sua aplicação Laravel (ex: `http://localhost` ou `http://localhost:8000`).
    - O navegador deve ser automaticamente redirecionado para a URL da aplicação Next.js (ex: `http://localhost:3000`) e exibir a página inicial do Next.js.
    - Acesse outras rotas do Laravel (ex: `/login`, `/admin`, etc.) para confirmar que elas continuam funcionando normalmente.

## 5. Problemas Encontrados e Soluções
- **Dependência de URL:** A solução atual depende que a aplicação Next.js esteja rodando e acessível na URL especificada (`http://localhost:3000`). Se a porta ou o endereço do Next.js mudar, o redirecionamento falhará.
- **Solução:** Utilizar variáveis de ambiente (arquivo `.env` do Laravel) para armazenar a URL da aplicação Next.js tornaria a configuração mais flexível e fácil de gerenciar entre diferentes ambientes (desenvolvimento, produção).
- **Problema:** Após comentar a rota `landing` original, a página de login (`/login`) começou a apresentar o erro `Route [landing] not defined.`. Isso ocorreu porque a view `login.blade.php` continha um link para a logo que usava `route('landing')`.
- **Solução:** O link na view `AppLaravel/resources/views/auth/login.blade.php` (linha 40) foi modificado para apontar diretamente para a URL da aplicação Next.js (`http://localhost:3000`) em vez de usar a função `route()`.


## 6. Sugestões de Otimização
- **Variável de Ambiente:** Como mencionado acima, usar uma variável de ambiente para a URL do Next.js:
    ```php
    // Em .env
    NEXTJS_URL=http://localhost:3000

    // Em web.php
    Route::redirect('/', env('NEXTJS_URL', 'http://localhost:3000'));
    ```
- **Proxy Reverso (Configuração Avançada):** Para uma integração mais transparente (sem mudança de URL visível para o usuário e permitindo servir ambas as aplicações sob o mesmo domínio/porta), configurar um proxy reverso no servidor web (Apache ou Nginx) seria a solução ideal. Isso direcionaria o tráfego para `/` para o servidor Next.js e outras rotas para o Laravel, mas requer configuração no nível do servidor.

## 7. Anexos
N/A