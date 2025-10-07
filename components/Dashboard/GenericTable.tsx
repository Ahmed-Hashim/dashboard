"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableColumn<T> {
  title: string;
  key: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
}

export const GenericTable = <T,>({ data, columns }: GenericTableProps<T>) => (
  <Table>
    <TableHeader>
      <TableRow>
        {columns.map((col) => (
          <TableHead key={String(col.key)}>{col.title}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item: any) => (
        <TableRow key={item.id}>
          {columns.map((col) => (
            <TableCell key={String(col.key)}>
              {col.render ? col.render(item) : item[col.key]}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
