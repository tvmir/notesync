'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppState } from '@/lib/providers/use-state';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface FolderProps {
  params: { folderId: string };
}

const Folder: FC<FolderProps> = ({ params }) => {
  const { state, notebookId } = useAppState();
  const router = useRouter();

  const currentFolder = state.notebooks
    .find((notebook) => notebook.id === notebookId)
    ?.folders.find((folder) => folder.id === params.folderId);

  return (
    <div className="h-full pt-20 pl-20">
      <div className="pt-4 pb-8 text-3xl font-semibold">
        {currentFolder?.title}
      </div>
      <div className="space-y-3 max-w-7xl">
        <div className="grid gap-4 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          {currentFolder?.files.map((file) => (
            <div key={file.id}>
              <Card
                key={file.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/dashboard/${notebookId}/${params.folderId}/${file.id}`
                  )
                }
              >
                <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                  <div className="space-y-1">
                    <CardTitle>
                      {file.iconId} {file.title}
                    </CardTitle>
                    <CardDescription>
                      {new Date(file.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Folder;
