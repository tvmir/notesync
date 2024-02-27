'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthUser } from '@supabase/supabase-js';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FC } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CreateNotebookForm } from '@/types/form';
import { useToast } from '@/components/ui/use-toast';
import { v4 } from 'uuid';
import { Notebook } from '@/types/supabase';
import { createNotebook } from '@/lib/supabase/queries';
import { useAppState } from '@/lib/providers/state';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CreateNotebookSetupProps {
  user: AuthUser;
}

const CreateNotebookSetup: FC<CreateNotebookSetupProps> = ({ user }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { dispatch } = useAppState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<CreateNotebookForm>({
    mode: 'onChange',
    defaultValues: {
      notebookName: '',
    },
  });

  const onSubmit: SubmitHandler<CreateNotebookForm> = async (value) => {
    const notebookUUID = v4();

    try {
      const newNotebook: Notebook = {
        createdAt: new Date().toISOString(),
        id: notebookUUID,
        title: value.notebookName,
        userId: user.id,
        pomodoroCount: 0,
      };

      const { error } = await createNotebook(newNotebook);

      if (error) {
        console.log('Unable to create notebook: ', error);
      } else {
        dispatch({
          type: 'ADD_NOTEBOOK',
          payload: { ...newNotebook, folders: [] },
        });

        toast({
          title: 'Notebook Created',
          description: `${newNotebook.title} has been created successfully.`,
        });

        router.replace(`/dashboard/${newNotebook.id}`);
      }
    } catch (error) {
      console.log(error, 'Error');

      toast({
        title: 'Could not create your notebook',
        description:
          'We were unable to create your notebook. Please try again.',
        variant: 'destructive',
      });
    } finally {
      reset();
    }
  };

  return (
    <Card className="w-[800px] h-screen sm:h-auto">
      <CardHeader>
        <CardTitle>Create a notebook</CardTitle>
        <CardDescription>
          Enhance your organization with designated notebooks that enable you to
          manage all your notes in folders and files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-full">
                <Label
                  htmlFor="notebookName"
                  className="text-sm text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="notebookName"
                  type="text"
                  className="bg-transparent mt-4"
                  disabled={isLoading}
                  {...register('notebookName', {
                    required: 'Notebook Name is required',
                  })}
                />
                <small className="text-red-500">
                  {errors.notebookName?.message?.toString()}
                </small>
              </div>
            </div>
            <div className="self-end">
              <Button disabled={isLoading} isLoading={isLoading} type="submit">
                Create Notebook
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateNotebookSetup;
