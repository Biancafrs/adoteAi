import React from 'react';
import { Publicacoes } from '../../../utils/models/publicacao.model';

interface PublicationMediaProps {
  publication: Publicacoes;
  onImageClick: (images: string[], index: number) => void;
}

const PublicationMedia: React.FC<PublicationMediaProps> = ({
  publication,
  onImageClick
}) => {
  if (!publication.media || publication.media.length === 0) {
    return null;
  }

  const getGridLayout = (count: number) => {
    switch (count) {
      case 1:
        return {
          containerClass: "grid-cols-1",
          itemClass: "aspect-[4/3]",
          maxHeight: "max-h-80",
          maxToShow: 1
        };
      case 2:
        return {
          containerClass: "grid-cols-2",
          itemClass: "aspect-square",
          maxHeight: "max-h-80",
          maxToShow: 2
        };
      case 3:
        return {
          containerClass: "grid-cols-3",
          itemClass: "aspect-square",
          maxHeight: "max-h-80",
          maxToShow: 3
        };
      case 4:
        return {
          containerClass: "grid-cols-2",
          itemClass: "aspect-square",
          maxHeight: "max-h-80",
          maxToShow: 4
        };
      default:
        return {
          containerClass: "grid-cols-3",
          itemClass: "aspect-square",
          maxHeight: "max-h-80",
          maxToShow: 3
        };
    }
  };

  const layout = getGridLayout(publication.media.length);

  return (
    <div className="mb-4">
      <div className={`grid gap-2 ${layout.containerClass} ${layout.maxHeight} overflow-hidden rounded-xl`}>
        {publication.media.slice(0, layout.maxToShow).map((url, idx) => {
          const isLast = idx === layout.maxToShow - 1 && publication.media.length > layout.maxToShow;
          const remainingCount = publication.media.length - layout.maxToShow;

          return (
            <button
              key={`${publication.id}-${idx}`}
              className={`group relative bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-[1.02] border-0 p-0 ${layout.itemClass}`}
              onClick={() => onImageClick(publication.media, idx)}
            >
              <img
                src={url}
                alt={`Publicação ${publication.id} - ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Erro ao carregar imagem:", url);
                  const target = e.target as HTMLImageElement;
                  if (target?.style) {
                    target.style.display = "none";
                  }
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {isLast && remainingCount > 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-500/10 to-transparent backdrop-blur-[1px] flex items-center justify-center">
                  <div className="text-center bg-amber-50/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-amber-100/25">
                    <span className="text-amber-800 text-base font-bold">
                      +{remainingCount}
                    </span>
                    <p className="text-amber-600 text-xs mt-0.5 font-medium">mais</p>
                  </div>
                </div>
              )}

              {publication.media.length > 1 && !isLast && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm border border-white/20 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                  {idx + 1}/{publication.media.length}
                </div>
              )}

              {url.includes('video') && (
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                  <span>▶️</span>
                  <span>Vídeo</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {publication.media.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span className="text-amber-600">📸</span>
          <span>{publication.media.length} {publication.media.length === 1 ? 'foto' : 'fotos'}</span>
          <span className="text-gray-400">• Clique para ver todas</span>
        </div>
      )}
    </div>
  );
};

export default PublicationMedia;