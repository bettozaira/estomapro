import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Camera, BarChart3, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Users, label: 'Pacientes', path: '/patient-registration' },
    { icon: FileText, label: 'Evolução', path: '/clinical-evolution' },
    { icon: Camera, label: 'Fotos', path: '/wound-gallery' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: User, label: 'Perfil', path: '/professional-profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <item.icon size={20} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;