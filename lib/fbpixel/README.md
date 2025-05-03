# Facebook Pixel para LiveTurb

Esta implementação do Facebook Pixel é compatível com a Vercel e foi criada para rastrear o fluxo de usuários no sistema híbrido LiveTurb (Next.js/Laravel).

## Configuração

Para configurar o Facebook Pixel, é necessário adicionar a seguinte variável de ambiente no projeto Next.js:

```
NEXT_PUBLIC_FB_PIXEL_ID=1089192597935409
```

Esta variável pode ser configurada:
1. Na interface da Vercel (Environment Variables)
2. Localmente em um arquivo `.env.local`
3. No sistema de CI/CD

## Eventos Implementados

- **PageView**: Rastreamento automático de visualizações de página
- **StartTrial**: Quando o usuário clica em "TESTE 7 DIAS GRATIS"
- **InitiateCheckout**: Quando o usuário seleciona um plano
- **CompleteRegistration**: Quando o usuário completa o registro (implementado no Laravel)
- **Purchase**: Quando o usuário finaliza a compra (implementado no Laravel)

## Uso

Os eventos são importados e chamados automaticamente nos componentes relevantes:

```javascript
// Para disparar um evento específico
import { startTrial, initiateCheckout } from "@/lib/fbpixel";

// Exemplo de uso
startTrial();
initiateCheckout({ value: 97, currency: 'BRL' });
```
