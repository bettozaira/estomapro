import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfessional } from '../hooks/useProfessional';
import { Stethoscope, Mail, Lock, User, Badge } from 'lucide-react';
import FormField from './FormField';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const { professional, loading: professionalLoading, createProfessional } = useProfessional();
  const [isLogin, setIsLogin] = useState(true);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    full_name: '',
    registration_number: '',
    specialty: '',
    institution: '',
    phone: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authLoading || professionalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={32} className="text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const handleAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        if (!isLogin && authData.password !== authData.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }

        const { error } = isLogin 
          ? await signIn(authData.email, authData.password)
          : await signUp(authData.email, authData.password);

        if (error) throw error;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro na autenticação');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ESTOMAPRO</h1>
            <p className="text-slate-600">Sistema de Registro de Lesões</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <FormField
              label="E-mail"
              type="email"
              value={authData.email}
              onChange={(value) => setAuthData(prev => ({ ...prev, email: value }))}
              placeholder="seu@email.com"
              required
            />

            <FormField
              label="Senha"
              type="password"
              value={authData.password}
              onChange={(value) => setAuthData(prev => ({ ...prev, password: value }))}
              placeholder="Sua senha"
              required
            />

            {!isLogin && (
              <FormField
                label="Confirmar Senha"
                type="password"
                value={authData.confirmPassword}
                onChange={(value) => setAuthData(prev => ({ ...prev, confirmPassword: value }))}
                placeholder="Confirme sua senha"
                required
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Fazer login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!professional && !isCreatingProfile) {
    setIsCreatingProfile(true);
  }

  if (isCreatingProfile && !professional) {
    const handleCreateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const { error } = await createProfessional({
          ...profileData,
          email: user.email || ''
        });

        if (error) throw new Error(error);
        setIsCreatingProfile(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao criar perfil');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Criar Perfil</h1>
            <p className="text-slate-600">Complete suas informações profissionais</p>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-4">
            <FormField
              label="Nome Completo"
              type="text"
              value={profileData.full_name}
              onChange={(value) => setProfileData(prev => ({ ...prev, full_name: value }))}
              placeholder="Seu nome completo"
              required
            />

            <FormField
              label="Número de Registro"
              type="text"
              value={profileData.registration_number}
              onChange={(value) => setProfileData(prev => ({ ...prev, registration_number: value }))}
              placeholder="COREN-SP 123456"
              required
            />

            <FormField
              label="Especialidade"
              type="text"
              value={profileData.specialty}
              onChange={(value) => setProfileData(prev => ({ ...prev, specialty: value }))}
              placeholder="Enfermagem em Estomaterapia"
            />

            <FormField
              label="Instituição"
              type="text"
              value={profileData.institution}
              onChange={(value) => setProfileData(prev => ({ ...prev, institution: value }))}
              placeholder="Hospital ou clínica"
            />

            <FormField
              label="Telefone"
              type="tel"
              value={profileData.phone}
              onChange={(value) => setProfileData(prev => ({ ...prev, phone: value }))}
              placeholder="(11) 99999-9999"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Perfil'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;