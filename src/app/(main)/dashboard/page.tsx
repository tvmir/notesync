import db from '@/lib/supabase/db';
import { redirect } from 'next/navigation';
import CreateNotebookSetup from '../_components/Notebooks/CreateNotebookSetup';
import supabaseServer from '@/lib/supabase/supabase-server';

const Dashboard = async () => {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const notebook = await db.query.notebooks.findFirst({
    where: (notebook, { eq }) => eq(notebook.userId, user.id),
  });

  if (!notebook) {
    return (
      <div className="bg-background h-screen w-screen flex justify-center items-center">
        <CreateNotebookSetup user={user} />
      </div>
    );
  }

  redirect(`/dashboard/${notebook.id}`);
};

export default Dashboard;
