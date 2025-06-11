import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";

export type Porte = "pequeno" | "médio" | "grande";

interface PetRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Lista de ONGs/Abrigos pré-definidas
const ABRIGOS_DISPONIVEIS = [
  { id: "abrigo_001", nome: "Abrigo São Francisco" },
  { id: "abrigo_002", nome: "Casa dos Anjos" },
  { id: "abrigo_003", nome: "ONG Patinhas Carentes" },
  { id: "abrigo_004", nome: "Lar dos Bichinhos" },
  { id: "abrigo_005", nome: "Amigos de Patas" },
];

const initialState = {
  nome: "",
  especie: "",
  raca: "",
  idade: "",
  porte: "pequeno" as Porte,
  localizacao: "",
  abrigoId: "",
  abrigoNome: "",
  tipoAbrigo: "selecionar", // 'selecionar' ou 'personalizado'
  descricao: "",
  vacinado: false,
  castrado: false,
};

const PetRegisterModal: React.FC<PetRegisterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resetar formulário ao abrir/fechar
  React.useEffect(() => {
    if (isOpen) {
      setForm(initialState);
      setErrors({});
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  // Controlar overflow do body
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.especie.trim()) newErrors.especie = "Espécie é obrigatória";
    if (!form.raca.trim()) newErrors.raca = "Raça é obrigatória";
    if (!form.localizacao.trim()) newErrors.localizacao = "Localização é obrigatória";

    // Validação do abrigo
    if (form.tipoAbrigo === "selecionar" && !form.abrigoId) {
      newErrors.abrigo = "Selecione um abrigo";
    } else if (form.tipoAbrigo === "personalizado" && !form.abrigoNome.trim()) {
      newErrors.abrigo = "Nome do abrigo é obrigatório";
    }

    const idade = Number(form.idade);
    if (isNaN(idade) || idade <= 0) {
      newErrors.idade = "Idade deve ser um número positivo";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });

    // Limpar campos quando mudar o tipo de abrigo
    if (name === "tipoAbrigo") {
      setForm({ ...form, tipoAbrigo: value, abrigoId: "", abrigoNome: "" });
      setErrors({ ...errors, abrigo: "" });
    }

    // Atualizar abrigoNome quando selecionar abrigo pré-definido
    if (name === "abrigoId") {
      const abrigoSelecionado = ABRIGOS_DISPONIVEIS.find(a => a.id === value);
      setForm({
        ...form,
        abrigoId: value,
        abrigoNome: abrigoSelecionado?.nome || ""
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas arquivos de imagem são permitidos');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Arquivo muito grande. Máximo 5MB');
      return;
    }

    setSelectedFile(file);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsUploading(true);

    try {
      // Preparar dados do formulário
      const formData = new FormData();

      // Dados do animal
      formData.append('nome', form.nome);
      formData.append('especie', form.especie);
      formData.append('raca', form.raca);
      formData.append('idade', String(parseInt(form.idade)));
      formData.append('porte', form.porte);
      formData.append('localizacao', form.localizacao);
      formData.append('descricao', form.descricao);

      formData.append('vacinado', form.vacinado ? 'true' : 'false');
      formData.append('castrado', form.castrado ? 'true' : 'false');

      // Abrigo
      if (form.tipoAbrigo === "selecionar") {
        formData.append('abrigoId', form.abrigoId);
        formData.append('abrigoNome', form.abrigoNome);
      } else {
        // Para abrigo personalizado, gerar um ID único
        const customAbrigoId = `custom_${Date.now()}`;
        formData.append('abrigoId', customAbrigoId);
        formData.append('abrigoNome', form.abrigoNome);
      }

      // Foto
      if (selectedFile) {
        formData.append('foto', selectedFile);
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao cadastrar pet:', error);
      toast.error('Erro ao cadastrar pet');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', zIndex: 1000000 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          style={{ zIndex: 1000001 }}
          aria-label="Fechar modal"
        >
          &times;
        </button>

        <h2 className="text-3xl font-extrabold mb-6 text-amber-700 text-center">
          Cadastrar Pet para Adoção
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload de Foto */}
          <div className="text-center">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foto do Pet
            </label>
            <div className="flex flex-col items-center">
              <div
                onClick={triggerFileSelect}
                className="w-32 h-32 border-2 border-dashed border-amber-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500 transition-colors bg-amber-50"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl text-amber-600">📷</span>
                    <p className="text-sm text-amber-600 mt-1">Clique para adicionar foto</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG ou GIF (máx. 5MB)
              </p>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome do Pet *
              </label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Buddy, Luna..."
                className={`w-full text-black border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.nome ? "border-red-500" : "border-gray-300"
                  }`}
                required
              />
              {errors.nome && (
                <span className="text-red-500 text-xs">{errors.nome}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Espécie *
              </label>
              <select
                name="especie"
                value={form.especie}
                onChange={handleChange}
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.especie ? "border-red-500" : "border-gray-300"
                  }`}
                required
              >
                <option value="">Selecione...</option>
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Coelho">Coelho</option>
                <option value="Pássaro">Pássaro</option>
                <option value="Outro">Outro</option>
              </select>
              {errors.especie && (
                <span className="text-red-500 text-xs">{errors.especie}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Raça *
              </label>
              <input
                name="raca"
                value={form.raca}
                onChange={handleChange}
                placeholder="Ex: Labrador, SRD..."
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.raca ? "border-red-500" : "border-gray-300"
                  }`}
                required
              />
              {errors.raca && (
                <span className="text-red-500 text-xs">{errors.raca}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Idade (anos) *
              </label>
              <input
                name="idade"
                value={form.idade}
                onChange={handleChange}
                placeholder="Ex: 2"
                type="number"
                min={0}
                step={0.5}
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.idade ? "border-red-500" : "border-gray-300"
                  }`}
                required
              />
              {errors.idade && (
                <span className="text-red-500 text-xs">{errors.idade}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Porte *
              </label>
              <select
                name="porte"
                value={form.porte}
                onChange={handleChange}
                className="w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 border-gray-300"
              >
                <option value="pequeno">Pequeno</option>
                <option value="médio">Médio</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Localização *
              </label>
              <input
                name="localizacao"
                value={form.localizacao}
                onChange={handleChange}
                placeholder="Cidade, Estado"
                className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.localizacao ? "border-red-500" : "border-gray-300"
                  }`}
                required
              />
              {errors.localizacao && (
                <span className="text-red-500 text-xs">{errors.localizacao}</span>
              )}
            </div>
          </div>

          {/* Informações do Abrigo */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">
              Informações do Abrigo/ONG
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Como deseja informar o abrigo? *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tipoAbrigo"
                      value="selecionar"
                      checked={form.tipoAbrigo === "selecionar"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Selecionar da lista</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tipoAbrigo"
                      value="personalizado"
                      checked={form.tipoAbrigo === "personalizado"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Inserir nome personalizado</span>
                  </label>
                </div>
              </div>

              {form.tipoAbrigo === "selecionar" ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Selecione o Abrigo/ONG *
                  </label>
                  <select
                    name="abrigoId"
                    value={form.abrigoId}
                    onChange={handleChange}
                    className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.abrigo ? "border-red-500" : "border-gray-300"
                      }`}
                    required
                  >
                    <option value="">Selecione um abrigo...</option>
                    {ABRIGOS_DISPONIVEIS.map((abrigo) => (
                      <option key={abrigo.id} value={abrigo.id}>
                        {abrigo.nome}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nome do Abrigo/ONG *
                  </label>
                  <input
                    name="abrigoNome"
                    value={form.abrigoNome}
                    onChange={handleChange}
                    placeholder="Digite o nome do abrigo ou ONG"
                    className={`w-full border text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.abrigo ? "border-red-500" : "border-gray-300"
                      }`}
                    required
                  />
                </div>
              )}

              {errors.abrigo && (
                <span className="text-red-500 text-xs">{errors.abrigo}</span>
              )}
            </div>
          </div>

          {/* Informações de Saúde */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Informações de Saúde
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="vacinado"
                  checked={form.vacinado}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Vacinado</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="castrado"
                  checked={form.castrado}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Castrado</span>
              </label>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Conte mais sobre a personalidade, comportamento e necessidades especiais do pet..."
              className="w-full border rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none border-gray-300"
              rows={4}
            />
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={isUploading}
            className="bg-amber-700 text-white px-6 py-3 rounded-lg w-full font-semibold hover:bg-amber-800 transition-colors mt-4 shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Cadastrando...
              </>
            ) : (
              <>
                <span>🐾</span>
                Cadastrar Pet
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PetRegisterModal;
