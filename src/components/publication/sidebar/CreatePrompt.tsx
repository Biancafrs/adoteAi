import React from 'react';

const CreatePrompt: React.FC = () => {
  return (
    <div className="bg-[#563838] text-white rounded-2xl shadow-lg p-4 min-h-[120px]">
      <div className="flex items-center gap-3 mb-3">
        <img
          src="/src/assets/DOG2.avif"
          alt="Logo"
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="font-bold text-base leading-tight">Tem animal precisando de um lar?</h3>
          <p className="text-amber-100 text-sm hover:cursor-pointer">Cadastre aqui</p>
        </div>
      </div>
      <button className="bg-white text-amber-800 px-4 py-2 rounded-lg font-semibold hover:bg-amber-50 transition-colors w-full hover:cursor-pointer">
        Cadastrar
      </button>
    </div>
  );
};

export default CreatePrompt;