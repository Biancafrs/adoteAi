import React from "react";
import { Publicacoes } from "../../../utils/models/publicacao.model";

interface PublicationHeaderProps {
  publication: Publicacoes;
  onDelete?: () => void;
  currentUserId?: string;
}

const PublicationHeader: React.FC<PublicationHeaderProps> = ({
  publication,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-[#563838] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
        {publication.authorProfilePhoto ? (
          <img
            src={publication.authorProfilePhoto}
            alt={publication.authorName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>🐾</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-amber-800 text-lg">
          {publication.authorName}
        </h3>
        <p className="text-amber-600 text-sm">
          {formatDate(publication.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <span className="bg-[#563838] text-white px-3 py-1 rounded-full text-sm font-semibold">
          Adoção
        </span>
      </div>
    </div>
  );
};

export default PublicationHeader;
