import { useState, useEffect } from 'react';
import { apiService } from '../../../service/api.service';


interface CurrentUser {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  profilePhoto?: string;
  displayName?: string;
}

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCurrentUser(null);
          return;
        }

        // Primeiro obter ID do token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.uid || payload.sub || payload.user_id || '';

        if (!userId) {
          setCurrentUser(null);
          return;
        }

        // Buscar dados completos do usuário
        const userData = await apiService.getCurrentUser();

        setCurrentUser({
          id: userId,
          ...userData.user
        });

      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  return { currentUser, isLoading, setCurrentUser };
};