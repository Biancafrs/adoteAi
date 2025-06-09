import React from 'react';
import ImageViewer from './ImageViewer';
import ImageNavigation from './ImageNavigation';
import ImageThumbnails from './ImageThumbnails';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onGoTo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Arrows */}
      <ImageNavigation
        images={images}
        currentIndex={currentIndex}
        onNext={onNext}
        onPrev={onPrev}
      />

      {/* Main Image */}
      <ImageViewer
        images={images}
        currentIndex={currentIndex}
      />

      {/* Thumbnails */}
      <ImageThumbnails
        images={images}
        currentIndex={currentIndex}
        onGoTo={onGoTo}
      />
    </div>
  );
};

export default ImageModal;