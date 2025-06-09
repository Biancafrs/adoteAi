import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Publicacoes } from '../../../utils/models/publicacao.model';
import AdoptionModal from '../../modals/AdoptionModal/Adoption';



interface PublicationActionsProps {
  publication: Publicacoes;
  currentUserId: string;
  isLiking: boolean;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
}

const PublicationActions: React.FC<PublicationActionsProps> = ({
  publication,
  currentUserId,
  isLiking,
  onLike,
  onComment
}) => {
  const [adoptionModalOpen, setAdoptionModalOpen] = useState(false);
  const handleCloseModal = () => {
    setAdoptionModalOpen(false);
  };

  const isLiked = Boolean(
    currentUserId &&
    publication.likedBy &&
    Array.isArray(publication.likedBy) &&
    publication.likedBy.includes(currentUserId)
  );

  const likesCount = publication.likes || 0;
  const commentsCount = publication.comments || 0;

  const handleAdoptClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Você precisa estar logado para solicitar adoção');
      return;
    }
    setAdoptionModalOpen(true);
  };


  return (
    <>
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          {/* Botão de Curtir */}
          <button
            onClick={() => onLike(publication.id)}
            disabled={isLiking}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${isLiked
              ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-sm'
              : 'bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200'
              } ${isLiking ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
          >
            <span className={`text-base transition-transform duration-200 ${isLiking ? 'animate-pulse' : isLiked ? 'scale-110' : ''
              }`}>
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span className={`text-xs font-semibold ${isLiked ? 'text-red-600' : 'text-gray-600'
              }`}>
              {likesCount}
            </span>
          </button>

          {/* Botão de Comentários */}
          <button
            onClick={() => onComment(publication.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-base">💬</span>
            <span className="text-xs font-semibold text-gray-600">
              {commentsCount}
            </span>
          </button>

          {/* Botão de Compartilhar */}
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-600 border border-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer">
            <span className="text-base">📤</span>
          </button>
        </div>

        {/* Botão Quero Adotar */}
        <button
          onClick={handleAdoptClick}
          className="bg-[#563838] hover:bg-[#6d4a4a] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
        >
          <span className="text-sm">💝</span>
          <span>Quero Adotar</span>
        </button>
      </div>

      {/* Modal de Adoção */}
      {adoptionModalOpen && (
        <AdoptionModal
          isOpen={adoptionModalOpen}
          onClose={handleCloseModal}
          publication={{
            id: publication.id,
            text: publication.text,
            authorName: publication.authorName,
            authorEmail: publication.authorEmail,
            media: publication.media
          }}
        />
      )}
    </>
  );
};

export default PublicationActions;