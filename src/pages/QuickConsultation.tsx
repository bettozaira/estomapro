import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Clock, Camera, MapPin, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const QuickConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    procedure: '',
    observation: '',
    datetime: new Date().toISOString().slice(0, 16),
    location: '',
    hasPhoto: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quick consultation data:', formData);
    navigate('/');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleInputChange('location', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="p-4 pb-20">
      <PageHeader 
        title="Atendimento Rápido"
        subtitle="Registro rápido de consulta"
        onBack={() => navigate('/')}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
            <Stethoscope size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Atendimento Rápido</h2>
            <p className="text-slate-600 text-sm">Formulário simplificado para registro ágil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Name */}
          <FormField
            label="Nome do Paciente"
            type="text"
            value={formData.patientName}
            onChange={(value) => handleInputChange('patientName', value)}
            placeholder="Digite o nome do paciente"
            required
          />

          {/* Date and Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <Clock className="mr-2" size={16} />
              Data e Horário
            </label>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => handleInputChange('datetime', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Procedure */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Procedimento Realizado <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.procedure}
              onChange={(e) => handleInputChange('procedure', e.target.value)}
              placeholder="Descreva brevemente o procedimento realizado..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              required
            />
          </div>

          {/* Observation */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Observação Breve
            </label>
            <textarea
              value={formData.observation}
              onChange={(e) => handleInputChange('observation', e.target.value)}
              placeholder="Observações importantes..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <Camera className="mr-2" size={16} />
              Foto (Opcional)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors duration-200 cursor-pointer">
              <Camera size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 text-sm mb-1">Adicionar foto do atendimento</p>
              <p className="text-xs text-slate-500">Clique ou arraste uma imagem</p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleInputChange('hasPhoto', e.target.files && e.target.files.length > 0)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
              <MapPin className="mr-2" size={16} />
              Localização (Opcional)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Coordenadas ou endereço"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-3 bg-teal-100 text-teal-700 rounded-xl hover:bg-teal-200 transition-colors duration-200 font-medium"
              >
                GPS
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="font-medium text-slate-800 mb-3">Resumo do Atendimento</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Paciente:</span>
                <p className="font-medium text-slate-800">{formData.patientName || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-slate-600">Data/Hora:</span>
                <p className="font-medium text-slate-800">
                  {new Date(formData.datetime).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Foto:</span>
                <p className="font-medium text-slate-800">{formData.hasPhoto ? 'Sim' : 'Não'}</p>
              </div>
              <div>
                <span className="text-slate-600">Localização:</span>
                <p className="font-medium text-slate-800">{formData.location ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 px-6 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Save className="mr-2" size={20} />
              Salvar Atendimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickConsultation;