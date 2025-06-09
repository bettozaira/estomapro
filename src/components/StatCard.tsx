import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  color
}) => {
  const isPositive = change.startsWith('+') || !change.startsWith('-');
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {change}
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
        <div className="text-sm text-slate-600">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;