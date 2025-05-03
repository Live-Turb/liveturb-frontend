import './globals.css'
import { AuthProvider } from '../context/AuthContext'; // Importa o AuthProvider

export const metadata = {
  generator: 'v0.dev'
};

function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
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
