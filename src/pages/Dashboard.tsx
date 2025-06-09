import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  FileText, 
  Camera, 
  BarChart3, 
  Stethoscope, 
  Settings,
  Plus,
  Clock,
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useEvolutions } from '../hooks/useEvolutions';
import { useWoundPhotos } from '../hooks/useWoundPhotos';
import { useProfessional } from '../hooks/useProfessional';
import ActionButton from '../components/ActionButton';
import StatCard from '../components/StatCard';
import RecentPatients from '../components/RecentPatients';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { evolutions } = useEvolutions();
  const { photos } = useWoundPhotos();
  const { professional } = useProfessional();

  const mainActions = [
    {
      icon: UserPlus,
      label: 'Cadastrar Paciente',
      description: 'Novo registro de paciente',
      path: '/patient-registration',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      icon: FileText,
      label: 'Nova Evolução',
      description: 'Registrar evolução clínica',
      path: '/clinical-evolution',
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700'
    },
    {
      icon: Camera,
      label: 'Adicionar Foto',
      description: 'Galeria de lesões',
      path: '/wound-gallery',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      icon: BarChart3,
      label: 'Relatórios',
      description: 'Gerar e exportar relatórios',
      path: '/reports',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      icon: Stethoscope,
      label: 'Atendimento Rápido',
      description: 'Registro rápido de consulta',
      path: '/quick-consultation',
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700'
    },
    {
      icon: Settings,
      label: 'Configurações',
      description: 'Ajustes e preferências',
      path: '/settings',
      color: 'bg-gradient-to-r from-slate-500 to-slate-600',
      hoverColor: 'hover:from-slate-600 hover:to-slate-700'
    }
  ];

  // Calculate today's evolutions
  const today = new Date().toISOString().split('T')[0];
  const todayEvolutions = evolutions.filter(e => e.evolution_date === today).length;

  // Calculate pending items (patients without recent evolutions)
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 7);
  const recentEvolutionPatients = evolutions
    .filter(e => new Date(e.evolution_date) >= recentDate)
    .map(e => e.patient_id);
  const pendingPatients = patients.filter(p => !recentEvolutionPatients.includes(p.id)).length;

  const stats = [
    {
      icon: Users,
      label: 'Pacientes Ativos',
      value: patients.length.toString(),
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      label: 'Evoluções Hoje',
      value: todayEvolutions.toString(),
      change: '+25%',
      color: 'text-emerald-600'
    },
    {
      icon: Camera,
      label: 'Fotos Registradas',
      value: photos.length.toString(),
      change: '+15%',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Pendências',
      value: pendingPatients.toString(),
      change: '-2',
      color: 'text-orange-600'
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">ESTOMAPRO</h1>
            <p className="text-slate-600">
              Bem-vindo de volta, {professional?.full_name || 'Profissional'}
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {professional ? getInitials(professional.full_name) : 'PR'}
            </span>
          </div>
        </div>
        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {mainActions.map((action, index) => (
          <ActionButton
            key={index}
            {...action}
            onClick={() => navigate(action.path)}
          />
        ))}
      </div>

      {/* Recent Patients */}
      <RecentPatients />

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/patient-registration')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center z-10"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Dashboard;