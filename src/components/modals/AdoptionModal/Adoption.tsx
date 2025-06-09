import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// Configurar dayjs para português
dayjs.locale('pt-br');

interface AdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  publication: {
    id: string;
    text: string;
    authorName: string;
    authorEmail: string;
    media?: string[];
  };
}

const AdoptionModal: React.FC<AdoptionModalProps> = ({
  isOpen,
  onClose,
  publication
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    dataDisponibilidade: null as dayjs.Dayjs | null,
    hora: '',
    experiencia: '',
    moradia: '',
    motivacao: '',
    aceitaTermos: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente está montado
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Controlar overflow do body de forma mais estável
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleInputChange = useCallback((field: string, value: string | boolean | dayjs.Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      dataDisponibilidade: null,
      hora: '',
      experiencia: '',
      moradia: '',
      motivacao: '',
      aceitaTermos: false
    });
  }, []);

  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.aceitaTermos) {
      toast.error('Você deve aceitar os termos para continuar');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const adoptionRequest = {
        publicationId: publication.id,
        publicationAuthorEmail: publication.authorEmail,
        publicationText: publication.text,
        requesterInfo: {
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          disponibilidade: `${formData.dataDisponibilidade?.format('DD/MM/YYYY')} às ${formData.hora}`,
          experiencia: formData.experiencia,
          moradia: formData.moradia,
          motivacao: formData.motivacao
        },
      };

      const response = await fetch('http://localhost:3000/adoption-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adoptionRequest)
      });

      if (response.ok) {
        toast.success('Solicitação de adoção enviada com sucesso! 🎉');
        handleClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao enviar solicitação');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, publication, handleClose]);

  // Não renderizar se não estiver montado ou aberto
  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lado Esquerdo - Header com Info da Publicação */}
        <div className="w-2/5 bg-gradient-to-br bg-[#563838] text-white p-6 flex flex-col relative">
          {/* Botão de Fechar */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full text-white hover:text-red-300 transition-all duration-200 z-10 group hover:shadow-lg hover:scale-110"
            type="button"
            title="Fechar modal"
            style={{
              fontSize: '18px',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="group-hover:drop-shadow-lg group-hover:border-white group-hover:border-opacity-50 border border-transparent rounded-full px-2 py-1.5">✕</span>
          </button>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Solicitação de Adoção</h2>

            <p className="text-amber-100 mb-6">
              Ficamos muito felizes em saber que você se interessou por este amiguinho! 💝
            </p>

            {/* Info da Publicação */}
            <div className="bg-amber-50 bg-opacity-20 rounded-lg p-4 mb-6 border border-amber-300 border-opacity-20">
              <h3 className="font-semibold mb-2 text-amber-800">📝 Sobre este animal:</h3>
              <p className="text-sm text-amber-950 leading-relaxed mb-3">
                {publication.text}
              </p>
              <p className="text-xs text-amber-800">
                Por: {publication.authorName}
              </p>
            </div>

            {/* Imagem/Preview se disponível */}
            {publication.media && publication.media.length > 0 && (
              <div className="bg-amber-50 bg-opacity-20 rounded-lg p-2 mb-6 border border-amber-300 border-opacity-20">
                <img
                  src={publication.media[0]}
                  alt="Animal para adoção"
                  className="w-full h-44 object-cover rounded-lg"
                />
              </div>
            )}
          </div>


          <div className="mt-auto p-3 bg-amber-50 bg-opacity-10 rounded-lg border border-amber-100 border-opacity-20">
            <p className="text-xs text-amber-900 opacity-90">
              💡 Preencha os dados abaixo para que o responsável entre em contato
            </p>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="w-3/5 overflow-y-auto bg-zinc-50 p-6">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Info pessoal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Seu nome"
                    disabled={isLoading}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#563838] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(22) 99999-9999"
                    disabled={isLoading}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#563838] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contato@gmail.com"
                  disabled={isLoading}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#563838] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                />
              </div>

              {/* Data e Hora */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Quando você pode conhecer o animal? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <DatePicker
                      value={formData.dataDisponibilidade}
                      onChange={(newValue) => handleInputChange('dataDisponibilidade', newValue)}
                      minDate={dayjs()}
                      format="DD/MM/YYYY"
                      disabled={isLoading}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          placeholder: 'Selecione a data',
                          required: true,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              backgroundColor: 'white',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#563838',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#563838',
                                borderWidth: '2px',
                              },
                            },
                            '& .MuiInputBase-input': {
                              padding: '10px 14px',
                              fontSize: '14px',
                            },
                          },
                        },
                        popper: {
                          placement: 'bottom-start',
                          sx: {
                            zIndex: 10000,
                            '& .MuiPaper-root': {
                              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                              border: '1px solid #e0e0e0',
                            },
                          },
                        },
                      }}
                    />
                  </div>

                  <select
                    required
                    value={formData.hora}
                    onChange={(e) => handleInputChange('hora', e.target.value)}
                    disabled={isLoading}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#563838] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  >
                    <option value="">Horário</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>

              {/* Experiência e Moradia */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Experiência com pets *
                  </label>
                  <select
                    required
                    value={formData.experiencia}
                    onChange={(e) => handleInputChange('experiencia', e.target.value)}
                    disabled={isLoading}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#563838] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="nunca">Nunca tive pets</option>
                    <option value="pouca">Pouca experiência</option>
                    <option value="moderada">Experiência moderada</option>
                    <option value="muita">Muita experiência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tipo de moradia *
                  </label>
                  <select
                    required
                    value={formData.moradia}
                    onChange={(e) => handleInputChange('moradia', e.target.value)}
                    disabled={isLoading}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#563838] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa-quintal">Casa com quintal</option>
                    <option value="casa-sem-quintal">Casa sem quintal</option>
                    <option value="sitio">Sítio/Chácara</option>
                  </select>
                </div>
              </div>

              {/* Motivação */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Por que você quer adotar este animal? *
                </label>
                <textarea
                  required
                  value={formData.motivacao}
                  onChange={(e) => handleInputChange('motivacao', e.target.value)}
                  placeholder="Conte um pouco sobre sua motivação para adotar..."
                  rows={3}
                  disabled={isLoading}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#563838] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                />
              </div>

              {/* Termos */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.aceitaTermos}
                    onChange={(e) => handleInputChange('aceitaTermos', e.target.checked)}
                    disabled={isLoading}
                    className="mt-1 w-4 h-4 text-[#563838] focus:ring-[#563838] border-gray-300 rounded disabled:cursor-not-allowed"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-700 leading-relaxed">
                    Declaro que tenho condições de cuidar do animal e que as informações prestadas são verdadeiras. Estou ciente de que a adoção é um compromisso permanente.
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.aceitaTermos}
                  className="flex-1 px-4 py-2.5 bg-[#563838] hover:bg-[#6d4a4a] disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>💝</span>
                      Enviar Solicitação
                    </>
                  )}
                </button>
              </div>
            </form>
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AdoptionModal;