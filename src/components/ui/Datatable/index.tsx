import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "../Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode; // custom cell renderer
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  emptyText?: string;
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  emptyText = "Aucun enregistrement trouvé",
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / limit);
  const showingFrom = (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <div className="guest__table mt-8">
      <div className="overflow-x-auto rounded-3xl border border-borderlight dark:border-neutral-700">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key.toString()}
                  className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="dark:text-neutral-300">
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm"
                    >
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-6 text-sm text-gray-500 text-center"
                >
                  Aucun enregistrement trouvé
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="dark:text-neutral-300">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm"
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3">
          <div className="text-sm text-gray-600 dark:text-neutral-300">
            Affichage {showingFrom} sur {total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
            >
              <ArrowLeft size={16} /> Précédent
            </Button>
            {/* <span className="text-sm dark:text-neutral-300">
              Page {page} / {Math.max(1, totalPages)}
            </span> */}
            <Button
              variant="outline"
              size="small"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
            >
              Suivant <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
