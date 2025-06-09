import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mr-4 hover:bg-slate-50 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-slate-600 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;