import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2', 
    lg: 'w-8 h-8 border-3'
  };

  const colorClasses = {
    primary: 'border-[#563838] border-t-transparent',
    secondary: 'border-amber-600 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;