export interface Publicacoes {
  id: string;
  text: string;
  media: string[];
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorProfilePhoto?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  likes: number;
  comments: number;
  likedBy: string[];
}

export interface Comentarios {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorProfilePhoto?: string;
  publicationId: string;
  createdAt: string;
}