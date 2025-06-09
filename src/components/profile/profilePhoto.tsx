import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../service/api.service';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoUpdate: (newPhotoUrl: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  onPhotoUpdate,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas arquivos de imagem são permitidos');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Arquivo muito grande. Máximo 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const result = await apiService.uploadProfilePhoto(file);

      onPhotoUpdate(result.profilePhoto);
      setPreviewUrl(null);
      toast.success('Foto de perfil atualizada com sucesso!');

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da foto');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const getDisplayPhoto = () => {
    if (previewUrl) return previewUrl;
    if (currentPhoto) return currentPhoto;
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-20 h-20 rounded-full border-2 border-[#4b2d2d] bg-gray-100 flex items-center justify-center overflow-hidden">
          {getDisplayPhoto() ? (
            <img
              src={getDisplayPhoto()!}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[#4b2d2d] text-2xl">👤</div>
          )}

          {/* Overlay de carregamento */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Botão de edição */}
        <button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="absolute -bottom-1 -right-1 bg-[#4b2d2d] text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-[#5c3a3a] transition-colors disabled:opacity-50"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className="text-sm text-gray-700 mt-2 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
        onClick={triggerFileSelect}
        disabled={isUploading}
      >
        {isUploading ? 'Enviando...' : 'Edite sua foto de perfil'}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ProfilePhotoUpload;