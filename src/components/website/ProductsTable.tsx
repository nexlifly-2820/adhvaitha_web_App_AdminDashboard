"use client";

import { useState } from "react";
import { AddProductDialog } from "@/components/website/AddProductDialog";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Button } from "@/components/ui/button";

export interface WebsiteProduct {
  id: string;
  productName: string;
  productDescription: string;
  category: string;
  minQuantity: { value: string, unit: string };
  maxQuantity: { value: string, unit: string };
  images: string[];
  createdAt: string;
}

interface ProductsTableProps {
  data: WebsiteProduct[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function ProductsTable({ data, isLoading = false, onRefresh }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<WebsiteProduct | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/dashboard/website/api/delete-website-products?id=${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire('Deleted!', data.message, 'success');
            if (onRefresh) onRefresh();
          } else {
            Swal.fire('Error', data.error, 'error');
          }
        } catch (error: any) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    });
  };
  const columns: ColumnDef<WebsiteProduct>[] = [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const images = row.getValue("images") as string[];
        return images && images.length > 0 ? (
          <img src={images[0]} alt="Product" className="h-10 w-10 object-cover rounded-md" />
        ) : (
          <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center text-xs">No img</div>
        );
      },
    },
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      id: "quantityRange",
      header: "Quantity Range",
      cell: ({ row }) => {
        const min = row.original.minQuantity;
        const max = row.original.maxQuantity;
        if (!min || !max) return <div>N/A</div>;
        return <div>{min.value}{min.unit} - {max.value}{max.unit}</div>;
      }
    },
    {
      accessorKey: "productDescription",
      header: "Description",
      cell: ({ row }) => {
        const desc = row.getValue("productDescription") as string;
        return <div className="max-w-[200px] truncate">{desc}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setIsEditDialogOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(product.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Basic Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      
      {isEditDialogOpen && (
        <AddProductDialog 
          open={isEditDialogOpen} 
          setOpen={setIsEditDialogOpen} 
          initialData={editingProduct} 
          onProductAdded={() => { if (onRefresh) onRefresh(); setIsEditDialogOpen(false); }} 
        />
      )}
    </div>
  );
}
