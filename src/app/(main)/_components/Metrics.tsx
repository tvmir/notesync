import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import supabaseServer from '@/lib/supabase/supabaseServer';
import { fetchNotebooks } from '@/lib/supabase/queries';
import Tasks from './Tasks';

interface MetricsProps {
  notebookId: string;
}

const Metrics: FC<MetricsProps> = async ({ notebookId }) => {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const currentNotebook = (await fetchNotebooks(user.id)).find(
    (notebook) => notebook.id === notebookId
  );

  return (
    <div className="space-y-2 p-4 pt-0 max-w-5xl">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pomodoro Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{currentNotebook?.pomodoroCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +{(currentNotebook?.pomodoroCount! / 100) * 100}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Time Spent on Tasks
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{new Date(currentNotebook?.timeSpent!).getMinutes()} Mins
            </div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Tasks notebookId={notebookId} />
      </div>
    </div>
  );
};

export default Metrics;
