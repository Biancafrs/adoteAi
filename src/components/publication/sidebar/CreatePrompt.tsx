import React, { useState } from "react";
import PetRegisterModal from "../../modals/PetRegisterModal";
import { cadastrarPet } from "../../../service/pet.service";
import toast from "react-hot-toast";

const CreatePrompt: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await cadastrarPet(data);
      toast.success("PET CADASTRADO COM SUCESSO 🎉");
      handleClose();
    } catch (e) {
      toast.error(
        "Erro ao cadastrar pet. Verifique os dados e tente novamente."
      );
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
            Cadastre-o aqui!
          </p>
        </div>
      </div>

      <button
        className="bg-white text-amber-800 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors w-full"
        onClick={handleOpen}
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar Pet"}
      </button>

      <PetRegisterModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreatePrompt;
