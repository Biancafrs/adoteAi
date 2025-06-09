import type { Publicacoes } from "../utils/models/publicacao.model";

const API_BASE_URL = 'http://localhost:3000';

export interface CommentData {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorProfilePhoto?: string;
  createdAt: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Likes
  async toggleLike(publicationId: string): Promise<Publicacoes> {
    const response = await fetch(`${API_BASE_URL}/publications/${publicationId}/like`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao curtir publicação');
    }

    return response.json();
  }

  // Comentários
  async addComment(publicationId: string, text: string): Promise<Publicacoes> {
    const response = await fetch(`${API_BASE_URL}/publications/${publicationId}/comment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Erro ao comentar');
    }

    return response.json();
  }

  async getComments(publicationId: string): Promise<CommentData[]> {
    const response = await fetch(`${API_BASE_URL}/publications/${publicationId}/comments`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar comentários');
    }

    return response.json();
  }

  async deleteComment(publicationId: string, commentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/publications/${publicationId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir comentário');
    }
  }

  // Publicações
  async deletePublication(publicationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/publications/${publicationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir publicação');
    }
  }

  // Upload de foto de perfil
  async uploadProfilePhoto(file: File): Promise<{ profilePhoto: string; user: any }> {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/profile-photo`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer upload da foto');
    }

    return response.json();
  }

  // Dados do usuário
  async getCurrentUser(): Promise<{ user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    return response.json();
  }

  async updateUser(userData: any): Promise<{ user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar usuário');
    }

    return response.json();
  }
}

export const apiService = new ApiService();