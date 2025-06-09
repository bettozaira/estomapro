import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Download, Filter, Calendar, User, FileText, Share2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    patient: '',
    startDate: '',
    endDate: '',
    reportType: 'complete'
  });

  const mockReports = [
    {
      id: 1,
      patientName: 'Maria Santos',
      dateRange: '01/01/2024 - 15/01/2024',
      evolutions: 8,
      photos: 12,
      procedures: 'Limpeza, curativo, debridamento',
      status: 'ready'
    },
    {
      id: 2,
      patientName: 'João Silva',
      dateRange: '05/01/2024 - 15/01/2024',
      evolutions: 5,
      photos: 8,
      procedures: 'Curativo, medicação tópica',
      status: 'ready'
    }
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const generateReport = () => {
    console.log('Generating report with filters:', filters);
    // Here you would implement the actual report generation
  };

  return (
    <div className="p-4 pb-20">
      <PageHeader 
        title="Relatórios"
        subtitle="Gere e exporte relatórios profissionais"
        onBack={() => navigate('/')}
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Filter className="mr-2 text-blue-600" size={20} />
          Filtros
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Paciente
            </label>
            <select
              value={filters.patient}
              onChange={(e) => handleFilterChange('patient', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Todos os pacientes</option>
              <option value="maria-santos">Maria Santos</option>
              <option value="joao-silva">João Silva</option>
              <option value="ana-costa">Ana Costa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => handleFilterChange('reportType', e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="complete">Completo</option>
              <option value="evolution">Apenas Evoluções</option>
              <option value="photos">Apenas Fotos</option>
              <option value="summary">Resumo</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={generateReport}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <BarChart3 className="mr-2" size={20} />
            Gerar Relatório
          </button>
          <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors duration-200">
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <FileText className="mr-2 text-emerald-600" size={20} />
          Relatórios Disponíveis
        </h3>

        <div className="space-y-4">
          {mockReports.map((report) => (
            <div key={report.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-slate-800">{report.patientName}</h4>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Pronto
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{report.dateRange}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{report.evolutions} evoluções</span>
                    <span>{report.photos} fotos</span>
                    <span>Procedimentos: {report.procedures}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors duration-200">
                    <Download size={16} />
                  </button>
                  <button className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors duration-200">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
          <Download className="mb-3" size={24} />
          <h4 className="font-semibold mb-2">Exportar PDF</h4>
          <p className="text-blue-100 text-sm mb-4">Relatório completo em PDF</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            Gerar PDF
          </button>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white">
          <FileText className="mb-3" size={24} />
          <h4 className="font-semibold mb-2">Exportar Excel</h4>
          <p className="text-emerald-100 text-sm mb-4">Dados em planilha</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            Gerar Excel
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
          <Share2 className="mb-3" size={24} />
          <h4 className="font-semibold mb-2">Compartilhar</h4>
          <p className="text-purple-100 text-sm mb-4">Via link ou e-mail</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;