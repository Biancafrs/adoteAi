import React, { useState } from "react";
import { createPortal } from "react-dom";
import PetRegisterModal from "../../modals/PetRegisterModal";
import { cadastrarPet } from "../../../service/pet.service";
import toast from "react-hot-toast";

const CreatePrompt: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await cadastrarPet(formData);
      toast.success("Pet cadastrado com sucesso! 🎉");
      console.log('Pet cadastrado:', result);
      handleClose();
    } catch (error: any) {
      console.error('Erro ao cadastrar pet:', error);
      toast.error(error.message || "Erro ao cadastrar pet. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#563838] text-white rounded-2xl shadow-lg p-6 min-h-[150px]">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="/src/assets/DOG2.avif"
          alt="Logo"
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">
            Tem um animal precisando de um lar?
          </h3>
          <p className="text-amber-100 text-sm hover:cursor-pointer mt-1">
            Cadastre-o aqui e ajude a encontrar uma família!
          </p>
        </div>
      </div>

      <button
        className="bg-white text-amber-800 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors w-full flex items-center justify-center gap-2"
        onClick={handleOpen}
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
            Cadastrando...
          </>
        ) : (
          <>
            <span>🐾</span>
            Cadastrar Pet
          </>
        )}
      </button>

      {/* Modal renderizado via Portal no body */}
      {modalOpen && createPortal(
        <PetRegisterModal
          isOpen={modalOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />,
        document.body
      )}
    </div>
  );
};

export default CreatePrompt;
