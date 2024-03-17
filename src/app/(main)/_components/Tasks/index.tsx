import { FC } from 'react';
import { fetchTasks } from '@/lib/supabase/queries';
import { columns } from './Columns';
import { DataTable } from './DataTable';

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
