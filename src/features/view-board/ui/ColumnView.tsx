import React, { useRef, useState } from 'react';
import { type Column, COLUMN_CONFIGS } from '../../../entities/column';
import { useCardStore, type Card } from '../../../entities/card';
import { useColumnStore } from '../../../entities/column';
import { useBoardStore } from '../../../entities/board';
import { useDropTarget, useDraggable, useSelectionStore } from '../../../shared/lib';
import { CardView } from './CardView';
import { AddCardButton } from '../../add-card';

interface ColumnViewProps {
  column: Column;
  onReorder?: (draggedColumnId: string, targetColumnId: string) => void;
  onCardClick?: (card: Card) => void;
  searchResults?: Set<string>;
}

export const ColumnView: React.FC<ColumnViewProps> = ({ column, onReorder, onCardClick, searchResults = new Set() }) => {
  console.log('column', column)
  const { getCardsByColumn, moveCard, moveMultipleCards, updateCard } = useCardStore();
  const { moveCardBetweenColumns, deleteColumn } = useColumnStore();
  const { removeColumnFromBoard } = useBoardStore();
  const { selectAll, deselectAll, isSelectMode, clearSelection } = useSelectionStore();
  const cards = getCardsByColumn(column.id);
  const config = COLUMN_CONFIGS.find(c => c.status === column.status);
  const columnRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCardReorder = (draggedCardId: string, targetCardId: string) => {
    const draggedCard = cards.find(c => c.id === draggedCardId);
    const targetCard = cards.find(c => c.id === targetCardId);
    
    if (!draggedCard || !targetCard) return;
    
    const draggedIndex = cards.findIndex(c => c.id === draggedCardId);
    const targetIndex = cards.findIndex(c => c.id === targetCardId);
    
    // Reorder the cards array
    const reorderedCards = [...cards];
    reorderedCards.splice(draggedIndex, 1);
    reorderedCards.splice(targetIndex, 0, draggedCard);
    
    // Update positions for all affected cards
    reorderedCards.forEach((card, index) => {
      updateCard(card.id, { position: index });
    });
  };

  const handleDeleteColumn = () => {
    // Delete all cards in the column first
    cards.forEach(card => {
      // This will be handled by the store
    });
    
    // Remove column from board and delete column
    removeColumnFromBoard(column.boardId, column.id);
    deleteColumn(column.id);
    setShowDeleteConfirm(false);
  };

  // Make column draggable
  useDraggable({
    ref: columnRef,
    data: {
      type: 'column',
      id: column.id,
      columnId: column.id,
    },
  });

  useDropTarget({
    ref: columnRef,
    canDrop: ({ source }) => {
      // Allow dropping cards from other columns
      if (source.data.type === 'card' && source.data.columnId !== column.id) {
        return true;
      }
      // Allow dropping columns for reordering
      if (source.data.type === 'column' && source.data.columnId !== column.id) {
        return true;
      }
      return false;
    },
    onDrop: (result) => {
      const { source } = result;
      if (source.data.type === 'card') {
        // Check if this is a multi-card drag
        if (source.data.selectedCards && source.data.selectedCards.length > 1) {
          // Move multiple cards
          moveMultipleCards(source.data.selectedCards, column.id);
          // Update column relationships for all moved cards
          source.data.selectedCards.forEach((cardId: string) => {
            moveCardBetweenColumns(cardId, source.data.columnId, column.id);
          });
          // Clear selection after moving
          clearSelection();
        } else {
          // Move single card
          moveCardBetweenColumns(source.data.id, source.data.columnId, column.id);
          moveCard(source.data.id, column.id);
        }
      } else if (source.data.type === 'column' && onReorder) {
        onReorder(source.data.columnId, column.id);
      }
    },
  });

  return (
    <div 
      ref={columnRef}
      className="bg-gray-50 rounded-xl p-6 min-h-[500px] transition-colors duration-200 hover:bg-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="cursor-move text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{column.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}>
            {cards.length}
          </span>
          {isSelectMode && cards.length > 0 && (
            <button
              onClick={() => selectAll(cards.map(c => c.id))}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              title="Select all cards in this column"
            >
              Select All
            </button>
          )}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete column"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks in {column.title.toLowerCase()}</p>
          </div>
        ) : (
          cards.map((card) => (
            <CardView 
              key={card.id} 
              card={card} 
              onReorder={handleCardReorder} 
              onCardClick={onCardClick}
              isSearchResult={searchResults.has(card.id)}
            />
          ))
        )}
        <AddCardButton columnId={column.id} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Column</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{column.title}"? This will also delete all {cards.length} cards in this column.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteColumn}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};