import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>("");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.profilePhoto) {
            setUserPhoto(data.user.profilePhoto);
          }
        })
        .catch(() => {
          // Silenciar erro se não conseguir carregar
        });
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-20 bg-[#563838] px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div
          className="w-14 h-12 flex cursor-pointer"
          onClick={() => navigate("/publicacoes")}
        >
          <img src="/src/assets/logo.svg" alt="Logo" />
        </div>
        <div className="relative shadow-2xl rounded-2xl w-[500px] h-12 bg-[#DCCDBA]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar animais para adoção..."
            className="w-full h-full pl-12 pr-4 bg-transparent outline-none rounded-2xl text-lg"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>
        <Button
          style={{
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            borderRadius: "1rem",
            width: "7rem",
            height: "2.5rem",
            backgroundColor: "#DCCDBA",
            color: "black",
            fontSize: "1rem",
            fontWeight: "500"
          }}
        >
          Adoção
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border border-[#4b2d2d] bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden">
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[#4b2d2d] text-xl">👤</div>
          )}
        </div>
        <Box>
          <div
            ref={anchorRef}
            onClick={handleToggle}
            style={{ display: "inline-flex", cursor: "pointer" }}
          >
            <MenuIcon
              sx={{
                color: "#DCCDBA",
                fontSize: 32,
                transition: "0.3s",
                "&:hover": {
                  color: "#C0B0A0",
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
                    backgroundColor: "#00000099",
                    opacity: 0.6,
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    width: "250px",
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} disablePadding>
                      <Button
                        onClick={() => handleNavigate("/publicacoes")}
                        fullWidth
                        sx={buttonStyles}
                      >
                        Publicações
                      </Button>
                      <Button
                        onClick={() => handleNavigate("/informacoesPessoais")}
                        fullWidth
                        sx={buttonStyles}
                      >
                        Informações pessoais
                      </Button>
                      <Button
                        onClick={() => handleNavigate("/segurancaSenha")}
                        fullWidth
                        sx={buttonStyles}
                      >
                        Privacidade
                      </Button>
                      <Button
                        onClick={() => handleNavigate("/sobre")}
                        fullWidth
                        sx={buttonStyles}
                      >
                        Sobre
                      </Button>
                      <Button
                        onClick={() => {
                          localStorage.clear();
                          handleNavigate("/");
                        }}
                        fullWidth
                        sx={buttonStyles}
                      >
                        Sair
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
  backgroundColor: "#5C3939",
  color: "#fff",
  textTransform: "none",
  borderRadius: "12px",
  mb: 1,
  boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  "&:hover": {
    backgroundColor: "#472828",
  },
  "&.Mui-disabled": {
    backgroundColor: "#b0b0b0",
    color: "#fff",
  },
};
