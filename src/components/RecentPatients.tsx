import React from 'react';
import { Clock, AlertCircle, Camera, FileText } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useEvolutions } from '../hooks/useEvolutions';
import { useWoundPhotos } from '../hooks/useWoundPhotos';

const RecentPatients: React.FC = () => {
  const { patients } = usePatients();
  const { evolutions } = useEvolutions();
  const { photos } = useWoundPhotos();

  // Get recent patients with their latest activity
  const recentPatients = patients.slice(0, 3).map(patient => {
    const patientEvolutions = evolutions.filter(e => e.patient_id === patient.id);
    const patientPhotos = photos.filter(p => p.patient_id === patient.id);
    
    const lastEvolution = patientEvolutions.sort((a, b) => 
      new Date(b.evolution_date).getTime() - new Date(a.evolution_date).getTime()
    )[0];
    
    const lastPhoto = patientPhotos.sort((a, b) => 
      new Date(b.photo_date).getTime() - new Date(a.photo_date).getTime()
    )[0];

    let lastActivity = 'Sem atividade';
    let status = 'pending';
    let priority = 'low';

    if (lastEvolution) {
      const daysSinceEvolution = Math.floor(
        (new Date().getTime() - new Date(lastEvolution.evolution_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceEvolution === 0) {
        lastActivity = 'Hoje';
        status = 'evolution';
        priority = 'low';
      } else if (daysSinceEvolution === 1) {
        lastActivity = '1 dia atrás';
        status = 'evolution';
        priority = 'medium';
      } else {
        lastActivity = `${daysSinceEvolution} dias atrás`;
        status = 'pending';
        priority = daysSinceEvolution > 7 ? 'high' : 'medium';
      }
    }

    if (lastPhoto && (!lastEvolution || new Date(lastPhoto.photo_date) > new Date(lastEvolution.evolution_date))) {
      const daysSincePhoto = Math.floor(
        (new Date().getTime() - new Date(lastPhoto.photo_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSincePhoto === 0) {
        lastActivity = 'Foto hoje';
        status = 'photo';
      } else if (daysSincePhoto === 1) {
        lastActivity = 'Foto 1 dia atrás';
        status = 'photo';
      } else {
        lastActivity = `Foto ${daysSincePhoto} dias atrás`;
        status = 'photo';
      }
    }

    const age = new Date().getFullYear() - new Date(patient.birth_date).getFullYear();

    return {
      id: patient.id,
      name: patient.full_name,
      age,
      condition: patient.main_diagnosis,
      lastVisit: lastActivity,
      status,
      priority
    };
  });

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

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">Pacientes Recentes</h2>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Nenhum paciente cadastrado</h3>
          <p className="text-slate-600">Cadastre o primeiro paciente para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Pacientes Recentes</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Ver todos ({patients.length})
          </button>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {recentPatients.map((patient) => (
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