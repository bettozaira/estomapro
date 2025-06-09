import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Calendar, Image, Tag, MessageCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const WoundGallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'upload' | 'gallery'>('upload');
  const [formData, setFormData] = useState({
    patient: '',
    date: new Date().toISOString().split('T')[0],
    woundType: '',
    woundStage: '',
    comments: ''
  });

  const mockImages = [
    {
      id: 1,
      patientName: 'Maria Santos',
      date: '2024-01-15',
      type: 'Úlcera diabética',
      stage: 'Grau II',
      url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      patientName: 'João Silva',
      date: '2024-01-14',
      type: 'Úlcera de pressão',
      stage: 'Grau I',
      url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      patientName: 'Ana Costa',
      date: '2024-01-13',
      type: 'Ferida cirúrgica',
      stage: 'Cicatrização',
      url: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wound photo data:', formData);
    navigate('/');
  };

  return (
    <div className="p-4 pb-20">
      <PageHeader 
        title="Galeria de Lesões"
        subtitle="Gerencie fotos e documentação visual"
        onBack={() => navigate('/')}
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setSelectedTab('upload')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
              selectedTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Upload className="inline mr-2" size={20} />
            Nova Foto
          </button>
          <button
            onClick={() => setSelectedTab('gallery')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
              selectedTab === 'gallery'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Image className="inline mr-2" size={20} />
            Galeria
          </button>
        </div>

        {selectedTab === 'upload' ? (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Paciente <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.patient}
                  onChange={(e) => handleInputChange('patient', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Selecione um paciente</option>
                  <option value="maria-santos">Maria Santos (67 anos)</option>
                  <option value="joao-silva">João Silva (45 anos)</option>
                  <option value="ana-costa">Ana Costa (52 anos)</option>
                </select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Foto da Lesão <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer">
                  <Camera size={48} className="mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-2">Clique para adicionar uma foto</p>
                  <p className="text-sm text-slate-500">Ou arraste e solte aqui</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Photo Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Data da Foto"
                  type="date"
                  value={formData.date}
                  onChange={(value) => handleInputChange('date', value)}
                  required
                />
                <FormField
                  label="Tipo de Lesão"
                  type="text"
                  value={formData.woundType}
                  onChange={(value) => handleInputChange('woundType', value)}
                  placeholder="Ex: Úlcera diabética"
                />
              </div>

              <FormField
                label="Estágio da Lesão"
                type="text"
                value={formData.woundStage}
                onChange={(value) => handleInputChange('woundStage', value)}
                placeholder="Ex: Grau II"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comentários / Observações
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Observações sobre a lesão..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
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
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Salvar Foto
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockImages.map((image) => (
                <div key={image.id} className="bg-slate-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="aspect-video bg-slate-200 relative">
                    <img
                      src={image.url}
                      alt={`Lesão - ${image.patientName}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-xs font-medium text-slate-700">{image.date}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">{image.patientName}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <Tag size={14} className="mr-2" />
                        {image.type}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar size={14} className="mr-2" />
                        {image.stage}
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WoundGallery;