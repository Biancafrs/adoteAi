import React from 'react';

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, currentIndex }) => {
  return (
    <div className="max-w-full max-h-full flex items-center justify-center">
      {images[currentIndex] && (
        <img
          src={images[currentIndex]}
          alt={`Imagem ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      )}
    </div>
  );
};

export default ImageViewer;