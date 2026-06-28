"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, Loader2 } from "lucide-react";
import { OrderDetails } from "@/types/order";
import { format } from "date-fns";

interface OrdersTableProps {
  data: OrderDetails[];
  onRowClick: (order: OrderDetails) => void;
  isLoading?: boolean;
  startIndex?: number;
}

export function OrdersTable({ data, onRowClick, isLoading = false, startIndex = 0 }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<OrderDetails>[] = [
    {
      id: "serialNumber",
      header: "S.No",
      cell: ({ row }) => <div className="text-center font-medium text-muted-foreground">{startIndex + row.index + 1}</div>,
    },
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-8 data-[state=open]:bg-accent"
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile Number",
    },
    {
      accessorKey: "productName",
      header: "Product",
      cell: ({ row }) => {
        const order = row.original;
        const mainProduct = order.products[0]?.name || "Unknown Product";
        const extraCount = order.products.length - 1;
        return (
          <div className="max-w-[200px] truncate" title={mainProduct}>
            {mainProduct} {extraCount > 0 && <span className="text-muted-foreground text-xs">(+{extraCount})</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 h-8"
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => {
        return <div>{format(new Date(row.getValue("orderDate")), "MMM dd, yyyy")}</div>;
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const order = row.original;
        const isCOD = order.paymentMethod?.toUpperCase().includes('COD');
        
        return (
          <Badge 
            variant={isCOD ? "secondary" : "default"} 
            className={isCOD ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-emerald-500 hover:bg-emerald-600 text-white"}
          >
            {isCOD ? "COD" : "PAID"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("orderStatus") as string;
        return <Badge variant="outline">{status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(row.original);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-card">
      <Table wrapperClassName="flex-1 min-h-0 overflow-auto">
        <TableHeader className="bg-slate-800 text-slate-100 dark:bg-slate-900 sticky top-0 z-10 shadow-sm [&_th]:text-slate-200 [&_button]:text-slate-200 hover:[&_button]:text-slate-100 hover:[&_button]:bg-slate-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-3" />
                  <span className="text-slate-500">Loading orders...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
