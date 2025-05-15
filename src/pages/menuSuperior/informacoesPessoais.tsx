import { useState } from "react";
import { Pencil } from "lucide-react";
import Header from "../../components/header/header";

type FormFields = {
  nome: string;
  nascimento: string;
  genero: string;
  estado: string;
  cep: string;
  cidade: string;
  bairro: string;
  telefone: string;
};

const InformacoesPessoais = () => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "Guilherme Pereira Maciel",
    nascimento: "13/11/2000",
    genero: "Masculino",
    estado: "Minas Gerais",
    cep: "37504-588",
    cidade: "Itajubá",
    bairro: "Piedade",
    telefone: "(35)998251994",
  });

  const fields: { label: string; key: keyof FormFields }[] = [
    { label: "Nome", key: "nome" },
    { label: "Data de nascimento", key: "nascimento" },
    { label: "Gênero", key: "genero" },
    { label: "Estado", key: "estado" },
    { label: "CEP", key: "cep" },
    { label: "Cidade", key: "cidade" },
    { label: "Bairro", key: "bairro" },
    { label: "Telefone", key: "telefone" },
  ];

  const handleChange = (key: keyof FormFields, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex flex-col items-center justify-center p-6 pt-20 ">
      <Header />
      <div className="absolute top-20 left-50 pt-20">
        <a
          href="/"
          className="bg-[#4b2d2d] text-white px-4 py-2 rounded-lg shadow-md font-bold hover:bg-[#3a2323]"
        >
          Voltar
        </a>
      </div>
      <div className="max-w-2xl w-full bg-white border border-gray-300 rounded-lg p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#4b2d2d] mb-6">
          Informações pessoais
        </h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full border border-[#4b2d2d] bg-gray-100 flex items-center justify-center">
            { }
          </div>
          <span className="text-sm text-gray-700 mt-2">
            Edite sua foto de perfil
          </span>
        </div>

        <div className="space-y-4">
          {fields.map((info, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-1 border-gray-300"
            >
              <span className="font-semibold text-gray-800">{info.label}:</span>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                {editIndex === index ? (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={formData[info.key]}
                    onChange={(e) => handleChange(info.key, e.target.value)}
                  />
                ) : (
                  <span>{formData[info.key]}</span>
                )}
                <Pencil
                  size={16}
                  className="text-[#4b2d2d] cursor-pointer"
                  onClick={() => setEditIndex(index)}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="mt-8 w-full bg-[#4b2d2d] text-white font-bold py-2 rounded-lg shadow-md hover:bg-[#5c3a3a]">
          Salvar
        </button>
      </div>
    </div>
  );
};

export default InformacoesPessoais;
