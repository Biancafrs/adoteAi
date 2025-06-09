import React, { useMemo } from 'react';
import { Publicacoes } from '../../../utils/models/publicacao.model';
import PublicationActions from './PublicationActions';
import PublicationContent from './PublicationContent';
import PublicationHeader from './PublicationHeader';
import PublicationMedia from './PublicationMedia';

interface PublicationCardProps {
  publication: Publicacoes;
  currentUserId: string;
  isLiking: boolean;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onImageClick: (images: string[], index: number) => void;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  currentUserId,
  isLiking,
  onLike,
  onComment,
  onImageClick
}) => {
  // Memoizar props pesadas para evitar re-renders
  const memoizedActions = useMemo(() => ({
    publication,
    currentUserId,
    isLiking,
    onLike,
    onComment
  }), [publication.id, publication.likes, publication.likedBy, currentUserId, isLiking, onLike, onComment]);

  return (
    <div
      data-publication-id={publication.id}
      className="publication-card bg-white rounded-2xl shadow-lg border border-amber-100 mb-6 overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 max-w-2xl mx-auto"
    >
      <div className="p-6">
        <PublicationHeader publication={publication} />
        <PublicationContent publication={publication} />
        <PublicationMedia
          publication={publication}
          onImageClick={onImageClick}
        />
        <PublicationActions {...memoizedActions} />
      </div>
    </div>
  );
};

export default React.memo(PublicationCard);