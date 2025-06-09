import { useState, useEffect } from 'react';

export const useImageModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (images: string[], startIndex: number = 0) => {
    setCurrentImages(images);
    setCurrentIndex(startIndex);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentImages([]);
    setCurrentIndex(0);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setCurrentIndex(prev =>
      prev < currentImages.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentIndex(prev =>
      prev > 0 ? prev - 1 : currentImages.length - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeModal();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentImages.length]);

  return {
    isOpen,
    currentImages,
    currentIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
    goToImage
  };
};