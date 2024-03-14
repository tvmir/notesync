'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  TableMeta,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  MoreHorizontal,
} from 'lucide-react';
import { v4 } from 'uuid';
import { Task } from '@/types/supabase';
import { createTask } from '@/lib/supabase/queries';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { CreateTaskForm } from '@/types/form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  notebookId: string;
}

interface CustomTableMeta<TData> extends TableMeta<TData> {
  addRow: () => void;
  updateRow: (id: string) => void;
  removeRow: (id: string) => void;
}

type WithIdTaskStatus<T> = T & Task;

export function DataTable<TData extends Task, TValue>({
  columns,
  data,
  notebookId,
}: DataTableProps<TData, TValue>) {
  const supabase = createClientComponentClient();

  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [tableData, setTableData] = useState<WithIdTaskStatus<TData>[]>(data);
  const [inputTaskName, setInputTaskName] = useState<string>('');
  const [inputStatus, setInputStatus] = useState<string>('Todo');

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 3,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      addRow: async () => {
        const newTask = {
          id: v4(),
          task: inputTaskName,
          status: inputStatus,
          notebookId,
        } as WithIdTaskStatus<TData>;

        setTableData([...tableData, newTask]);

        const { error } = await createTask(newTask);

        if (error) {
          toast({
            title: 'Error',
            description: 'Unable to create this task, please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            description: 'Task has been created.',
          });
        }
      },
      updateRow: async (id: string) => {
        const { error } = await supabase
          .from('tasks')
          .update({
            task: inputTaskName,
            status: inputStatus,
          })
          .eq('id', id);

        setTableData([...tableData]);

        if (error) {
          toast({
            title: 'Error',
            description: 'Unable to edit this task, please try again.',
            variant: 'destructive',
          });
        }

        const { data: updatedRows, error: fetchError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id);

        if (fetchError) return;

        setTableData((prevTableData) => {
          const rowIndex = prevTableData.findIndex((row) => row.id === id);
          if (rowIndex !== -1) {
            const updatedTableData = [...prevTableData];
            updatedTableData[rowIndex] = updatedRows[0];
            return updatedTableData;
          }
          return prevTableData;
        });
      },
      removeRow: async (id: string) => {
        setTableData((prevData) => prevData.filter((row) => row.id !== id));

        const { error } = await supabase.from('tasks').delete().eq('id', id);

        if (error) {
          toast({
            title: 'Error',
            description: 'Unable to remove this task, please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            description: 'Task has been removed.',
          });
        }
      },
    },
  });

  const meta = table.options.meta as CustomTableMeta<TData>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('task')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('task')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="space-x-2 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a task</DialogTitle>
                <DialogDescription>
                  Click save when you are done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task" className="text-right">
                    Task
                  </Label>
                  <Input
                    id="taskI"
                    value={inputTaskName}
                    className="col-span-3"
                    onChange={(e) => setInputTaskName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Input
                    id="statusI"
                    value={inputStatus}
                    className="col-span-3"
                    onChange={(e) => setInputStatus(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit" onClick={meta?.addRow}>
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => meta.removeRow(row.original.id)}
                          className="cursor-pointer"
                        >
                          Delete
                        </DropdownMenuItem>

                        <DialogTrigger asChild>
                          <DropdownMenuItem className="cursor-pointer">
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit this task</DialogTitle>
                        <DialogDescription>
                          Click save when you are done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="task" className="text-right">
                            Task
                          </Label>
                          <Input
                            id="taskI"
                            value={inputTaskName}
                            defaultValue={row.original.task}
                            className="col-span-3"
                            onChange={(e) => setInputTaskName(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="status" className="text-right">
                            Status
                          </Label>
                          <Input
                            id="statusI"
                            value={inputStatus}
                            defaultValue={row.original.status}
                            className="col-span-3"
                            onChange={(e) => setInputStatus(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="submit"
                            onClick={() => meta?.updateRow(row.original.id)}
                          >
                            Save changes
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  Start planning your tasks here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
