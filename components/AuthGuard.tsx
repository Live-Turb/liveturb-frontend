"use client"; // Marca como Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho se necessário
import axios from '../lib/axios';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading, recheckAuth } = useAuth();
  const router = useRouter();
  const [verificandoAuth, setVerificandoAuth] = useState(true);

  useEffect(() => {
    const verificarAuth = async () => {
      setVerificandoAuth(true);
      try {
        // Tentar realizar uma chamada para verificar autenticação
        await axios.get('/api/user');
        // Se não lançar erro, está autenticado
        setVerificandoAuth(false);
      } catch (error) {
        console.log("Erro ao verificar autenticação:", error);
        // Se receber 401, redirecionar para login
        const loginUrl = `https://liveturb.com/login`;
        // Usar um caminho relativo para o redirecionamento de volta
        const currentPath = window.location.pathname + window.location.search;
        const redirectTo = encodeURIComponent(`https://app.liveturb.com${currentPath}`);
        
        // Limpar quaisquer cookies existentes antes de redirecionar
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        window.location.href = `${loginUrl}?redirect_to=${redirectTo}`;
      }
    };

    // Verificar autenticação quando o componente montar
    if (!isLoading && !user) {
      verificarAuth();
    } else if (!isLoading && user) {
      setVerificandoAuth(false);
    }
  }, [user, isLoading, router]);

  if (isLoading || verificandoAuth) {
    // Pode retornar um componente de loading mais elaborado
    return <div>Verificando autenticação...</div>;
  }

  // Só renderiza os children se o usuário estiver autenticado
  return <>{children}</>;
};

export default AuthGuard;