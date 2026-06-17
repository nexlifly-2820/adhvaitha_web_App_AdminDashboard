"use client";

import { useState } from "react";
import { AddRecipeDialog } from "@/components/website/AddRecipeDialog";
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
import { Badge } from "@/components/ui/badge";

export interface WebsiteRecipe {
  id: string;
  recipeName: string;
  recipeDescription: string;
  category: string;
  ingredients: string[];
  makingProcess: string;
  difficulty: string;
  makingTime: { value: string, unit: string };
  createdAt: string;
}

interface RecipesTableProps {
  data: WebsiteRecipe[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function RecipesTable({ data, isLoading = false, onRefresh }: RecipesTableProps) {
  const [editingRecipe, setEditingRecipe] = useState<WebsiteRecipe | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure to delete this recipe?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/dashboard/website/api/delete-website-recipes?id=${id}`, {
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
  const columns: ColumnDef<WebsiteRecipe>[] = [
    {
      accessorKey: "recipeName",
      header: "Recipe Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("recipeName")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.getValue("difficulty")}</Badge>
    },
    {
      id: "makingTime",
      header: "Time",
      cell: ({ row }) => {
        const makingTime = row.original.makingTime;
        return makingTime ? <div>{makingTime.value} {makingTime.unit}</div> : <div>N/A</div>;
      }
    },
    {
      accessorKey: "ingredients",
      header: "Ingredients",
      cell: ({ row }) => {
        const ings = row.getValue("ingredients") as string[];
        return <div className="max-w-[200px] truncate">{ings?.join(", ")}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const recipe = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => { setEditingRecipe(recipe); setIsEditDialogOpen(true); }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(recipe.id)}>
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
                    Loading recipes...
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
                    No recipes found.
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
        <AddRecipeDialog 
          open={isEditDialogOpen} 
          setOpen={setIsEditDialogOpen} 
          initialData={editingRecipe} 
          onRecipeAdded={() => { if (onRefresh) onRefresh(); setIsEditDialogOpen(false); }} 
        />
      )}
    </div>
  );
}
