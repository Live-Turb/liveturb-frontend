// Este é um Server Component, pode exportar metadata
import type { Metadata } from 'next';
import '../globals.css';
import AuthGuard from '../../components/AuthGuard'; // Importa o AuthGuard

export const metadata: Metadata = {
  title: 'Espionagem LiveTurb',
  description: 'Created with v0',
  generator: 'v0.dev',
};

// Configurações para suprimir erros de hidratação causados por extensões do navegador
// Nota: suppressHydrationWarning deve ser aplicado nos elementos HTML, não exportado assim.
// export const suppressHydrationWarnings = true; // Removido - aplicar nos elementos se necessário

export default function EscalandoAgoraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A lógica de autenticação será movida para um componente cliente (AuthGuard)
  // Este layout apenas renderiza a estrutura e os filhos
  // Idealmente, este layout não deveria renderizar <html> e <body>, pois o layout raiz já faz isso.
  // Mantendo a estrutura original por enquanto:
  // Este layout aplica o AuthGuard aos seus children.
  // Ele NÃO deve renderizar <html> ou <body>, pois isso é feito pelo layout raiz.
  return (
    <AuthGuard>{children}</AuthGuard>
  );
}
