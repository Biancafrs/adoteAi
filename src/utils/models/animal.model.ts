export interface Animal {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  porte: 'pequeno' | 'médio' | 'grande';
  localizacao: string;
  abrigoId: string;
  abrigoNome?: string;
  descricao?: string;
  foto?: string;
  vacinado?: boolean;
  castrado?: boolean;
  authorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}