import { Link } from "react-router-dom";

const Cadastro = () => {
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

        <form className="w-full max-w-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Digite seu nome..."
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Sobrenome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Digite seu nome..."
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
              id="email"
              name="tel"
              placeholder="Digite seu telefone..."
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-white "
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium "
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Digite sua senha..."
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium "
            >
              Confirme sua senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Digite sua senha novamente..."
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
            />
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
          src="./src/assets/img-login.svg"
          alt="Imagem de cadastro"
          className="h-full w-full p-5 rounded-lg"
        />
      </div>
    </div>
  );
};

export default Cadastro;
