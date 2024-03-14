'use client';

import {
  ElementRef,
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppState } from '@/lib/providers/state';
import { File } from '@/types/supabase';
import { updateFile } from '@/lib/supabase/queries';
import type EditorJS from '@editorjs/editorjs';
import { useToast } from '@/components/ui/use-toast';
import { OutputData } from '@editorjs/editorjs';
import TextareaAutosize from 'react-textarea-autosize';
import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

interface EditorProps {
  fileId: string;
  file?: File;
}

const Editor: FC<EditorProps> = ({ fileId, file }) => {
  const ref = useRef<EditorJS>();
  const titleRef = useRef<ElementRef<'textarea'>>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();

  const { state, dispatch, notebookId, folderId } = useAppState();

  // Checking if the file has any content inside of it
  const editorContent = useMemo(() => {
    const fileContent = state.notebooks
      .find((notebook) => notebook.id === notebookId)
      ?.folders.find((folder) => folder.id === folderId)
      ?.files.find((file) => file.id === fileId);

    if (fileContent) return fileContent;

    return {
      title: file?.title,
      createdAt: file?.createdAt,
      iconId: file?.iconId,
      content: file?.content,
    } as File;
  }, [state, notebookId, folderId]);

  const [inputVal, setInputVal] = useState<string>(editorContent.title);

  // Updating title in real-time to be displayed on the sidebar
  const enableInputTitle = () => {
    setIsEditing(true);
    setTimeout(() => {
      setInputVal(editorContent.title);
      titleRef.current?.focus();
    }, 0);
  };

  const disableInputTitle = () => setIsEditing(false);

  const onChangeInputTitle = async (value: string) => {
    if (!notebookId || !folderId) return;

    setInputVal(value);
    dispatch({
      type: 'UPDATE_FILE',
      payload: {
        file: { title: value || 'Untitled' },
        folderId,
        notebookId,
        fileId,
      },
    });

    const { error } = await updateFile({ title: value }, fileId);

    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description:
          'Unable to update the title for this file, please try again',
      });
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInputTitle();
    }
  };

  // Data encryption of the file's content
  const encryptData = (data: any) => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.C_SECRET_KEY || ''
    ).toString();
    return encrypted;
  };

  // Data decryption of the file's content
  const decryptData = (encryptedData: any) => {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedData,
        process.env.C_SECRET_KEY || ''
      );
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (decrypted) {
        // console.log('Decryption successful:', decrypted);
        return JSON.parse(decrypted);
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  };

  // Initializing editor
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    // const ImageTool = (await import('@editorjs/image')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor;
        },
        // Autosave feature
        onChange: async () => {
          const blocks = await ref.current?.save();

          if (!notebookId || !folderId) return;

          const encryptedBlocks = encryptData(blocks);

          dispatch({
            type: 'UPDATE_FILE',
            payload: {
              file: { content: encryptedBlocks },
              notebookId,
              folderId: folderId,
              fileId,
            },
          });

          const { error } = await updateFile(
            { content: encryptedBlocks },
            fileId
          );

          if (error) {
            toast({
              variant: 'destructive',
              description: 'Something went wrong with the editor.',
            });
          }
        },
        placeholder: 'Type here to write your note...',
        inlineToolbar: true,
        data: {
          blocks: decryptData(editorContent.content as OutputData)?.blocks,
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
          },
          // image: {
          //   class: ImageTool,
          //   config: {
          //     uploader: {
          //       async uploadByFile(file: File) {
          //         // upload to uploadthing
          //         const [res] = await uploadFiles([file], 'imageUploader');

          //         return {
          //           success: 1,
          //           file: {
          //             url: res.fileUrl,
          //           },
          //         };
          //       },
          //     },
          //   },
          // },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  return (
    <>
      <div className="group relative">
        {isEditing ? (
          <TextareaAutosize
            ref={titleRef}
            onBlur={disableInputTitle}
            onKeyDown={onKeyDown}
            value={inputVal}
            onChange={(e) => onChangeInputTitle(e.target.value)}
            className="text-5xl bg-transparent font-bold break-words outline-none text-primary"
          />
        ) : (
          <div
            onClick={enableInputTitle}
            className="pb-3 text-5xl font-bold break-words outline-none text-primary"
          >
            {editorContent.title}
          </div>
        )}
      </div>
      <div id="editor" className="prose max-w-[800px]" />
    </>
  );
};

export default Editor;
