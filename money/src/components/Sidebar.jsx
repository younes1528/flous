import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Budget', icon: '💰' },
  { path: '/statistics', label: 'Statistiques', icon: '📊' },
  { path: '/history', label: 'Historique', icon: '📅' },
  { path: '/categories', label: 'Catégories', icon: '🏷️' },
  { path: '/settings', label: 'Paramètres', icon: '⚙️' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white z-50 w-64 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Menu</h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${location.pathname === path 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
