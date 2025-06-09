import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Publicacoes } from '../../../utils/models/publicacao.model';

export const usePublications = () => {
  const [publications, setPublications] = useState<Publicacoes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  const likingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const getCurrentUserId = useMemo(() => {
    return () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.warn('⚠️ Nenhum token encontrado no localStorage');
          return '';
        }

        // Verificar se o token tem o formato JWT correto
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('❌ Token não tem formato JWT válido');
          return '';
        }

        const payload = JSON.parse(atob(tokenParts[1]));

        const possibleUserIds = [
          payload.uid,
          payload.sub,
          payload.user_id,
          payload.firebase?.identities?.['firebase']?.[0],
          payload.auth_time ? payload.uid : null,
        ].filter(Boolean);


        const userId = possibleUserIds[0] || '';

        if (!userId) {
          console.error('❌ Nenhum User ID válido encontrado no token');
          console.error('❌ Estrutura do payload:', Object.keys(payload));
        }

        return userId;
      } catch (error) {
        console.error('❌ Erro ao extrair User ID do token:', error);
        return '';
      }
    };
  }, []);

  const fetchPublications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/publications");

      if (response.ok) {
        const data = await response.json();
        setPublications(Array.isArray(data) ? data : []);
      } else {
        throw new Error("API não disponível");
      }
    } catch (error) {
      console.warn("Erro ao carregar da API:", error);
      const stored = localStorage.getItem("adoption_posts");
      if (stored) {
        const localData = JSON.parse(stored);
        setPublications(localData);
      } else {
        setPublications([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLike = useCallback(async (publicationId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Você precisa estar logado para curtir');
      return;
    }

    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      toast.error('Erro de autenticação');
      return;
    }

    let wasLiked = false;

    setPublications(prev => {
      return prev.map(pub => {
        if (pub.id === publicationId) {
          const currentlyLiked = pub.likedBy?.includes(currentUserId) || false;
          wasLiked = currentlyLiked;

          const newLikedBy = currentlyLiked
            ? (pub.likedBy || []).filter(id => id !== currentUserId)
            : [...(pub.likedBy || []), currentUserId];

          const newPublication = {
            ...pub,
            likes: currentlyLiked
              ? Math.max(0, (pub.likes || 0) - 1)
              : (pub.likes || 0) + 1,
            likedBy: newLikedBy
          };

          return newPublication;
        }
        return pub;
      });
    });

    setLikingPosts(prev => new Set([...prev, publicationId]));

    try {
      const response = await fetch(`http://localhost:3000/publications/${publicationId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao processar curtida');
      }


    } catch (error) {
      console.error('Erro ao curtir:', error);

      setPublications(prev =>
        prev.map(pub => {
          if (pub.id === publicationId) {
            const newLikedBy = wasLiked
              ? [...(pub.likedBy || []), currentUserId]
              : (pub.likedBy || []).filter(id => id !== currentUserId);

            return {
              ...pub,
              likes: wasLiked
                ? (pub.likes || 0) + 1
                : Math.max(0, (pub.likes || 0) - 1),
              likedBy: newLikedBy
            };
          }
          return pub;
        })
      );

      toast.error('Erro ao processar curtida');
    } finally {
      const timeoutId = setTimeout(() => {
        setLikingPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(publicationId);
          return newSet;
        });
        likingTimeouts.current.delete(publicationId);
      }, 200);

      const existingTimeout = likingTimeouts.current.get(publicationId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      likingTimeouts.current.set(publicationId, timeoutId);
    }
  }, [getCurrentUserId]);

  const addPublication = useCallback((newPublication: Publicacoes) => {
    setPublications(prev => [newPublication, ...prev]);
  }, []);

  const updatePublication = useCallback((publicationId: string, updates: Partial<Publicacoes>) => {
    setPublications(prev =>
      prev.map(pub =>
        pub.id === publicationId ? { ...pub, ...updates } : pub
      )
    );
  }, []);

  useEffect(() => {
    return () => {
      likingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      likingTimeouts.current.clear();
    };
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    isLoading,
    likingPosts,
    handleLike,
    addPublication,
    updatePublication,
    refetch: fetchPublications,
    currentUserId: getCurrentUserId()
  };
};