'use client';

import CustomTooltip from '@/components/CustomTooltip';
import EmojiPicker from '@/components/EmojiPicker';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { useAppState } from '@/lib/providers/use-state';
import { createFile, updateFile, updateFolder } from '@/lib/supabase/queries';
import { File } from '@/types/supabase';
import clsx from 'clsx';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useMemo, useState } from 'react';
import { v4 } from 'uuid';

interface SidebarDropdownProps {
  id: string;
  title: string;
  type: 'folder' | 'file';
  iconId: string;
}

const SidebarDropdown: FC<SidebarDropdownProps> = ({
  id,
  title,
  type,
  iconId,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const { state, dispatch, folderId, notebookId } = useAppState();

  const isFolder = type === 'folder';
  const styles = useMemo(
    () =>
      clsx('relative', {
        'border-none text-md': isFolder,
        'border-none ml-6 text-[16px]': !isFolder,
      }),
    [isFolder]
  );

  // Navigates to the folder/file page once it's been clicked
  const navigateToPage = (fId: string, type: string) => {
    if (type === 'folder') {
      router.push(`/dashboard/${notebookId}/${fId}`);
    }

    if (type === 'file') {
      router.push(
        `/dashboard/${notebookId}/${folderId}/${fId.split('folder')[1]}`
      );
    }
  };

  // Responsible for changing the emoji icon of the folder
  const onChangeEmojiHandler = async (selected: string) => {
    if (type === 'folder') {
      if (notebookId)
        dispatch({
          type: 'UPDATE_FOLDER',
          payload: {
            notebookId,
            folderId: id,
            folder: { iconId: selected },
          },
        });

      const { error } = await updateFolder({ iconId: selected }, id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Unable to update emoji, please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Updates the folder title
  const folderTitle: string | undefined = useMemo(() => {
    if (type === 'folder') {
      const fTitle = state.notebooks
        .find((notebook) => notebook.id === notebookId)
        ?.folders.find((folder) => folder.id === id)?.title;

      if (title === fTitle || !fTitle) return title;

      return fTitle;
    }
  }, [state, type, notebookId, id, title]);

  const folderTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!notebookId) return;
    const fId = id.split('folder');

    if (fId.length === 1) {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: { title: e.target.value },
          folderId: fId[0],
          notebookId,
        },
      });
    }
  };

  // Updates the file title
  const fileTitle: string | undefined = useMemo(() => {
    if (type === 'file') {
      const ffId = id.split('folder');

      const fTitle = state.notebooks
        .find((notebook) => notebook.id === notebookId)
        ?.folders.find((folder) => folder.id === ffId[0])
        ?.files.find((file) => file.id === ffId[1])?.title;

      if (title === fTitle || !fTitle) return title;

      return fTitle;
    }
  }, [state, type, notebookId, id, title]);

  const fileTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const fId = id.split('folder');

    if (!notebookId || !folderId) return;

    if (fId.length === 2 && fId[1]) {
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          file: { title: e.target.value },
          folderId,
          notebookId,
          fileId: fId[1],
        },
      });
    }
  };

  const addNewFile = async () => {
    if (!notebookId) return;

    const newFile: File = {
      folderId: id,
      content: '',
      createdAt: new Date().toISOString(),
      title: 'Untitled',
      iconId: '📄',
      id: v4(),
      notebookId,
    };

    dispatch({
      type: 'ADD_FILE',
      payload: { file: newFile, folderId: id, notebookId },
    });

    const { error } = await createFile(newFile);

    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Unable to create file, please try again.',
      });
    } else {
      toast({
        description: 'File has been created successfully',
      });
    }
  };

  const hoverStyles = useMemo(
    () =>
      clsx(
        'h-full hidden rounded-sm absolute right-0 items-center justify-center',
        {
          'group-hover/file:block': type === 'file',
          'group-hover/folder:block': type === 'folder',
        }
      ),
    [type]
  );

  // Edit folder title directly from the sidebar
  const handleBlur = async () => {
    if (!isEditingTitle) return;

    setIsEditingTitle(false);

    const fId = id.split('folder');

    if (fId.length === 1) {
      if (!folderTitle) return;

      toast({
        description: 'Folder title has been changed.',
      });

      await updateFolder({ title }, fId[0]);
    }
  };

  return (
    <AccordionItem
      value={id}
      className={styles}
      onClick={(e) => {
        e.stopPropagation();
        navigateToPage(id, type);
      }}
    >
      <AccordionTrigger
        id={type}
        className="hover:no-underline text-muted-foreground text-sm pt-[13px] pb-[14px]"
        disabled={type === 'file'}
      >
        <div
          className={clsx(
            'relative text-white whitespace-nowrap flex justify-between items-center w-full',
            {
              'group/folder': isFolder,
              'group/file': !isFolder,
            }
          )}
        >
          <div className="flex gap-2 items-center justify-center overflow-hidden">
            <div className="relative flex gap-x-1">
              <EmojiPicker getEmoji={onChangeEmojiHandler}>
                {iconId}
              </EmojiPicker>
            </div>
            <input
              type="text"
              readOnly={!isEditingTitle}
              onDoubleClick={() =>
                type === 'folder'
                  ? setIsEditingTitle(true)
                  : setIsEditingTitle(false)
              }
              onBlur={handleBlur}
              onChange={
                type === 'folder'
                  ? folderTitleChangeHandler
                  : fileTitleChangeHandler
              }
              value={type === 'folder' ? folderTitle : fileTitle}
              className={clsx(
                'outline-none overflow-hidden w-[140px] text-primary text-sm',
                {
                  'bg-muted/50 cursor-text h-4': isEditingTitle,
                  'bg-transparent cursor-pointer': !isEditingTitle,
                }
              )}
            />
          </div>
          <div className={hoverStyles}>
            {type === 'folder' && (
              <CustomTooltip message="Add File">
                <PlusIcon
                  onClick={addNewFile}
                  size={15}
                  className="hover:text-white text-primary transition-colors"
                />
              </CustomTooltip>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        {state.notebooks
          .find((notebook) => notebook.id === notebookId)
          ?.folders.find((folder) => folder.id === id)
          ?.files.map((file) => {
            const customFileId = `${id}folder${file.id}`;

            return (
              <SidebarDropdown
                key={file.id}
                title={file.title}
                type="file"
                id={customFileId}
                iconId={file.iconId}
              />
            );
          })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default SidebarDropdown;
