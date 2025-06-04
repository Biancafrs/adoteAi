import React, { useState, useEffect } from "react";
import Header from "../../components/header/header";
import { toast } from "react-hot-toast";

interface Publication {
  id: string;
  text: string;
  media: string[];
  authorName: string;
  authorEmail: string;
  createdAt: string;
  likes?: number;
  comments?: number;
}

const Publicacoes: React.FC = () => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const [publications, setPublications] = useState<Publication[]>([]);

  // Estados para o modal de imagens
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setIsLoadingPosts(true);

      // Primeiro tenta carregar da API
      const response = await fetch("http://localhost:3000/publications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPublications(Array.isArray(data) ? data : []);
      } else {
        throw new Error("API não disponível");
      }
    } catch (error) {
      console.warn(
        "Erro ao carregar da API, carregando do localStorage:",
        error
      );

      try {
        const stored = localStorage.getItem("adoption_posts");
        if (stored) {
          const localData = JSON.parse(stored);
          const convertedData = localData.map((pub: any) => ({
            id: pub.id.toString(),
            text: pub.text,
            media: pub.media || [],
            authorName: "Usuário Local",
            authorEmail: "local@example.com",
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
          }));
          setPublications(convertedData);
        } else {
          setPublications([]);
        }
      } catch (localError) {
        console.error("Erro ao carregar do localStorage:", localError);
        setPublications([]);
      }
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Funções do modal de imagens
  const openImageModal = (images: string[], startIndex: number = 0) => {
    setCurrentImages(images);
    setCurrentImageIndex(startIndex);
    setImageModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setCurrentImages([]);
    setCurrentImageIndex(0);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < currentImages.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : currentImages.length - 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!imageModalOpen) return;

      switch (event.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeImageModal();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imageModalOpen, currentImages.length]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const valid = files.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );

    if (valid.length !== files.length) {
      toast.error("Apenas arquivos de imagem e vídeo são permitidos");
      return;
    }

    if (selectedFiles.length + valid.length > 5) {
      toast.error("Máximo de 5 arquivos permitidos");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...valid]);
    setPreviewUrls((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handlePublish = async () => {
    if (!postText.trim() && selectedFiles.length === 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Usuário não autenticado. Salvando apenas localmente.");
    }

    setIsLoading(true);

    try {
      if (token) {
        const formData = new FormData();
        formData.append("text", postText.trim());

        selectedFiles.forEach((file, index) => {
          formData.append("files", file);
        });

        const response = await fetch("http://localhost:3000/publications", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const newPublication = await response.json();
          setPublications((prev) => [newPublication, ...prev]);
          toast.success("Publicação criada com sucesso!");

          setPostText("");
          setSelectedFiles([]);
          previewUrls.forEach((url) => URL.revokeObjectURL(url));
          setPreviewUrls([]);

          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          const errorText = await response.text();
          console.error("Erro da API:", {
            status: response.status,
            statusText: response.statusText,
            errorText,
          });
          throw new Error(`Erro da API: ${response.status} - ${errorText}`);
        }
      } else {
        throw new Error("Token não encontrado");
      }
    } catch (error) {
      console.warn("Erro ao publicar na API, tentando fallback local:", error);

      try {
        const fileToDataURL = (file: File): Promise<string> =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

        const mediaDataUrls = await Promise.all(
          selectedFiles.map(fileToDataURL)
        );

        const newLocalPub = {
          id: Date.now(),
          text: postText.trim(),
          media: mediaDataUrls,
        };

        const stored = localStorage.getItem("adoption_posts");
        const existingPosts = stored ? JSON.parse(stored) : [];
        const updatedPosts = [newLocalPub, ...existingPosts];
        localStorage.setItem("adoption_posts", JSON.stringify(updatedPosts));

        const convertedPub: Publication = {
          id: newLocalPub.id.toString(),
          text: newLocalPub.text,
          media: newLocalPub.media,
          authorName: "Você",
          authorEmail: "local@example.com",
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: 0,
        };

        setPublications((prev) => [convertedPub, ...prev]);
        toast.success("Publicação salva localmente!");

        setPostText("");
        setSelectedFiles([]);
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (localError) {
        console.error("Erro ao salvar localmente:", localError);
        toast.error("Erro ao criar publicação");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (error) {
      return "Data inválida";
    }
  };

  const PublicationSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg mb-6 p-6 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />

      {/* Modal de Imagens */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {currentImages.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg z-10">
              {currentImageIndex + 1} / {currentImages.length}
            </div>
          )}

          {currentImages.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div className="max-w-full max-h-full flex items-center justify-center">
            {currentImages[currentImageIndex] && (
              <img
                src={currentImages[currentImageIndex]}
                alt={`Imagem ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>

          {currentImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {currentImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg max-w-xs overflow-x-auto">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <div className="pt-30 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-6xl">🐾</span>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800">
              Publicações de Adoção
            </h1>
          </div>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Conecte corações, transforme vidas. Cada publicação é uma
            oportunidade de amor.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Formulário de Criação */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-800 mb-8 overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-800 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                🐾
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-800">
                  Criar Nova Publicação
                </h2>
                <p className="text-amber-600">
                  Ajude um amiguinho a encontrar um novo lar 🏠
                </p>
              </div>
            </div>

            <textarea
              className="w-full p-4 border-2 border-amber-200 rounded-xl resize-none focus:border-amber-800 focus:outline-none bg-amber-50 text-lg"
              rows={4}
              placeholder="Conte sobre este amiguinho especial... Qual é a personalidade dele? Que cuidados precisa? O que o torna único?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              disabled={isLoading}
            />

            {/* Preview das Imagens */}
            {previewUrls.length > 0 && (
              <div className="mt-6">
                <p className="text-amber-800 font-semibold mb-4">
                  Fotos selecionadas ({previewUrls.length}/5)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                        <img
                          src={url}
                          alt={`preview-${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(idx)}
                        disabled={isLoading}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alertas */}
            {showError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                É preciso adicionar uma descrição ou fotos do animalzinho.
              </div>
            )}

            {showSuccess && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                Publicação criada com sucesso! 🎉
              </div>
            )}
          </div>

          <div className="bg-amber-50 px-6 py-4 flex justify-between items-center">
            <div>
              <input
                id="upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleImageUpload}
                disabled={isLoading}
                className="hidden"
              />
              <label
                htmlFor="upload"
                className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-amber-800 text-amber-800 rounded-xl font-semibold cursor-pointer hover:bg-amber-100 transition-colors ${
                  isLoading || selectedFiles.length >= 5
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="text-xl">📷</span>
                {selectedFiles.length >= 5
                  ? "Limite atingido"
                  : "Adicionar Fotos"}
              </label>
            </div>

            <button
              onClick={handlePublish}
              disabled={
                (!postText.trim() && !selectedFiles.length) || isLoading
              }
              className="bg-amber-800 hover:bg-amber-900 disabled:bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publicando...
                </>
              ) : (
                <>
                  <span>✈️</span>
                  Publicar Adoção
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lista de Publicações */}
        <div>
          {isLoadingPosts ? (
            <div>
              {[...Array(3)].map((_, index) => (
                <PublicationSkeleton key={index} />
              ))}
            </div>
          ) : publications.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-amber-800 text-center mb-6">
                Animais Esperando por Você ❤️
              </h2>
              {publications.map((pub, index) => (
                <div
                  key={pub.id}
                  className="bg-white rounded-2xl shadow-lg border border-amber-100 mb-6 overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Header do Post */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-amber-800 text-lg">
                          {pub.authorName}
                        </h3>
                        <p className="text-amber-600 text-sm">
                          {formatDate(pub.createdAt)}
                        </p>
                      </div>
                      <span className="bg-amber-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Adoção
                      </span>
                    </div>

                    {/* Conteúdo do Post */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        {pub.text}
                      </p>

                      {/* Galeria de Mídia */}
                      {pub.media && pub.media.length > 0 && (
                        <div
                          className={`grid gap-3 ${
                            pub.media.length === 1
                              ? "grid-cols-1"
                              : pub.media.length === 2
                              ? "grid-cols-2"
                              : "grid-cols-2 md:grid-cols-3"
                          }`}
                        >
                          {pub.media.map((url, idx) => {
                            const mediaKey = `${pub.id}-${
                              typeof url === "string" ? url : idx
                            }`;
                            return (
                              <div
                                key={mediaKey}
                                className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                                onClick={() => openImageModal(pub.media, idx)}
                              >
                                <img
                                  src={url}
                                  alt={`pub-${pub.id}-${idx}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error(
                                      "Erro ao carregar imagem:",
                                      url
                                    );
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors">
                          <span>❤️</span>
                          <span className="text-sm">{pub.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors">
                          <span>💬</span>
                          <span className="text-sm">{pub.comments || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-amber-600 hover:text-amber-800 transition-colors">
                          <span>📤</span>
                        </button>
                      </div>

                      <button className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                        💝 Quero Adotar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-4">🐾</div>
              <h2 className="text-2xl font-bold text-amber-700 mb-2">
                Nenhuma publicação ainda
              </h2>
              <p className="text-amber-600">
                Seja o primeiro a compartilhar um amiguinho em busca de um lar!
                🏠
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publicacoes;
