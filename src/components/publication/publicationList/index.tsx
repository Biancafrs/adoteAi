import React from 'react';
import { Publicacoes } from '../../../utils/models/publicacao.model';
import PublicationCard from '../publicationCard';
import PublicationSkeleton from './PublicationSkeleton';

interface PublicationListProps {
  publications: Publicacoes[];
  isLoading: boolean;
  currentUserId: string;
  likingPosts: Set<string>;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onImageClick: (images: string[], index: number) => void;
}

const PublicationList: React.FC<PublicationListProps> = ({
  publications,
  isLoading,
  currentUserId,
  likingPosts,
  onLike,
  onComment,
  onImageClick
}) => {
  if (isLoading) {
    return (
      <div>
        {[...Array(3)].map((_, index) => (
          <PublicationSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-4">🐾</div>
        <h2 className="text-2xl font-bold text-[#563838] mb-2">
          Nenhuma publicação ainda
        </h2>
        <p className="text-amber-600">
          Seja o primeiro a compartilhar um amiguinho em busca de um lar! 🏠
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-800 text-center mb-6">
        Animais Esperando por Você ❤️
      </h2>
      {publications.map((publication) => (
        <PublicationCard
          key={publication.id}
          publication={publication}
          currentUserId={currentUserId}
          isLiking={likingPosts.has(publication.id)}
          onLike={onLike}
          onComment={onComment}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};

export default PublicationList;