import React from 'react';
import { Clock, AlertCircle, Camera, FileText } from 'lucide-react';

const RecentPatients: React.FC = () => {
  const patients = [
    {
      id: 1,
      name: 'Maria Santos',
      age: 67,
      condition: 'Úlcera diabética',
      lastVisit: '2 horas atrás',
      status: 'evolution',
      priority: 'high'
    },
    {
      id: 2,
      name: 'João Silva',
      age: 45,
      condition: 'Úlcera de pressão',
      lastVisit: '1 dia atrás',
      status: 'photo',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Ana Costa',
      age: 52,
      condition: 'Ferida cirúrgica',
      lastVisit: '3 dias atrás',
      status: 'pending',
      priority: 'low'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'evolution':
        return <FileText size={16} className="text-emerald-600" />;
      case 'photo':
        return <Camera size={16} className="text-purple-600" />;
      case 'pending':
        return <AlertCircle size={16} className="text-orange-600" />;
      default:
        return <Clock size={16} className="text-slate-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-orange-500';
      case 'low':
        return 'border-l-emerald-500';
      default:
        return 'border-l-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Pacientes Recentes</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Ver todos
          </button>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`p-4 hover:bg-slate-50 transition-colors duration-200 border-l-4 ${getPriorityColor(patient.priority)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                  <span className="text-sm text-slate-500">({patient.age} anos)</span>
                  {getStatusIcon(patient.status)}
                </div>
                <p className="text-sm text-slate-600 mb-1">{patient.condition}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} />
                  {patient.lastVisit}
                </div>
              </div>
              <button className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors duration-200">
                <span className="text-slate-600 text-lg">›</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPatients;