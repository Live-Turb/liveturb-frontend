"use client"

// A lógica de autenticação foi movida para o layout (escalados/app/escalando-agora/layout.tsx)
// Esta página agora assume que só será renderizada se o usuário estiver autenticado.
import MarketplaceDashboard from "../../marketplace-dashboard";

export default function EscalandoAgoraPage() {
  // Renderiza diretamente o conteúdo, pois a proteção está no layout.
  return <MarketplaceDashboard />;
}

