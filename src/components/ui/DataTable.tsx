import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";
import { Edit, Trash2 } from "lucide-react";
import { type ReactNode } from 'react';
import { cn } from "../../lib/utils";

export type AccessorFn<T> = (item: T) => ReactNode;

export interface Column<T> {
  header: string;
  accessor: keyof T | AccessorFn<T>;
  cell?: (value: any, item: T) => ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: T['id']) => void;
  emptyMessage?: string;
  className?: string;
  'aria-label'?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = "No data available",
  className = "",
  'aria-label': ariaLabel = "Data table",
}: DataTableProps<T>) {
  return (
    <div className={`rounded-md border ${className}`}>
      <Table aria-label={ariaLabel}>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead 
                key={index} 
                className={cn(
                  column.className,
                  column.align === 'center' ? 'text-center' : 
                  column.align === 'right' ? 'text-right' : 'text-left'
                )}
              >
                {column.header}
              </TableHead>
            ))}
            {(onEdit || onDelete) && (
              <TableHead className="w-[120px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id} className="group hover:bg-gray-50">
                {columns.map((column, colIndex) => {
                  const value = typeof column.accessor === 'function' 
                    ? column.accessor(item)
                    : item[column.accessor as keyof T];
                  
                  const cellContent = column.cell 
                    ? column.cell(value, item) 
                    : value != null ? String(value) : '-';
                  
                  return (
                    <TableCell 
                      key={colIndex} 
                      className={cn(
                        column.className,
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left',
                        'py-3'
                      )}
                    >
                      {cellContent}
                    </TableCell>
                  );
                })}
                {(onEdit || onDelete) && (
                  <TableCell className="w-[120px] text-right">
                    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          aria-label={`Edit ${item.id}`}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item.id)}
                          aria-label={`Delete ${item.id}`}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                className="h-24 text-center text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
