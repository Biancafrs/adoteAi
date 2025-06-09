import { useMemo } from 'react';

export const useAuth = () => {
  const authInfo = useMemo(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return {
        isAuthenticated: false,
        userId: '',
        error: 'Token não encontrado'
      };
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.uid || payload.user_id || payload.sub || '';

      return {
        isAuthenticated: !!userId,
        userId,
        payload,
        tokenExists: true,
        error: userId ? null : 'User ID não encontrado no token'
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        userId: '',
        error: 'Token inválido'
      };
    }
  }, []);

  return authInfo;
};