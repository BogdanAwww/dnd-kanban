import React, { useState } from 'react';
import { useSelectionStore } from '../../../shared/lib/selection';
import { useCardStore } from '../../../entities/card';
import { useColumnStore } from '../../../entities/column';
import { Button } from '../../../shared/ui/Button';

export const BulkOperationsBar: React.FC = () => {
  const { selectedCards, clearSelection, isSelectMode } = useSelectionStore();
  const { deleteCard, updateCard, moveMultipleCards } = useCardStore();
  const { getColumnsByBoard } = useColumnStore();
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('');

  const selectedCount = selectedCards.size;
  const selectedArray = Array.from(selectedCards);

  // Get all columns for move operation
  const allColumns = getColumnsByBoard('board-1'); // Assuming single board for now

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedCount} card(s)?`)) {
      selectedArray.forEach(cardId => {
        deleteCard(cardId);
      });
      clearSelection();
    }
  };

  const handleMarkComplete = () => {
    selectedArray.forEach(cardId => {
      updateCard(cardId, { priority: 'high' }); // Using priority as a simple completion indicator
    });
    clearSelection();
  };

  const handleMarkIncomplete = () => {
    selectedArray.forEach(cardId => {
      updateCard(cardId, { priority: 'low' });
    });
    clearSelection();
  };

  const handleMove = () => {
    if (targetColumnId) {
      moveMultipleCards(selectedArray, targetColumnId);
      clearSelection();
      setShowMoveDropdown(false);
      setTargetColumnId('');
    }
  };

  if (!isSelectMode || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {selectedCount} card{selectedCount !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1"
            >
              Delete
            </Button>
            
            <Button
              onClick={handleMarkComplete}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1"
            >
              Mark Complete
            </Button>
            
            <Button
              onClick={handleMarkIncomplete}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1"
            >
              Mark Incomplete
            </Button>
            
            <div className="relative">
              <Button
                onClick={() => setShowMoveDropdown(!showMoveDropdown)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1"
              >
                Move To
              </Button>
              
              {showMoveDropdown && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-48">
                  <div className="text-xs text-gray-500 mb-2 px-2">Select column:</div>
                  {allColumns.map(column => (
                    <button
                      key={column.id}
                      onClick={() => {
                        setTargetColumnId(column.id);
                        handleMove();
                      }}
                      className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                    >
                      {column.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              onClick={clearSelection}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
