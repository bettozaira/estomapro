import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, User, Clock, Save, CheckSquare } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const ClinicalEvolution: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    clinicalDescription: '',
    procedures: '',
    materials: [{ name: '', quantity: '', batch: '' }],
    observations: '',
    woundAssessment: {
      odor: false,
      exudate: false,
      edges: false,
      depth: false
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssessmentChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      woundAssessment: { ...prev.woundAssessment, [field]: checked }
    }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { name: '', quantity: '', batch: '' }]
    }));
  };

  const updateMaterial = (index: number, field: string, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setFormData(prev => ({ ...prev, materials: newMaterials }));
  };

  const removeMaterial = (index: number) => {
    if (formData.materials.length > 1) {
      setFormData(prev => ({
        ...prev,
        materials: prev.materials.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Evolution data:', formData);
    navigate('/');
  };

  return (
    <div className="p-4 pb-20">
      <PageHeader 
        title="Evolução de Enfermagem"
        subtitle="Registre a evolução clínica do paciente"
        onBack={() => navigate('/')}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <User className="mr-2 text-blue-600" size={20} />
              Identificação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
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
              
              <FormField
                label="Data"
                type="date"
                value={formData.date}
                onChange={(value) => handleInputChange('date', value)}
                required
              />
              
              <FormField
                label="Horário"
                type="time"
                value={formData.time}
                onChange={(value) => handleInputChange('time', value)}
                required
              />
            </div>
          </div>

          {/* Clinical Description */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <FileText className="mr-2 text-emerald-600" size={20} />
              Descrição Clínica
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Evolução Clínica <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.clinicalDescription}
                  onChange={(e) => handleInputChange('clinicalDescription', e.target.value)}
                  placeholder="Descreva a evolução clínica do paciente..."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Procedimentos Realizados
                </label>
                <textarea
                  value={formData.procedures}
                  onChange={(e) => handleInputChange('procedures', e.target.value)}
                  placeholder="Liste os procedimentos realizados..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Save className="mr-2 text-purple-600" size={20} />
                Materiais Utilizados
              </h3>
              <button
                type="button"
                onClick={addMaterial}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors duration-200"
              >
                + Adicionar
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.materials.map((material, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl">
                  <input
                    type="text"
                    placeholder="Nome do material"
                    value={material.name}
                    onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Quantidade"
                    value={material.quantity}
                    onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Lote"
                    value={material.batch}
                    onChange={(e) => updateMaterial(index, 'batch', e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {formData.materials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wound Assessment */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <CheckSquare className="mr-2 text-orange-600" size={20} />
              Avaliação da Lesão
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(formData.woundAssessment).map(([key, checked]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={checked}
                    onChange={(e) => handleAssessmentChange(key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={key} className="ml-2 text-sm text-slate-700 capitalize">
                    {key === 'odor' ? 'Odor' : 
                     key === 'exudate' ? 'Exsudato' :
                     key === 'edges' ? 'Bordas' : 'Profundidade'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Observações Complementares
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
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
              className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Salvar Evolução
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicalEvolution;