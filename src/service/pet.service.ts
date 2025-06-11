import { apiService } from "./api.service";

export async function cadastrarPet(formData: FormData) {
  const token = localStorage.getItem('token');

  console.log('=== DADOS DO FORMDATA ===');
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  const response = await fetch("http://localhost:3000/animais", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Não incluir Content-Type para FormData, o browser define automaticamente
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Erro na resposta:', errorData);
    throw new Error(errorData.message || 'Erro ao cadastrar pet');
  }

  return response.json();
}

export async function listarPets(filtros?: any) {
  const queryParams = new URLSearchParams();

  if (filtros) {
    Object.entries(filtros).forEach(([key, value]) => {
      if (value && String(value).trim() !== '') {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `http://localhost:3000/animais${queryParams.toString() ? `?${queryParams}` : ''}`;

  console.log('Buscando animais com URL:', url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Erro ao buscar pets');
  }

  return response.json();
}

export async function buscarPetPorId(id: string) {
  const response = await fetch(`http://localhost:3000/animais/${id}`);

  if (!response.ok) {
    throw new Error('Pet não encontrado');
  }

  return response.json();
}

export async function deletarPet(id: string) {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:3000/animais/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Erro na resposta:', errorData);
    throw new Error(errorData.message || 'Erro ao deletar pet');
  }

  return true;
}