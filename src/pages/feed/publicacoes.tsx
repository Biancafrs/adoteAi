import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header';
import { toast } from 'react-hot-toast';

import {
  Card, CardContent, CardActions, TextField, Button, Box,
  Typography, IconButton, Paper, Alert, Divider, CircularProgress
} from '@mui/material';
import { Image, Close } from '@mui/icons-material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

interface Publication {
  id: string;
  text: string;
  media: string[];
  authorName: string;
  authorEmail: string;
  createdAt: string;
  likes?: number;
  comments?: number;
}

const Publicacoes: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const [publications, setPublications] = useState<Publication[]>([]);

  // Carregar publicações (primeiro tenta da API, depois localStorage)
  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setIsLoadingPosts(true);

      // Primeiro tenta carregar da API
      const response = await fetch('http://localhost:3000/publications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        setPublications(Array.isArray(data) ? data : []);
      } else {
        throw new Error('API não disponível');
      }
    } catch (error) {
      console.warn('Erro ao carregar da API, carregando do localStorage:', error);

      // Fallback para localStorage
      try {
        const stored = localStorage.getItem('adoption_posts');
        if (stored) {
          const localData = JSON.parse(stored);
          // Converter formato local para formato da API
          const convertedData = localData.map((pub: any) => ({
            id: pub.id.toString(),
            text: pub.text,
            media: pub.media || [],
            authorName: 'Usuário Local',
            authorEmail: 'local@example.com',
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
          }));
          setPublications(convertedData);
        } else {
          setPublications([]);
        }
      } catch (localError) {
        console.error('Erro ao carregar do localStorage:', localError);
        setPublications([]);
      }
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const valid = files.filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );

    if (valid.length !== files.length) {
      toast.error('Apenas arquivos de imagem e vídeo são permitidos');
      return;
    }

    if (selectedFiles.length + valid.length > 5) {
      toast.error('Máximo de 5 arquivos permitidos');
      return;
    }

    setSelectedFiles(prev => [...prev, ...valid]);
    setPreviewUrls(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handlePublish = async () => {




    // Validação
    if (!postText.trim() && selectedFiles.length === 0) {

      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const token = localStorage.getItem('token');


    if (!token) {

      toast.error('Usuário não autenticado. Salvando apenas localmente.');
      // Continuar com fallback local mesmo sem token
    }

    setIsLoading(true);

    try {
      if (token) {


        // Criar FormData
        const formData = new FormData();
        formData.append('text', postText.trim());

        // Adicionar arquivos
        selectedFiles.forEach((file, index) => {

          formData.append('files', file);
        });

        // Log do FormData

        for (let pair of formData.entries()) {

        }


        const response = await fetch('http://localhost:3000/publications', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // NÃO adicionar Content-Type para FormData - o browser define automaticamente
          },
          body: formData,
        });






        if (response.ok) {
          const newPublication = await response.json();


          // Atualizar lista de publicações
          setPublications(prev => [newPublication, ...prev]);
          toast.success('Publicação criada com sucesso!');

          // Limpar formulário
          setPostText('');
          setSelectedFiles([]);
          previewUrls.forEach(url => URL.revokeObjectURL(url));
          setPreviewUrls([]);

          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);

        } else {
          const errorText = await response.text();
          console.error('Erro da API:', {
            status: response.status,
            statusText: response.statusText,
            errorText
          });
          throw new Error(`Erro da API: ${response.status} - ${errorText}`);
        }
      } else {
        throw new Error('Token não encontrado');
      }
    } catch (error) {
      console.warn('Erro ao publicar na API, tentando fallback local:', error);

      // Fallback para localStorage
      try {
        const fileToDataURL = (file: File): Promise<string> =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });


        const mediaDataUrls = await Promise.all(
          selectedFiles.map(fileToDataURL)
        );

        const newLocalPub = {
          id: Date.now(),
          text: postText.trim(),
          media: mediaDataUrls
        };



        // Salvar no localStorage
        const stored = localStorage.getItem('adoption_posts');
        const existingPosts = stored ? JSON.parse(stored) : [];
        const updatedPosts = [newLocalPub, ...existingPosts];
        localStorage.setItem('adoption_posts', JSON.stringify(updatedPosts));

        // Adicionar à lista local
        const convertedPub: Publication = {
          id: newLocalPub.id.toString(),
          text: newLocalPub.text,
          media: newLocalPub.media,
          authorName: 'Você',
          authorEmail: 'local@example.com',
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: 0,
        };

        setPublications(prev => [convertedPub, ...prev]);
        toast.success('Publicação salva localmente!');

        // Limpar formulário
        setPostText('');
        setSelectedFiles([]);
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

      } catch (localError) {
        console.error('Erro ao salvar localmente:', localError);
        toast.error('Erro ao criar publicação');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Extracted publications list rendering logic
  let publicationsList: React.ReactNode;
  if (isLoadingPosts) {
    publicationsList = (
      <div className="w-full flex justify-center mt-10">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando publicações...</Typography>
      </div>
    );
  } else if (publications.length > 0) {
    publicationsList = (
      <div className="w-full flex items-center justify-center mt-10 px-4">
        <Box sx={{ maxWidth: 672, width: '100%' }}>
          {publications.map(pub => (
            <Card key={pub.id} sx={{ mb: 4, borderRadius: 2, boxShadow: 1, bgcolor: '#563838' }}>
              <CardContent
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  color: '#fff'
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #4b2d2d', bgcolor: 'grey.100' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {pub.authorName}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {formatDate(pub.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                  {pub.media && pub.media.length > 0 && (
                    <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(1, 1fr)' } }}>
                      {pub.media.map((url, idx) => {
                        // Use a unique key based on publication id and media url
                        const mediaKey = `${pub.id}-${typeof url === 'string' ? url : idx}`;
                        return (
                          <Paper
                            key={mediaKey}
                            sx={{
                              height: 128,
                              borderRadius: 1,
                              overflow: 'hidden',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <img
                              src={url}
                              alt={`pub-${pub.id}-${idx}`}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                console.error('Erro ao carregar imagem:', url);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </Paper>
                        );
                      })}
                    </Box>
                  )}

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ mb: 2 }}>{pub.text}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                  <Button
                    variant="text"
                    sx={{
                      bgcolor: '#f5f5f5',
                      color: '#563838',
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Desejo adotar
                  </Button>
                </Box>
              </CardContent>
              <Divider />
            </Card>
          ))}
        </Box>
      </div>
    );
  } else {
    publicationsList = (
      <div className="w-full flex justify-center mt-10">
        <Typography variant="h6" color="textSecondary">
          Nenhuma publicação encontrada. Seja o primeiro a publicar!
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f2] pt-25">
      <Header />
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#563838] mt-20 mb-8">Publicações de adoção</h1>
      </div>

      <div className="w-full flex items-center justify-center mt-10 px-4">
        <Card sx={{ maxWidth: 672, width: '100%', boxShadow: 3, borderRadius: 2, border: '3px solid #563838' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <img src="/src/assets/publi.svg" width={48} height={48} alt="Ícone publicação" />
              <Typography variant="h6" fontWeight={600} color="#424242">Criar uma publicação</Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Descreva o animal para adoção, sua personalidade, cuidados necessários..."
              value={postText}
              onChange={e => setPostText(e.target.value)}
              variant="outlined"
              disabled={isLoading}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset, &:hover fieldset, &.Mui-focused fieldset': { borderColor: '#563838' }
                }
              }}
            />

            {previewUrls.length > 0 && (
              <Box
                sx={{
                  mb: 2,
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
                }}
              >
                {previewUrls.map((url, idx) => (
                  <Paper
                    key={idx}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 1,
                      '&:hover .delete-btn': { opacity: 1 }
                    }}
                  >
                    <img
                      src={url}
                      alt={`preview-${idx + 1}`}
                      style={{ width: '100%', height: 128, objectFit: 'cover', display: 'block' }}
                    />
                    <IconButton
                      className="delete-btn"
                      onClick={() => removeImage(idx)}
                      disabled={isLoading}
                      sx={{
                        position: 'absolute', top: 8, right: 8,
                        bgcolor: 'error.main', color: '#fff', width: 24, height: 24,
                        opacity: 0, transition: 'opacity 0.2s',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}

            {showError && <Alert severity="error" sx={{ mb: 2 }}>É preciso adicionar texto ou mídia.</Alert>}
            {showSuccess && <Alert severity="success" sx={{ mb: 2 }}>Publicação criada!</Alert>}
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3, pt: 0 }}>
            <Box>
              <input
                id="upload"
                hidden
                multiple
                type="file"
                accept="image/*,video/*"
                onChange={handleImageUpload}
                disabled={isLoading}
              />
              <label htmlFor="upload">
                <Button
                  variant="text"
                  component="span"
                  startIcon={<Image />}
                  disabled={isLoading}
                  sx={{ color: '#757575', textTransform: 'none', '&:hover': { bgcolor: '#f5f5f5', color: '#563838' } }}
                >
                  Foto/Vídeo
                </Button>
              </label>
            </Box>

            <Button
              variant="contained"
              disabled={(!postText.trim() && !selectedFiles.length) || isLoading}
              onClick={handlePublish}
              sx={{ bgcolor: '#563838', px: 3, gap: 1, textTransform: 'none', '&:hover': { bgcolor: '#563838' } }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AddCircleOutlineOutlinedIcon />
              )}
              {isLoading ? 'Publicando...' : 'Adicionar doação'}
            </Button>
          </CardActions>
        </Card>
      </div>

      {/* Lista de publicações */}
      {publicationsList}
    </div>
  );
};

export default Publicacoes;
