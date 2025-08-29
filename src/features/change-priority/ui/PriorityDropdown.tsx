import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCardStore, type Card, type CardPriority, PRIORITY_CONFIGS } from '../../../entities/card';

interface PriorityDropdownProps {
  card: Card;
}

export const PriorityDropdown: React.FC<PriorityDropdownProps> = ({ card }) => {
  const { updateCard } = useCardStore();
  const priorityConfig = PRIORITY_CONFIGS.find(p => p.priority === card.priority);

  const handlePriorityChange = (newPriority: CardPriority) => {
    updateCard(card.id, { priority: newPriority });
  };

  return (
    <div className="relative group">
      <button className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${priorityConfig?.color} hover:opacity-80 transition-opacity`}>
        {priorityConfig?.label} Priority
        <ChevronDown size={12} />
      </button>
      
      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {PRIORITY_CONFIGS.map((priority) => (
          <button
            key={priority.priority}
            onClick={() => handlePriorityChange(priority.priority)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
              priority.priority === card.priority ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
          >
            {priority.label}
          </button>
        ))}
      </div>
    </div>
  );
};