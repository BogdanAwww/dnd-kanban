import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCardStore, type Card } from '../../../entities/card';
import { COLUMN_CONFIGS } from '../../../entities/column';
import { useColumnStore } from '../../../entities/column';

interface MoveCardDropdownProps {
  card: Card;
}

export const MoveCardDropdown: React.FC<MoveCardDropdownProps> = ({ card }) => {
  const { moveCard } = useCardStore();
  const { columns, moveCardBetweenColumns } = useColumnStore();

  const currentColumn = columns.find(col => col.id === card.columnId);
  const availableColumns = columns.filter(col => col.boardId === currentColumn?.boardId);

  const handleMoveToColumn = (newColumnId: string) => {
    if (newColumnId !== card.columnId) {
      moveCardBetweenColumns(card.id, card.columnId, newColumnId);
      moveCard(card.id, newColumnId);
    }
  };

  return (
    <div className="relative group">
      <button className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 bg-gray-100 text-gray-800 hover:opacity-80 transition-opacity">
        Move
        <ChevronDown size={12} />
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {availableColumns.map((column) => {
          const config = COLUMN_CONFIGS.find(c => c.status === column.status);
          return (
            <button
              key={column.id}
              onClick={() => handleMoveToColumn(column.id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                column.id === card.columnId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {column.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};