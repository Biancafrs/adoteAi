import React from 'react';

const ImportantTip: React.FC = () => {
  return (
    <div className="bg-[#F0F8FF] border-l-4 border-[#563838] p-4 rounded-lg min-h-[100px]">
      <div className="flex items-start gap-3">
        <span className="text-amber-500 text-xl flex-shrink-0">💡</span>
        <div className="flex-1">
          <h4 className="font-bold text-amber-800 mb-2 text-base">Dica importante</h4>
          <p className="text-sm leading-relaxed text-gray-700">
            Antes de adotar, certifique-se de ter tempo, espaço e recursos
            para cuidar do animal. A adoção é um compromisso para toda a
            vida!
          </p>
          <div className="mt-2 p-2 bg-amber-50 rounded-md">
            <p className="text-xs text-amber-700 font-medium">
              💝 Lembre-se: amor e responsabilidade caminham juntos!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantTip;