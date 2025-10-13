"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface TableColumn<T> {
  title: string;
  // keyof T ensures that 'key' is a valid property of the data object
  key: keyof T;
  render?: (item: T) => React.ReactNode;
}

// ✅ Add a type constraint: T must be an object with an id.
interface GenericTableProps<T extends { id: string | number }> {
  data: T[];
  columns: TableColumn<T>[];
}

// ✅ Apply the same constraint to the component's generic type parameter.
export const GenericTable = <T extends { id: string | number }>({
  data,
  columns,
}: GenericTableProps<T>) => (
  <Table>
    <TableHeader>
      <TableRow>
        {columns.map((col) => (
          // Using String() is good practice for keys that might be numbers
          <TableHead key={String(col.key)}>{col.title}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {/* ✅ Remove ': any'. TypeScript now correctly infers 'item' is of type 'T'. */}
      {data.map((item) => (
        // ✅ item.id is now safe to access because of the type constraint.
        <TableRow key={item.id}>
          {columns.map((col) => (
            <TableCell key={String(col.key)}>
              {/* ✅ Both col.render(item) and item[col.key] are fully type-checked. */}
              {col.render ? col.render(item) : (item[col.key] as React.ReactNode)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);