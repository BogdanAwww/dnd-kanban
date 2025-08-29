import React, { useState, useRef } from 'react';
import { Calendar, Edit3, Check } from 'lucide-react';
import { type Card } from '../../../entities/card';
import { useDraggable, useDropTarget, useSelectionStore } from '../../../shared/lib';
import { EditCardForm } from '../../edit-card';
import { MoveCardDropdown } from '../../move-card';
import { PriorityDropdown } from '../../change-priority';
import { DeleteCardButton } from '../../delete-card';
import { Button } from '../../../shared/ui/Button';

interface CardViewProps {
  card: Card;
  onReorder?: (draggedCardId: string, targetCardId: string) => void;
  onCardClick?: (card: Card) => void;
  isSearchResult?: boolean;
}

export const CardView: React.FC<CardViewProps> = ({ card, onReorder, onCardClick, isSearchResult = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { selectedCards, toggleCard, isSelectMode } = useSelectionStore();
  const isSelected = selectedCards.has(card.id);

  useDraggable({
    ref: cardRef,
    data: {
      type: 'card',
      id: card.id,
      columnId: card.columnId,
      isSelected: isSelected,
      selectedCards: isSelectMode ? Array.from(selectedCards) : [card.id],
    },
  });

  useDropTarget({
    ref: cardRef,
    canDrop: ({ source }) => {
      return source.data.type === 'card' && 
             source.data.id !== card.id && 
             source.data.columnId === card.columnId;
    },
    onDrop: (result) => {
      const { source } = result;
      if (source.data.type === 'card' && onReorder) {
        onReorder(source.data.id, card.id);
      }
      setIsDraggedOver(false);
    },
  });
  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-lg p-4 shadow-sm border transition-all duration-200 ${
        isSelectMode ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${
        isDraggedOver 
          ? 'border-blue-400 shadow-lg transform scale-105' 
          : isSelected
          ? 'border-blue-500 bg-blue-50'
          : isSearchResult
          ? 'border-yellow-400 bg-yellow-50 shadow-md'
          : 'border-gray-200 hover:shadow-md'
      }`}
      onClick={() => {
        if (isSelectMode) {
          toggleCard(card.id);
        } else if (onCardClick) {
          onCardClick(card);
        }
      }}
      draggable={!isSelectMode || isSelected}
    >
      {isEditing ? (
        <EditCardForm 
          card={card} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
            {isSelectMode && (
              <div 
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300'
                }`}
              >
                {isSelected && <Check size={12} />}
              </div>
            )}
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{card.title}</h4>
              
            </div>
          </div>
            {!isSelectMode && (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                  title="Edit card"
                >
                  <Edit3 size={16} />
                </button>
                <DeleteCardButton card={card} />
              </div>
            )}
          </div>

          {card.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {card.description}
            </p>
          )}

          {!isSelectMode && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PriorityDropdown card={card} />
                <MoveCardDropdown card={card} />
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};