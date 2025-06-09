import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  hoverColor: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  description,
  color,
  hoverColor,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`${color} ${hoverColor} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
          <Icon size={24} />
        </div>
        <div className="w-2 h-2 bg-white/30 rounded-full"></div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{label}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </button>
  );
};

export default ActionButton;