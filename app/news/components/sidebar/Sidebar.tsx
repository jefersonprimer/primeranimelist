// components/Sidebar.tsx

import TopAnimes from './TopAnimes';

const Sidebar = () => {
  return (
    <div className="grid grid-cols-1 bg-white border border-gray-300 ">
      <TopAnimes />
    </div>
  );
};

export default Sidebar;


