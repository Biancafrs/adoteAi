import { apiService } from "./api.service";

export async function cadastrarPet(data: any) {
  // Ajuste a rota conforme seu backend
  const response = await fetch("http://localhost:3000/animais", {
    method: "POST",
    headers: apiService["getAuthHeaders"](),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao cadastrar pet");
  return response.json();
}
