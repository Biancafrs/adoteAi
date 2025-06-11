import React, { useState, useEffect } from "react";
import Header from "../../components/header/header";

import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import AnimalCard from "../../components/animalsCard";
import AnimalDetailModal from "../../components/modals/AnimalDetailModal";
import PetRegisterModal from "../../components/modals/PetRegisterModal";
import { listarPets, cadastrarPet } from "../../service/pet.service";
import type { Animal } from "../../utils/models/animal.model";

const AnimalsPage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    especie: "",
    porte: "",
    localizacao: "",
    raca: ""
  });

  const loadAnimals = async (filterParams = filters) => {
    try {
      setIsLoading(true);

      // Limpar filtros vazios
      const cleanedFilters = Object.entries(filterParams).reduce((acc, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value.trim();
        }
        return acc;
      }, {} as any);

      console.log('Aplicando filtros:', cleanedFilters);
      const data = await listarPets(cleanedFilters);
      setAnimals(data);
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
      toast.error("Erro ao carregar lista de animais");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    loadAnimals(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      especie: "",
      porte: "",
      localizacao: "",
      raca: ""
    };
    setFilters(clearedFilters);
    loadAnimals(clearedFilters);
  };
  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedAnimal(null);
  };

  const handleRegisterSubmit = async (formData: FormData) => {
    try {
      await cadastrarPet(formData);
      toast.success("Animal cadastrado com sucesso! 🎉");
      setRegisterModalOpen(false);
      loadAnimals(); // Recarregar lista
    } catch (error: any) {
      console.error('Erro ao cadastrar animal:', error);
      toast.error(error.message || "Erro ao cadastrar animal");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <Header />

      <div className="pt-24 pb-8 px-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-4xl">🐾</span>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800">
              Animais para Adoção
            </h1>
          </div>
          <p className="text-xl text-amber-600 font-semibold max-w-3xl mx-auto">
            Encontre seu novo melhor amigo. Cada animal aqui está esperando por uma família cheia de amor.
          </p>
        </div>

        {/* Botão Cadastrar Animal */}
        <div className="max-w-7xl mx-auto mb-8 flex justify-center">
          <button
            onClick={() => setRegisterModalOpen(true)}
            className="bg-[#563838] hover:bg-[#6d4a4a] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>🐾</span>
            Cadastrar Animal
          </button>
        </div>

        {/* Filtros Melhorados */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
              <span>🔍</span>
              Filtros de Busca
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Espécie
                </label>
                <select
                  value={filters.especie}
                  onChange={(e) => handleFilterChange("especie", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                >
                  <option value="">Todas as espécies</option>
                  <option value="Cão">Cão</option>
                  <option value="Gato">Gato</option>
                  <option value="Coelho">Coelho</option>
                  <option value="Pássaro">Pássaro</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porte
                </label>
                <select
                  value={filters.porte}
                  onChange={(e) => handleFilterChange("porte", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                >
                  <option value="">Todos os portes</option>
                  <option value="pequeno">Pequeno</option>
                  <option value="médio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localização
                </label>
                <input
                  type="text"
                  value={filters.localizacao}
                  onChange={(e) => handleFilterChange("localizacao", e.target.value)}
                  placeholder="Digite a cidade..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raça
                </label>
                <input
                  type="text"
                  value={filters.raca}
                  onChange={(e) => handleFilterChange("raca", e.target.value)}
                  placeholder="Digite a raça..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-700"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {Object.values(filters).some(filter => filter !== '') && (
                  <span className="flex items-center gap-2">
                    <span>🔍</span>
                    Filtros ativos: {Object.values(filters).filter(f => f !== '').length}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Limpar
                </button>

                <button
                  onClick={handleApplyFilters}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <span>🔍</span>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Animais */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-amber-600 font-semibold">Carregando animais...</p>
              </div>
            </div>
          ) : animals.length > 0 ? (
            <>
              <div className="mb-6 text-center">
                <p className="text-amber-700 font-medium">
                  {animals.length} {animals.length === 1 ? 'animal encontrado' : 'animais encontrados'}
                  {Object.values(filters).some(filter => filter !== '') && (
                    <span className="text-amber-600 ml-2">
                      (com filtros aplicados)
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {animals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onClick={() => handleAnimalClick(animal)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-4">🐾</div>
              <h3 className="text-2xl font-bold text-amber-800 mb-2">
                {Object.values(filters).some(filter => filter !== '')
                  ? 'Nenhum animal encontrado com estes filtros'
                  : 'Nenhum animal encontrado'
                }
              </h3>
              <p className="text-amber-600 mb-6">
                {Object.values(filters).some(filter => filter !== '')
                  ? 'Tente ajustar os filtros ou limpar a busca'
                  : 'Seja o primeiro a cadastrar um animal'
                }
              </p>
              <div className="flex gap-4 justify-center">
                {Object.values(filters).some(filter => filter !== '') && (
                  <button
                    onClick={handleClearFilters}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="bg-[#563838] hover:bg-[#6d4a4a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cadastrar Animal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {detailModalOpen && selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          isOpen={detailModalOpen}
          onClose={handleCloseDetailModal}
          onDelete={(id) => {
            setAnimals(prev => prev.filter(animal => animal.id !== id));
            setDetailModalOpen(false);
            setSelectedAnimal(null);
          }}
        />
      )}

      {registerModalOpen && createPortal(
        <PetRegisterModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          onSubmit={handleRegisterSubmit}
        />,
        document.body
      )}
    </div>
  );
};

export default AnimalsPage;