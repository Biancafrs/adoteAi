import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import Header from "../../components/header/header";
import { toast } from "react-hot-toast";
import ProfilePhotoUpload from "../../components/profile/profilePhoto";

type FormFields = {
  nome: string;
  sobrenome: string;
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
  const [formData, setFormData] = useState<FormFields>({
    nome: "",
    sobrenome: "",
    nascimento: "",
    genero: "",
    estado: "",
    cep: "",
    cidade: "",
    bairro: "",
    telefone: "",
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  const fields: { label: string; key: keyof FormFields }[] = [
    { label: "Nome", key: "nome" },
    { label: "Sobrenome", key: "sobrenome" },
    { label: "Data de nascimento", key: "nascimento" },
    { label: "Gênero", key: "genero" },
    { label: "Estado", key: "estado" },
    { label: "CEP", key: "cep" },
    { label: "Cidade", key: "cidade" },
    { label: "Bairro", key: "bairro" },
    { label: "Telefone", key: "telefone" },
  ];

  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);

    if (!t) {
      toast.error("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/auth/me", {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFormData((prev) => ({
            ...prev,
            ...data.user,
          }));
          // IMPORTANTE: Definir a foto de perfil separadamente
          if (data.user.profilePhoto) {
            setProfilePhoto(data.user.profilePhoto);
          }
        }
      })
      .catch(() => {
        toast.error("Erro ao carregar dados do perfil.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof FormFields, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }
      toast.success("Perfil atualizado com sucesso!");
      setEditIndex(null);
    } catch {
      toast.error("Erro ao atualizar perfil.");
    }
  };

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    setProfilePhoto(newPhotoUrl);

    setFormData(prev => ({
      ...prev,
      profilePhoto: newPhotoUrl
    }));

    toast.success('Foto de perfil atualizada!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f2]">
        <Header />
        <div className="max-w-2xl w-full bg-white border border-gray-300 rounded-lg p-8 shadow-md">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-6 mx-auto w-48"></div>

          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-1 border-gray-300">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 h-10 bg-gray-200 rounded-lg animate-pulse w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex flex-col items-center justify-center p-6 pt-20 ">
      <Header />
      <div className="absolute top-20 left-50 pt-20">
        <a
          href="/publicacoes"
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
          <ProfilePhotoUpload
            currentPhoto={profilePhoto}
            onPhotoUpdate={handlePhotoUpdate}
          />
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
                    value={formData[info.key] ?? ""}
                    onChange={(e) => handleChange(info.key, e.target.value)}
                    onBlur={() => setEditIndex(null)}
                    autoFocus
                  />
                ) : (
                  <span
                    className={formData[info.key] ? "" : "text-gray-400 italic"}
                  >
                    {formData[info.key] || "Não preenchido"}
                  </span>
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

        <button
          className="mt-8 w-full bg-[#4b2d2d] text-white font-bold py-2 rounded-lg shadow-md hover:bg-[#5c3a3a]"
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default InformacoesPessoais;
