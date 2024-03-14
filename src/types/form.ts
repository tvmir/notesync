import { z } from 'zod';

export const CreateNotebookFormSchema = z.object({
  notebookName: z
    .string()
    .describe('Notebook Name')
    .min(2, 'Notebook name must be a minimum of 2 characters'),
});

export const CreateTaskFormSchema = z.object({
  taskName: z
    .string()
    .describe('Task Name')
    .min(2, 'Task name must be a minimum of 2 characters'),
  status: z.string(),
});

export type CreateNotebookForm = z.infer<typeof CreateNotebookFormSchema>;
export type CreateTaskForm = z.infer<typeof CreateTaskFormSchema>;
