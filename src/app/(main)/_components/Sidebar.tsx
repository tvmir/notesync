// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { FC } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { fetchFolders, fetchNotebooks } from '@/lib/supabase/queries';
import Navigation from './Navigation';
import { ScrollArea } from '../../../components/ui/scroll-area';
import FoldersList from './FoldersList';
import NotebooksList from './NotebooksList';
import supabaseServer from '@/lib/supabase/supabaseServer';
import Player from './Player';

interface SidebarProps {
  params: { notebookId: string };
  className?: string;
}

const Sidebar: FC<SidebarProps> = async ({ params, className }) => {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: notebookFolders, error } = await fetchFolders(
    params.notebookId
  );

  const [allUserNotebooks] = await Promise.all([fetchNotebooks(user.id)]);

  if (error) redirect('/dashboard');

  //get all the different workspaces private collaborating shared
  return (
    <aside
      className={twMerge(
        'hidden sm:flex sm:flex-col w-[232px] shrink-0 p-4 md:gap-4 !justify-between',
        className
      )}
    >
      <div>
        <NotebooksList
          userNotebooks={allUserNotebooks}
          defaultNotebook={[...allUserNotebooks].find(
            (notebook) => notebook.id === params.notebookId
          )}
        />
        <Navigation currentNotebookId={params.notebookId} />
        <ScrollArea
          className="overflow-scroll relative
          h-[450px]
        "
        >
          <div className="pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40" />
          <FoldersList
            folders={notebookFolders || []}
            notebookId={params.notebookId}
          />
        </ScrollArea>
        <Player />
      </div>
    </aside>
  );
};

export default Sidebar;
