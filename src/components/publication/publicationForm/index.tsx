import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Publicacoes } from '../../../utils/models/publicacao.model';
import TextArea from './TextArea';
import MediaUpload from './MediaUpload';
import MediaPreview from './MediaPreview';

interface PublicationFormProps {
  onPublicationCreated: (publication: Publicacoes) => void;
}

const PublicationForm: React.FC<PublicationFormProps> = ({ onPublicationCreated }) => {
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileSelect = (files: File[]) => {
    if (selectedFiles.length + files.length > 5) {
      toast.error('Máximo de 5 arquivos permitidos');
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [
      ...prev,
      ...files.map(file => URL.createObjectURL(file))
    ]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePublish = async () => {
    if (!postText.trim() && selectedFiles.length === 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('text', postText.trim());

      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:3000/publications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newPublication = await response.json();
        onPublicationCreated(newPublication);

        // Reset form
        setPostText('');
        setSelectedFiles([]);
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        toast.success('Publicação criada com sucesso!');
      } else {
        throw new Error('Erro ao criar publicação');
      }
    } catch (error) {
      console.error('Erro ao publicar:', error);
      toast.error('Erro ao criar publicação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-800 mb-8 overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1 max-w-2xl mx-auto">
      <div className="p-6 pb-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-[#563838] rounded-full flex items-center justify-center text-white text-xl shadow-lg">
            🐾
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-800">
              Criar Nova Publicação
            </h2>
            <p className="text-[#563838] text-base">
              Ajude um amiguinho a encontrar um novo lar 🏠
            </p>
          </div>
        </div>

        {/* Text Area */}
        <TextArea
          value={postText}
          onChange={setPostText}
          disabled={isLoading}
        />

        {/* Media Preview */}
        <MediaPreview
          previewUrls={previewUrls}
          onRemove={handleRemoveFile}
          disabled={isLoading}
        />

        {/* Error/Success Messages */}
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

      {/* Footer */}
      <div className="bg-[#F0F8FF] px-6 py-4 flex justify-between items-center">
        <MediaUpload
          onFileSelect={handleFileSelect}
          disabled={isLoading || selectedFiles.length >= 5}
          maxFiles={5 - selectedFiles.length}
        />

        <button
          onClick={handlePublish}
          disabled={(!postText.trim() && !selectedFiles.length) || isLoading}
          className="bg-[#563838] hover:bg-amber-900 disabled:bg-gray-400 text-white px-5 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
  );
};

export default PublicationForm;