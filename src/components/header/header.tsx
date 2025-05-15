import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, ClickAwayListener, Grow, MenuList, Paper, Popper } from '@mui/material';
import { useState, useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full h-20 bg-[#563838] px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className='w-14 h-12 flex'>
                    <img src="/src/assets/logo.svg" alt="Logo" />
                </div>
                <div className="relative shadow-2xl rounded-2xl w-96 h-12 bg-[#DCCDBA]">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar"
                        className="w-full h-full pl-12 pr-4 bg-transparent outline-none rounded-2xl"
                    />
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
                <Button style={{
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                    borderRadius: '1rem',
                    width: '6rem',
                    height: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#DCCDBA',
                    color: 'black',
                }}>
                    Adoção
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-[#4b2d2d] bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                </div>
                <Box>
                    <div ref={anchorRef} onClick={handleToggle} style={{ display: 'inline-flex', cursor: 'pointer' }}>
                        <MenuIcon
                            sx={{
                                color: '#DCCDBA',
                                fontSize: 32,
                                transition: '0.3s',
                                '&:hover': {
                                    color: '#C0B0A0',
                                },
                            }}
                        />
                    </div>

                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        placement="bottom-end"
                        transition
                        disablePortal
                    >
                        {({ TransitionProps }) => (
                            <Grow {...TransitionProps}>
                                <Paper
                                    sx={{
                                        mt: 4,
                                        px: 2,
                                        py: 2,
                                        backgroundColor: '#00000099',
                                        opacity: 0.6,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        width: '250px',
                                    }}
                                >
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList autoFocusItem={open} disablePadding>
                                            <Button
                                                onClick={() => handleNavigate('/')}
                                                fullWidth
                                                sx={buttonStyles}
                                            >
                                                Mensagens
                                            </Button>
                                            <Button
                                                onClick={() => handleNavigate('/informacoesPessoais')}
                                                fullWidth
                                                sx={buttonStyles}
                                            >
                                                Informações pessoais
                                            </Button>
                                            <Button
                                                onClick={() => handleNavigate('/segurancaSenha')}
                                                fullWidth
                                                sx={buttonStyles}
                                            >
                                                Privacidade
                                            </Button>
                                            <Button
                                                onClick={() => handleNavigate('/sobre')}
                                                fullWidth
                                                sx={buttonStyles}
                                            >
                                                Sobre
                                            </Button>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            </div>
        </header>
    );
}

const buttonStyles = {
    backgroundColor: '#5C3939',
    color: '#fff',
    textTransform: 'none',
    borderRadius: '12px',
    mb: 1,
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    '&:hover': {
        backgroundColor: '#472828',
    },
};