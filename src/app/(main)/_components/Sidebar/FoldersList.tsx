'use client';

import CustomTooltip from '@/components/CustomTooltip';
import { Accordion } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/lib/providers/use-state';
import { createFolder } from '@/lib/supabase/queries';
import { Folder } from '@/types/supabase';
import { PlusIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import SidebarDropdown from './SidebarDropdown';
import { Separator } from '@/components/ui/separator';

interface FoldersListProps {
  folders: Folder[];
  notebookId: string;
}

const FoldersList: FC<FoldersListProps> = ({ folders, notebookId }) => {
  const { state, dispatch, folderId } = useAppState();
  const [userFolders, setUserFolders] = useState<Folder[]>(folders);
  const { toast } = useToast();

  // Show the folders and its files
  useEffect(() => {
    if (folders.length > 0) {
      dispatch({
        type: 'SET_FOLDERS',
        payload: {
          notebookId,
          folders: folders.map((folder) => ({
            ...folder,
            files:
              state.notebooks
                .find((notebook) => notebook.id === notebookId)
                ?.folders.find((fr) => {
                  fr.id === folder.id;
                })?.files || [],
          })),
        },
      });
    }
  }, [folders, notebookId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setUserFolders(
      state.notebooks.find((notebook) => notebook.id === notebookId)?.folders ||
        []
    );
  }, [state, notebookId]);

  // Creating a new folder and displaying it in the sidebar
  const addFolderHandler = async () => {
    const initiatedFolder: Folder = {
      id: v4(),
      createdAt: new Date().toISOString(),
      title: 'Untitled',
      iconId: '📝',
      notebookId,
    };

    dispatch({
      type: 'ADD_FOLDER',
      payload: {
        notebookId,
        folder: {
          ...initiatedFolder,
          files: [],
        },
      },
    });

    const { error } = await createFolder(initiatedFolder);

    if (error) {
      toast({
        title: 'Error',
        description: 'Unable to create folder, please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        description: 'Folder has been created.',
      });
    }
  };

  return (
    <>
      <div className="flex sticky z-20 top-0 w-full h-10 group/title justify-between items-center pr-2 text-primary">
        <span className="text-primary/70 text-sm capitalize">Folders</span>
        <CustomTooltip message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className="group-hover/title:inline-block hidden cursor-pointer hover:text-white"
          />
        </CustomTooltip>
      </div>
      <Separator className="mb-2" />
      <Accordion
        type="multiple"
        defaultValue={[folderId || '']}
        className="pb-20"
      >
        {userFolders.map((folder) => (
          <SidebarDropdown
            key={folder.id}
            id={folder.id}
            title={folder.title}
            iconId={folder.iconId}
            type="folder"
          />
        ))}
      </Accordion>
    </>
  );
};

export default FoldersList;
