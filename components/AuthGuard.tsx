"use client"; // Marca como Client Component

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho se necessário

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        const loginUrl = `https://liveturb.com/login`;
        // Precisamos usar app.liveturb.com no redirect_to
        // Modificamos window.location.href para garantir que estamos redirecionando para o domínio app.liveturb.com
        const currentPath = window.location.pathname + window.location.search;
        const redirectTo = encodeURIComponent(`https://app.liveturb.com${currentPath}`);
        // Usamos window.location.href para redirecionamento cross-origin
        window.location.href = `${loginUrl}?redirect_to=${redirectTo}`;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    // Pode retornar um componente de loading mais elaborado
    return <div>Verificando autenticação...</div>;
  }

  // Só renderiza os children se o usuário estiver autenticado
  if (user) {
    return <>{children}</>;
  }

  // Retorna null enquanto o redirecionamento está pendente ou se algo der errado
  // O useEffect deve cuidar do redirecionamento antes disso na maioria dos casos.
  return null;
};

export default AuthGuard;