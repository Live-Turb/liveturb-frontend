// lib/fbpixel/cross-platform.js
// Script para integrar com o Laravel sem modificar seus arquivos

import { FB_PIXEL_ID } from './index';

/**
 * Gera um script que será executado no domínio do Laravel
 * Este script será incluído como um link direto que o usuário pode usar
 */
export function generateLaravelScript() {
  const scriptContent = `
// Facebook Pixel Code para Laravel
(function() {
  // Configuração principal do Facebook Pixel
  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window, document,'script', 'https://connect.facebook.net/en_US/fbevents.js');
  
  // Inicialização com o ID do pixel
  fbq('init', '${FB_PIXEL_ID}');
  fbq('track', 'PageView');
  
  // Inserir imagem para noscript
  var noscript = document.createElement('noscript');
  var img = document.createElement('img');
  img.height = '1';
  img.width = '1';
  img.style.display = 'none';
  img.src = 'https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1';
  noscript.appendChild(img);
  document.head.appendChild(noscript);
  
  // Detecção de URLs e eventos
  function checkURLAndFireEvents() {
    var currentURL = window.location.href;
    
    // Detecta página de registro
    if (currentURL.includes('/user/register/')) {
      // Procura por formulários na página
      var forms = document.querySelectorAll('form');
      forms.forEach(function(form) {
        form.addEventListener('submit', function() {
          fbq('track', 'CompleteRegistration', {
            content_name: 'registro-usuario',
            status: true
          });
        });
      });
    }
    
    // Detecta página de sucesso de pagamento/assinatura
    if (currentURL.includes('/subscription/success') || 
        currentURL.includes('/payment/completed') || 
        currentURL.includes('/dashboard') && document.body.textContent.includes('Subscription complete')) {
      
      // Tenta extrair o valor da URL ou do texto da página
      var planValue = 0;
      var planName = '';
      
      // Procura por textos que possam conter informações do plano
      var pageContent = document.body.textContent;
      
      if (pageContent.includes('Iniciante') || currentURL.includes('6bc0595a-f99b-45f0-9840-1b223603286d')) {
        planValue = 97;
        planName = 'Iniciante';
      } else if (pageContent.includes('Profissional') || currentURL.includes('313892f0-e4e9-4a7b-8927-ddd15f803879')) {
        planValue = 297;
        planName = 'Profissional';
      } else if (pageContent.includes('Empresarial') || currentURL.includes('4445d507-5a66-4dda-83de-a660878e1274')) {
        planValue = 597;
        planName = 'Empresarial';
      }
      
      // Dispara evento de compra
      fbq('track', 'Purchase', {
        content_name: planName,
        content_type: 'subscription',
        value: planValue,
        currency: 'BRL'
      });
    }
    
    // Para páginas de checkout/pagamento
    if (currentURL.includes('/checkout') || currentURL.includes('/payment')) {
      fbq('track', 'InitiateCheckout');
    }
  }
  
  // Executa a verificação quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkURLAndFireEvents);
  } else {
    checkURLAndFireEvents();
  }
  
  // Monitora mudanças no histórico do navegador para SPAs
  window.addEventListener('popstate', checkURLAndFireEvents);
  
  // Sobrescreve history.pushState e history.replaceState para SPAs
  var pushState = history.pushState;
  history.pushState = function() {
    pushState.apply(history, arguments);
    checkURLAndFireEvents();
  };
  
  var replaceState = history.replaceState;
  history.replaceState = function() {
    replaceState.apply(history, arguments);
    checkURLAndFireEvents();
  };
})();
  `;

  return scriptContent;
}

/**
 * Cria um componente que gera um link para o script do Facebook Pixel para Laravel
 */
export function LaravelPixelInstructions() {
  const scriptContent = generateLaravelScript();
  const blob = new Blob([scriptContent], { type: 'application/javascript' });
  const scriptUrl = URL.createObjectURL(blob);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">Instruções para o Facebook Pixel no Laravel</h3>
      <p className="mb-3">
        Para implementar o Facebook Pixel no sistema Laravel, siga um destes métodos:
      </p>
      
      <h4 className="font-semibold mb-1">Método 1: Extensão do navegador</h4>
      <ol className="list-decimal pl-5 mb-3">
        <li>Instale a extensão "User JavaScript and CSS" (Chrome) ou similar</li>
        <li>Configure a extensão para injetar o script abaixo em todas as páginas do domínio "liveturb.com"</li>
        <li>Cole o código JavaScript abaixo na configuração da extensão</li>
      </ol>
      
      <h4 className="font-semibold mb-1">Método 2: Google Tag Manager</h4>
      <ol className="list-decimal pl-5 mb-3">
        <li>Configure uma tag personalizada no Google Tag Manager</li>
        <li>Cole o código JavaScript abaixo como conteúdo da tag</li>
        <li>Configure-a para disparar em todas as páginas do domínio "liveturb.com"</li>
      </ol>
      
      <div className="bg-gray-900 text-green-400 p-3 rounded overflow-auto text-sm mb-3">
        <pre>{scriptContent}</pre>
      </div>
      
      <a 
        href={scriptUrl} 
        download="facebook-pixel-laravel.js"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Baixar Script
      </a>
    </div>
  );
}
