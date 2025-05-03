import './globals.css'
import { AuthProvider } from '../context/AuthContext'; // Importa o AuthProvider
import FacebookPixelProvider from '../lib/fbpixel/FacebookPixelProvider'; // Importa o FacebookPixelProvider

export const metadata = {
  generator: 'v0.dev'
};

function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <AuthProvider> {/* Envolve o conteúdo com o AuthProvider */}
          <FacebookPixelProvider> {/* Adiciona o Facebook Pixel */}
            {children}
          </FacebookPixelProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout



// Imports e metadata movidos para o topo
