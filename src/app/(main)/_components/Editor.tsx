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
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import TextareaAutosize from 'react-textarea-autosize';
import crypto from 'crypto';

interface EditorProps {
  fileId: string;
  file?: File;
}

const Editor: FC<EditorProps> = ({ fileId, file }) => {
  const ref = useRef<EditorJS>();
  const titleRef = useRef<ElementRef<'textarea'>>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [encryptionKey, setEncryptionKey] = useState<Buffer | null>(null);
  const [encryptionIV, setEncryptionIV] = useState<Buffer | null>(null);
  const { toast } = useToast();

  const { state, dispatch, notebookId, folderId } = useAppState();

  useEffect(() => {
    // Generate encryption key and IV
    const key = crypto.randomBytes(32); // 256-bit key
    const iv = crypto.randomBytes(16); // 128-bit IV
    setEncryptionKey(key);
    setEncryptionIV(iv);
  }, []);

  const editorContent = useMemo(() => {
    const fileContent = state.notebooks
      .find((notebook) => notebook.id === notebookId)
      ?.folders.find((folder) => folder.id === folderId)
      ?.files.find((file) => file.id === fileId);

    if (fileContent) {
      return fileContent;
    }

    return {
      title: file?.title,
      createdAt: file?.createdAt,
      iconId: file?.iconId,
      content: file?.content,
    } as File;
  }, [state, notebookId, folderId]);

  const [inputVal, setInputVal] = useState<string>(editorContent.title);

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

  // Encryption function
  function encrypt(data: any, key: Buffer, iv: Buffer): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
  }

  // Decryption function
  function decrypt(
    encryptedData: string,
    key: Buffer,
    iv: Buffer
  ): OutputBlockData[] {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return JSON.parse(decryptedData) as OutputBlockData[];
  }

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
        onChange: async () => {
          const blocks = await ref.current?.save();

          // if (!notebookId || !folderId || !encryptionKey || !encryptionIV)
          //   return;

          if (!notebookId || !folderId) return;

          // // Encrypt JSON data before updating in the database
          // const jsonData = JSON.stringify(blocks);

          // console.log('JSON: ', jsonData);

          // const encryptedData = encrypt(jsonData, encryptionKey, encryptionIV);

          // console.log('ENCRYPTED: ', encryptedData);

          dispatch({
            type: 'UPDATE_FILE',
            payload: {
              file: { content: blocks },
              notebookId,
              folderId: folderId,
              fileId,
            },
          });

          const { error } = await updateFile({ content: blocks }, fileId);

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
          blocks: (editorContent.content as OutputData).blocks,
        },
        // data: {
        //   blocks: editorContent.content
        //     ? decrypt(
        //         (editorContent.content as any).blocks,
        //         encryptionKey!,
        //         encryptionIV!
        //       )
        //     : [],
        // },
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
