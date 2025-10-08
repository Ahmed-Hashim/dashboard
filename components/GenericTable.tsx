"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  itemsPerPage?: number; // ✅ عدد العناصر في كل صفحة
}

/**
 * 🔁 GenericTable مع Pagination
 */
export default function GenericTable<T extends object>({
  columns,
  data,
  loading = false,
  emptyMessage = "لا توجد بيانات للعرض.",
  loadingMessage = "جاري تحميل البيانات...",
  itemsPerPage = 10,
}: GenericTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const columnCount = columns.length;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key.toString()} className="text-right">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : currentData.length > 0 ? (
              currentData.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key.toString()}
                      className={col.className}
                    >
                      {col.render
                        ? col.render(item)
                        : String(item[col.key] ?? "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            السابق
          </Button>

          <span className="text-sm">
            الصفحة {currentPage} من {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
}
