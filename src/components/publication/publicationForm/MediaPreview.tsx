import React from 'react';

interface MediaPreviewProps {
  previewUrls: string[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  previewUrls,
  onRemove,
  disabled = false
}) => {
  if (previewUrls.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-[#563838] font-semibold mb-4">
        Fotos selecionadas ({previewUrls.length}/5)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previewUrls.map((url, idx) => (
          <div key={idx} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onRemove(idx)}
              disabled={disabled}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPreview;