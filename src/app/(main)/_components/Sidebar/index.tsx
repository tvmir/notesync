import React, { FC } from 'react';
import { redirect } from 'next/navigation';
import { fetchFolders, fetchNotebooks } from '@/lib/supabase/queries';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import FoldersList from './FoldersList';
import SidebarItems from './SidebarItems';
import supabaseServer from '@/lib/supabase/supabase-server';
import Player from '../Player';

interface SidebarProps {
  params: { notebookId: string; folderId: string };
}

const Sidebar: FC<SidebarProps> = async ({ params }) => {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Gets all the folders based on the notebook ID
  const { data: notebookFolders, error } = await fetchFolders(
    params.notebookId
  );

  // Gets all the notebooks for the user
  const allUserNotebooks = await fetchNotebooks(user.id);

  if (error) redirect('/dashboard');

  return (
    <>
      <SidebarItems
        userNotebooks={allUserNotebooks}
        defaultNotebook={allUserNotebooks.find(
          (notebook) => notebook.id === params.notebookId
        )}
      >
        <div>
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
        </div>
        <Player />
      </SidebarItems>
    </>
  );
};

export default Sidebar;
