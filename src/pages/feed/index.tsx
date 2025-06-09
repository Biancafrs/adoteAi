import React, { useState } from "react";
import Header from "../../components/header/header";

import { usePublications } from "./hooks/usePublications";
import { useImageModal } from "./hooks/useImageModal";
import heartBeatAnimation from "../../utils/css/heartBeat";
import Sidebar from "../../components/publication/sidebar";
import CommentsModal from "../../components/modals/CommentsModal/Comentarios";
import ImageModal from "../../components/modals/ImageModal";
import PublicationForm from "../../components/publication/publicationForm";
import PublicationList from "../../components/publication/publicationList";

const PublicacoesPage: React.FC = () => {
  const {
    publications,
    isLoading,
    likingPosts,
    handleLike,
    addPublication,
    updatePublication,
    currentUserId,
  } = usePublications();

  const imageModal = useImageModal();

  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState<
    string | null
  >(null);
  const [pubs, setPubs] = useState(publications);

  React.useEffect(() => {
    setPubs(publications);
  }, [publications]);

  const openCommentsModal = (publicationId: string) => {
    setSelectedPublicationId(publicationId);
    setCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setCommentsModalOpen(false);
    setSelectedPublicationId(null);
  };

  const handleDeletePublication = (id: string) => {
    setPubs((prev) => prev.filter((pub) => pub.id !== id));
  };

  return (
    <>
      <style>{heartBeatAnimation}</style>
      <div className="min-h-screen bg-[#FDF8F2]">
        <Header />

        {/* Modal de Imagens */}
        <ImageModal
          isOpen={imageModal.isOpen}
          images={imageModal.currentImages}
          currentIndex={imageModal.currentIndex}
          onClose={imageModal.closeModal}
          onNext={imageModal.nextImage}
          onPrev={imageModal.prevImage}
          onGoTo={imageModal.goToImage}
        />

        {/* Modal de Comentários */}
        {commentsModalOpen && selectedPublicationId && (
          <CommentsModal
            publicationId={selectedPublicationId}
            isOpen={commentsModalOpen}
            onClose={closeCommentsModal}
            onCommentAdded={(newCount) => {
              updatePublication(selectedPublicationId, { comments: newCount });
            }}
          />
        )}

        {/* Hero Section*/}
        <div className="pt-24 pb-8 px-6">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-6">
              <img src="/src/assets/logo.svg" alt="Logo" />
              <h1 className="text-4xl md:text-5xl font-bold text-amber-800">
                Publicações de Adoção
              </h1>
            </div>
            <p className="text-xl text-amber-600 font-semibold max-w-3xl mx-auto">
              Conecte corações, transforme vidas. Cada publicação é uma
              oportunidade de amor.
            </p>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Coluna Principal*/}
              <div className="lg:col-span-8">
                <div className="max-w-3xl mx-auto">
                  <PublicationForm onPublicationCreated={addPublication} />
                  <PublicationList
                    publications={pubs}
                    isLoading={isLoading}
                    currentUserId={currentUserId}
                    likingPosts={likingPosts}
                    onLike={handleLike}
                    onComment={openCommentsModal}
                    onImageClick={imageModal.openModal}
                    onDeletePublication={handleDeletePublication}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <Sidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicacoesPage;
