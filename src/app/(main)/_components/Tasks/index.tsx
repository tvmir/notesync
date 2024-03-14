import { FC } from 'react';
import { fetchTasks } from '@/lib/supabase/queries';
import { columns } from './Columns';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/supabase';
// import supabaseServer from '@/lib/supabase/supabaseServer';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface TaskProps {
  notebookId: string;
}

const Tasks: FC<TaskProps> = async ({ notebookId }) => {
  const { data: tasks } = await fetchTasks(notebookId);

  return (
    <div>
      <DataTable columns={columns} data={tasks!} notebookId={notebookId} />
    </div>
  );
};

export default Tasks;
