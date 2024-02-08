import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const incrementPomodoroCounter = async ({
  x,
  row_id,
}: {
  x: number;
  row_id: string;
}) => {
  const supabase = createClientComponentClient();

  return await supabase.rpc('increment_pomodoro', {
    x,
    row_id,
  });
};
