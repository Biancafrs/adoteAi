import React from "react";
import type { Animal } from "../../utils/models/animal.model";


interface AnimalCardProps {
  animal: Animal;
  onClick: () => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onClick }) => {
  const getPorteIcon = (porte: string) => {
    switch (porte) {
      case 'pequeno': return '🐕';
      case 'médio': return '🐶';
      case 'grande': return '🐕‍🦺';
      default: return '🐾';
    }
  };

  const getEspecieIcon = (especie: string) => {
    switch (especie.toLowerCase()) {
      case 'cão': return '🐕';
      case 'gato': return '🐱';
      case 'coelho': return '🐰';
      case 'pássaro': return '🐦';
      default: return '🐾';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden group"
    >
      {/* Foto do Animal */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {animal.foto ? (
          <img
            src={animal.foto}
            alt={animal.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <span class="text-6xl">${getEspecieIcon(animal.especie)}</span>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <span className="text-6xl">{getEspecieIcon(animal.especie)}</span>
          </div>
        )}

        {/* Badge de Porte */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-amber-800 shadow-sm">
          {getPorteIcon(animal.porte)} {animal.porte}
        </div>

        {/* Badge de Vacinado/Castrado */}
        {(animal.vacinado || animal.castrado) && (
          <div className="absolute top-3 left-3 flex gap-1">
            {animal.vacinado && (
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                💉 Vacinado
              </div>
            )}
            {animal.castrado && (
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                ✂️ Castrado
              </div>
            )}
          </div>
        )}
      </div>

      {/* Informações do Animal */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-amber-800 mb-1 group-hover:text-amber-900 transition-colors">
            {animal.nome}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              {getEspecieIcon(animal.especie)}
              {animal.especie}
            </span>
            <span className="text-gray-400">•</span>
            <span>{animal.raca}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>🎂</span>
            <span>
              {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>📍</span>
            <span className="truncate">{animal.localizacao}</span>
          </div>

          {animal.abrigoNome && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>🏠</span>
              <span className="truncate">{animal.abrigoNome}</span>
            </div>
          )}
        </div>

        {/* Descrição resumida */}
        {animal.descricao && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {animal.descricao.length > 80
              ? `${animal.descricao.substring(0, 80)}...`
              : animal.descricao
            }
          </p>
        )}

        {/* Call to Action */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-600 font-medium">
            Clique para ver mais detalhes
          </span>
          <div className="flex items-center gap-1 text-amber-600 group-hover:text-amber-700 transition-colors">
            <span className="text-sm">Ver perfil</span>
            <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;