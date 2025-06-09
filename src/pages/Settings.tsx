import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Bell, 
  Cloud, 
  Smartphone,
  Database,
  HelpCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'pt-BR',
    notifications: {
      evolution: true,
      photos: true,
      appointments: false
    },
    security: {
      biometric: false,
      autoLock: true,
      passwordProtection: true
    },
    backup: {
      autoBackup: true,
      cloudSync: false
    }
  });

  const handleToggle = (section: string, key: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: !prev[section as keyof typeof prev][key as keyof any]
      }
    }));
  };

  const handleSingleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const SettingCard = ({ 
    icon: Icon, 
    title, 
    children, 
    color = "text-blue-600" 
  }: { 
    icon: any, 
    title: string, 
    children: React.ReactNode,
    color?: string 
  }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <Icon className={`mr-2 ${color}`} size={20} />
        {title}
      </h3>
      {children}
    </div>
  );

  const ToggleItem = ({ 
    label, 
    description, 
    checked, 
    onChange 
  }: { 
    label: string, 
    description: string, 
    checked: boolean, 
    onChange: () => void 
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
      <div>
        <h4 className="font-medium text-slate-800">{label}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="p-4 pb-20">
      <PageHeader 
        title="Configurações"
        subtitle="Personalize suas preferências"
        onBack={() => navigate('/')}
      />

      {/* Appearance */}
      <SettingCard icon={Sun} title="Aparência">
        <ToggleItem
          label="Modo Escuro"
          description="Tema escuro para reduzir o cansaço visual"
          checked={settings.darkMode}
          onChange={() => handleSingleToggle('darkMode')}
        />
        <div className="py-3">
          <h4 className="font-medium text-slate-800 mb-2">Idioma</h4>
          <select
            value={settings.language}
            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>
      </SettingCard>

      {/* Security */}
      <SettingCard icon={Shield} title="Segurança" color="text-red-600">
        <ToggleItem
          label="Autenticação Biométrica"
          description="Use impressão digital ou Face ID"
          checked={settings.security.biometric}
          onChange={() => handleToggle('security', 'biometric')}
        />
        <ToggleItem
          label="Bloqueio Automático"
          description="Bloquear app após inatividade"
          checked={settings.security.autoLock}
          onChange={() => handleToggle('security', 'autoLock')}
        />
        <ToggleItem
          label="Proteção por Senha"
          description="Exigir senha para dados sensíveis"
          checked={settings.security.passwordProtection}
          onChange={() => handleToggle('security', 'passwordProtection')}
        />
      </SettingCard>

      {/* Notifications */}
      <SettingCard icon={Bell} title="Notificações" color="text-orange-600">
        <ToggleItem
          label="Evolução Pendente"
          description="Lembrete de evoluções não registradas"
          checked={settings.notifications.evolution}
          onChange={() => handleToggle('notifications', 'evolution')}
        />
        <ToggleItem
          label="Foto não Adicionada"
          description="Lembrete para adicionar fotos"
          checked={settings.notifications.photos}
          onChange={() => handleToggle('notifications', 'photos')}
        />
        <ToggleItem
          label="Agendamentos"
          description="Notificações de consultas marcadas"
          checked={settings.notifications.appointments}
          onChange={() => handleToggle('notifications', 'appointments')}
        />
      </SettingCard>

      {/* Backup & Sync */}
      <SettingCard icon={Cloud} title="Backup e Sincronização" color="text-emerald-600">
        <ToggleItem
          label="Backup Automático"
          description="Backup local dos dados"
          checked={settings.backup.autoBackup}
          onChange={() => handleToggle('backup', 'autoBackup')}
        />
        <ToggleItem
          label="Sincronização na Nuvem"
          description="Sincronizar com Google Drive"
          checked={settings.backup.cloudSync}
          onChange={() => handleToggle('backup', 'cloudSync')}
        />
        <div className="py-3 border-t border-slate-100">
          <button className="w-full py-3 px-4 bg-emerald-100 text-emerald-700 rounded-xl font-medium hover:bg-emerald-200 transition-colors duration-200">
            Fazer Backup Agora
          </button>
        </div>
      </SettingCard>

      {/* Data Management */}
      <SettingCard icon={Database} title="Gerenciamento de Dados" color="text-purple-600">
        <div className="space-y-3">
          <button className="w-full py-3 px-4 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors duration-200 text-left">
            Exportar Todos os Dados
          </button>
          <button className="w-full py-3 px-4 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-colors duration-200 text-left">
            Limpar Cache
          </button>
          <button className="w-full py-3 px-4 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors duration-200 text-left">
            Apagar Todos os Dados
          </button>
        </div>
      </SettingCard>

      {/* App Info */}
      <SettingCard icon={HelpCircle} title="Informações do App" color="text-slate-600">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-700">Versão</span>
            <span className="text-slate-600">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-700">Última Atualização</span>
            <span className="text-slate-600">15/01/2024</span>
          </div>
          <button className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors duration-200 text-left">
            Verificar Atualizações
          </button>
          <button className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors duration-200 text-left">
            Termos de Uso e Privacidade
          </button>
        </div>
      </SettingCard>

      {/* Install PWA */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center mb-4">
          <Smartphone className="mr-3" size={24} />
          <div>
            <h3 className="font-semibold">Instalar ESTOMAPRO</h3>
            <p className="text-blue-100 text-sm">Acesso rápido na tela inicial</p>
          </div>
        </div>
        <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors duration-200">
          Adicionar à Tela Inicial
        </button>
      </div>
    </div>
  );
};

export default Settings;