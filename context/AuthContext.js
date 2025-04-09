"use client"; // Necessário para hooks como useState, useEffect, useContext

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../lib/axios'; // Importa nossa instância configurada

// Cria o contexto
const AuthContext = createContext({
  user: null,
  isLoading: true,
  error: null,
  recheckAuth: () => {}, // Função para re-verificar manualmente se necessário
});

// Cria o provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Primeiro, garante o cookie CSRF (Sanctum precisa disso)
      await axios.get('/sanctum/csrf-cookie');
      // Tenta buscar os dados do usuário autenticado
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (err) {
      // Se der erro (ex: 401 não autenticado), define usuário como null
      setUser(null);
      // Não consideramos erro de autenticação como um erro geral da aplicação aqui
      if (err.response && err.response.status !== 401) {
         console.error("Erro ao buscar usuário:", err);
         setError(err); // Armazena outros erros (ex: rede, servidor)
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Executa a verificação de autenticação quando o componente monta
  useEffect(() => {
    fetchUser();
  }, []);

  // Valor fornecido pelo contexto
  const value = {
    user,
    isLoading,
    error,
    recheckAuth: fetchUser, // Expõe a função para re-verificar
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para usar o contexto facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};