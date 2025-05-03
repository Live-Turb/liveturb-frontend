import './globals.css'
import { AuthProvider } from '../context/AuthContext'; // Importa o AuthProvider
import { FB_PIXEL_ID } from '../lib/fpixel';

export const metadata = {
  generator: 'v0.dev'
};

function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <head>
        {/* Facebook Pixel Code */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {/* End Facebook Pixel Code */}
      </head>
      <body suppressHydrationWarning={true}>
        <AuthProvider> {/* Envolve o conteúdo com o AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout



// Imports e metadata movidos para o topo
