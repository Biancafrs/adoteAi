import React, { useState } from "react";

const SegurancaSenha = () => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (novaSenha.length < 8) {
      setErro("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("A nova senha e a confirmação não coincidem.");
      return;
    }

    // Aqui você pode prosseguir com a lógica de envio (API, etc.)
    alert("Senha alterada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] flex flex-col items-center justify-center p-6">
      <div className="absolute top-20 left-10">
        <a
          href="/"
          className="bg-[#4b2d2d] text-white px-4 py-2 rounded-lg shadow-md font-bold hover:bg-[#3a2323]"
        >
          Voltar
        </a>
      </div>

      <h1 className="text-2xl font-bold text-center text-[#4b2d2d] mb-6">
        Segurança e privacidade
      </h1>

      <div className="max-w-2xl w-full bg-white border border-gray-300 rounded-lg p-8 shadow-md text-center">
        <p className="text-gray-800 text-sm mb-4">
          Para alterar sua senha, é necessário verificar a atual primeiro. Em
          seguida, crie uma senha que não seja fácil de adivinhar,
          preferencialmente combinando letras maiúsculas e minúsculas, números e
          caracteres especiais.
        </p>
        <p className="text-gray-800 text-sm mb-6">
          Certifique-se de que a nova senha tenha pelo menos 8 caracteres e seja
          única, evitando reutilizar senhas antigas. Após a criação, confirme a
          nova senha e salve-a em um local seguro para futuras referências.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <label htmlFor="senhaAtual" className="mb-1 text-sm text-gray-700">
              Digite sua senha atual:
            </label>
            <input
              type="password"
              id="senhaAtual"
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="novaSenha" className="mb-1 text-sm text-gray-700">
              Digite uma nova senha:
            </label>
            <input
              type="password"
              id="novaSenha"
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center">
            <label
              htmlFor="confirmarSenha"
              className="mb-1 text-sm text-gray-700"
            >
              Confirma sua nova senha:
            </label>
            <input
              type="password"
              id="confirmarSenha"
              className="border border-gray-300 rounded px-3 py-1 text-sm"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {erro && <p className="text-red-600 text-sm mt-2">{erro}</p>}

          <button
            type="submit"
            className="mt-4 bg-[#4b2d2d] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[#5c3a3a]"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SegurancaSenha;
