import { useState, useEffect } from 'react';

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUserId = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCurrentUserId('');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.uid || payload.user_id || payload.sub || '';
        setCurrentUserId(userId);
      } catch (error) {
        console.error('Erro ao obter ID do usuário:', error);
        setCurrentUserId('');
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUserId();
  }, []);

  return { currentUserId, isLoading };
};