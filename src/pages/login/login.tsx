import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "../../firebase";

function Login() {
  const images = [
    "src/assets/img-login.svg",
    "src/assets/cachorro1.png",
    "src/assets/cachorro2.png",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth(firebaseApp);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem("token", idToken);
      navigate("/publicacoes");
    } catch (error) {
      alert("Erro ao fazer login");
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f1e9]">
      <div className="w-1/2 bg-center bg-cover bg-no-repeat flex items-center justify-center p-5 rounded-lg">
        <img
          src={images[currentImageIndex]}
          alt="Imagem de login"
          className="h-full w-full object-contain transition duration-500 ease-in-out rounded-lg"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-[#f6f1e9]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img className="h-10 w-10" src="src/assets/logo.svg" alt="Logo" />
            <h1 className="text-4xl font-bold text-gray-800">MeAdote</h1>
          </div>
          <p className="text-sm text-gray-600">
            A adoção transforma vidas – a deles e a sua!
          </p>
        </div>

        <h2 className="text-3xl font-bold text-[#563838] mb-6">
          Faça seu login
        </h2>

        <form
          className="w-full max-w-lg mt-10 space-y-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 mt-5 border border-gray-300 rounded-md bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-right text-sm text-gray-500 hover:underline cursor-pointer">
            Esqueceu sua senha ?
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full p-3 bg-[#5C3A32] text-white rounded-md"
            >
              Login
            </button>
          </div>
          <Link to="/register">
            <button
              type="button"
              className="w-full p-3 border border-gray-300 rounded-md hover:border-[#5C3A32] hover:cursor-pointer hover:text-gray-30 transition duration-300"
            >
              Cadastre-se
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
