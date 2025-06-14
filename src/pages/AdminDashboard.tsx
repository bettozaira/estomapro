import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  UserCheck, 
  UserX, 
  Activity, 
  DollarSign,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  CreditCard,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Crown,
  Star,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  registration_number: string;
  specialty?: string;
  institution?: string;
  created_at: string;
  account_status: 'pending' | 'active' | 'suspended' | 'expired';
  subscription_tier: string;
  trial_ends_at?: string;
  last_sign_in?: string;
}

interface SubscriptionRequest {
  id: string;
  user_name: string;
  user_email: string;
  plan_name: string;
  request_type: 'new_account' | 'upgrade' | 'renewal';
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'requests' | 'revenue'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'expired'>('all');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const { data: professionals, error: usersError } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Simulate subscription data and status
      const usersWithStatus: AdminUser[] = professionals.map(prof => ({
        ...prof,
        account_status: prof.account_status || (Math.random() > 0.7 ? 'pending' : Math.random() > 0.9 ? 'suspended' : 'active'),
        subscription_tier: prof.subscription_tier || (Math.random() > 0.6 ? 'free' : Math.random() > 0.5 ? 'professional' : 'clinic'),
        last_sign_in: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));

      setUsers(usersWithStatus);

      // Simulate subscription requests
      const mockRequests: SubscriptionRequest[] = [
        {
          id: '1',
          user_name: 'Dr. Ana Silva',
          user_email: 'ana.silva@hospital.com',
          plan_name: 'Profissional',
          request_type: 'new_account',
          status: 'pending',
          requested_at: new Date().toISOString()
        },
        {
          id: '2',
          user_name: 'Enf. Carlos Santos',
          user_email: 'carlos@clinica.com',
          plan_name: 'Clínica',
          request_type: 'upgrade',
          status: 'pending',
          requested_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'suspend' | 'activate' | 'delete') => {
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('professionals')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        const newStatus = action === 'approve' ? 'active' : action === 'suspend' ? 'suspended' : 'active';
        
        const { error } = await supabase
          .from('professionals')
          .update({ 
            account_status: newStatus,
            approved_at: action === 'approve' ? new Date().toISOString() : undefined
          })
          .eq('id', userId);

        if (error) throw error;
        
        setUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, account_status: newStatus as any }
            : u
        ));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' }
        : r
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.registration_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.account_status === 'active').length,
    pendingUsers: users.filter(u => u.account_status === 'pending').length,
    suspendedUsers: users.filter(u => u.account_status === 'suspended').length,
    monthlyRevenue: 15420.50,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    freeUsers: users.filter(u => u.subscription_tier === 'free').length,
    paidUsers: users.filter(u => u.subscription_tier !== 'free').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      case 'expired': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'suspended': return 'Suspenso';
      case 'expired': return 'Expirado';
      default: return 'Desconhecido';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'free': return <Star className="w-4 h-4 text-slate-500" />;
      case 'professional': return <Crown className="w-4 h-4 text-blue-500" />;
      case 'clinic': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Star className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTierText = (tier: string) => {
    switch (tier) {
      case 'free': return 'Gratuito';
      case 'professional': return 'Profissional';
      case 'clinic': return 'Clínica';
      default: return 'Gratuito';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Painel Administrativo</h1>
                <p className="text-sm text-slate-600">ESTOMAPRO - Gerenciamento de Assinaturas</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
            >
              <LogOut className="mr-2" size={16} />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex border-b border-slate-200">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Activity },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'requests', label: 'Solicitações', icon: AlertTriangle },
              { id: 'revenue', label: 'Receita', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="mr-2" size={20} />
                {tab.label}
                {tab.id === 'requests' && stats.pendingRequests > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {stats.pendingRequests}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Executivo</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total de Usuários</p>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-12 h-12 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">Usuários Ativos</p>
                        <p className="text-3xl font-bold">{stats.activeUsers}</p>
                      </div>
                      <UserCheck className="w-12 h-12 text-emerald-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Pendentes</p>
                        <p className="text-3xl font-bold">{stats.pendingUsers}</p>
                      </div>
                      <AlertTriangle className="w-12 h-12 text-orange-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Receita Mensal</p>
                        <p className="text-3xl font-bold">R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Ações Rápidas</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('requests')}
                        className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-orange-700 font-medium">Aprovar Contas</span>
                          <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {stats.pendingRequests}
                          </span>
                        </div>
                      </button>
                      <button 
                        onClick={() => setActiveTab('users')}
                        className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-blue-700 font-medium">Gerenciar Usuários</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('revenue')}
                        className="w-full text-left p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-emerald-700 font-medium">Ver Relatórios</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Distribuição de Planos</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-700">Gratuito</span>
                        </div>
                        <span className="font-semibold text-slate-800">{stats.freeUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Crown className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-slate-700">Profissional</span>
                        </div>
                        <span className="font-semibold text-slate-800">{Math.floor(stats.paidUsers * 0.7)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 text-purple-500 mr-2" />
                          <span className="text-slate-700">Clínica</span>
                        </div>
                        <span className="font-semibold text-slate-800">{Math.floor(stats.paidUsers * 0.3)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Métricas do Mês</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Novos Usuários</span>
                        <span className="font-semibold text-emerald-600">+{Math.floor(stats.totalUsers * 0.15)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Upgrades</span>
                        <span className="font-semibold text-blue-600">+{Math.floor(stats.paidUsers * 0.2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Cancelamentos</span>
                        <span className="font-semibold text-red-600">-{Math.floor(stats.totalUsers * 0.05)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Gerenciamento de Usuários</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="active">Ativos</option>
                      <option value="pending">Pendentes</option>
                      <option value="suspended">Suspensos</option>
                      <option value="expired">Expirados</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Usuário
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Registro
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Plano
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Último Acesso
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900">{user.full_name}</div>
                                <div className="text-sm text-slate-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              {user.registration_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getTierIcon(user.subscription_tier)}
                                <span className="ml-2 text-sm text-slate-900">{getTierText(user.subscription_tier)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.account_status)}`}>
                                {getStatusText(user.account_status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString('pt-BR') : 'Nunca'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                {user.account_status === 'pending' && (
                                  <button
                                    onClick={() => handleUserAction(user.id, 'approve')}
                                    className="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                                    title="Aprovar"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                {user.account_status === 'active' && (
                                  <button
                                    onClick={() => handleUserAction(user.id, 'suspend')}
                                    className="text-orange-600 hover:text-orange-900 p-1 rounded"
                                    title="Suspender"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                )}
                                {user.account_status === 'suspended' && (
                                  <button
                                    onClick={() => handleUserAction(user.id, 'activate')}
                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                    title="Reativar"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                  title="Visualizar"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, 'delete')}
                                  className="text-red-600 hover:text-red-900 p-1 rounded"
                                  title="Excluir"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Users size={48} className="mx-auto text-slate-400 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Nenhum usuário encontrado</h3>
                      <p className="text-slate-600">Tente ajustar os filtros de busca</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Solicitações de Assinatura</h2>
                
                <div className="space-y-4">
                  {requests.filter(r => r.status === 'pending').map((request) => (
                    <div key={request.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-800">{request.user_name}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {request.plan_name}
                            </span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                              {request.request_type === 'new_account' ? 'Nova Conta' : 
                               request.request_type === 'upgrade' ? 'Upgrade' : 'Renovação'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{request.user_email}</p>
                          <p className="text-xs text-slate-500">
                            Solicitado em {new Date(request.requested_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors duration-200 font-medium"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                          >
                            Rejeitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {requests.filter(r => r.status === 'pending').length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Nenhuma solicitação pendente</h3>
                      <p className="text-slate-600">Todas as solicitações foram processadas</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Relatórios Financeiros</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium">Receita Mensal</p>
                        <p className="text-3xl font-bold">R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}</p>
                        <p className="text-emerald-200 text-sm">+12% vs mês anterior</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-emerald-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Assinantes Pagos</p>
                        <p className="text-3xl font-bold">{stats.paidUsers}</p>
                        <p className="text-blue-200 text-sm">Taxa de conversão: 23%</p>
                      </div>
                      <CreditCard className="w-12 h-12 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Ticket Médio</p>
                        <p className="text-3xl font-bold">R$ 67,50</p>
                        <p className="text-purple-200 text-sm">Por usuário/mês</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-purple-200" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Resumo de Planos</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-slate-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-slate-800">Plano Gratuito</h4>
                          <p className="text-sm text-slate-600">R$ 0/mês</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{stats.freeUsers} usuários</p>
                        <p className="text-sm text-slate-600">R$ 0</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Crown className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-slate-800">Plano Profissional</h4>
                          <p className="text-sm text-slate-600">R$ 29,90/mês</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{Math.floor(stats.paidUsers * 0.7)} usuários</p>
                        <p className="text-sm text-slate-600">R$ {(Math.floor(stats.paidUsers * 0.7) * 29.90).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 text-purple-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-slate-800">Plano Clínica</h4>
                          <p className="text-sm text-slate-600">R$ 99,90/mês</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{Math.floor(stats.paidUsers * 0.3)} usuários</p>
                        <p className="text-sm text-slate-600">R$ {(Math.floor(stats.paidUsers * 0.3) * 99.90).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;