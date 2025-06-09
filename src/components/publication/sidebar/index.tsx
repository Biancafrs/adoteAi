import React from 'react';
import CreatePrompt from './CreatePrompt';
import PartnerOrgs from './PartnerOrgs';
import ImportantTip from './ImportantTip';

const Sidebar: React.FC = () => {
  return (
    <div className="space-y-6 w-full">
      <CreatePrompt />
      <PartnerOrgs />
      <ImportantTip />
    </div>
  );
};

export default Sidebar;