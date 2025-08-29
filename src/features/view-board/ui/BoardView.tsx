import React, { useEffect, useState, useCallback } from 'react';
import { useBoardStore } from '../../../entities/board';
import { useColumnStore } from '../../../entities/column';
import { useDnDMonitor, useDropTarget, useSelectionStore } from '../../../shared/lib';
import { ColumnView } from './ColumnView';
import { AddColumnForm } from '../../add-column';
import { BulkOperationsBar } from '../../bulk-operations';
import { ColumnFilter } from '../../column-filter';
import { CardDetailSidebar } from '../../card-detail';
import { CardSearch } from '../../card-search';
import { type Card } from '../../../entities/card';

interface BoardViewProps {
  boardId: string;
}

export const BoardView: React.FC<BoardViewProps> = ({ boardId }) => {
  const { boards, setActiveBoard } = useBoardStore();
  const allColumns = useColumnStore(state => state.columns);
  const updateColumn = useColumnStore(state => state.updateColumn);
  const { toggleSelectMode, isSelectMode } = useSelectionStore();
  const [isDragging, setIsDragging] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserFiltered, setHasUserFiltered] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Set<string>>(new Set());
  
  const board = boards.find(b => b.id === boardId);
  const columns = allColumns
    .filter(column => column.boardId === boardId)
    .sort((a, b) => a.position - b.position);
    


  useDnDMonitor({
    onDragStart: () => setIsDragging(true),
    onDragEnd: () => setIsDragging(false),
  });

  // Initialize visible columns when columns change
  useEffect(() => {
    if (columns.length > 0) {
      if (!isInitialized) {
        // First time: show all columns
        setVisibleColumns(new Set(columns.map(col => col.id)));
        setIsInitialized(true);
      } else if (!hasUserFiltered) {
        // If user hasn't manually filtered, add new columns to visible set
        setVisibleColumns(prev => {
          const newSet = new Set(prev);
          let hasNewColumns = false;
          
          columns.forEach(col => {
            if (!newSet.has(col.id)) {
              newSet.add(col.id);
              hasNewColumns = true;
            }
          });
          
          return hasNewColumns ? newSet : prev;
        });
      }
    }
  }, [columns, isInitialized, hasUserFiltered]);

  const handleColumnReorder = (draggedColumnId: string, targetColumnId: string) => {
    const draggedColumn = columns.find(c => c.id === draggedColumnId);
    const targetColumn = columns.find(c => c.id === targetColumnId);
    
    if (!draggedColumn || !targetColumn) return;
    
    const draggedIndex = columns.findIndex(c => c.id === draggedColumnId);
    const targetIndex = columns.findIndex(c => c.id === targetColumnId);
    
    // Reorder the columns array
    const reorderedColumns = [...columns];
    reorderedColumns.splice(draggedIndex, 1);
    reorderedColumns.splice(targetIndex, 0, draggedColumn);
    
    // Update positions for all affected columns
    reorderedColumns.forEach((column, index) => {
      updateColumn(column.id, { position: index });
    });
  };

  const handleToggleColumn = (columnId: string) => {
    setHasUserFiltered(true);
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const handleShowAllColumns = () => {
    setHasUserFiltered(false);
    setVisibleColumns(new Set(columns.map(col => col.id)));
  };

  const handleHideAllColumns = () => {
    setHasUserFiltered(true);
    setVisibleColumns(new Set());
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedCard(null);
  };

  const handleSearchResults = useCallback((results: Set<string>) => {
    setSearchResults(results);
  }, []);

  useEffect(() => {
    if (board) {
      setActiveBoard(board);
    }
  }, [board, setActiveBoard]);

  if (!board) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Board not found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isDragging ? 'select-none' : ''}`}>
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{board.title}</h1>
            {board.description && (
              <p className="text-gray-600">{board.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <CardSearch boardId={boardId} onSearchResults={handleSearchResults} />
            <ColumnFilter
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={handleToggleColumn}
              onShowAll={handleShowAllColumns}
              onHideAll={handleHideAllColumns}
            />
            <button
              onClick={toggleSelectMode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isSelectMode 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isSelectMode ? 'Exit Select Mode' : 'Select Cards'}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden space-y-4">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{board.title}</h1>
            {board.description && (
              <p className="text-gray-600 text-sm sm:text-base">{board.description}</p>
            )}
          </div>

          {/* Search Bar - Full Width */}
          <div className="w-full">
            <CardSearch boardId={boardId} onSearchResults={handleSearchResults} />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2">
            <ColumnFilter
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={handleToggleColumn}
              onShowAll={handleShowAllColumns}
              onHideAll={handleHideAllColumns}
            />
            <button
              onClick={toggleSelectMode}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                isSelectMode 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isSelectMode ? 'Exit Select' : 'Select Cards'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4">
                      {columns
              .filter(column => visibleColumns.has(column.id))
              .map((column) => (
                <div key={column.id} className="w-80 flex-shrink-0">
                  <ColumnView 
                    column={column} 
                    onReorder={handleColumnReorder}
                    onCardClick={handleCardClick}
                    searchResults={searchResults}
                  />
                </div>
              ))}
          <div className="w-80 flex-shrink-0">
            <AddColumnForm boardId={boardId} />
          </div>
        </div>
      </div>
      <BulkOperationsBar />
      
      {/* Card Detail Sidebar */}
      <CardDetailSidebar
        card={selectedCard}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
    </div>
  );
};