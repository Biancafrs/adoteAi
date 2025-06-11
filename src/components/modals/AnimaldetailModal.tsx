import React, { useState } from "react";
import { createPortal } from "react-dom";

import ConfirmModal from "../ui/ConfirmModal";
import { deletarPet } from "../../service/pet.service";
import toast from "react-hot-toast";
import { useCurrentUser } from "../../pages/feed/hooks/useCurrentUser";
import type { Animal } from "../../utils/models/animal.model";
import AdoptionModal from "./AdoptionModal/Adoption";

interface AnimalDetailModalProps {
  animal: Animal;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  animal,
  isOpen,
  onClose,
  onDelete
}) => {
  const [adoptionModalOpen, setAdoptionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser } = useCurrentUser();

  if (!isOpen) return null;

  const getEspecieIcon = (especie: string) => {
    switch (especie.toLowerCase()) {
      case 'cão': return '🐕';
      case 'gato': return '🐱';
      case 'coelho': return '🐰';
      case 'pássaro': return '🐦';
      default: return '🐾';
    }
  };

  const getPorteInfo = (porte: string) => {
    switch (porte) {
      case 'pequeno': return { icon: '🐕', description: 'Até 10kg' };
      case 'médio': return { icon: '🐶', description: '10kg - 25kg' };
      case 'grande': return { icon: '🐕‍🦺', description: 'Acima de 25kg' };
      default: return { icon: '🐾', description: 'Não informado' };
    }
  };

  const porteInfo = getPorteInfo(animal.porte);

  const formatDate = (date?: Date) => {
    if (!date) return 'Não informado';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleAdoptClick = () => {
    setAdoptionModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletarPet(animal.id);
      toast.success(`${animal.nome} foi removido com sucesso! 🐾`);
      if (onDelete) {
        onDelete(animal.id);
      }
      onClose();
    } catch (error: any) {
      console.error('Erro ao deletar animal:', error);
      toast.error(error.message || 'Erro ao deletar animal');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  // Verificar se o usuário atual pode deletar (se for o mesmo que cadastrou)
  const canDelete = currentUser && (
    // Se o animal tem authorId e corresponde ao usuário atual
    (animal as any).authorId === currentUser.id ||
    // Ou se o usuário é admin/tem permissão (você pode ajustar essa lógica)
    currentUser.email?.includes('@admin') // exemplo de verificação de admin
  );

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Coluna da Imagem */}
        <div className="w-2/5 relative">
          {animal.foto ? (
            <img
              src={animal.foto}
              alt={animal.nome}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <span class="text-8xl">${getEspecieIcon(animal.especie)}</span>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <span className="text-8xl">{getEspecieIcon(animal.especie)}</span>
            </div>
          )}

          {/* Badges sobre a imagem */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {animal.vacinado && (
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                💉 Vacinado
              </div>
            )}
            {animal.castrado && (
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                ✂️ Castrado
              </div>
            )}
          </div>

          {/* Badge de Porte */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-semibold text-amber-800 shadow-lg">
            {porteInfo.icon} {animal.porte}
          </div>
        </div>

        {/* Coluna de Informações */}
        <div className="w-3/5 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-amber-800 mb-2">
                  {animal.nome}
                </h2>
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="flex items-center gap-1 text-lg">
                    {getEspecieIcon(animal.especie)}
                    {animal.especie}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-lg">{animal.raca}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Botão de Deletar - apenas se o usuário tiver permissão */}
                {canDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    title="Deletar animal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                {/* Botão de Fechar */}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Fechar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎂</span>
                  <span className="font-semibold text-amber-800">Idade</span>
                </div>
                <p className="text-amber-700 text-lg">
                  {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{porteInfo.icon}</span>
                  <span className="font-semibold text-blue-800">Porte</span>
                </div>
                <p className="text-blue-700 text-lg capitalize">{animal.porte}</p>
                <p className="text-blue-600 text-sm">{porteInfo.description}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📍</span>
                  <span className="font-semibold text-green-800">Localização</span>
                </div>
                <p className="text-green-700">{animal.localizacao}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏠</span>
                  <span className="font-semibold text-purple-800">Abrigo</span>
                </div>
                <p className="text-purple-700">{animal.abrigoNome || 'Não informado'}</p>
              </div>
            </div>

            {/* Descrição */}
            {animal.descricao && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📝</span>
                  Sobre {animal.nome}
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {animal.descricao}
                  </p>
                </div>
              </div>
            )}

            {/* Informações de Saúde */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🏥</span>
                Informações de Saúde
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border-2 ${animal.vacinado ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{animal.vacinado ? '✅' : '❌'}</span>
                    <span className={`font-medium ${animal.vacinado ? 'text-green-800' : 'text-gray-600'
                      }`}>
                      {animal.vacinado ? 'Vacinado' : 'Não vacinado'}
                    </span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border-2 ${animal.castrado ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{animal.castrado ? '✅' : '❌'}</span>
                    <span className={`font-medium ${animal.castrado ? 'text-blue-800' : 'text-gray-600'
                      }`}>
                      {animal.castrado ? 'Castrado' : 'Não castrado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Cadastro */}
            <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
              <p>Cadastrado em: {formatDate(animal.createdAt)}</p>
              {animal.updatedAt && animal.updatedAt !== animal.createdAt && (
                <p>Atualizado em: {formatDate(animal.updatedAt)}</p>
              )}
            </div>
          </div>

          {/* Footer com Botão de Adoção */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleAdoptClick}
              className="w-full bg-[#563838] hover:bg-[#6d4a4a] text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <span className="text-2xl">💝</span>
              Quero Adotar {animal.nome}
            </button>
            <p className="text-center text-sm text-gray-600 mt-2">
              Clique para iniciar o processo de adoção
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Adoção */}
      {adoptionModalOpen && (
        <AdoptionModal
          isOpen={adoptionModalOpen}
          onClose={() => setAdoptionModalOpen(false)}
          publication={{
            id: `animal_${animal.id}`,
            text: `${animal.nome} - ${animal.especie} ${animal.raca}, ${animal.idade} ${animal.idade === 1 ? 'ano' : 'anos'}\n\n${animal.descricao || 'Animal disponível para adoção.'}`,
            authorName: animal.abrigoNome || 'Abrigo',
            authorEmail: 'contato@abrigo.com', // Você pode ajustar isso baseado nos dados do abrigo
            media: animal.foto ? [animal.foto] : undefined,
          }}
        />
      )}

      {/* Modal de Confirmação de Delete */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Deletar ${animal.nome}`}
        description={`Tem certeza que deseja deletar ${animal.nome}? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={isDeleting}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AnimalDetailModal;