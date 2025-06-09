import React from 'react';
import { Publicacoes } from '../../../utils/models/publicacao.model';

interface PublicationContentProps {
  publication: Publicacoes;
}

const PublicationContent: React.FC<PublicationContentProps> = ({ publication }) => {
  return (
    <div className="mb-4">
      <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">
        {publication.text}
      </p>
    </div>
  );
};

export default PublicationContent;