const heartBeatAnimation = `
  @keyframes heartbeat {
    0% { 
      transform: scale(1);
    }
    25% { 
      transform: scale(1.1);
    }
    50% { 
      transform: scale(1.3);
    }
    75% { 
      transform: scale(1.1);
    }
    100% { 
      transform: scale(1);
    }
  }
  
  .heartbeat-animation {
    animation: heartbeat 0.6s ease-in-out;
  }

  /* Classe para trigger da animação */
  .heart-liked {
    animation: heartbeat 0.6s ease-in-out;
  }

  /* Melhorias nos botões */
  .publication-button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .publication-button:hover {
    transform: translateY(-1px);
  }

  .publication-button:active {
    transform: translateY(0);
  }
 
  /* Loading spinner personalizado */
  @keyframes spin-heart {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }

  .spin-heart {
    animation: spin-heart 0.8s linear infinite;
  }
`;

export default heartBeatAnimation;