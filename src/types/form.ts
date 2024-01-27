import { z } from 'zod';

export const CreateNotebookFormSchema = z.object({
  notebookName: z
    .string()
    .describe('Notebook Name')
    .min(2, 'Notebook name must be a minimum of 2 characters'),
});

export type CreateNotebookForm = z.infer<typeof CreateNotebookFormSchema>;
