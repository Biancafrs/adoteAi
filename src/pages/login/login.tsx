// src/pages/Login.jsx
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex h-screen  bg-[#f6f1e9]">
      <div className="w-1/2 bg-center bg-cover bg-no-repeat flex items-center justify-center">
        <img
          src="./src/assets/img-login.svg"
          alt="Imagem de login"
          className=" h-full w-full p-5 "
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-[#f6f1e9]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img className="h-10 w-10" src="src/assets/logo.svg" alt="" />
            <h1 className="text-4xl font-bold text-gray-800">Adote-Ai</h1>
          </div>
          <p className="text-sm text-gray-600">
            A adoção transforma vidas – a deles e a sua!
          </p>
        </div>

        <h2 className="text-3xl font-bold text-[#563838]  mb-6">
          Faça seu login
        </h2>

        <form className="w-full max-w-lg mt-10 space-y-4 ">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md bg-white"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 mt-5 border border-gray-300 rounded-md  bg-white"
          />
          <div className="text-right text-sm text-gray-500 hover:underline cursor-pointer">
            Esqueceu sua senha ?
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-[#5C3A32] text-white rounded-md"
          >
            Login
          </button>
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
