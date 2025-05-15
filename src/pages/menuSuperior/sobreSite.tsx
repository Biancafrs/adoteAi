import Header from "../../components/header/header";

const SobreSite = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f2] pt-20">
      <Header />
      <div className="container mx-auto px-4 py-6 relative">
        <div className="mb-4">
          <a
            href="/"
            className="inline-block bg-[#4b2d2d] text-white px-4 py-2 rounded-lg shadow-md font-bold hover:bg-[#3a2323]"
          >
            Voltar
          </a>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg p-8 shadow-md">
          <h1 className="text-2xl font-bold text-center text-[#4b2d2d] mb-4">
            Sobre nosso site
          </h1>
          <p className="text-gray-800 text-justify mb-6">
            O Adote-aí é um site dedicado à adoção de animais, conectando pessoas
            interessadas em adotar pets com organizações e abrigos que abrigam
            animais disponíveis para adoção. A plataforma oferece informações
            detalhadas sobre cada animal, incluindo fotos, descrições e dados
            sobre suas necessidades específicas, facilitando o processo de adoção
            para os usuários. O objetivo principal do site é promover a adoção
            responsável e aumentar a visibilidade dos animais que aguardam por um
            lar acolhedor.
          </p>

          <div className="flex justify-center gap-6 mb-6">
            <img
              src="src/assets/dog1.png"
              alt="Cachorro 1"
              className="w-32 h-32 object-cover rounded-full border-4 border-[#fdf8f2] shadow-md"
            />
            <img
              src="src/assets/dog2.png"
              alt="Cachorro 2"
              className="w-32 h-32 object-cover rounded-full border-4 border-[#fdf8f2] shadow-md"
            />
            <img
              src="src/assets/dog3.png"
              alt="Cachorro 3"
              className="w-32 h-32 object-cover rounded-full border-4 border-[#fdf8f2] shadow-md"
            />
          </div>

          <div className="text-sm text-gray-900">
            <p>
              <strong>Desenvolvido por:</strong> João Pedro Carvalho Diniz, Daniel
              Junior Dias Avelino, Wanderson Batista da Silva, Andralyssa
              Rodrigues Pereira, Vitória Machado Silva, Lucas Borges de Souza,
              Lucas Xavier Diniz Ribeiro, Bianca Ferreira Siqueira, Gabriel
              Henrique de Oliveira Campos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreSite;