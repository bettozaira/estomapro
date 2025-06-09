import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, Phone, Mail, Heart, FileText, Camera, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
    comorbidities: [],
    mainDiagnosis: '',
    observations: '',
    responsibleName: '',
    responsiblePhone: '',
    passwordProtected: false,
    password: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Patient data:', formData);
    // Show success message and navigate back
    navigate('/');
  };

  return (
    <div className="p-4 pb-20">
      <PageHeader 
        title="Cadastro de Paciente"
        subtitle="Registre as informações do paciente"
        onBack={() => navigate('/')}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <User className="mr-2 text-blue-600" size={20} />
              Informações Pessoais
            </h3>
            <div className="space-y-4">
              <FormField
                label="Nome Completo"
                type="text"
                value={formData.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
                placeholder="Digite o nome completo"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Data de Nascimento"
                  type="date"
                  value={formData.birthDate}
                  onChange={(value) => handleInputChange('birthDate', value)}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sexo
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Telefone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  placeholder="(11) 99999-9999"
                />
                
                <FormField
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Heart className="mr-2 text-red-500" size={20} />
              Informações Clínicas
            </h3>
            <div className="space-y-4">
              <FormField
                label="Diagnóstico Principal"
                type="text"
                value={formData.mainDiagnosis}
                onChange={(value) => handleInputChange('mainDiagnosis', value)}
                placeholder="Diagnóstico clínico principal"
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Observações Gerais
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Responsible Person */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <User className="mr-2 text-purple-600" size={20} />
              Responsável Legal (Opcional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nome do Responsável"
                type="text"
                value={formData.responsibleName}
                onChange={(value) => handleInputChange('responsibleName', value)}
                placeholder="Nome do responsável"
              />
              
              <FormField
                label="Telefone do Responsável"
                type="tel"
                value={formData.responsiblePhone}
                onChange={(value) => handleInputChange('responsiblePhone', value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Lock className="mr-2 text-orange-500" size={20} />
              Segurança
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="passwordProtected"
                  checked={formData.passwordProtected}
                  onChange={(e) => handleInputChange('passwordProtected', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="passwordProtected" className="ml-2 text-sm text-slate-700">
                  Proteger dados do paciente com senha
                </label>
              </div>
              
              {formData.passwordProtected && (
                <FormField
                  label="Senha de Proteção"
                  type="password"
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  placeholder="Digite uma senha segura"
                  required={formData.passwordProtected}
                />
              )}
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
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Salvar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;