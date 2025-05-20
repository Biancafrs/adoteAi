import Header from "../../components/header/header";

function publicacoes() {
  return (
    <div>
      <Header />
      <div className="mt-24 w-full h-screen flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#563838]">
          Publicações de adoção
        </h1>
      </div>
      <div className="border-1  w-full flex itens-center justify-center mt-10">
        <div className="w-1/2 flex flex-col justify-center items-center px-10"></div>
      </div>
    </div>
  );
}

export default publicacoes;
