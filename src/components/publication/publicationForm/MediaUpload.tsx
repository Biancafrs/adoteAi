import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';

interface MediaUploadProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  onFileSelect,
  disabled = false,
  maxFiles = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    // Validar tipos de arquivo
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length !== files.length) {
      toast.error('Apenas arquivos de imagem e vídeo são permitidos');
    }

    if (validFiles.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    onFileSelect(validFiles);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-amber-800 text-amber-800 rounded-xl font-semibold cursor-pointer hover:bg-[#c5ccd1] transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <span className="text-xl">📷</span>
        {maxFiles === 0 ? 'Limite atingido' : 'Adicionar Fotos'}
      </button>
    </div>
  );
};

export default MediaUpload;