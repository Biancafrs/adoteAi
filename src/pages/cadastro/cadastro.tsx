import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-hot-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "../../firebase";

Modal.setAppElement("#root");

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "./src/assets/img-login.svg",
    "./src/assets/cachorro1.png",
    "./src/assets/cachorro2.png",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      value = value.replace(/(\d*)/, "($1");
    }

    setFormData((prev) => ({ ...prev, tel: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      const auth = getAuth(firebaseApp);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem("token", idToken);

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          telefone: formData.tel,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar usuário no backend");
      }

      const userData = await response.json();

      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/", { state: { registeredUser: userData } });
    } catch (error) {
      toast.error("Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f1e9]">
      <div className="w-1/2 flex flex-col justify-center items-center px-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Criar uma conta
        </h1>
        <p className="text-sm text-gray-700 mb-6">
          Você já possui uma conta?{" "}
          <Link to="/" className="underline text-[#5C3A32]">
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block mb-1 text-sm font-medium">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Digite seu nome..."
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label
                htmlFor="sobrenome"
                className="block mb-1 text-sm font-medium"
              >
                Sobrenome
              </label>
              <input
                type="text"
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                required
                placeholder="Digite seu sobrenome..."
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium ">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email..."
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white "
            />
          </div>

          <div>
            <label htmlFor="tel" className="block mb-1 text-sm font-medium ">
              Telefone
            </label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handlePhoneChange}
              placeholder="(11) 91234-5678"
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium"
            >
              Senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua senha..."
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-medium"
            >
              Confirme sua senha
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Digite sua senha novamente..."
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm">
              Mostrar senhas
            </label>
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-3 bg-[#5C3A32] text-white rounded-md"
          >
            Cadastrar
          </button>
        </form>
      </div>

      <div className="w-1/2 bg-center bg-cover bg-no-repeat flex items-center justify-center">
        <img
          src={images[currentImageIndex]}
          alt="Imagem de cadastro"
          className="h-full w-full p-5 rounded-lg object-contain transition duration-500 ease-in-out"
        />
      </div>
    </div>
  );
};

export default Cadastro;
