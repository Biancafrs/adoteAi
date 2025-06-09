import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Comentarios } from '../../../utils/models/publicacao.model';
import { apiService } from '../../../service/api.service';

export const useComments = (publicationId: string) => {
  const [comments, setComments] = useState<Comentarios[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    if (!publicationId) return;

    setIsLoading(true);
    try {
      const commentsData = await apiService.getComments(publicationId);
      setComments(commentsData as unknown as Comentarios[]);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      toast.error('Erro ao carregar comentários');
    } finally {
      setIsLoading(false);
    }
  }, [publicationId]);

  const addComment = useCallback(async (text: string) => {
    if (!text.trim()) {
      toast.error('Digite um comentário');
      return false;
    }

    setIsSubmitting(true);

    try {
      await apiService.addComment(publicationId, text.trim());

      // Recarregar comentários
      await loadComments();

      toast.success('Comentário adicionado!');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [publicationId, loadComments]);

  return {
    comments,
    isLoading,
    isSubmitting,
    loadComments,
    addComment
  };
};