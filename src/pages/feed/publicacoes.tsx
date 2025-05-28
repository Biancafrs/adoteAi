import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header';

import {
  Card, CardContent, CardActions, TextField, Button, Box,
  Typography, IconButton, Paper, Alert, Divider
} from '@mui/material';
import { Image, Close } from '@mui/icons-material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

interface Publication {
  id: number;
  text: string;
  media: string[];         
}

const fileToDataURL = (file: File): Promise<string> =>
  new Promise(res => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.readAsDataURL(file);
  });

const Publicacoes: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('adoption_posts');
    if (stored) setPublications(JSON.parse(stored));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const valid = files.filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );

    if (valid.length !== files.length) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
    if (!postText.trim() && !selectedFiles.length) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const mediaDataUrls = await Promise.all(
      selectedFiles.map(fileToDataURL)
    );

    const newPub: Publication = {
      id: Date.now(),
      text: postText.trim(),
      media: mediaDataUrls
    };

    setPublications(prev => {
      const updated = [newPub, ...prev];
      localStorage.setItem('adoption_posts', JSON.stringify(updated)); // persistir
      return updated;
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPostText('');
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2] pt-25">
      <Header />
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#563838]">Publicações de adoção</h1>
      </div>

      <div className="w-full flex items-center justify-center mt-10 px-4">
        <Card sx={{ maxWidth: 672, width: '100%', boxShadow: 3, borderRadius: 2, border: '3px solid #563838' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <img src="src/assets/publi.svg" width={48} height={48} alt="Ícone publicação" />
              <Typography variant="h6" fontWeight={600} color="#424242">Criar uma publicação</Typography>
            </Box>

            <TextField
              fullWidth multiline rows={4}
              placeholder="Descreva o animal para adoção, sua personalidade, cuidados necessários..."
              value={postText}
              onChange={e => setPostText(e.target.value)}
              variant="outlined"
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
              <input id="upload" hidden multiple type="file" accept="image/*,video/*" onChange={handleImageUpload} />
              <label htmlFor="upload">
                <Button
                  variant="text" component="span" startIcon={<Image />}
                  sx={{ color: '#757575', textTransform: 'none', '&:hover': { bgcolor: '#f5f5f5', color: '#563838' } }}
                >
                  Foto/Vídeo
                </Button>
              </label>
            </Box>

            <Button
              variant="contained"
              disabled={!postText.trim() && !previewUrls.length}
              onClick={handlePublish}
              sx={{ bgcolor: '#563838', px: 3, gap: 1, textTransform: 'none', '&:hover': { bgcolor: '#563838' } }}
            >
              <AddCircleOutlineOutlinedIcon />
              Adicionar doação
            </Button>
          </CardActions>
        </Card>
      </div>

      {publications.length > 0 && (
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
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #4b2d2d', bgcolor: 'grey.100' }} />
                    <Typography variant="body2">Publicado por:</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    {pub.media.length > 0 && (
                      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(1, 1fr)' } }}>
                        {pub.media.map((url, idx) => (
                          <Paper
                            key={idx}
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
                            />
                          </Paper>
                        ))}
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
      )}
    </div>
  );
};

export default Publicacoes;
