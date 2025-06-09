import React, { useState } from "react";

export type Porte = "pequeno" | "médio" | "grande";

interface PetRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const initialState = {
  nome: "",
  especie: "",
  raca: "",
  idade: "",
  porte: "pequeno",
  localizacao: "",
  abrigoId: "",
  descricao: "",
};

const PetRegisterModal: React.FC<PetRegisterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Resetar formulário ao abrir/fechar
  React.useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.especie.trim()) newErrors.especie = "Espécie é obrigatória";
    if (!form.raca.trim()) newErrors.raca = "Raça é obrigatória";
    if (!form.localizacao.trim())
      newErrors.localizacao = "Localização é obrigatória";
    if (!form.abrigoId.trim())
      newErrors.abrigoId = "ID do Abrigo é obrigatório";
    const idade = Number(form.idade);
    if (isNaN(idade) || idade <= 0)
      newErrors.idade = "Idade deve ser um número positivo";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ ...form, idade: Number(form.idade) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          aria-label="Fechar modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-amber-700 text-center">
          Cadastrar Pet
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome"
                className={`w-full text-black border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.nome ? "border-red-500" : ""
                }`}
                required
              />
              {errors.nome && (
                <span className="text-red-500 text-xs">{errors.nome}</span>
              )}
            </div>
            <div>
              <input
                name="especie"
                value={form.especie}
                onChange={handleChange}
                placeholder="Espécie"
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.especie ? "border-red-500" : ""
                }`}
                required
              />
              {errors.especie && (
                <span className="text-red-500 text-xs">{errors.especie}</span>
              )}
            </div>
            <div>
              <input
                name="raca"
                value={form.raca}
                onChange={handleChange}
                placeholder="Raça"
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.raca ? "border-red-500" : ""
                }`}
                required
              />
              {errors.raca && (
                <span className="text-red-500 text-xs">{errors.raca}</span>
              )}
            </div>
            <div>
              <input
                name="idade"
                value={form.idade}
                onChange={handleChange}
                placeholder="Idade"
                type="number"
                min={1}
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.idade ? "border-red-500" : ""
                }`}
                required
              />
              {errors.idade && (
                <span className="text-red-500 text-xs">{errors.idade}</span>
              )}
            </div>
            <div>
              <select
                name="porte"
                value={form.porte}
                onChange={handleChange}
                className="w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="pequeno">Pequeno</option>
                <option value="médio">Médio</option>
                <option value="grande">Grande</option>
              </select>
            </div>
            <div>
              <input
                name="localizacao"
                value={form.localizacao}
                onChange={handleChange}
                placeholder="Localização"
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.localizacao ? "border-red-500" : ""
                }`}
                required
              />
              {errors.localizacao && (
                <span className="text-red-500 text-xs">
                  {errors.localizacao}
                </span>
              )}
            </div>
            <div className="md:col-span-2">
              <input
                name="abrigoId"
                value={form.abrigoId}
                onChange={handleChange}
                placeholder="ID do Abrigo"
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  errors.abrigoId ? "border-red-500" : ""
                }`}
                required
              />
              {errors.abrigoId && (
                <span className="text-red-500 text-xs">{errors.abrigoId}</span>
              )}
            </div>
            <div className="md:col-span-2">
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descrição (opcional)"
                className="w-full border rounded-lg p-3  text-black focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-amber-700 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-amber-800 transition-colors mt-2 shadow-md"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PetRegisterModal;
