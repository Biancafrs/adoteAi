import React from 'react';

const PublicationSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg mb-6 p-6 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
      <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
};

export default PublicationSkeleton;