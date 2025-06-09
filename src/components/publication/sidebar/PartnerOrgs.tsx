import React from 'react';

const PartnerOrgs: React.FC = () => {
  const orgs = [
    {
      name: 'Santuário Jardim de São Francisco',
      location: 'R. Ja, S/N - Ilha, Itajubá - MG, 37517-000',
      specialty: 'Cães',
      image: '/src/assets/ong1.png'
    },
    {
      name: 'RESGACTI',
      location: 'Itajubá, MG',
      specialty: 'Resgates',
      image: '/src/assets/RESGACTI.jpg'
    },
    {
      name: 'Lar dos Bichos',
      location: 'Belo Horizonte, MG',
      animals: 12,
      specialty: 'Animais idosos',
      image: '/src/assets/DOG1.jpg'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 min-h-[240px]">
      <h3 className="text-lg font-bold text-amber-800 mb-4">ONGs Parceiras</h3>
      <div className="space-y-4">
        {orgs.map((org, index) => (
          <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
            <img
              src={org.image}
              alt={`Logo ${org.name}`}
              className="w-10 h-10 bg-[#563838] rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-amber-800 text-sm leading-tight">{org.name}</h4>
              <p className="text-xs text-amber-600 mb-1 truncate">
                📍 {org.location}
              </p>
              {org.animals && (
                <p className="text-xs text-gray-600 mb-1">
                  🐾 {org.animals} animais disponíveis
                </p>
              )}
              <p className="text-xs text-gray-600">
                ⭐ {org.specialty}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerOrgs;