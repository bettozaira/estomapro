import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Calendar, Image, Tag, MessageCircle } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useWoundPhotos } from '../hooks/useWoundPhotos';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const WoundGallery: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { photos, createPhoto, uploadPhoto } = useWoundPhotos();
  const [selectedTab, setSelectedTab] = useState<'upload' | 'gallery'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    patient: '',
    date: new Date().toISOString().split('T')[0],
    woundType: '',
    woundStage: '',
    comments: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Por favor, selecione uma foto');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload photo first
      const { url, error: uploadError } = await uploadPhoto(selectedFile);
      if (uploadError || !url) {
        throw new Error(uploadError || 'Erro ao fazer upload da foto');
      }

      // Create photo record
      const photoData = {
        patient_id: formData.patient,
        photo_url: url,
        photo_date: formData.date,
        wound_type: formData.woundType || undefined,
        wound_stage: formData.woundStage || undefined,
        comments: formData.comments,
      };

      const { error } = await createPhoto(photoData);
      
      if (error) {
        throw new Error(error);
      }

      setSuccess(true);
      setTimeout(() => {
        setSelectedTab('gallery');
        setSuccess(false);
        setFormData({
          patient: '',
          date: new Date().toISOString().split('T')[0],
          woundType: '',
          woundStage: '',
          comments: ''
        });
        setSelectedFile(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar foto');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 pb-20">
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Foto Salva!</h2>
            <p className="text-slate-600 mb-4">A foto foi adicionada à galeria com sucesso.</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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
            Galeria ({photos.length})
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
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.full_name} ({new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} anos)
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Foto da Lesão <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer relative">
                  <Camera size={48} className="mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-2">
                    {selectedFile ? selectedFile.name : 'Clique para adicionar uma foto'}
                  </p>
                  <p className="text-sm text-slate-500">Ou arraste e solte aqui</p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
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

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

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
                  disabled={loading || !selectedFile}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Foto'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            {photos.length === 0 ? (
              <div className="text-center py-12">
                <Camera size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Nenhuma foto encontrada</h3>
                <p className="text-slate-600 mb-4">Adicione a primeira foto de lesão</p>
                <button
                  onClick={() => setSelectedTab('upload')}
                  className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                >
                  Adicionar Foto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => {
                  const patient = patients.find(p => p.id === photo.patient_id);
                  return (
                    <div key={photo.id} className="bg-slate-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="aspect-video bg-slate-200 relative">
                        <img
                          src={photo.photo_url}
                          alt={`Lesão - ${patient?.full_name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-xs font-medium text-slate-700">
                            {new Date(photo.photo_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-slate-800 mb-2">{patient?.full_name}</h4>
                        <div className="space-y-2">
                          {photo.wound_type && (
                            <div className="flex items-center text-sm text-slate-600">
                              <Tag size={14} className="mr-2" />
                              {photo.wound_type}
                            </div>
                          )}
                          {photo.wound_stage && (
                            <div className="flex items-center text-sm text-slate-600">
                              <Calendar size={14} className="mr-2" />
                              {photo.wound_stage}
                            </div>
                          )}
                          {photo.comments && (
                            <div className="flex items-start text-sm text-slate-600">
                              <MessageCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{photo.comments}</span>
                            </div>
                          )}
                        </div>
                        <button className="w-full mt-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WoundGallery;