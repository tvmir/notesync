import { FC } from 'react';
import Sidebar from '../../_components/Sidebar';
import UserAccount from '@/app/(landing)/_components/UserAccount';
import supabaseServer from '@/lib/supabase/supabaseServer';
// import PomodoroTimer from '@/components/Pomodoro';

interface NotebookProps {
  children: React.ReactNode;
  params: any;
}

const NotebookLayout: FC<NotebookProps> = async ({ children, params }) => {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  return (
    <main className="flex overflow-hidden h-screen">
      <Sidebar params={params} />

      <div className="md:pl-[232px]">
        <div className="fixed z-[20] md:left-[232px] left-0 right-2 top-0 p-3 backdrop-blur-md flex gap-3 items-center border-b-[1px]">
          {/* <PomodoroTimer /> */}
          <UserAccount user={user} />
        </div>
        <div className="relative w-full">{children}</div>
      </div>
    </main>
  );
};

export default NotebookLayout;
