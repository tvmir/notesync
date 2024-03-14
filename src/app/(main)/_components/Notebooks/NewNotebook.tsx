'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseUser } from '@/lib/providers/user-state';
import { createNotebook } from '@/lib/supabase/queries';
import { Notebook } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { v4 } from 'uuid';

const NewNotebook: FC = () => {
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createNewNotebook = async () => {
    setIsLoading(true);
    const notebookUUID = v4();

    if (user?.id) {
      const newNotebook: Notebook = {
        createdAt: new Date().toISOString(),
        id: notebookUUID,
        title,
        userId: user.id,
        pomodoroCount: 0,
        timeSpent: 0,
      };

      await createNotebook(newNotebook);

      toast({
        title: 'Success',
        description: 'Notebook has been created successfully!',
      });

      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-4 flex-col">
      <div className="pt-4">
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </Label>
        <div className="flex justify-center items-center mt-2">
          <Input
            name="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="button"
        disabled={!title || isLoading}
        variant={'default'}
        isLoading={isLoading}
        onClick={createNewNotebook}
      >
        Create
      </Button>
    </div>
  );
};

export default NewNotebook;
