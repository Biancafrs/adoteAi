import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ value, onChange, disabled }) => {
  return (
    <textarea
      className="w-full p-6 border-2 border-[#828588] rounded-xl resize-none focus:border-amber-800 focus:outline-none bg-white text-lg leading-relaxed"
      rows={5}
      placeholder="Conte sobre este amiguinho especial... Qual é a personalidade dele? Que cuidados precisa? O que o torna único?"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

export default TextArea;