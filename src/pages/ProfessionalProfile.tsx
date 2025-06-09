import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Badge, Stethoscope, Camera, Edit3, Save, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';

const ProfessionalProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Dr. Silva Santos',
    registrationNumber: 'COREN-SP 123456',
    specialty: 'Enfermagem em Estomaterapia',
    institution: 'Hospital São Paulo',
    email: 'silva.santos@hospital.com',
    phone: '(11) 99999-9999'
  });

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Úlcera Diabética - Padrão',
      content: 'Paciente apresenta úlcera diabética em região plantar, com bordas definidas...',
      category: 'Diabetes'
    },
    {
      id: 2,
      name: 'Úlcera de Pressão - Grau II',
      content: 'Lesão por pressão em região sacral, grau II, com perda parcial...',
      category: 'Pressão'
    },
    {
      id: 3,
      name: 'Curativo Padrão',
      content: 'Realizada limpeza da lesão com SF 0,9%, aplicação de...',
      category: 'Procedimento'
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Profile data saved:', profileData);
    setIsEditing(false);
  };

  const addTemplate = () => {
    const newTemplate = {
      id: templates.length + 1,
      name: 'Novo Modelo',
      content: '',
      category: 'Geral'
    };
    setTemplates([...templates, newTemplate]);
  };

  return (
    <div className="p-4 pb-20">
      <PageHeader 
        title="Perfil Profissional"
        subtitle="Gerencie suas informações e configurações"
        onBack={() => navigate('/')}
      />

      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <User className="mr-2 text-blue-600" size={20} />
            Informações Pessoais
          </h3>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          >
            {isEditing ? <Save className="mr-2\" size={16} /> : <Edit3 className="mr-2" size={16} />}
            {isEditing ? 'Salvar' : 'Editar'}
          </button>
        </div>

        {/* Profile Photo */}
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold mr-4">
            DS
          </div>
          <div>
            <h4 className="text-xl font-semibold text-slate-800">{profileData.fullName}</h4>
            <p className="text-slate-600">{profileData.registrationNumber}</p>
            <p className="text-slate-500 text-sm">{profileData.specialty}</p>
          </div>
          {isEditing && (
            <button className="ml-auto p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200">
              <Camera size={20} className="text-slate-600" />
            </button>
          )}
        </div>

        {/* Profile Form */}
        {isEditing ? (
          <div className="space-y-4">
            <FormField
              label="Nome Completo"
              type="text"
              value={profileData.fullName}
              onChange={(value) => handleInputChange('fullName', value)}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Número de Registro"
                type="text"
                value={profileData.registrationNumber}
                onChange={(value) => handleInputChange('registrationNumber', value)}
                required
              />
              
              <FormField
                label="Especialidade"
                type="text"
                value={profileData.specialty}
                onChange={(value) => handleInputChange('specialty', value)}
              />
            </div>

            <FormField
              label="Instituição"
              type="text"
              value={profileData.institution}
              onChange={(value) => handleInputChange('institution', value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="E-mail"
                type="email"
                value={profileData.email}
                onChange={(value) => handleInputChange('email', value)}
              />
              
              <FormField
                label="Telefone"
                type="tel"
                value={profileData.phone}
                onChange={(value) => handleInputChange('phone', value)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-slate-700 mb-1">Instituição</h5>
              <p className="text-slate-600">{profileData.institution}</p>
            </div>
            <div>
              <h5 className="font-medium text-slate-700 mb-1">E-mail</h5>
              <p className="text-slate-600">{profileData.email}</p>
            </div>
            <div>
              <h5 className="font-medium text-slate-700 mb-1">Telefone</h5>
              <p className="text-slate-600">{profileData.phone}</p>
            </div>
            <div>
              <h5 className="font-medium text-slate-700 mb-1">Especialidade</h5>
              <p className="text-slate-600">{profileData.specialty}</p>
            </div>
          </div>
        )}
      </div>

      {/* Digital Signature */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Edit3 className="mr-2 text-purple-600" size={20} />
          Assinatura Digital
        </h3>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
          <Edit3 size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-slate-600 mb-2">Desenhe sua assinatura</p>
          <p className="text-sm text-slate-500 mb-4">Use o dedo ou mouse para assinar</p>
          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200">
            Limpar Assinatura
          </button>
        </div>
      </div>

      {/* Evolution Templates */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <FileText className="mr-2 text-emerald-600" size={20} />
            Modelos de Evolução
          </h3>
          <button
            onClick={addTemplate}
            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
          >
            + Novo Modelo
          </button>
        </div>

        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-800">{template.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {template.category}
                  </span>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{template.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;