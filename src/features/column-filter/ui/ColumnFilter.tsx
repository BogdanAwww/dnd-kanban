import React, { useState } from 'react';
import { type Column } from '../../../entities/column';
import { Button } from '../../../shared/ui/Button';

interface ColumnFilterProps {
  columns: Column[];
  visibleColumns: Set<string>;
  onToggleColumn: (columnId: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export const ColumnFilter: React.FC<ColumnFilterProps> = ({
  columns,
  visibleColumns,
  onToggleColumn,
  onShowAll,
  onHideAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCount = visibleColumns.size;
  const totalCount = columns.length;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
        variant='secondary'
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          <span className="hidden sm:inline">Columns</span>
          <span className="sm:hidden">Cols</span>
          ({visibleCount}/{totalCount})
        </span>
      </Button>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 z-50 lg:min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Column Filter</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {columns.map((column) => {
              const isVisible = visibleColumns.has(column.id);
              
              return (
                <label key={column.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => onToggleColumn(column.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{column.title}</span>
                  <span className="text-xs text-gray-500">({column.cardIds.length})</span>
                </label>
              );
            })}
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <Button
              onClick={onShowAll}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1"
            >
              Show All
            </Button>
            <Button
              onClick={onHideAll}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm py-1"
            >
              Hide All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
