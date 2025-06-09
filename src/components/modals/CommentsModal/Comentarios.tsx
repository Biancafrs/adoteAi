import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../../service/api.service';
import type { Comentarios } from '../../../utils/models/publicacao.model';

interface CommentsModalProps {
  publicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded: (newCount: number) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  publicationId,
  isOpen,
  onClose,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<Comentarios[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && publicationId) {
      loadComments();
    }
  }, [isOpen, publicationId]);

  const loadComments = async () => {
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
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error('Digite um comentário');
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.addComment(publicationId, newComment.trim());

      // Recarregar comentários
      await loadComments();

      // Atualizar contador no componente pai
      onCommentAdded(comments.length + 1);

      setNewComment('');
      toast.success('Comentário adicionado!');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#563838]">
            Comentários ({comments.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de Comentários */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#563838] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-[#563838] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.authorProfilePhoto ? (
                      <img
                        src={comment.authorProfilePhoto}
                        alt={comment.authorName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{comment.authorName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#563838]">
                        {comment.authorName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-gray-500">Nenhum comentário ainda</p>
              <p className="text-sm text-gray-400">Seja o primeiro a comentar!</p>
            </div>
          )}
        </div>

        {/* Formulário de Novo Comentário */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={handleSubmitComment} className="flex gap-3">
            <div className="w-10 h-10 bg-[#563838] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              👤
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva um comentário..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:border-[#563838] focus:outline-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-[#563838] hover:bg-[#6d4a4a] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>💬</span>
                      Comentar
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;