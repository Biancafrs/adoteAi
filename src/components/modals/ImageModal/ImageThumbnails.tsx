import React from 'react';

interface ImageThumbnailsProps {
  images: string[];
  currentIndex: number;
  onGoTo: (index: number) => void;
}

const ImageThumbnails: React.FC<ImageThumbnailsProps> = ({
  images,
  currentIndex,
  onGoTo
}) => {
  if (images.length <= 1) return null;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto p-2">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onGoTo(index)}
          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
            ? 'border-white opacity-100'
            : 'border-gray-500 opacity-60 hover:opacity-80'
            }`}
        >
          <img
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};

export default ImageThumbnails;